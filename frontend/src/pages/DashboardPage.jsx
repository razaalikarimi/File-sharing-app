import React, { useEffect, useState } from "react";
import api from "../api/axios";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";

const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const fetchMyFiles = async () => {
    try {
      const res = await api.get("/files/my");
      setFiles(res.data.files || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load files. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchMyFiles();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this file?");
    if (!ok) return;

    try {
      await api.delete(`/files/${id}`);
      fetchMyFiles();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete file. Please try again."
      );
    }
  };

  return (
    <div className="page-wide">
      <h1 className="page-title">My workspace</h1>
      <p className="page-subtitle">
        Upload, manage and share your files from a single place.
      </p>

      <FileUpload onUploadComplete={fetchMyFiles} />

      {error && <div className="error-message">{error}</div>}

      <div className="card mt-3">
        <div className="card-header">
          <div className="card-title">My files</div>
          <div className="card-subtitle">
            All files you have uploaded to your personal drive.
          </div>
        </div>
        <FileList files={files} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default DashboardPage;
