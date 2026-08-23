package com.auth.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth.backend.constant.Endpoint;
import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.RoleRequest;
import com.auth.backend.dto.user.UserResponse;
import com.auth.backend.service.AdminClientService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(Endpoint.ADMIN) // /api/v1/admin
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminClientController {
    private final AdminClientService adminClientService;

    // Resolves to: GET /api/v1/admin/users (or /user)
    @GetMapping(Endpoint.USER) 
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminClientService.getAllUsers());
    }

    // Resolves to: PATCH /api/v1/admin
    @PatchMapping(Endpoint.USER)
    public ResponseEntity<String> editRole(@RequestParam Long id, @RequestBody RoleRequest request){
        adminClientService.editRole(id, request);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }

    // Resolves to: DELETE /api/v1/admin/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable Long id){
        adminClientService.removeUser(id);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }
}