package kr.kh.backend.domain;

import lombok.Data;

@Data
public class User {
    private String email;
    private String nickname;
    private String password;
    private boolean is_admin;
    private String platform;
}
