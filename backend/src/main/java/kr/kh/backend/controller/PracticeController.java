package kr.kh.backend.controller;

import kr.kh.backend.dto.BookmarkDTO;
import kr.kh.backend.service.practice.PracticeService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PracticeController {

    @Autowired
    private  PracticeService practiceService;

    @PostMapping("/bookmarks")
    public ResponseEntity<String> addBookmark(@RequestBody BookmarkDTO bookmarkDTO,
                                              @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");
        return practiceService.addBookmark(bookmarkDTO, token);

    }

    @GetMapping("/bookmarks")
    public ResponseEntity<Long> getBookmark(@RequestParam("questionId") Long questionId,
                                            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");
        return practiceService.getBookmark(questionId, token);
    }

}

