"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import AdminGuard from "@/lib/AdminGuard";
import api from "@/lib/axios.js";
import Header from "@/components/dashboard/header";
import { useTokenAuth } from "@/hooks/useTokenAuth.js";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    FileText,
    Loader2,
    Trash2,
    Upload,
    XCircle,
} from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const formatBytes = (bytes) => {
    if (!bytes) return "0 KB";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${Math.ceil(bytes / 1024)} KB`;
};

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

const isPdfFile = (file) =>
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

const isWordFile = (file) =>
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".doc") ||
    file.name.toLowerCase().endsWith(".docx");

const getFileExtension = (name) => {
    const parts = String(name || "").split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
};

export default function AdminUserDocumentsPage() {
    const { userId } = useParams();
    const { isAuthenticated, isLoading } = useTokenAuth();

    const [userName, setUserName] = useState("");
    const [documents, setDocuments] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const fileInputRef = useRef(null);

    const fetchDocuments = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await api.get(`/admin/user-documents/${userId}`);
            setDocuments(res.data.data.documents || []);
            setUserName(res.data.data.userName || "");
        } catch (error) {
            setDocuments([]);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        fetchDocuments();
    }, [userId, fetchDocuments]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isPdf = isPdfFile(file);
        const isWord = isWordFile(file);
        const isImage = file.type.startsWith("image/");

        if (!isPdf && !isWord && !isImage) {
            setFeedback({
                type: "error",
                text: "Only images, PDF and Word documents are allowed.",
            });
            e.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setFeedback({
                type: "error",
                text: "File is too large. Maximum size is 20 MB.",
            });
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
        setFeedback(null);
        setUploadProgress(0);
    };

    const handleUpload = async () => {
        if (!selectedFile || !userId) return;

        const isPdf = isPdfFile(selectedFile);
        const isWord = isWordFile(selectedFile);
        const resourceType = isPdf || isWord ? "raw" : "image";

        setUploading(true);
        setFeedback(null);
        setUploadProgress(0);

        try {
            const signatureResponse = await api.get(`/admin/user-documents/signature/${userId}`);
            const { apiKey, cloudName, folder, signature, timestamp } = signatureResponse.data.data;

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
                        setUploadProgress(Math.min((progressEvent.loaded / total) * 100, 100));
                    },
                }
            );

            const uploadedFile = cloudinaryResponse.data;

            const registerResponse = await api.post(`/admin/user-documents/register/${userId}`, {
                url: uploadedFile.secure_url || uploadedFile.url,
                cloudinaryPublicId: uploadedFile.public_id,
                resourceType,
                fileName: selectedFile.name,
                mimeType: selectedFile.type,
                size: selectedFile.size,
            });

            if (registerResponse.status === 201) {
                setFeedback({
                    type: "success",
                    text: "Document uploaded successfully.",
                });
                setSelectedFile(null);
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchDocuments();
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

    const handleDelete = async (document) => {
        if (!window.confirm(`Delete "${document.fileName}"? This cannot be undone.`)) return;

        setDeletingId(document._id);
        setFeedback(null);
        try {
            await api.delete(`/admin/user-documents/${userId}/${document._id}`);
            setFeedback({
                type: "success",
                text: "Document deleted successfully.",
            });
            fetchDocuments();
        } catch (error) {
            setFeedback({
                type: "error",
                text: "Could not delete the document. Please try again.",
            });
        } finally {
            setDeletingId(null);
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="mb-3 h-8 px-3 text-xs hover:bg-green-50 hover:text-green-700 cursor-pointer"
                        >
                            <Link href="/admin">
                                <ArrowLeft className="h-3 w-3" />
                                Back to Users
                            </Link>
                        </Button>
                        <h1 className="text-[36px] font-bold text-[#101518]">
                            {userName ? `${userName}'s Documents` : "User Documents"}
                        </h1>
                        <p className="text-[#5c778a] text-sm">
                            Blood reports, prescriptions and other documents uploaded for this user.
                        </p>
                    </div>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-green-700 hover:bg-green-800 cursor-pointer text-white"
                    >
                        <Upload className="h-4 w-4" />
                        Upload Document
                    </Button>
                </div>

                {feedback && (
                    <div
                        className={`flex items-center gap-2 text-sm rounded-md px-4 py-3 ${
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

                {selectedFile && (
                    <div className="border border-[#d4dde2] rounded-lg p-6 bg-white">
                        <h2 className="text-lg font-semibold text-[#101518]">New upload</h2>
                        <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-4 py-3">
                            <div className="flex-1 pr-4">
                                <span className="block text-sm text-[#101518] truncate">
                                    {selectedFile.name} ({formatBytes(selectedFile.size)})
                                </span>
                                {uploading && (
                                    <div className="mt-3 space-y-1">
                                        <div className="flex items-center justify-between text-[11px] text-[#5c778a]">
                                            <span>Uploading to Cloudinary...</span>
                                            <span>{Math.round(uploadProgress)}%</span>
                                        </div>
                                        <Progress value={uploadProgress} className="h-2 bg-green-100" />
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
                                        Uploading...
                                    </>
                                ) : (
                                    "Upload"
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="border border-[#d4dde2] rounded-lg p-6 bg-white">
                    <h2 className="text-lg font-semibold text-[#101518]">Uploaded Documents</h2>
                    {documents === null ? (
                        <p className="text-sm text-[#5c778a] mt-3">Loading...</p>
                    ) : documents.length === 0 ? (
                        <p className="text-sm text-[#5c778a] mt-3">
                            No documents uploaded for this user yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {documents.map((document) => {
                                const isImage = document.resourceType === "image";
                                return (
                                    <div
                                        key={document._id}
                                        className="border border-[#d4dde2] rounded-lg overflow-hidden bg-white"
                                    >
                                        <div className="h-36 flex items-center justify-center bg-gray-50">
                                            {isImage ? (
                                                <img
                                                    src={document.url}
                                                    alt={document.fileName}
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-[#5c778a]">
                                                    <FileText className="h-12 w-12 text-green-700" />
                                                    <span className="text-[10px] uppercase tracking-wide">
                                                        {getFileExtension(document.fileName)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p
                                                className="text-sm font-semibold text-[#101518] truncate"
                                                title={document.fileName}
                                            >
                                                {document.fileName}
                                            </p>
                                            <p className="text-xs text-[#5c778a] mt-1">
                                                {formatBytes(document.size)} · {formatDate(document.createdAt)}
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    className="flex-1 h-8 text-xs hover:bg-green-50 hover:text-green-700 cursor-pointer"
                                                >
                                                    <a
                                                        href={document.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        View
                                                    </a>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(document)}
                                                    disabled={deletingId === document._id}
                                                    className="h-8 text-xs hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                >
                                                    {deletingId === document._id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3 w-3" />
                                                    )}
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
