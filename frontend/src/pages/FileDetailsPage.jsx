import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ShareWithUsersModal from "../components/ShareWithUsersModal";
import GenerateLinkModal from "../components/GenerateLinkModal";

const FileDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [shareUsersOpen, setShareUsersOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  const fetchFile = async () => {
    try {
      const res = await api.get(`/files/${id}`);
      setFile(res.data.file);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load file details.");
    }
  };

  useEffect(() => {
    fetchFile();
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await api.get(`/files/download/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file?.originalName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to download file.");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this file permanently?");
    if (!ok) return;

    try {
      await api.delete(`/files/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete file.");
    }
  };

  if (!file && !error) {
    return <p className="center-text">Loading file…</p>;
  }

  if (error && !file) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page">
      <h1 className="page-title">File details</h1>
      <p className="page-subtitle">
        See metadata and manage sharing for this file.
      </p>

      {error && <div className="error-message">{error}</div>}

      {file && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">{file.originalName}</div>
            <div className="card-subtitle">
              {file.mimetype} · {(file.size / 1024).toFixed(2)} KB
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm">
              <strong>Uploaded:</strong>{" "}
              {new Date(file.uploadDate).toLocaleString()}
            </p>
          </div>

          <div
            className="mt-3"
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <button className="btn btn-primary" onClick={handleDownload}>
              Download
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShareUsersOpen(true)}
            >
              Share with users
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setLinkModalOpen(true)}
            >
              Generate link
            </button>
            <button
              className="btn btn-outline"
              style={{
                borderColor: "rgba(248, 113, 113, 0.7)",
                color: "#fecaca",
              }}
              onClick={handleDelete}
            >
              Delete file
            </button>
          </div>
        </div>
      )}

      <ShareWithUsersModal
        isOpen={shareUsersOpen}
        onClose={() => setShareUsersOpen(false)}
        fileId={id}
        onShared={fetchFile}
      />

      <GenerateLinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        fileId={id}
      />
    </div>
  );
};

export default FileDetailsPage;
