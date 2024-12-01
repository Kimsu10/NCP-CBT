package kr.kh.backend.service.security;

import kr.kh.backend.domain.EmailVerification;
import kr.kh.backend.dto.EmailVerificationDTO;
import kr.kh.backend.mapper.UserMapper;
import kr.kh.backend.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmailVerificationService {
    private final UserMapper userMapper;
    private final MailService mailService;

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;

    public void sendCodeToEmail(String email) {
        log.info("Sending email verification code to {}", email);

        // 이메일 중복 확인
        if (userMapper.isEmailExisted(email)) {
            throw new IllegalArgumentException("email already exists");
        }

        // 인증 코드 생성
        String authCode = createAuthCode();
        String title = "[NCBT] 인증 번호";

        // 기존 인증 데이터 삭제
        userMapper.deleteEmailVerification(email);

        // 새 인증 데이터 삽입
        EmailVerification emailVerification = EmailVerification.builder()
                .email(email)
                .authCode(authCode)
                .expirationTime(LocalDateTime.now().plus(authCodeExpirationMillis, ChronoUnit.MILLIS))
                .build();
        userMapper.insertEmailVerification(emailVerification);

        // 이메일 발송
        mailService.sendEmail(email, title, "인증번호: " + authCode);
    }

    public EmailVerificationDTO verifyCode(String email, String authCode) {
        EmailVerification emailVerification = userMapper.findByEmail(email);

        if (emailVerification == null) {
            throw new IllegalArgumentException("can't find email verification code");
        }

        boolean isExpired = emailVerification.getExpirationTime().isBefore(LocalDateTime.now());
        if (isExpired) {
            throw new IllegalArgumentException("email verification is expired");
        }

        boolean isValid = emailVerification.getAuthCode().equals(authCode);
        if (!isValid) {
            throw new IllegalArgumentException("email verification is invalid");
        }

        // 인증 성공 시 데이터 삭제
        userMapper.deleteEmailVerification(email);

        return new EmailVerificationDTO(
                emailVerification.getEmail(),
                emailVerification.getAuthCode(),
                emailVerification.getExpirationTime()
        );
    }

    private String createAuthCode() {
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            log.error("Error while generating auth code", e);
            throw new IllegalStateException("Failed to generate secure number", e);
        }
    }
}
