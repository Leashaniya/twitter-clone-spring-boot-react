package com.zosh.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.zosh.dto.TwitDto;
import com.zosh.dto.mapper.TwitDtoMapper;
import com.zosh.exception.TwitException;
import com.zosh.exception.UserException;
import com.zosh.model.Twit;
import com.zosh.model.User;
import com.zosh.request.TwitReplyRequest;
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
			@RequestParam(value = "content", required = true) String content,
			@RequestParam(value = "images", required = false) List<MultipartFile> images,
			@RequestParam(value = "video", required = false) MultipartFile video,
			@RequestHeader("Authorization") String jwt) throws UserException, TwitException, IOException {
		
		User user = userService.findUserProfileByJwt(jwt);
		
		Twit twit = new Twit();
		twit.setContent(content);
		twit.setCreatedAt(LocalDateTime.now());
		twit.setUser(user);
		
		Twit createdTwit = twitService.createTwit(twit, user);
		TwitDto twitDto = TwitDtoMapper.toTwitDto(createdTwit, user);
		
		return new ResponseEntity<>(twitDto, HttpStatus.CREATED);
	}
	
	@PostMapping("/reply")
	public ResponseEntity<TwitDto> replyTwit(@RequestBody TwitReplyRequest req, 
			@RequestHeader("Authorization") String jwt) throws UserException, TwitException {
		User user = userService.findUserProfileByJwt(jwt);
		Twit twit = twitService.createReply(req, user);
		TwitDto twitDto = TwitDtoMapper.toTwitDto(twit, user);
		return new ResponseEntity<>(twitDto, HttpStatus.CREATED);
	}
	
	@PutMapping("/{twitId}/retwit")
	public ResponseEntity<TwitDto> retwit(@PathVariable Long twitId,
			@RequestHeader("Authorization") String jwt) throws UserException, TwitException {
		User user = userService.findUserProfileByJwt(jwt);
		Twit twit = twitService.retwit(twitId, user);
		TwitDto twitDto = TwitDtoMapper.toTwitDto(twit, user);
		return new ResponseEntity<>(twitDto, HttpStatus.OK);
	}
	
	@GetMapping("/{twitId}")
	public ResponseEntity<TwitDto> findTwitById(@PathVariable Long twitId,
			@RequestHeader("Authorization") String jwt) throws TwitException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Twit twit = twitService.findById(twitId);
		TwitDto twitDto = TwitDtoMapper.toTwitDto(twit, user);
		return new ResponseEntity<>(twitDto, HttpStatus.ACCEPTED);
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
	
	@GetMapping("/user/{userId}/likes")
	public ResponseEntity<List<TwitDto>> findTwitByLikesContainsUser(@PathVariable Long userId,
			@RequestHeader("Authorization") String jwt) throws UserException {
		User reqUser = userService.findUserProfileByJwt(jwt);
		User user = userService.findUserById(userId);
		List<Twit> twits = twitService.findByLikesContainsUser(user);
		List<TwitDto> twitDtos = TwitDtoMapper.toTwitDtos(twits, reqUser);
		return new ResponseEntity<>(twitDtos, HttpStatus.OK);
	}
	
	@PutMapping("/{twitId}")
	public ResponseEntity<TwitDto> updateTwit(
			@PathVariable Long twitId,
			@RequestParam("content") String content,
			@RequestParam(value = "images", required = false) List<MultipartFile> images,
			@RequestParam(value = "video", required = false) MultipartFile video,
			@RequestHeader("Authorization") String jwt) throws UserException, TwitException, IOException {
		
		User user = userService.findUserProfileByJwt(jwt);
		Twit existingTwit = twitService.findById(twitId);
		
		if (!existingTwit.getUser().getId().equals(user.getId())) {
			throw new TwitException("You can only edit your own posts");
		}
		
		existingTwit.setContent(content);
		
		Twit updatedTwit = twitService.updateTwit(existingTwit);
		TwitDto twitDto = TwitDtoMapper.toTwitDto(updatedTwit, user);
		
		return new ResponseEntity<>(twitDto, HttpStatus.OK);
	}
}
