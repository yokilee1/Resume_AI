package com.resume.resumeai.advice;

import java.util.UUID;

public class ApiResponse<T> {
    private String code;
    private String message;
    private T data;
    private String traceId;

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.code = "OK";
        r.message = "success";
        r.data = data;
        r.traceId = UUID.randomUUID().toString();
        return r;
    }
    public static <T> ApiResponse<T> error(String code, String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.code = code;
        r.message = message;
        r.traceId = UUID.randomUUID().toString();
        return r;
    }
    public String getCode() { return code; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public String getTraceId() { return traceId; }
    public void setCode(String code) { this.code = code; }
    public void setMessage(String message) { this.message = message; }
    public void setData(T data) { this.data = data; }
    public void setTraceId(String traceId) { this.traceId = traceId; }
}