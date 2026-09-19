package com.curo.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY =
            "your-super-secret-key-change-this-in-production-with-env-var";

    private final long EXPIRATION_TIME = 86400000; // 24 hours

    private final SecretKey signingKey =
            Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    /**
     * Generate JWT token for User
     */
    public String generateToken(Long userId, String email) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("userType", "USER")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Generate JWT token for Provider
     */
    public String generateProviderToken(Long providerId, String email) {
        return Jwts.builder()
                .subject(providerId.toString())
                .claim("email", email)
                .claim("userType", "PROVIDER")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Parse and validate JWT token
     */
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extract User ID from token
     */
    public Long extractUserId(String token) {
        try {
            Claims claims = getClaims(token);
            if (!"USER".equals(claims.get("userType", String.class))) {
                throw new RuntimeException("Invalid token type for user");
            }
            return Long.parseLong(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    /**
     * Extract Provider ID from token
     */
    public Long extractProviderId(String token) {
        try {
            Claims claims = getClaims(token);
            if (!"PROVIDER".equals(claims.get("userType", String.class))) {
                throw new RuntimeException("Invalid token type for provider");
            }
            return Long.parseLong(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    /**
     * Extract email from token
     */
    public String extractEmail(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.get("email", String.class);
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    /**
     * Get user type from token (USER or PROVIDER)
     */
    public String getUserType(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.get("userType", String.class);
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    /**
     * Validate token
     */
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return true;
        }
    }
}