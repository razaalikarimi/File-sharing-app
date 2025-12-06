import React, { useState } from "react";
import api from "../api/axios";

const FileUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!files || files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    const formData = new FormData();
    for (let f of files) {
      formData.append("files", f);
    }

    try {
      setUploading(true);
      await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploading(false);
      setFiles(null);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setUploading(false);
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-top">
        <div>
          <div className="card-title">Upload files</div>
          <div className="card-subtitle">
            Drag & drop into this project (or choose from your computer).
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="upload-input"
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <button
            className="btn btn-primary mt-1"
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>
      <p className="upload-hint">
        Max 10 MB per file · Images, PDFs, docs and plain text allowed.
      </p>
      {error && <div className="error-message mt-1">{error}</div>}
    </div>
  );
};

export default FileUpload;
