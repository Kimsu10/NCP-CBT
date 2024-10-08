package kr.kh.backend.domain;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter @Setter
@ToString(exclude = "password")
public class User implements UserDetails {

    private int id;
    private String email;
    private String nickname;
    private String password;
    private String platform;
    private String roles;


    @Override
    public String getUsername() {
        return nickname;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles != null && !roles.isEmpty() ?
                List.of(roles.split(",")).stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList()) :
                new ArrayList<>();
    }

    // 이하 메서드는 UsersDetails 를 상속받아 구현할 경우 반드시 Override 해야하는 메서드들로, 전부 true 를 반환하게 함.
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
