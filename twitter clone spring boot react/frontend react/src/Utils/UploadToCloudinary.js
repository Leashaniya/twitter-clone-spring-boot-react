export const uploadToCloudinary = async (pics, fileType) => {
    if (!pics) {
        throw new Error("No file provided");
    }

    try {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "social_media_uploads"); // Your custom upload preset
        data.append("cloud_name", "dvebp0urn"); // Your cloud name

        const res = await fetch(`https://api.cloudinary.com/v1_1/dvebp0urn/${fileType}/upload`, {
            method: "post",
            body: data,
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Cloudinary error response:", errorData);
            throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
        }

        const fileData = await res.json();
        
        if (!fileData?.url) {
            throw new Error('No URL received from Cloudinary');
        }

        console.log("Upload successful. URL:", fileData.url);
        return fileData.url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error(`Failed to upload ${fileType}: ${error.message}`);
    }
};