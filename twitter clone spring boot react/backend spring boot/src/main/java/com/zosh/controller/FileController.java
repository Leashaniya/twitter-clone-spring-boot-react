package com.zosh.controller;

import com.zosh.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileService fileService;

    private static final int MAX_IMAGES = 3;

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        int imageCount = 0;
        boolean hasVideo = false;
        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            
            if (fileService.isImage(contentType)) {
                if (imageCount >= MAX_IMAGES) {
                    throw new IllegalArgumentException("Maximum of " + MAX_IMAGES + " images allowed");
                }
                imageCount++;
            } else {
                if (hasVideo) {
                    throw new IllegalArgumentException("Only one video allowed per post");
                }
                hasVideo = true;
            }

            String url = fileService.uploadFile(file);
            urls.add(url);
        }

        return ResponseEntity.ok(urls);
    }
} 