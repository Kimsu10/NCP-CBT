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

}
