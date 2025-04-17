package com.zosh.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zosh.dto.TwitDto;
import com.zosh.dto.mapper.TwitDtoMapper;
import com.zosh.exception.TwitException;
import com.zosh.exception.UserException;
import com.zosh.model.Twit;
import com.zosh.model.User;
import com.zosh.response.ApiResponse;
import com.zosh.service.TwitService;
import com.zosh.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/twits")
@Tag(name="Twit Management", description = "Endpoints for managing twits")
public class TwitController {
    
    private TwitService twitService;
    private UserService userService;
    
    public TwitController(TwitService twitService, UserService userService) {
        this.twitService = twitService;
        this.userService = userService;
    }
    
    @PostMapping("/create")
    public ResponseEntity<TwitDto> createTwit(
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) String imageUrl,
            @RequestParam(value = "video", required = false) String videoUrl,
            @RequestHeader("Authorization") String jwt) throws UserException, TwitException, IOException {
        
        User user = userService.findUserProfileByJwt(jwt);
        
        // Debug logging
        System.out.println("Received create twit request with data:");
        System.out.println("Content: " + content);
        System.out.println("Image URL: " + (imageUrl != null ? imageUrl : "null"));
        System.out.println("Video URL: " + (videoUrl != null ? videoUrl : "null"));
        
        Twit twit = new Twit();
        twit.setContent(content);
        twit.setCreatedAt(LocalDateTime.now());
        twit.setUser(user);
        
        // Handle image URL
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            System.out.println("Setting image URL in twit: " + imageUrl);
            twit.setImage(imageUrl.trim());
        } else {
            System.out.println("No image URL provided");
            twit.setImage(null);
        }
        
        // Handle video URL
        if (videoUrl != null && !videoUrl.isEmpty()) {
            System.out.println("Setting video URL: " + videoUrl);
            twit.setVideo(videoUrl);
        }
        
        Twit savedTwit = twitService.createTwit(twit, user);
        System.out.println("Saved twit with ID: " + savedTwit.getId());
        System.out.println("Saved image URL: " + savedTwit.getImage());
        
        TwitDto twitDto = TwitDtoMapper.toTwitDto(savedTwit, user);
        return new ResponseEntity<>(twitDto, HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteTwit(@PathVariable Long id) {
        // Implementation of deleteTwit method
        return null; // Placeholder return, actual implementation needed
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TwitDto> getTwit(@PathVariable Long id) {
        // Implementation of getTwit method
        return null; // Placeholder return, actual implementation needed
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TwitDto> updateTwit(
            @PathVariable Long id,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) String imageUrl,
            @RequestParam(value = "video", required = false) String videoUrl,
            @RequestHeader("Authorization") String jwt) throws UserException, TwitException {
        
        User user = userService.findUserProfileByJwt(jwt);
        Twit existingTwit = twitService.findById(id);
        
        // Check if the user is the owner of the twit
        if (!existingTwit.getUser().getId().equals(user.getId())) {
            throw new TwitException("You are not authorized to edit this twit");
        }
        
        existingTwit.setContent(content);
        
        // Handle image URL
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            existingTwit.setImage(imageUrl.trim());
        }
        
        // Handle video URL
        if (videoUrl != null && !videoUrl.trim().isEmpty()) {
            existingTwit.setVideo(videoUrl.trim());
        }
        
        Twit updatedTwit = twitService.updateTwit(existingTwit);
        TwitDto twitDto = TwitDtoMapper.toTwitDto(updatedTwit, user);
        
        return new ResponseEntity<>(twitDto, HttpStatus.OK);
    }
    
    @GetMapping("/feed")
    public ResponseEntity<List<TwitDto>> getAllTwits(@RequestHeader("Authorization") String jwt) throws UserException {
        try {
            String token = jwt.substring(7); // Remove "Bearer " prefix
            User user = userService.findUserProfileByJwt(token);
            List<Twit> twits = twitService.findAllTwit();
            List<TwitDto> twitDtos = new ArrayList<>();
            
            for (Twit twit : twits) {
                TwitDto twitDto = TwitDtoMapper.toTwitDto(twit, user);
                twitDtos.add(twitDto);
            }
            
            return new ResponseEntity<>(twitDtos, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error in getAllTwits: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}