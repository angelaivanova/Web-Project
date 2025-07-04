package org.example.service.application.Impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.model.AuthenticationResponse;
import org.example.model.DTOs.userDTO.RegisterUserDTO;
import org.example.model.Token;
import org.example.model.User;
import org.example.model.enumerations.Role;
import org.example.repository.TokenRepository;
import org.example.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 TokenRepository tokenRepository,
                                 AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterUserDTO request){
        if(repository.findByUsername(request.getUsername()).isPresent()){
            return new AuthenticationResponse(null, null, "User already exist");
        }

        User user = new User();
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        String roleStr = request.getRole();
        if (roleStr != null && roleStr.startsWith("ROLE_")) {
            roleStr = roleStr.substring(5);
        }
        Role roleEnum = Role.valueOf(roleStr); // assuming Role is your enum class

        user.setRole(roleEnum);

        user=repository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(accessToken, refreshToken, user);

        return new AuthenticationResponse(accessToken, refreshToken, "User registration was successful");
    }

    public AuthenticationResponse authenticate(User request){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            User user = repository.findByUsername(request.getUsername()).orElseThrow();
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllTokenByUser(user);
            saveUserToken(accessToken, refreshToken, user);

            return new AuthenticationResponse(
                    accessToken,
                    refreshToken,
                    "User login was successful",
                    user.getRole().roleName(),
                    user.getUsername(),
                    user.getId()
            );

        } catch (Exception e){
            System.err.println("Authentication failed: " + e.getMessage());
            return new AuthenticationResponse(null, null, "Invalid credentials");
        }
    }

    private void revokeAllTokenByUser(User user){
        List<Token> validTokens = tokenRepository.findAllAccessTokensByUser(user.getId());
        if(validTokens.isEmpty()){
            return;
        }
        validTokens.forEach(t->{
            t.setLoggedOut(true);
        });
        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(String accessToken, String refreshToken, User user){
        Token token = new Token();
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }

    public ResponseEntity refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ){
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader==null || !authHeader.startsWith("Bearer ")){
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        String username = jwtService.extractUsername(token);

        User user = repository.findByUsername(username)
                .orElseThrow(()->new RuntimeException("No user found"));

        if (jwtService.isValidRefreshToken(token, user)){
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllTokenByUser(user);
            saveUserToken(accessToken,refreshToken,user);

            return new ResponseEntity<>(new AuthenticationResponse(accessToken, refreshToken, "New token generated"), HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.UNAUTHORIZED);
    }
}
