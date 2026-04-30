package com.devlog.auth;

import com.devlog.auth.EmailExistsException;
import com.devlog.post.PostNotFoundException;
import com.devlog.post.UnauthorizedPostActionException;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthenticationExceptionHandler {

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<Map<String, String>> badCredentials(BadCredentialsException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("Error", "Bad credentials"));
  }

  @ExceptionHandler(EmailExistsException.class)
  public ResponseEntity<Map<String, String>> emailExists(EmailExistsException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("Error", ex.getMessage()));
  }

  // Post not found
  @ExceptionHandler(PostNotFoundException.class)
  public ResponseEntity<Map<String, String>> postNotFound(PostNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Error", ex.getMessage()));
  }

  // Author tried to delete someone else's post
  @ExceptionHandler(UnauthorizedPostActionException.class)
  public ResponseEntity<Map<String, String>> unauthorizedPost(UnauthorizedPostActionException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("Error", ex.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, String>> genericError(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("Error", "Something went wrong"));
  }
}
