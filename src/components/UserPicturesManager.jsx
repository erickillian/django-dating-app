import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal, Upload, message } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { fetchUserPictures, deleteUserPicture, uploadUserPicture } from '../actions/userActions';
import "./UserPicturesManager.css";

// Drag and drop
import { DndContext, PointerSensor, useSensor, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


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
    const [fileList, setFileList] = useState([]);

    const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 20 } });

    useEffect(() => {
        dispatch(fetchUserPictures());
    }, [dispatch]);

    useEffect(() => {
        if (pictures) {
            const formattedFileList = pictures.map(picture => ({
                uid: picture.id,
                name: picture.image.split('/').pop(),
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
    };

    const handleChange = async ({ fileList: newFileList }) => {
        if (newFileList.length > 6) {
            // Prevent adding more than 6 pictures by removing the last added picture beyond the limit
            message.error('You can only have up to 6 active pictures.');
            return;
        }
        setFileList(newFileList);
    };

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        dispatch(uploadUserPicture(file));
    }

    const handleRemove = (file) => {
        // Call the deleteUserPicture action creator
        dispatch(deleteUserPicture(file.uid));
    };

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const handleDownload = async (url, fileName) => {
        try {
            const response = await fetch(url); // Fetch the image
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob(); // Convert the response to a blob
            const blobUrl = window.URL.createObjectURL(blob); // Create a URL for the blob

            // Create an anchor element and set its attributes for download
            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = fileName || 'download'; // Default file name if none provided
            document.body.appendChild(anchor); // Append to body
            anchor.click(); // Trigger click to download

            // Clean up by revoking the object URL and removing the anchor element
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(anchor);
        } catch (error) {
            console.error('Failed to download the image:', error);
            // Handle the error, for example, by showing an error message to the user
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const DraggableUploadListItem = ({ file, originNode, actions }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging, // This property indicates if the current item is being dragged
        } = useSortable({ id: file.uid });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: isDragging ? 'grabbing' : 'grab', // Change the cursor based on the dragging state
            zIndex: isDragging ? 10 : 1, // Adjust the zIndex based on the dragging state
            position: isDragging ? 'relative' : 'static', // Add this linez
            opacity: isDragging ? 0.8 : 1, // Adjust the opacity based on the dragging state
        };

        const preview = (e) => {
            handlePreview(file);
        };

        const remove = (e) => {
            handleRemove(file);
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={isDragging ? 'is-dragging' : ''}>
                <Card
                    hoverable
                    cover={
                        <img
                            alt={file.name}
                            src={file.url}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            draggable={false}
                            onClick={(e) => preview(e)}
                        />
                    }
                    actions={[
                        <EyeOutlined key="preview" onClick={(e) => preview(e)} />,
                        <DownloadOutlined key="download" onClick={() => handleDownload(file.url, file.name)} />,
                        <DeleteOutlined key="delete" onClick={(e) => remove(e)} />,
                    ]}

                />
            </div>
        );
    };


    return (
        <Card title="Your Pictures" bordered={false}>
            <DndContext sensors={[sensor]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={fileList.map(file => file.uid)} strategy={rectSortingStrategy}>
                    <ImgCrop rotationSlider={true} showGrid={true} aspect={1} modalWidth={1024} quality={1}>
                        <Upload
                            customRequest={handleUpload}
                            fileList={fileList}
                            onChange={handleChange}
                            listType="picture-card"
                            itemRender={(originNode, file, fileList, actions) => (
                                <DraggableUploadListItem file={file} originNode={originNode} actions={actions} />
                            )}
                            className={`custom-upload-list ${fileList.length < 8 ? '' : 'hide'}`}
                        >
                            {/* {fileList.map(file => (
                                file.status === 'uploading' && <Progress percent={upload_picture_progress} />
                            ))} */}
                            {uploadButton}
                        </Upload>
                    </ImgCrop>
                </SortableContext>
            </DndContext>
            <Modal open={previewOpen} title={"Preview"} footer={null} onCancel={(event) => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Card>
    );
};

export default UserPicturesManager;
