package kr.kh.backend.mapper;

import kr.kh.backend.domain.EmailVerification;
import kr.kh.backend.domain.User;
import kr.kh.backend.dto.security.LoginDTO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE nickname = #{username}")
    User findByUsername(String username);

    @Select("SELECT * FROM user WHERE email = #{email}")
    User findByEmail(String email);

    // 일반 로그인 insert
    @Insert("INSERT INTO user(email, nickname, password, roles) " +
            "VALUES (#{email}, #{username}, #{password}, #{roles})")
    void insertUser(LoginDTO loginDTO);

    // 소셜 로그인 insert
    @Insert("INSERT INTO user(email, nickname, roles, platform) " +
            "VALUES (#{email}, #{nickname}, #{roles}, #{platform})")
    void insertOauthUser(User user);

    @Select("SELECT COUNT(*) = 1 FROM user WHERE nickname = #{username}")
    boolean isUsernameExisted(String username);

    // 트큰의 username으로 user_id 조회
    @Select("SELECT id FROM user WHERE nickname = #{username}")
    Long findUserIdByUsername(String username);

    // 이메일 중복 확인
    @Select("SELECT COUNT(*) = 1 FROM user WHERE email = #{email}")
    boolean isEmailExisted(String email);

    // 이메일 인증 테스트 중
    // 이메일 인증 코드 저장
    @Insert("INSERT INTO email_verification (email, auth_code, expiration_time) " +
            "VALUES (#{email}, #{authCode}, #{expirationTime})")
    void insertEmailVerification(EmailVerification emailVerification);

    // Email로 이메일 인증 조회
    @Select("SELECT * FROM email_verification WHERE email = #{email}")
    EmailVerification findByVerifiedEmail(String email);

    // 인증 코드와 이메일 확인
    @Select("SELECT COUNT(*) = 1 FROM email_verification " +
            "WHERE email = #{email} AND auth_code = #{authCode}")
    boolean verifyAuthCode(String email, String authCode);

    // 인증 코드 삭제
    @Delete("DELETE FROM email_verification WHERE email = #{email}")
    void deleteEmailVerification(String email);

}
