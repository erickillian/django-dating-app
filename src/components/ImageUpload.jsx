import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadUserPicture } from '../actions/userActions'; // Import your action
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import './ImageUpload.css';

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    await new Promise((resolve) => {
        image.onload = resolve;
    });

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const file = new File([blob], "cropped.jpg", { type: 'image/jpeg' });
            resolve(file);
        }, 'image/jpeg');
    });
}


const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [showCropper, setShowCropper] = useState(true);

    const dispatch = useDispatch();
    const uploadProgress = useSelector(state => state.user.upload_progress);
    const isUploading = useSelector(state => state.user.user_uploading);

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result));
            reader.readAsDataURL(event.target.files[0]);
            setShowCropper(true); // Show the cropper
        }
    };


    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        setShowCropper(true); // Show the cropper
    }, []);

    const handleUpload = async () => {
        try {
            const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
            setCroppedImage(croppedImg);
            setShowCropper(false);
            dispatch(uploadUserPicture(croppedImg)); // Upload the cropped image
            setImageSrc(null);
        } catch (e) {
            console.error(e);
        }
    };
    const cancelUpload = () => {
        setShowCropper(false); // Hide the cropper
        setImageSrc(null);
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileSelect} />
            {showCropper && imageSrc && (
                <div className="cropper-container">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                    <div className="cropper-buttons">
                        <button className="crop-save-button" onClick={handleUpload}>
                            Save Image
                        </button>
                        <button className="crop-discard-button" onClick={cancelUpload}>
                            Discard Image
                        </button>
                        {
                            isUploading && (
                                <div>
                                    <div>Uploading...</div>
                                    <progress value={uploadProgress} max="100"></progress>
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
        </div >
    );
};

export default ImageUpload;