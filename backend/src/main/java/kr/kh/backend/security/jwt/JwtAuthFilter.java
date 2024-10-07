package kr.kh.backend.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends GenericFilterBean {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        log.info("do JWT Filter ! request = {}", request);

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // 로그인 요청을 예외 처리
        if ("/form/login".equals(httpRequest.getRequestURI())) {
            log.info("httpUri = {}", httpRequest.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        // Request Header 에서 JWT 토큰 추출
        String token = resolveToken((HttpServletRequest) request);
        log.info("token is null ? {}", token);

        // validate Token 으로 유효성 검사
        if(token != null && jwtTokenProvider.validateToken(token)) {
            log.info("validate token");
            // 토큰이 유효할 경우 토큰에서 Authentication 객체를 가져와서 SecurityContext 에 저장
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("set Authentication to SecurityContextHolder");
        }

        log.info("success JWT Filter ! SecurityContextHolder = {}", SecurityContextHolder.getContext());
        chain.doFilter(request, response);
    }

    /**
     * 토큰 추출 : 주어진 HttpServletRequest 의 Authorization 헤더에서 Bearer 접두사로 시작하는 토큰을 추출하여 반환
     */
    private String resolveToken(HttpServletRequest request) {
        log.info("resolveToken request = {}", request);
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken != null && bearerToken.startsWith("Bearer")) {
            log.info("bearerToken = {}", bearerToken);
            return bearerToken.substring(7);
        }
        log.info("Token null");
        return null;
    }
}
