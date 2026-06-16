package com.auth.backend.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.auth.backend.constant.EnvironmentValues;
import com.auth.backend.constant.ResponseMessage;
import com.auth.backend.entity.UserEntity;
import com.auth.backend.exception.CustomNotFoundException;
import com.auth.backend.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtil {
    private final UserRepository userRepository;
    private final EnvironmentValues environmentValues;
    private Key key;


    @PostConstruct
    public void init(){
        this.key = Keys.hmacShaKeyFor(environmentValues.getJwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    private String generateToken(UserEntity user,int expiration){
        Map<String,Object> claims = new HashMap<>();

        claims.put("id",user.getId());
        claims.put("role",user.getRole());

        long currentMillis = System.currentTimeMillis();
        Date issueAt = new Date(currentMillis);
        Date expirationDate = new Date(expiration + currentMillis);

        return Jwts
                .builder()
                .addClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(issueAt)
                .setExpiration(expirationDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    public String generateAccessToken(UserEntity user){
        return generateToken(user,environmentValues.getAccessTime());
    }
    public String generateRefreshToken(UserEntity user){
       return generateToken(user,environmentValues.getRefreshTime());
    }

    public Claims extractClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractSubject(String token){
        return extractClaims(token).getSubject();
    }
    public Date extractExpiration(String token){
        return extractClaims(token).getExpiration();
    }
    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }


    public boolean validateToken(String token){
        try {
            return !isTokenExpired(token) && extractSubject(token) != null;
        } catch (Exception e){
            return false;
        }
    }


    public UserEntity extractUser(String token){
        String email = extractSubject(token);
        return userRepository.findByEmail(email).orElseThrow(()-> new CustomNotFoundException(ResponseMessage.NOT_FOUND));
    }
}
