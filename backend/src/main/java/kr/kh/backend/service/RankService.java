package kr.kh.backend.service;

import kr.kh.backend.dto.RankDTO;
import kr.kh.backend.mapper.RankMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class RankService {

    private final RankMapper rankMapper;

    public List<RankDTO> getRankingV1(RankDTO rankDTO) {
        // 1. title 로 subject_id 검색
        rankDTO.setSubjectId(rankMapper.findIdByTitle(rankDTO.getTitle()));

        // 2. 해당하는 subject_id 중에서 score 가 높은 순서로 정렬. (5행까지만 추출)
        return rankMapper.findTop5V1(rankDTO);
    }

    public List<RankDTO> getRankingV2(RankDTO rankDTO) {
        // 조인 쿼리로 한 번에 검색
        return rankMapper.findTop5V2(rankDTO);
    }

}
