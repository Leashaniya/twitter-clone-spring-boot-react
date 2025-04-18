package com.zosh.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;
    
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    public String uploadImage(MultipartFile file) throws IOException {
        try {
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", "twitter-clone",
                "upload_preset", "twitter_preset",
                "resource_type", "auto"
            );

            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage());
        }
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extract public ID from URL
            String publicId = extractPublicId(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            // Log error but don't throw - we don't want to break the application flow if deletion fails
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }

    private String extractPublicId(String imageUrl) {
        // Example URL: https://res.cloudinary.com/dzxyymhu9/image/upload/v1234567890/twitter-clone/abc123
        if (imageUrl != null && imageUrl.contains("/upload/")) {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length > 1) {
                // Remove version number if present
                String[] versionAndPublicId = parts[1].split("/", 2);
                if (versionAndPublicId.length > 1) {
                    return versionAndPublicId[1];
                }
                return parts[1];
            }
        }
        return null;
    }
} 