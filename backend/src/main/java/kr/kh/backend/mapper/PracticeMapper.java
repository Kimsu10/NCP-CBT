package kr.kh.backend.mapper;

import kr.kh.backend.dto.BookmarkDTO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface PracticeMapper {

    // 북마크 추가
    @Insert("INSERT INTO bookmarks (subject_id, question_id, user_id) VALUES (#{subjectId}, #{questionId}, #{userId})")
    void addBookmark(BookmarkDTO bookmarkDTO);

    // 북마크 여부 확인
    @Select("SELECT * FROM bookmarks WHERE user_id = #{userId} AND question_id = #{questionId}")
    BookmarkDTO findBookmarkByUserIdAndQuestionId(Long userId, Long questionId);

    // 북마크 삭제
    @Delete("DELETE FROM bookmarks WHERE id = #{bookmarkId}")
    void deleteBookmark(Long bookmarkId);


}

