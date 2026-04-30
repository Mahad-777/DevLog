package com.devlog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devlog.auth.AuthRequest;
import com.devlog.auth.AuthResponse;
import com.devlog.auth.LoginService;
import com.devlog.auth.SignupRequest;
import com.devlog.auth.SignupService;
import com.devlog.user.UserEntity;
import com.devlog.user.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private SignupService signupService;
  private LoginService loginService;
  private UserRepository userRepository;

  AuthController(SignupService signupService, LoginService loginService, UserRepository userRepository) {
    this.signupService = signupService;
    this.loginService = loginService;
    this.userRepository = userRepository;
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
    return signupService.signup(request);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody AuthRequest AuthRequest, HttpServletRequest request,
      HttpServletResponse response) {
    return loginService.login(AuthRequest, request, response);
  }

  // Endpoint to check authentication state of a user
  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession session) {
    Long userId = (Long) session.getAttribute("userId");
    if (userId == null) {
      return ResponseEntity.status(401).build();
    }
    // return whatever the frontend needs, e.g. username
    UserEntity user = userRepository.findById(userId).orElse(null);
    if (user == null)
      return ResponseEntity.status(401).build();
    return ResponseEntity.ok(new AuthResponse("ok", user.getUsername()));
  }

}
