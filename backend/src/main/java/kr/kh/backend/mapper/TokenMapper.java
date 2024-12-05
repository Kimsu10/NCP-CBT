package kr.kh.backend.mapper;

import kr.kh.backend.domain.Token;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface TokenMapper {

    @Insert("INSERT INTO token (token, user_id, expiration_date, status) " +
            "VALUES (#{token}, #{userId}, #{expirationDate}, #{status})")
    int saveToken(Token token);

    @Select("SELECT FROM token WHERE user_id = #{userId}")
    Token getTokenByUserId(int userId);

}
