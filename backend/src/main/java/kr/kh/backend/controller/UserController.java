package kr.kh.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import kr.kh.backend.domain.User;
import kr.kh.backend.dto.oauth2.OauthLoginDTO;
import kr.kh.backend.dto.security.JwtToken;
import kr.kh.backend.dto.security.LoginDTO;
import kr.kh.backend.mapper.UserMapper;
import kr.kh.backend.security.jwt.JwtTokenProvider;
import kr.kh.backend.service.security.Oauth2UserService;
import kr.kh.backend.service.security.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@Slf4j
@AllArgsConstructor
public class UserController {

    private final UserService userService;
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
    public JwtToken login(@RequestBody LoginDTO loginDTO) {
        log.info("login : {}", loginDTO.toString());

        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();
        JwtToken jwtToken = userService.generateJwtToken(username, password);

        log.info("request username = {}", username);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());

        return jwtToken;
    }

    // 닉네임 중복확인
    @GetMapping("/form/checkNick")
    public boolean checkUsername(@RequestParam String username) {

        boolean isExisted = userMapper.isUsernameExisted(username);

        log.info("username {} is existed {}" , username, isExisted );

        return isExisted;

    }

    // 이메일 중복확인
    @GetMapping("/form/checkEmail")
    public boolean checkEmail(@RequestParam String email) {
        boolean isExisted = userMapper.isEmailExisted(email);

        log.info("email {} is existed {}" , email, isExisted );

        return isExisted;
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

        // HttpOnly 쿠키에 리프레시 토큰 넣어서 전송
        Cookie refreshCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setMaxAge(24 * 60 * 60);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + jwtToken.getAccessToken())
                .header("Set-Cookie", "refreshToken=" + jwtToken.getRefreshToken()
                        + "; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax" )
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

        // HttpOnly 쿠키에 리프레시 토큰 넣어서 전송
        Cookie refreshCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setMaxAge(24 * 60 * 60);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + jwtToken.getAccessToken())
                .header("Set-Cookie", "refreshToken=" + jwtToken.getRefreshToken()
                        + "; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax" )
                .build();
    }

    // 토큰 갱신
    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody JwtToken jwtToken) {
        log.info("액세스 토큰 갱신 요청 : 액세스 {}, 리프레시 {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());


        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + jwtToken.getAccessToken())
                .build();
    }

}
