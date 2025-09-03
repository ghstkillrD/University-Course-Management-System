package com.ucms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        try {
            // Skip JWT processing for auth endpoints
            String requestURI = request.getRequestURI();
            logger.debug("Processing request: {}", requestURI);
            System.out.println("JWT Filter - Processing request: " + requestURI);
            
            if (requestURI.contains("/auth/login") || requestURI.contains("/auth/register")) {
                logger.debug("Skipping JWT processing for auth endpoint: {}", requestURI);
                System.out.println("JWT Filter - Skipping JWT processing for auth endpoint: " + requestURI);
                filterChain.doFilter(request, response);
                return;
            }
            
            String jwt = getJwtFromRequest(request);
            logger.debug("Extracted JWT: {}", jwt != null ? "TOKEN_PRESENT" : "NO_TOKEN");
            
            if (StringUtils.hasText(jwt)) {
                logger.debug("JWT token found, validating...");
                if (tokenProvider.validateToken(jwt)) {
                    logger.debug("JWT token is valid");
                    String username = tokenProvider.getUsernameFromToken(jwt);
                    logger.debug("Username from token: {}", username);
                    
                    // Only set authentication if not already set
                    if (SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        logger.debug("User details loaded: {}, authorities: {}", userDetails.getUsername(), userDetails.getAuthorities().toString());
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.debug("Authentication set in security context for user: {}", username);
                        
                        // Verify it was set
                        if (SecurityContextHolder.getContext().getAuthentication() != null) {
                            logger.debug("✓ Authentication confirmed in SecurityContext: {}", 
                                SecurityContextHolder.getContext().getAuthentication().getName());
                        } else {
                            logger.error("✗ Authentication was not properly set in SecurityContext!");
                        }
                    } else {
                        logger.debug("Authentication already exists in SecurityContext");
                    }
                } else {
                    logger.debug("JWT token validation failed");
                }
            } else {
                logger.debug("No JWT token found in request");
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        // Final check before passing to next filter
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            logger.debug("🔐 Final check: Authentication exists before next filter: {}", 
                SecurityContextHolder.getContext().getAuthentication().getName());
        } else {
            logger.debug("❌ Final check: No authentication in SecurityContext before next filter");
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}