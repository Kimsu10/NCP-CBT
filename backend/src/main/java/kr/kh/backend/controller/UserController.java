package kr.kh.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import kr.kh.backend.dto.EmailVerificationDTO;
import kr.kh.backend.dto.oauth2.OauthLoginDTO;
import kr.kh.backend.dto.security.JwtToken;
import kr.kh.backend.dto.security.LoginDTO;
import kr.kh.backend.mapper.UserMapper;
import kr.kh.backend.security.jwt.JwtTokenProvider;
import kr.kh.backend.service.security.EmailVerificationService;
import kr.kh.backend.service.security.Oauth2UserService;
import kr.kh.backend.service.security.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final Oauth2UserService oauth2UserService;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @PostMapping("/form/register")
    public ResponseEntity<String> register(@RequestBody LoginDTO loginDTO) {
        log.info("register : {}", loginDTO.toString());
        String inputPassword = loginDTO.getPassword();
        String inputUsername = loginDTO.getUsername();
        String inputEmail = loginDTO.getEmail();

        if (inputPassword == null || inputPassword.trim().isEmpty() ||
            inputUsername == null || inputUsername.trim().isEmpty() ||
            inputEmail == null || inputEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("빈 칸을 채워주세요.");
        }

        if (inputPassword.length() <= 8 || !inputPassword.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            return ResponseEntity.badRequest().body("8자리 이상 특수문자를 1개 이상 포함해주세요.");
        }

        try {
        if (userMapper.isUsernameExisted(inputUsername)) {
            return ResponseEntity.badRequest().body("이미 가입된 유저입니다. (아이디 중복)");
        }

        if (userMapper.isEmailExisted(inputEmail)) {
            return ResponseEntity.badRequest().body("이미 가입된 유저입니다. (이메일 중복)");
        }

        // 비밀번호 인코딩 후 저장
        String password = passwordEncoder.encode(loginDTO.getPassword());
        loginDTO.setPassword(password);
        userMapper.insertUser(loginDTO);

        return ResponseEntity.ok("회원가입 성공.");
        } catch (DataAccessException e) {
            log.error("중복된 데이터 삽입 시도: {}", e.getMessage());
            return ResponseEntity.badRequest().body("중복된 데이터가 있습니다.");
        } catch (Exception e) {
            log.error("회원가입 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다.");
        }
    }

    // 로그인
    @PostMapping("/form/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        log.info("login : {}", loginDTO.toString());

        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();
        JwtToken jwtToken = userService.generateJwtToken(username, password);

        log.info("request username = {}", username);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());

        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(refreshTokenCookie);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtToken.getAccessToken());

        return ResponseEntity.ok(tokens);
    }

    // 닉네임 중복확인
    @GetMapping("/form/checkNick")
    public boolean checkUsername(@RequestParam String username) {

        boolean isExisted = userMapper.isUsernameExisted(username);

        log.info("username {} is existed {}" , username, isExisted );

        return isExisted;

    }

    // 이메일 인증 코드 요청
    @GetMapping("/form/email-code")
    public ResponseEntity<?> checkEmail(@RequestParam("email") @Valid String email) {
        boolean isExisted = userMapper.isEmailExisted(email);

        if (isExisted) {
            log.info("email {} is existed {}", email, isExisted);
            return new ResponseEntity<>("이미 등록된 이메일입니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            emailVerificationService.sendCodeToEmail(email);
            return new ResponseEntity<>("인증 코드가 발송되었습니다.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 이메일 코드 인증하기
    @PostMapping("/form/email-verify")
    public ResponseEntity<?> verifyCode(@RequestBody @Valid EmailVerificationDTO emailVerificationDTO) {

        try {
            EmailVerificationDTO response = emailVerificationService.verifyCode(
                    emailVerificationDTO.getEmail(),
                    emailVerificationDTO.getAuthCode()
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    // 네이버 로그인
    @PostMapping("/login/naver")
    public ResponseEntity<?> loginNaver(@RequestBody OauthLoginDTO oauthLoginDTO, HttpServletResponse response) {
        log.info("네이버 로그인 컨트롤러");

        // 네이버에서 사용자 정보 조회
        Authentication authentication = oauth2UserService.getNaverUser(oauthLoginDTO.getCode(), oauthLoginDTO.getState());
        if(authentication == null) {
            return ResponseEntity.status(400).build();
        }

        // JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        // 토큰 넣어서 전송
        // refresh token 은 쿠키 (HttpOnly) 로 전송
        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60 * 24); // 쿠키 유효기간 1일
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + jwtToken.getAccessToken())
                .build();
    }

    // 깃허브 로그인
    @PostMapping("/login/github")
    public ResponseEntity<?> loginGithub(@RequestBody OauthLoginDTO oauthLoginDTO, HttpServletResponse response) {
        log.info("깃허브 로그인 컨트롤러");

        // 네이버에서 사용자 정보 조회
        Authentication authentication = oauth2UserService.getGithubUser(oauthLoginDTO.getCode());
        if(authentication == null) {
            return ResponseEntity.status(400).build();
        }

        // JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        // 토큰 넣어서 전송
        // refresh token 은 쿠키 (HttpOnly) 로 전송
        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60 * 24); // 쿠키 유효기간 1일
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + jwtToken.getAccessToken())
                .build();
    }

    // 유저 계정 찾기
    @GetMapping("/form/find-account")
    public ResponseEntity<?> findAccount(@RequestParam String email){
        log.info("GET/form/findAccount {}", email);

        String username = userService.findUsernameByEmail(email);
        return ResponseEntity.ok(username);
    }

    // 유저 계정 또는 이메일로 이메일 인증하기
    @PostMapping("/form/send-code")
    public ResponseEntity<String> sendAuthCode(
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) String email) {
        log.info("POST /form/send-code - nickname: {}, email: {}", nickname, email);

        if (nickname != null) {
            emailVerificationService.sendAuthCodeByNickname(nickname);
        } else if (email != null) {
            emailVerificationService.sendAuthCodeByEmail(email);
        } else {
            return ResponseEntity.badRequest().body("nickname 또는 email 중 하나를 입력하세요.");
        }

        return ResponseEntity.ok("인증 코드가 이메일로 전송되었습니다.");
    }

    // 비밀번호 재설정
    @PatchMapping("/form/renewPassword")
    public ResponseEntity<String> renewPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String newPassword = request.get("password");

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("새로운 비밀번호를 입력하세요.");
        }

        if (newPassword.length() <= 8 || !newPassword.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            return ResponseEntity.badRequest().body("8자리 이상 특수문자를 1개 이상 포함해주세요.");
        }

        try {
            userService.changePassword(username, newPassword);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경에 실패했습니다.");
        }
    }
}
