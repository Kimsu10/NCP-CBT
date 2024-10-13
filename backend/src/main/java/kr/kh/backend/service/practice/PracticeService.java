package kr.kh.backend.service.practice;

import kr.kh.backend.dto.BookmarkDTO;
import kr.kh.backend.dto.PracticeComplaintsDTO;
import kr.kh.backend.mapper.PracticeMapper;
import kr.kh.backend.mapper.UserMapper; // 올바른 UserMapper 임포트
import kr.kh.backend.security.jwt.JwtTokenProvider;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import static org.springframework.web.servlet.function.ServerResponse.status;


@Service
@AllArgsConstructor
@Slf4j
public class PracticeService {

    private final PracticeMapper practiceMapper;
    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;

    // 상태 코드와 함께 응답 메시지를 반환
    public ResponseEntity<String> addBookmark(BookmarkDTO bookmarkDTO, String token) {
//        log.info("추가하는 북마크 값 ############################: {}", bookmarkDTO);

        String username = jwtTokenProvider.getUsernameFromToken(token);
//        log.info("JWT username 출력#########################: {}", username);
        if (username == null) {
            return ResponseEntity.badRequest().body("사용자 정보가 없습니다.");
        }

        Long userId = userMapper.findUserIdByUsername(username);
//        log.info("Found userId: {}", userId);
        if (userId == null) {
            return ResponseEntity.badRequest().body("사용자 정보가 없습니다.");
        }

        bookmarkDTO.setUserId(userId.intValue());

        try {
            BookmarkDTO existingBookmark = practiceMapper.findBookmarkByUserIdAndQuestionId(userId, (long) bookmarkDTO.getQuestionId());
//            log.info("북마크 존재 : {}", existingBookmark);

            if (existingBookmark != null) {
                practiceMapper.deleteBookmark(existingBookmark.getId());
//                log.info("북마크 id가 존재하는경우 삭제 : {}", existingBookmark.getId());
                return ResponseEntity.ok("북마크가 성공적으로 삭제되었습니다.");
            } else {
                practiceMapper.addBookmark(bookmarkDTO);
//                log.info("새로운 북마크 확인 : {}", bookmarkDTO);
                return ResponseEntity.ok("북마크가 성공적으로 추가되었습니다.");
            }
        } catch (Exception e) {
//            log.error("Error adding bookmark: {}", e.getMessage());
            return ResponseEntity.status(500).body("북마크 추가 중 오류가 발생했습니다: " + e.getMessage());
        }

    }

    // 상태 코드만 반환
    public ResponseEntity<Long> getBookmark(Long questionId, String token) {
        String username = jwtTokenProvider.getUsernameFromToken(token);

        if (username == null) {
            return ResponseEntity.badRequest().build();
        }

        Long userId = userMapper.findUserIdByUsername(username);

        try {
            BookmarkDTO existingBookmark = practiceMapper.findBookmarkByUserIdAndQuestionId(userId, questionId);

            if (existingBookmark != null) {
                return ResponseEntity.ok(questionId);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // 문제 오류 신고
        public ResponseEntity<String> addQuestionComplaints(PracticeComplaintsDTO practiceComplaintsDTO, String token) {

            String username = jwtTokenProvider.getUsernameFromToken(token);

            if (username == null) {
                return ResponseEntity.badRequest().body("사용자 정보가 없습니다.");
            }

            Long userId = userMapper.findUserIdByUsername(username);

            if (userId == null) {
                return ResponseEntity.badRequest().body("사용자 정보가 없습니다.");
            }

            practiceComplaintsDTO.setUserId(userId);



            try {
                PracticeComplaintsDTO existingComplaint = practiceMapper.findComplaintByUserIdAndSubjectQuestionId(userId, practiceComplaintsDTO.getSubjectQuestionId());

                if (existingComplaint != null) {
                    return ResponseEntity.badRequest().body("이미 해당 문제에 대한 오류 신고가 접수되었습니다.");
                }

                practiceMapper.addComplaint(practiceComplaintsDTO);
                return ResponseEntity.ok("문제 오류가 성공적으로 접수되었습니다.");

            }catch (Exception e) {
                return ResponseEntity.status(500).body("문제 오류 신고 중 문제가 발생했습니다: " + e.getMessage());
            }
        }
    }


