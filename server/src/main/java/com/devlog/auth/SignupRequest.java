package com.devlog.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(@Email @NotBlank String email,
    @NotBlank @Size(max = 49) String username, @NotBlank @Size(min = 3) String password) {
}
