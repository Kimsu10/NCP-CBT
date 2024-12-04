package kr.kh.backend.dto;

import lombok.Data;

@Data
public class PracticeComplaintsDTO {

    private Long userId;
    private Long subjectId;
    private Long subjectQuestionId;
    private String title;
    private String content;

}

/* Post - body
    {
    "subjectId": 1,
    "subjectQuestionId": 8,
    "title": "제목",
    "content": "이의있습니다"
}
* */