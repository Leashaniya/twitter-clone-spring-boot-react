package com.zosh.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
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
    public ResponseEntity<TwitDto> createTwit(@RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String jwt) throws UserException, TwitException, IOException {
        
        User user = userService.findUserProfileByJwt(jwt);
        
        Twit twit = new Twit();
        twit.setContent(content);
        twit.setCreatedAt(LocalDateTime.now());
        twit.setUser(user);
        
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            twit.setImage(imageUrl);
        }
        
        Twit savedTwit = twitService.createTwit(twit, user);
        TwitDto twitDto = TwitDtoMapper.toTwitDto(savedTwit, user);
        
        return new ResponseEntity<>(twitDto, HttpStatus.CREATED);
    }
    
    @GetMapping("/")
    public ResponseEntity<List<TwitDto>> findAllTwits(@RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<Twit> twits = twitService.findAllTwit();
        List<TwitDto> twitDtos = TwitDtoMapper.toTwitDtos(twits, user);
        return new ResponseEntity<>(twitDtos, HttpStatus.OK);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TwitDto>> getUsersTwits(@PathVariable Long userId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfileByJwt(jwt);
        User user = userService.findUserById(userId);
        List<Twit> twits = twitService.getUsersTwit(user);
        List<TwitDto> twitDtos = TwitDtoMapper.toTwitDtos(twits, reqUser);
        return new ResponseEntity<>(twitDtos, HttpStatus.OK);
    }
    
    @DeleteMapping("/{twitId}")
    public ResponseEntity<ApiResponse> deleteTwitById(@PathVariable Long twitId,
            @RequestHeader("Authorization") String jwt) throws UserException, TwitException {
        
        User user = userService.findUserProfileByJwt(jwt);
        twitService.deleteTwitById(twitId, user.getId());
        
        ApiResponse res = new ApiResponse();
        res.setMessage("twit deleted successfully");
        res.setStatus(true);
        
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
    
    @PutMapping("/{twitId}")
    public ResponseEntity<TwitDto> updateTwit(@PathVariable Long twitId,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String jwt) throws UserException, TwitException, IOException {
        
        User user = userService.findUserProfileByJwt(jwt);
        
        Twit existingTwit = twitService.findById(twitId);
        
        // Check if the user is the owner of the post
        if (!existingTwit.getUser().getId().equals(user.getId())) {
            throw new TwitException("You can only edit your own posts");
        }
        
        existingTwit.setContent(content);
        
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            existingTwit.setImage(imageUrl);
        }
        
        Twit updatedTwit = twitService.updateTwit(existingTwit);
        TwitDto twitDto = TwitDtoMapper.toTwitDto(updatedTwit, user);
        
        return new ResponseEntity<>(twitDto, HttpStatus.OK);
    }
    
    private String saveImage(MultipartFile image) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get("uploads");
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return "/uploads/" + fileName;
    }
} 