package kr.kh.backend.dto;

import lombok.Data;

@Data
public class PracticeComplaintsDTO {

    private Long id;
    private Long userId;
    private Long subjectId;
    private Long subjectQuestionId;
    private String title;
    private String content;

}
