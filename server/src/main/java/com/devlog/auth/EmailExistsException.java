package com.devlog.auth;

public class EmailExistsException extends RuntimeException {
    EmailExistsException(String msg) {
        new RuntimeException(msg);
    }
}
