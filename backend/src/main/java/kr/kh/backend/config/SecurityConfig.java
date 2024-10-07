package kr.kh.backend.config;

import kr.kh.backend.security.jwt.JwtAuthFilter;
import kr.kh.backend.security.jwt.JwtTokenProvider;
import kr.kh.backend.service.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.NEVER))

                .authorizeHttpRequests(
                        authorize -> authorize
                                .requestMatchers("/error").permitAll()
                                .requestMatchers("/form/**").permitAll() // 일반로그인, 회원가입 요청 허용
                                .requestMatchers("/oauth/**").permitAll() // 소셜로그인, 회원가입 요청 허용
                                .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN") // ADMIN 권한이 있어야 요청할 수 있는 경로
                                .anyRequest().authenticated() // 그 밖의 요청은 인증 필요
                )

                /**
                 * UsernamePasswordAuthenticationFilter 전에 JwtAuthFilter 를 거치도록 한다.
                 * 토큰이 유효한지 검사하고 유효하다면 인증 객체 (Authentication) 를 가져와서 Security Context 에 저장한다.
                 * (요청을 처리하는 동안 인증 정보를 유지하기 위함)
                 */
                .addFilterBefore(new JwtAuthFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

//                .formLogin(
//                        httpSecurityFormLoginConfigurer -> httpSecurityFormLoginConfigurer
//                                .loginPage("/form/login")
//                                .successHandler(LoginSuccessHandler())
//                                .failureHandler(LoginFailHandler())
//                        );
//
//                .oauth2Login(
//                        httpSecurityOAuth2LoginConfigurer -> httpSecurityOAuth2LoginConfigurer
//                                .loginPage("/oauth2/login")
//                                .successHandler(LoginSuccessHandler())
//                                .userInfoEndpoint(
//                                        userInfoEndpointConfig -> userInfoEndpointConfig
//                                                .userService(OAuth2UserService)
//                                )
//                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    // 커스텀한 UserDetailsService 를 스프링에서 인식하도록 AuthenticationManager 에 등록한다.
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

}