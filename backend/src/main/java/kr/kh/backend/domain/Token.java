package kr.kh.backend.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter @Setter
public class Token {
    private int id;
    private String token;
    private int userId;
    private Date expirationDate;
    private TokenStatus status;

}
