import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Modal, Upload, message } from "antd";
import {
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
    fetchUserPictures,
    deleteUserPicture,
    uploadUserPicture,
    updateUserPicturesOrder,
} from "../actions/userActions";
import "./UserPicturesManager.css";

// Drag and drop
import {
    DndContext,
    PointerSensor,
    useSensor,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UserPicturesManager = () => {
    const dispatch = useDispatch();
    const pictures = useSelector((state) => state.user.user_pictures);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 20 },
    });

    useEffect(() => {
        dispatch(fetchUserPictures());
    }, [dispatch]);

    useEffect(() => {
        if (pictures) {
            const formattedFileList = pictures.map((picture) => ({
                uid: picture.id,
                name: picture.image.split("/").pop(),
                active: picture.active,
                order: picture.order,
                status: "done",
                url: `http://localhost${picture.image}`,
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
        if (newFileList.length > 6 && newFileList.length < 12) {
            // Prevent adding more than 6 pictures by removing the last added picture beyond the limit
            message.warning("You can only have up to 6 active pictures.");
            return;
        }
        if (newFileList.length == 12) {
            // Prevent adding more than 6 pictures by removing the last added picture beyond the limit
            message.error(
                "You have reached the picture upload limit or 12 pictures."
            );
            return;
        }
        setFileList(newFileList);
    };

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        dispatch(uploadUserPicture(file));
    };

    const handleRemove = (file) => {
        // Call the deleteUserPicture action creator
        dispatch(deleteUserPicture(file.uid));
    };

    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
    }, []);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
            // Reset drag over index after dropping
            setDragOverIndex(null);
        }
        setActiveId(null);
    }, []);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
        setDragOverIndex(null); // Reset on cancel as well
    }, []);

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);
                const newOrder = arrayMove(prev, activeIndex, overIndex);
                const newOrderIdxs = newOrder.map((file) => file.uid);
                dispatch(updateUserPicturesOrder(newOrderIdxs));
                return newOrder;
            });
        }
    };

    const handleDownload = async (url, fileName) => {
        try {
            const response = await fetch(url); // Fetch the image
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob(); // Convert the response to a blob
            const blobUrl = window.URL.createObjectURL(blob); // Create a URL for the blob

            // Create an anchor element and set its attributes for download
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = fileName || "download"; // Default file name if none provided
            document.body.appendChild(anchor); // Append to body
            anchor.click(); // Trigger click to download

            // Clean up by revoking the object URL and removing the anchor element
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(anchor);
        } catch (error) {
            console.error("Failed to download the image:", error);
            // Handle the error, for example, by showing an error message to the user
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const PictureCard = ({ file }) => {
        return (
            <Card
                className="picture-card"
                hoverable
                cover={
                    <img
                        alt={file.name}
                        src={file.url}
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                        }}
                        draggable={false}
                        onClick={(e) => handlePreview(file)}
                    />
                }
                actions={[
                    <EyeOutlined
                        key="preview"
                        onClick={(e) => handlePreview(file)}
                    />,
                    <DownloadOutlined
                        key="download"
                        onClick={() => handleDownload(file.url, file.name)}
                    />,
                    <DeleteOutlined
                        key="delete"
                        onClick={(e) => handleRemove(file)}
                    />,
                ]}
            ></Card>
        );
    };

    const DraggableUploadListItem = ({ file, originNode, actions }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
            isOver,
        } = useSortable({ id: file.uid });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: isDragging ? "grabbing" : "grab", // Change the cursor based on the dragging state
            zIndex: isDragging ? 10 : 1, // Adjust the zIndex based on the dragging state
            position: isDragging ? "relative" : "static", // Add this linez
            // outline: isDragging ? "2px solid blue" : "none",
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={isDragging ? "is-dragging" : ""}
            >
                <PictureCard file={file} />
            </div>
        );
    };

    return (
        <Card title="Pictures" bordered={false}>
            <DndContext
                sensors={[sensor]}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
                onDragStart={(event) => setActiveId(event.active.id)}
                onDragCancel={() => setActiveId(null)}
            >
                <SortableContext
                    items={fileList.map((file) => file.uid)}
                    strategy={rectSortingStrategy}
                >
                    <ImgCrop
                        rotationSlider={true}
                        showGrid={true}
                        aspect={1}
                        modalWidth={1024}
                        quality={1}
                    >
                        <Upload
                            customRequest={handleUpload}
                            fileList={fileList}
                            onChange={handleChange}
                            listType="picture-card"
                            itemRender={(
                                originNode,
                                file,
                                fileList,
                                actions
                            ) => (
                                <DraggableUploadListItem
                                    file={file}
                                    originNode={originNode}
                                    actions={actions}
                                />
                            )}
                            className={`custom-upload-list ${
                                fileList.length < 12 ? "" : "hide"
                            }`}
                        >
                            {uploadButton}
                        </Upload>
                    </ImgCrop>
                </SortableContext>
                <DragOverlay className="drag-overlay">
                    {activeId
                        ? fileList.map((file) => {
                              if (file.uid === activeId) {
                                  return <PictureCard file={file} />;
                              } else {
                                  return null;
                              }
                          })
                        : null}
                </DragOverlay>
            </DndContext>
            <Modal
                open={previewOpen}
                title={"Preview"}
                footer={null}
                onCancel={(event) => setPreviewOpen(false)}
            >
                <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </Card>
    );
};

export default UserPicturesManager;
