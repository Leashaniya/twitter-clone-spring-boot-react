package com.zosh.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import org.springdoc.core.converters.models.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zosh.exception.TwitException;
import com.zosh.exception.UserException;
import com.zosh.model.Twit;
import com.zosh.model.User;
import com.zosh.repository.TwitRepository;
import com.zosh.request.TwitReplyRequest;
import com.zosh.request.TwitRequest;

@Service
@Transactional
public class TwitServiceImplementation implements TwitService {
	
	private TwitRepository twitRepository;
	
	public TwitServiceImplementation(TwitRepository twitRepository) {
		this.twitRepository=twitRepository;
	}

	@Override
	public Twit createTwit(Twit req,User user) {
		Twit twit=new Twit();
		twit.setContent(req.getContent());
		twit.setCreatedAt(LocalDateTime.now());
		twit.setImages(req.getImages() != null ? req.getImages() : new ArrayList<>());
		twit.setUser(user);
		twit.setReply(false);
		twit.setTwit(true);
		twit.setVideo(req.getVideo());
		
		return twitRepository.save(twit);
	}

	@Override
	public Twit retwit(Long twitId, User user) throws TwitException {
		Twit twit=findById(twitId);
		if(twit.getRetwitUser().contains(user)) {
			twit.getRetwitUser().remove(user);
		}
		else {
			twit.getRetwitUser().add(user);
		}
		
		return twitRepository.save(twit);
	}

	@Override
	@Transactional(readOnly = true)
	public Twit findById(Long twitId) throws TwitException {
		Twit twit = twitRepository.findById(twitId)
				.orElseThrow(() -> new TwitException("Twit Not Found With Id " + twitId));
		
		// Initialize the collections
		twit.getLikes().size();
		twit.getReplyTwits().size();
		twit.getRetwitUser().size();
		
		return twit;
	}

	@Override
	public void deleteTwitById(Long twitId, Long userId) throws TwitException, UserException {
		Twit twit = findById(twitId);
		
		if(!userId.equals(twit.getUser().getId())) {
			throw new UserException("you can't delete another users twit");
		}
		twitRepository.deleteById(twit.getId());
	}

	@Override
	public Twit removeFromRetwit(Long twitId, User user) throws TwitException, UserException {
		
		Twit twit=findById(twitId);
	
		twit.getRetwitUser().remove(user);
		
		return twitRepository.save(twit);
	}

	@Override
	public Twit createReply(TwitReplyRequest req,User user) throws TwitException {
		Twit twit = findById(req.getTwitId());
		
		Twit reply = new Twit();
		reply.setContent(req.getContent());
		reply.setCreatedAt(LocalDateTime.now());
		reply.setImages(req.getImages() != null ? req.getImages() : new ArrayList<>());
		reply.setUser(user);
		reply.setReplyFor(twit);
		reply.setReply(true);
		reply.setTwit(false);
		
		Twit savedReply = twitRepository.save(reply);
		
		twit.getReplyTwits().add(savedReply);
		twitRepository.save(twit);
		return twit;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Twit> findAllTwit() {
		List<Twit> twits = twitRepository.findAllByIsTwitTrueOrderByCreatedAtDesc();
		// Initialize collections for each twit
		for (Twit twit : twits) {
			twit.getLikes().size();
			twit.getReplyTwits().size();
			twit.getRetwitUser().size();
		}
		return twits;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Twit> getUsersTwit(User user) {
		List<Twit> twits = twitRepository.findByRetwitUserContainsOrUser_IdAndIsTwitTrueOrderByCreatedAtDesc(user, user.getId());
		// Initialize collections for each twit
		for (Twit twit : twits) {
			twit.getLikes().size();
			twit.getReplyTwits().size();
			twit.getRetwitUser().size();
		}
		return twits;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Twit> findByLikesContainsUser(User user) {
		List<Twit> twits = twitRepository.findByLikesUser_Id(user.getId());
		// Initialize collections for each twit
		for (Twit twit : twits) {
			twit.getLikes().size();
			twit.getReplyTwits().size();
			twit.getRetwitUser().size();
		}
		return twits;
	}
	
	@Override
	public Twit updateTwit(Twit twit) throws TwitException {
		Twit existingTwit = findById(twit.getId());
		existingTwit.setContent(twit.getContent());
		existingTwit.setImages(twit.getImages() != null ? twit.getImages() : new ArrayList<>());
		existingTwit.setVideo(twit.getVideo());
		return twitRepository.save(existingTwit);
	}
	
	

}
