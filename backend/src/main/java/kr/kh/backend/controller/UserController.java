package kr.kh.backend.controller;

import kr.kh.backend.dto.security.JwtToken;
import kr.kh.backend.dto.security.LoginDTO;
import kr.kh.backend.mapper.UserMapper;
import kr.kh.backend.service.security.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

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

        log.info("request username = {}, password = {}", username, password);
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

    // 토큰 인증 테스트를 위한 컨트롤러인데 아직 공사중...
    @PostMapping("/admin/test")
    public String loginTest() {
        log.info("admin test controller");
        return "login success";
    }

}
