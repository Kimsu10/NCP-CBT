package kr.kh.backend.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import kr.kh.backend.domain.Token;
import kr.kh.backend.domain.TokenStatus;
import kr.kh.backend.dto.security.JwtToken;
import kr.kh.backend.mapper.TokenMapper;
import kr.kh.backend.exception.CustomException;
import kr.kh.backend.mapper.UserMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;

    @Autowired
    private TokenMapper tokenMapper;

    //    트큰의 username으로 user_id 죄회해서 해볼게 있어서 임시로 작성
    @Autowired
    private UserMapper userMapper;

    /**
     * 암호 키 설정 : yml 파일에서 설정한 secret key 를 가져와서 토큰의 암호화, 복호화에 사용한다.
     */
    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 토큰 생성 : User 의 로그인 정보를 가져와서 accessToken, refreshToken 생성하는 메서드
     */
    public JwtToken generateToken(Authentication authentication) {
        log.info("Generate JWT token = {}", authentication);
        // 유저 권한 가져오기
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        log.info("user roles = {}", authorities);
        long now = System.currentTimeMillis();

        // access token 생성 : 인증된 사용자의 권한 정보와 만료 시간을 담는다. (1시간)
        Date accessExpiration = new Date(now + 1000 * 60 * 60);
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName())
                .claim("auth", authorities)
                .setExpiration(accessExpiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        log.info("generated access Token = {}", accessToken);

        // refresh token 생성 : access token 의 갱신을 위해 사용된다. (1주일)
        Date refreshExpiration = new Date(now + 1000 * 60 * 60 * 24 * 7);
        String refreshToken = Jwts.builder()
                .setSubject(authentication.getName())
                .setExpiration(refreshExpiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // refreshs token 디비에 저장
        int userId = userMapper.findId(authentication.getName());
        Token token = new Token();
        token.setToken(refreshToken);
        token.setId(userId);
        token.setStatus(TokenStatus.VALID);
        token.setExpirationDate(refreshExpiration);
        int result = tokenMapper.saveToken(token);

        log.info("generated refresh Token = {}, 저장 완료 ? {}", refreshToken, result == 1 ? "YES" : "NO");

        return JwtToken.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * 토큰 복호화 : 주어진 access token 을 복호화하여 사용자의 인증 정보(Authentication)를 생성한다.
     */
    public Authentication getAuthentication(String accessToken) {
        log.info("do decode access token = {}", accessToken);

        // parseClaims 라는 커스텀 메서드로 토큰 복호화
        Claims claims = parseClaims(accessToken);

        if(claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 클레임에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("auth").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // UserDetails 객체를 만들어서 주체(subject) 와 권한 정보를 포함한 인증 정보를 리턴
        UserDetails principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // 트큰의 username으로 user_id 반환
    public String getUsernameFromToken(String accessToken) {
        Claims claims = parseClaims(accessToken);
        return claims.getSubject();
    }

    // 주어진 access token 을 복호화하고, 만료된 토큰인 경우에도 claims 반환
    private Claims parseClaims(String jwtToken) {
        log.info("parseClaims jwtToken = {}", jwtToken);
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwtToken) // 검증 및 파싱을 모두 수행
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    /**
     * 토큰 갱신 : 액세스 토큰을 새로 발행하여 Authentication 객체에 다시 세팅
     */
    public String refreshAccessToken(Authentication authentication) {
        log.info("Updadte JWT token = {}", authentication);
        // 유저 권한 가져오기
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        log.info("user roles = {}", authorities);
        long now = System.currentTimeMillis();

        // access token 생성 : 인증된 사용자의 권한 정보와 만료 시간을 담는다. (1시간)
        Date accessExpiration = new Date(now + 1000 * 60 * 60);
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName())
                .claim("auth", authorities)
                .setExpiration(accessExpiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        log.info("generated access Token = {}", accessToken);

        setAuthenticationInSecurityContext(authentication, accessToken);

        return accessToken;
    }

    private void setAuthenticationInSecurityContext(Authentication authentication, String newAccessToken) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                        authentication.getPrincipal(),
                        newAccessToken,
                        authentication.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }

    /**
     * 액세스 토큰 유효성 검사
     */
    public boolean validateToken(String accessToken) {
        log.info("do validate Token ! access token: {}", accessToken);
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT token, {}", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token, {}", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT token, {}", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty, {}", e);
        }
        return false;
    }

    /**
     * 리프레시 토큰 유효성 검사
     */
    public boolean validateRefreshToken(String refreshToken) {
        log.info("do validateRefreshToken ! refreshToken: {}", refreshToken);
        try {
            // 서명 검증
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(refreshToken);

            // 디비에서 검증
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(refreshToken).getBody();
            String username = claims.getSubject();
            Token token = tokenMapper.getTokenByUserId(userMapper.findId(username));

            if(token != null) {
                if(token.getStatus() == TokenStatus.USED || token.getExpirationDate().before(new Date()) ) {
                    return false;
                }

                token.setStatus(TokenStatus.USED);
                tokenMapper.saveToken(token);

                return true;
            }

            return false;

        } catch (ExpiredJwtException e) {
            log.info("Expired refresh token, {}", e);
            return false;
        } catch (Exception e) {
            log.info("Invalid refresh token, {}", e);
            return false;
        }
    }

}
