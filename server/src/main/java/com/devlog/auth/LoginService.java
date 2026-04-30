package com.devlog.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import com.devlog.user.UserEntity;
import com.devlog.user.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Service
public class LoginService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;

  // Explicitly define the repository to persist the session
  private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

  // Constructor injection is the cleanest way to handle this
  public LoginService(UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
  }

  public AuthResponse login(@Valid AuthRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {

    // 1. Create the unauthenticated token
    UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(
        loginRequest.email(), loginRequest.password());

    // 2. Use the INJECTED manager to authenticate
    Authentication authentication = authenticationManager.authenticate(token);

    // 3. Update the SecurityContext
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);

    // 4. Persist the context so the session "remembers" the user
    securityContextRepository.saveContext(context, request, response);

    String username = authentication.getName();

    // 5. Return your response object
    return new AuthResponse("Login successful", username);
  }
}
