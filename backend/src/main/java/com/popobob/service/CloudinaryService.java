package com.popobob.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadBase64Image(String base64Image) {
        if (base64Image == null || base64Image.trim().isEmpty() || !base64Image.startsWith("data:image")) {
            return base64Image; // Not a base64 image or already a URL
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(base64Image, ObjectUtils.asMap(
                    "public_id", UUID.randomUUID().toString(),
                    "folder", "pop-o-bob"
            ));
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            System.err.println("Cloudinary upload failed: " + e.getMessage());
            return base64Image; // Fallback to original if upload fails
        }
    }
}
