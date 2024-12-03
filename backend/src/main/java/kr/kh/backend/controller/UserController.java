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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    public void register(@RequestBody LoginDTO loginDTO) {
        log.info("register : {}", loginDTO.toString());
        // 비밀번호 인코딩 후 저장
        String password = passwordEncoder.encode(loginDTO.getPassword());
        loginDTO.setPassword(password);
        userMapper.insertUser(loginDTO);
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
}
