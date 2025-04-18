export const uploadToCloudinary = async (pics, fileType) => {
    if (!pics) {
        console.log("No file selected");
        return null;
    }

    try {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "twitter_preset");  // Your preset name
        data.append("cloud_name", "dzxyymhu9");         // Your cloud name

        const res = await fetch(`https://api.cloudinary.com/v1_1/dzxyymhu9/${fileType}/upload`, {
            method: "post",
            body: data,
        });

        if (!res.ok) {
            throw new Error(`Upload failed with status: ${res.status}`);
        }

        const fileData = await res.json();
        console.log("Upload successful:", fileData);
        return fileData.secure_url; // Use secure_url instead of url
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload file to Cloudinary");
    }
};