"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AdminGuard from "@/lib/AdminGuard";
import api from "@/lib/axios.js";
import Header from "@/components/dashboard/header";
import { useTokenAuth } from "@/hooks/useTokenAuth.js";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageIcon, Clapperboard, Upload, Loader2, CheckCircle2, XCircle, Images } from "lucide-react";

const SECTIONS = [
    {
        id: "transformations",
        label: "Amazing Transformations",
        description: "Before/after client transformation photos",
        type: "image",
        accept: "image/*",
    },
    {
        id: "gallery",
        label: "Health & Wellness Gallery",
        description: "Wellness, gym and lifestyle photos",
        type: "image",
        accept: "image/*",
    },
    {
        id: "videos",
        label: "Our Featured Videos",
        description: "Client testimonial and workout videos",
        type: "video",
        accept: "video/*",
    },
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const SectionIcon = ({ type }) => {
    if (type === "video") return <Clapperboard className="h-5 w-5" />;
    if (type === "image") return <ImageIcon className="h-5 w-5" />;
    return <Images className="h-5 w-5" />;
};

export default function AdminMediaPage() {
    const { isAuthenticated, isLoading } = useTokenAuth();
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [uploadedItems, setUploadedItems] = useState(null);
    const fileInputRef = useRef(null);

    const activeSectionConfig = SECTIONS.find((s) => s.id === activeSection);

    const uploadedBytes = selectedFile ? (selectedFile.size * uploadProgress) / 100 : 0;
    const remainingBytes = selectedFile ? Math.max(selectedFile.size - uploadedBytes, 0) : 0;
    const uploadedMb = (uploadedBytes / (1024 * 1024)).toFixed(1);
    const remainingMb = (remainingBytes / (1024 * 1024)).toFixed(1);

    const fetchUploaded = async (section) => {
        try {
            const res = await api.get(`/media?section=${section}`);
            setUploadedItems(res.data.data.media);
        } catch (error) {
            setUploadedItems([]);
        }
    };

    useEffect(() => {
        setFeedback(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        fetchUploaded(activeSection);
    }, [activeSection]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        const typeMatches = activeSectionConfig.type === "video" ? isVideo : isImage;

        if (!typeMatches) {
            setFeedback({
                type: "error",
                text: activeSectionConfig.type === "video"
                    ? "This section accepts videos only."
                    : "This section accepts images only.",
            });
            e.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setFeedback({
                type: "error",
                text: "File is too large. Maximum size is 50 MB.",
            });
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setFeedback(null);
        setUploadProgress(0);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setFeedback(null);
        setUploadProgress(0);

        try {
            const signatureResponse = await api.get(`/media/signature?section=${activeSection}`);
            const { apiKey, cloudName, folder, resourceType, signature, timestamp } = signatureResponse.data.data;

            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append("file", selectedFile);
            cloudinaryFormData.append("api_key", apiKey);
            cloudinaryFormData.append("timestamp", timestamp);
            cloudinaryFormData.append("signature", signature);
            cloudinaryFormData.append("folder", folder);

            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                cloudinaryFormData,
                {
                    onUploadProgress: (progressEvent) => {
                        const total = progressEvent.total || selectedFile.size;
                        if (!total) return;

                        const progress = Math.min((progressEvent.loaded / total) * 100, 100);
                        setUploadProgress(progress);
                    },
                }
            );

            const uploadedFile = cloudinaryResponse.data;

            const registerResponse = await api.post("/media/register", {
                section: activeSection,
                url: uploadedFile.secure_url || uploadedFile.url,
                cloudinaryPublicId: uploadedFile.public_id,
            });

            if (registerResponse.status === 201) {
                setFeedback({
                    type: "success",
                    text: "Media uploaded to Cloudinary successfully.",
                });
                setSelectedFile(null);
                setPreviewUrl(null);
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchUploaded(activeSection);
            }
        } catch (error) {
            setFeedback({
                type: "error",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Upload failed. Please try again.",
            });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-green-700"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <AdminGuard>
            <Header />
            <div className="lg:px-14 px-5 py-14 flex flex-col space-y-6 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-[36px] font-bold">Media</h1>
                    <p className="text-[#5c778a] text-sm">
                        Upload photos and videos that appear on the website.
                    </p>
                </div>

                {/* Section selector */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`cursor-pointer text-left p-5 rounded-lg border-2 transition-all ${
                                activeSection === section.id
                                    ? "border-green-700 bg-green-50"
                                    : "border-[#d4dde2] bg-white hover:border-green-300"
                            }`}
                        >
                            <div className="flex items-center gap-2 text-[#101518] font-semibold">
                                <SectionIcon type={section.type} />
                                {section.label}
                            </div>
                            <p className="text-xs text-[#5c778a] mt-1">{section.description}</p>
                            <span
                                className={`inline-block mt-2 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded ${
                                    section.type === "video"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {section.type === "video" ? "Videos only" : "Images only"}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Upload card */}
                <div className="border border-[#d4dde2] rounded-lg p-6 bg-white">
                    <h2 className="text-lg font-semibold text-[#101518]">
                        Upload to {activeSectionConfig.label}
                    </h2>

                    <label
                        className="mt-4 flex flex-col items-center justify-center w-full border-2 border-dashed border-[#d4dde2] rounded-lg p-8 cursor-pointer hover:border-green-400 transition-colors"
                    >
                        {previewUrl ? (
                            activeSectionConfig.type === "video" ? (
                                <video src={previewUrl} controls className="max-h-64 rounded-md" />
                            ) : (
                                <img src={previewUrl} alt="Preview" className="max-h-64 rounded-md object-contain" />
                            )
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-[#5c778a]" />
                                <span className="mt-2 text-sm text-[#101518]">
                                    Click to choose a file
                                </span>
                                <span className="text-xs text-[#5c778a]">
                                    {activeSectionConfig.type === "video"
                                        ? "MP4 / WebM / MOV, up to 50 MB"
                                        : "JPG / PNG / WEBP, up to 50 MB"}
                                </span>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={activeSectionConfig.accept}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>

                    {selectedFile && (
                        <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-4 py-3">
                            <div className="flex-1 pr-4">
                                <span className="block text-sm text-[#101518] truncate">
                                    {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                                </span>
                                {uploading && (
                                    <div className="mt-3 space-y-1">
                                        <div className="flex items-center justify-between text-[11px] text-[#5c778a]">
                                            <span>{uploadedMb} MB uploaded</span>
                                            <span>{remainingMb} MB left</span>
                                        </div>
                                        <Progress
                                            value={uploadProgress}
                                            className={`h-2 ${activeSectionConfig.type === "video" ? "bg-purple-100" : "bg-green-100"}`}
                                        />
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-green-700 hover:bg-green-800 cursor-pointer text-white"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Uploading to Cloudinary...
                                    </>
                                ) : (
                                    "Upload"
                                )}
                            </Button>
                        </div>
                    )}

                    {feedback && (
                        <div
                            className={`mt-4 flex items-center gap-2 text-sm rounded-md px-4 py-3 ${
                                feedback.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {feedback.type === "success" ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            {feedback.text}
                        </div>
                    )}
                </div>

                {/* Uploaded list */}
                <div className="border border-[#d4dde2] rounded-lg p-6 bg-white">
                    <h2 className="text-lg font-semibold text-[#101518]">
                        Uploaded {activeSectionConfig.type === "video" ? "Videos" : "Photos"}
                    </h2>
                    {uploadedItems === null ? (
                        <p className="text-sm text-[#5c778a] mt-3">Loading...</p>
                    ) : uploadedItems.length === 0 ? (
                        <p className="text-sm text-[#5c778a] mt-3">
                            Nothing uploaded to this section yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {uploadedItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="border border-[#d4dde2] rounded-md overflow-hidden"
                                >
                                    {item.type === "video" ? (
                                        <video
                                            src={item.url}
                                            className="w-full h-24 object-cover bg-black"
                                        />
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt="Uploaded"
                                            className="w-full h-24 object-cover bg-gray-100"
                                        />
                                    )}
                                    <p className="text-[10px] text-[#5c778a] px-2 py-1">
                                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
