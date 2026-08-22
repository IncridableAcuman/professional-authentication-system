package com.auth.backend.controller;

import com.auth.backend.constant.Endpoint;
import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.dto.user.RoleRequest;
import com.auth.backend.service.AdminClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Endpoint.ADMIN + Endpoint.USER)
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminClientController {
    private final AdminClientService adminClientService;

    @PatchMapping
    public ResponseEntity<String> editRole(@RequestParam Long id, @RequestBody RoleRequest request){
        adminClientService.editRole(id,request);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable Long id){
        adminClientService.removeUser(id);
        return ResponseEntity.ok(ResponseMessage.SUCCESS);
    }
}
