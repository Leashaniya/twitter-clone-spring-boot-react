package com.zosh.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class FileService {

    @Autowired
    private Cloudinary cloudinary;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList("video/mp4", "video/quicktime");
    private static final int MAX_IMAGES = 3;
    private static final int MAX_VIDEO_DURATION = 30; // in seconds
    private static final long MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB max size for videos

    public List<String> uploadMultipleFiles(MultipartFile[] files) {
        int imageCount = 0;
        boolean hasVideo = false;
        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            validateFile(file);
            String contentType = file.getContentType();

            if (isImage(contentType)) {
                if (imageCount >= MAX_IMAGES) {
                    throw new IllegalArgumentException("Maximum of " + MAX_IMAGES + " images allowed");
                }
                imageCount++;
            } else if (isVideo(contentType)) {
                if (hasVideo) {
                    throw new IllegalArgumentException("Only one video allowed per post");
                }
                hasVideo = true;
            }

            String url = uploadFile(file);
            urls.add(url);
        }

        return urls;
    }

    public String uploadFile(MultipartFile file) {
        validateFile(file);
        try {
            Map<String, Object> options;
            
            if (isVideo(file.getContentType())) {
                options = ObjectUtils.asMap(
                    "resource_type", "video",
                    "max_duration", MAX_VIDEO_DURATION,
                    "transformation", Arrays.asList(
                        ObjectUtils.asMap("max_duration", MAX_VIDEO_DURATION)
                    )
                );
            } else {
                options = ObjectUtils.asMap(
                    "resource_type", "auto"
                );
            }
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }

    public void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("File type cannot be determined");
        }

        if (!ALLOWED_IMAGE_TYPES.contains(contentType) && !ALLOWED_VIDEO_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }

        if (isVideo(contentType)) {
            if (file.getSize() > MAX_VIDEO_SIZE) {
                throw new IllegalArgumentException("Video size exceeds maximum limit of 50MB");
            }
        }
    }

    private boolean isVideo(String contentType) {
        return ALLOWED_VIDEO_TYPES.contains(contentType);
    }

    public boolean isImage(String contentType) {
        return ALLOWED_IMAGE_TYPES.contains(contentType);
    }
} 