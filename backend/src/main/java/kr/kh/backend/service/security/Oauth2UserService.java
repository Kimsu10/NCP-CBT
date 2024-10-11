package kr.kh.backend.service.security;

import kr.kh.backend.domain.User;
import kr.kh.backend.dto.oauth2.NaverUserInfo;
import kr.kh.backend.dto.oauth2.Oauth2UserInfo;
import kr.kh.backend.dto.security.JwtToken;
import kr.kh.backend.mapper.UserMapper;
import kr.kh.backend.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class Oauth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 소셜 로그인한 정보로 이미 디비에 있는 유저인지 확인한 이후 로그인 진행.
     * (이 과정에서 UserDetails 객체를 생성하여 Authentication 객체 안에 넣는다.)
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("oauth2 login = {}", userRequest.getClientRegistration().getRegistrationId());

        // userRequest 정보로 loadUser 메서드를 실행해서 소셜 프로필을 가져온다.
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 소셜 로그인을 하면 사용자 정보가 JSON 형태로 담겨오는데 getAttributes() 메서드로 꺼낼 수 있다.
        // 자바에서 JSON 형식은 Map으로 저장하면 된다.
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 여러 개의 oauth2 제공자가 있으므로 분기 처리를 해준다.
        String userNameAttributesName = userRequest.getClientRegistration().getRegistrationId();
        Oauth2UserInfo oauth2UserInfo = null;

        if(userNameAttributesName.equals("naver")) {
            log.info("네이버 로그인 요청");
            oauth2UserInfo = new NaverUserInfo((Map)oAuth2User.getAttributes().get("response"));
        }

        String provider = oauth2UserInfo.getProvider();
        String providerId = oauth2UserInfo.getProviderId();
        String username = provider + "_" + providerId;
        String email = oauth2UserInfo.getEmail();
        String role = "USER";

        // 해당 유저가 디비에 있는지 확인
        log.info("mybatis 전");
        User user = userMapper.findByUsername(username);
        log.info("mybatis 후");

        if(user == null) {
            log.info("등록되지 않은 oauth 사용자 입니다. 디비에 사용자 정보를 저장합니다.");
            user = User.builder()
                    .email(email)
                    .nickname(username)
                    .platform(provider)
                    .roles(role)
                    .build();
            userMapper.insertOauthUser(user);
        } else {
            log.info("이미 등록된 oauth 사용자 입니다.");
        }

        // UserDetails를 Authentication 객체로 변환 후 SecurityContextHolder 에 저장
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("oauth2 유저가 인증되었습니다 = {}", authentication);

        return user;
    }
}
