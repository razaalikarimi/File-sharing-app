import React, { useEffect, useState } from "react";
import api from "../api/axios";
import FileList from "../components/FileList";

const SharedWithMePage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const fetchShared = async () => {
    try {
      const res = await api.get("/files/shared/with-me");
      setFiles(res.data.files || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load shared files. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchShared();
  }, []);

  return (
    <div className="page-wide">
      <h1 className="page-title">Shared with me</h1>
      <p className="page-subtitle">
        Files that other people have shared directly with your account.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="card mt-2">
        <FileList files={files} />
      </div>
    </div>
  );
};

export default SharedWithMePage;
