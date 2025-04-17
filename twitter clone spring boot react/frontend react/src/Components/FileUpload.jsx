import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FileUpload = ({ onUploadComplete }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const validateFiles = (files) => {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'));

        if (imageFiles.length > 3) {
            toast.error('Maximum 3 images allowed');
            return false;
        }

        if (videoFiles.length > 1) {
            toast.error('Only 1 video allowed');
            return false;
        }

        for (const video of videoFiles) {
            if (video.size > 50 * 1024 * 1024) { // 50MB
                toast.error('Video size should not exceed 50MB');
                return false;
            }
        }

        return true;
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (validateFiles(files)) {
            setSelectedFiles(Array.from(files));
        } else {
            event.target.value = null;
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select files to upload');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
            console.log('Appending file:', file.name, file.type, file.size);
            formData.append(`files`, file);
        });

        setUploading(true);
        try {
            console.log('Sending request to upload files...');
            const response = await axios.post('http://localhost:5454/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('Upload progress:', percentCompleted + '%');
                }
            });
            
            console.log('Upload response:', response.data);
            toast.success('Files uploaded successfully');
            onUploadComplete(response.data); // Array of URLs
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload error:', error);
            console.error('Error response:', error.response);
            
            let errorMessage = 'Error uploading files';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="file-input"
                disabled={uploading}
            />
            
            {selectedFiles.length > 0 && (
                <div className="selected-files">
                    <h4>Selected Files:</h4>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>
                                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                <br />
                                <small>Type: {file.type}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button 
                onClick={handleUpload} 
                disabled={uploading || selectedFiles.length === 0}
                className="upload-button"
            >
                {uploading ? 'Uploading...' : 'Upload Files'}
            </button>

            <style jsx>{`
                .file-upload-container {
                    padding: 20px;
                    border: 2px dashed #ccc;
                    border-radius: 8px;
                    margin: 20px 0;
                }

                .file-input {
                    margin-bottom: 15px;
                }

                .selected-files {
                    margin: 15px 0;
                }

                .selected-files ul {
                    list-style: none;
                    padding-left: 0;
                }

                .selected-files li {
                    margin: 5px 0;
                    padding: 5px;
                    background: #f5f5f5;
                    border-radius: 4px;
                }

                .upload-button {
                    padding: 10px 20px;
                    background-color: #1da1f2;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                }

                .upload-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default FileUpload; 