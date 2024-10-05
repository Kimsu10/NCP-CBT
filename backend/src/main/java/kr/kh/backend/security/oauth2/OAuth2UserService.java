//package kr.kh.backend.security.oauth2;
//
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.stereotype.Service;
//
//import java.util.Map;
//
//@Service
//public class OAuth2UserService extends DefaultOAuth2UserService {
//
//    @Override
//    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//        OAuth2User oAuth2User = super.loadUser(userRequest);
//        Map<String, Object> attributes = oAuth2User.getAttributes();
//
//        String userNameAttributeName = userRequest.getClientRegistration()
//                .getProviderDetails()
//                .getUserInfoEndpoint()
//                .getUserNameAttributeName();
//
//        NaverUserInfo naverUserInfo = new NaverUserInfo();
//
//    }
//}
