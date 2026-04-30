package com.devlog.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devlog.user.UserEntity;
import com.devlog.user.UserRepository;

import com.devlog.auth.EmailExistsException;

@Service
public class SignupService {
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public SignupService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;

  }

  // Validate the email and password
  private boolean validateCredentials(String email) {
    // is valid email
    return userRepository.existsByEmail(email);
  }

  public ResponseEntity<Void> signup(SignupRequest request) {
    // Validate the credentials
    // boolean isValidCred = validateCredentials(request.email(),
    // request.password());

    if (validateCredentials(request.email())) {
      throw new EmailExistsException("The email already exists");
    }

    // hash the password
    String hashedPass = passwordEncoder.encode(request.password());

    // put the user into the database
    UserEntity user = new UserEntity();
    user.setEmail(request.email());
    user.setPassword(hashedPass);
    user.setRole(UserEntity.Role.DEV);
    user.setUsername(request.username());
    userRepository.save(user);

    return ResponseEntity.ok().build();

  }
}
