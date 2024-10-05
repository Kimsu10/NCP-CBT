package kr.kh.backend.service.security;

import kr.kh.backend.dto.security.JwtToken;
import kr.kh.backend.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;

    /**
     * 유저의 로그인 요청으로 들어온 username + password 를 기반으로 검증 진행 후 JWT 토큰 생성
     */
    public JwtToken generateJwtToken(String username, String password) {
        log.info("Generate JWT Token = username : {}", username);

        // 사용자 정보를 로드
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        // 비밀번호 비교
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        // username + password 기반으로 Authentication 객체 생성
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);
        log.info("authenticationToken = {}", authenticationToken);

        // 해당 user 에 대한 검증 진행
        // 이 과정에서 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드가 실행된다..
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        log.info("authentication = {}", authentication);

        // 인증되면 JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);
        log.info("jwtToken = {}", jwtToken);

        return jwtToken;
    }
}
