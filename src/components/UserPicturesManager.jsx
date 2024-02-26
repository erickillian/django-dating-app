import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { fetchUserPictures, deleteUserPicture, uploadUserPicture } from '../actions/userActions';
import "./UserPicturesManager.css";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UserPicturesManager = () => {
    const dispatch = useDispatch();
    const pictures = useSelector(state => state.user.user_pictures);
    const pictures_loading = useSelector(state => state.user.pictures_loading);
    const delete_picture_loading = useSelector(state => state.user.delete_picture_loading);
    const upload_picture_progress = useSelector(state => state.user.user_upload_progress);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        dispatch(fetchUserPictures());
    }, [dispatch]);

    useEffect(() => {
        if (pictures) {
            const formattedFileList = pictures.map(picture => ({
                uid: picture.id,
                name: picture.name,
                status: 'done',
                url: `http://localhost${picture.image}`
            }));
            setFileList(formattedFileList);
        }
    }, [pictures]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = async ({ fileList: newFileList, file }) => {

    };

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        dispatch(uploadUserPicture(file));
    }

    const handleDragEnd = (sourceId, sourceIndex, targetIndex, targetId) => {
        if (sourceIndex === targetIndex) return;

        const newGridItems = [...gridItems];
        const [removed] = newGridItems.splice(sourceIndex, 1);
        newGridItems.splice(targetIndex, 0, removed);

        setGridItems(newGridItems);
        // Update fileList based on new order
        setFileList(newGridItems.map(item => item.content));
    };

    const handleRemove = (file) => {
        // Call the deleteUserPicture action creator
        dispatch(deleteUserPicture(file.uid));
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Card title="Your Pictures" bordered={false}>
            <ImgCrop rotationSlider={true} showGrid={true} aspect={1} modalWidth={1024} quality={1}>
                <Upload
                    customRequest={handleUpload}
                    className="custom-upload-list"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={handleRemove}
                >
                    {fileList.map(file => (
                        file.status === 'uploading' && <Progress percent={upload_picture_progress} />
                    ))}
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
            </ImgCrop>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Card>
    );
};

export default UserPicturesManager;
