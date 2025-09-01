package com.ucms.dto;

import com.ucms.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private Long id;
    private String username;
    private User.Role role;
    private Long profileId;
    private String name;
    private String email;
}