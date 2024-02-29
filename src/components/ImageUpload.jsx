import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadUserPicture } from "../actions/userActions"; // Import your action
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import "./ImageUpload.css";
import { Button, Upload, Modal, Progress, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

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
            const file = new File([blob], "cropped.jpg", {
                type: "image/jpeg",
            });
            resolve(file);
        }, "image/jpeg");
    });
}

const ImageUpload = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useDispatch();
    const uploadProgress = useSelector((state) => state.user.upload_progress);
    const isUploading = useSelector((state) => state.user.user_uploading);

    const handleFileChange = (info) => {
        const fileList = info.fileList;
        if (fileList && fileList.length > 0) {
            // Always use the last file in the fileList
            const file = fileList[fileList.length - 1].originFileObj;
            getBase64(file, (imageUrl) => {
                setImageSrc(imageUrl);
                setIsModalOpen(true);
            });
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = async () => {
        try {
            const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
            dispatch(uploadUserPicture(croppedImg));
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Card hoverable style={{ width: 240 }}>
            {" "}
            {/* Adjust width as needed */}
            <div className="card-container">
                <Upload
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    showUploadList={false}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Discard Image
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleUpload}
                        >
                            Save Image
                        </Button>,
                    ]}
                >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
                <Modal
                    title="Crop Image"
                    open={isModalOpen}
                    onOk={handleUpload}
                    onCancel={handleCancel}
                    width={800} // You can adjust this value as needed
                >
                    <div style={{ width: "100%", height: "500px" }}>
                        {" "}
                        {/* Adjust height as needed */}
                        <Cropper
                            classes={{
                                containerClassName: "cropper-container",
                                mediaClassName: "cropper-media",
                                cropAreaClassName: "cropper-croparea",
                            }}
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    {isUploading && <Progress percent={uploadProgress} />}
                </Modal>
            </div>
        </Card>
    );
};

function getBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
}

export default ImageUpload;
