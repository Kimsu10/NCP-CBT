package kr.kh.backend.controller;

import kr.kh.backend.dto.ExamDTO;
import kr.kh.backend.service.ExamService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping("/exam/record")
    public ResponseEntity<?> recordScore(@RequestBody ExamDTO examDTO,
                                         @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        return examService.recordScore(examDTO, token);
    }

}
