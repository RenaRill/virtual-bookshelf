package com.virtualshelf.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SigninRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
