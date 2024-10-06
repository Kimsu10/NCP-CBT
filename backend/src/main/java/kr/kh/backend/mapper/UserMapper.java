package kr.kh.backend.mapper;

import kr.kh.backend.domain.User;
import kr.kh.backend.dto.security.LoginDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE nickname = #{username}")
    User findByUsername(String username);

    @Insert("INSERT INTO user(email, nickname, password, roles) " +
            "VALUES (#{email}, #{username}, #{password}, #{roles})")
    void insertUser(LoginDTO loginDTO);

    @Select("SELECT COUNT(*) = 1 FROM user WHERE nickname = #{username}")
    boolean isUsernameExisted(String username);

    @Select("SELECT COUNT(*) = 1 FROM user WHERE email = #{email}")
    boolean isEmailExisted(String email);
}
