package kr.kh.backend.dto;

import lombok.Data;

@Data
public class BookmarkDTO {

    private Long id;
    private int subjectId;
    private int questionId;
    private int userId;

}
