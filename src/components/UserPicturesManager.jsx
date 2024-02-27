import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal, Upload } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
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

const DraggableUploadListItem = ({ file, originNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.uid });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                hoverable
                style={{ width: 240 }}
                cover={
                    <img
                        alt="example"
                        src={file.url || file.preview}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        draggable={false}
                    />
                }
                actions={[
                    <EyeOutlined key="preview" onClick={handleCustomPreview} />,
                    <DeleteOutlined key="delete" onClick={handleCustomDelete} />,
                ]}
            />
        </div>
    );
};


const UserPicturesManager = () => {
    const dispatch = useDispatch();
    const pictures = useSelector(state => state.user.user_pictures);
    const pictures_loading = useSelector(state => state.user.pictures_loading);
    const delete_picture_loading = useSelector(state => state.user.delete_picture_loading);
    const upload_picture_progress = useSelector(state => state.user.user_upload_progress);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

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
    };

    const handleChange = async ({ fileList: newFileList, file }) => {

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



    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Card title="Your Pictures" bordered={false}>
            <DndContext sensors={[sensor]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={fileList.map(file => file.uid)} strategy={rectSortingStrategy}>
                    <ImgCrop rotationSlider={true} showGrid={true} aspect={1} modalWidth={1024} quality={1}>
                        <Upload
                            customRequest={handleUpload}
                            className="custom-upload-list"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            onRemove={handleRemove}
                            listType="picture-card"
                            itemRender={(originNode, file) => (
                                <DraggableUploadListItem file={file} originNode={originNode} />
                            )}
                        >
                            {fileList.map(file => (
                                file.status === 'uploading' && <Progress percent={upload_picture_progress} />
                            ))}
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </ImgCrop>
                </SortableContext>
            </DndContext>
            <Modal open={previewOpen} title={"Preview"} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Card>
    );
};

export default UserPicturesManager;
