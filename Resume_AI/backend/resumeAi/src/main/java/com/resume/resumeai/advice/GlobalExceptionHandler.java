package com.resume.resumeai.advice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice(basePackages = "com.resume.resumeai.api")
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error("INVALID_ARGUMENT", ex.getMessage()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> validation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ":" + e.getDefaultMessage())
                .findFirst().orElse("Validation failed");
        return ResponseEntity.badRequest().body(ApiResponse.error("VALIDATION_ERROR", msg));
    }
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> violation(ConstraintViolationException ex) {
        String msg = ex.getConstraintViolations().stream().findFirst()
                .map(v -> v.getPropertyPath() + ":" + v.getMessage()).orElse("Validation failed");
        return ResponseEntity.badRequest().body(ApiResponse.error("VALIDATION_ERROR", msg));
    }
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<Object>> forbidden(SecurityException ex) {
        return ResponseEntity.status(403).body(ApiResponse.error("FORBIDDEN", ex.getMessage()));
    }
    /**
     * 处理数据库访问相关异常，统一返回 500，并记录详细错误日志
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiResponse<Object>> dbError(DataAccessException ex) {
        log.error("database access error", ex);
        return ResponseEntity.internalServerError().body(ApiResponse.error("DB_ERROR", "数据库访问失败"));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> generic(Exception ex) {
        log.error("unhandled error", ex);
        return ResponseEntity.internalServerError().body(ApiResponse.error("ERROR", "Internal server error"));
    }
}