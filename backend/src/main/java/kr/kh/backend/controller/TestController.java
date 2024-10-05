package kr.kh.backend.controller;

import kr.kh.backend.domain.User;
import kr.kh.backend.dto.security.JwtToken;
import kr.kh.backend.dto.security.LoginDTO;
import kr.kh.backend.mapper.TestMyBatis;
import kr.kh.backend.service.security.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
public class TestController {

    private final TestMyBatis testMyBatis;

    @GetMapping("/test")
    public List<User> test() {
        System.out.println("skdfsfdsljfkdlsfjldsjfdsjklfdskfs");
        return testMyBatis.selectAll();
    }

}
