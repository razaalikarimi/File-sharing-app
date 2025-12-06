// frontend/src/pages/LinkAccessPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const LinkAccessPage = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkLink = async () => {
      try {
        // ✅ public metadata endpoint
        const res = await api.get(`/files/public/access/${token}`);
        setFileInfo(res.data.file);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to access shared link."
        );
      }
    };
    checkLink();
  }, [token]);

  const handleDownload = async () => {
    if (!fileInfo) return;
    try {
      setDownloading(true);
      // ✅ public download endpoint
      const res = await api.get(`/files/public/download/${token}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.originalName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      setDownloading(false);
      setError(
        err.response?.data?.message || "Failed to download file via link."
      );
    }
  };

  if (error && !fileInfo) {
    return <div className="error-message">{error}</div>;
  }

  if (!fileInfo) {
    return <p className="center-text">Checking link…</p>;
  }

  return (
    <div className="page">
      <h1 className="page-title">Shared file</h1>
      <p className="page-subtitle">
        This file is shared with you via a secure link.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <div className="card-header">
          <div className="card-title">{fileInfo.originalName}</div>
          <div className="card-subtitle">
            {fileInfo.mimetype} · {(fileInfo.size / 1024).toFixed(2)} KB
          </div>
        </div>

        <button
          className="btn btn-primary mt-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Downloading…" : "Download"}
        </button>
      </div>
    </div>
  );
};

export default LinkAccessPage;
// frontend/src/pages/LinkAccessPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const LinkAccessPage = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkLink = async () => {
      try {
        // ✅ public metadata endpoint
        const res = await api.get(`/files/public/access/${token}`);
        setFileInfo(res.data.file);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to access shared link."
        );
      }
    };
    checkLink();
  }, [token]);

  const handleDownload = async () => {
    if (!fileInfo) return;
    try {
      setDownloading(true);
      // ✅ public download endpoint
      const res = await api.get(`/files/public/download/${token}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.originalName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      setDownloading(false);
      setError(
        err.response?.data?.message || "Failed to download file via link."
      );
    }
  };

  if (error && !fileInfo) {
    return <div className="error-message">{error}</div>;
  }

  if (!fileInfo) {
    return <p className="center-text">Checking link…</p>;
  }

  return (
    <div className="page">
      <h1 className="page-title">Shared file</h1>
      <p className="page-subtitle">
        This file is shared with you via a secure link.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <div className="card-header">
          <div className="card-title">{fileInfo.originalName}</div>
          <div className="card-subtitle">
            {fileInfo.mimetype} · {(fileInfo.size / 1024).toFixed(2)} KB
          </div>
        </div>

        <button
          className="btn btn-primary mt-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Downloading…" : "Download"}
        </button>
      </div>
    </div>
  );
};

export default LinkAccessPage;
// frontend/src/pages/LinkAccessPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const LinkAccessPage = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkLink = async () => {
      try {
        // ✅ public metadata endpoint
        const res = await api.get(`/files/public/access/${token}`);
        setFileInfo(res.data.file);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to access shared link."
        );
      }
    };
    checkLink();
  }, [token]);

  const handleDownload = async () => {
    if (!fileInfo) return;
    try {
      setDownloading(true);
      // ✅ public download endpoint
      const res = await api.get(`/files/public/download/${token}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.originalName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      setDownloading(false);
      setError(
        err.response?.data?.message || "Failed to download file via link."
      );
    }
  };

  if (error && !fileInfo) {
    return <div className="error-message">{error}</div>;
  }

  if (!fileInfo) {
    return <p className="center-text">Checking link…</p>;
  }

  return (
    <div className="page">
      <h1 className="page-title">Shared file</h1>
      <p className="page-subtitle">
        This file is shared with you via a secure link.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <div className="card-header">
          <div className="card-title">{fileInfo.originalName}</div>
          <div className="card-subtitle">
            {fileInfo.mimetype} · {(fileInfo.size / 1024).toFixed(2)} KB
          </div>
        </div>

        <button
          className="btn btn-primary mt-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Downloading…" : "Download"}
        </button>
      </div>
    </div>
  );
};

export default LinkAccessPage;
// frontend/src/pages/LinkAccessPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const LinkAccessPage = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkLink = async () => {
      try {
        // ✅ public metadata endpoint
        const res = await api.get(`/files/public/access/${token}`);
        setFileInfo(res.data.file);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to access shared link."
        );
      }
    };
    checkLink();
  }, [token]);

  const handleDownload = async () => {
    if (!fileInfo) return;
    try {
      setDownloading(true);
      // ✅ public download endpoint
      const res = await api.get(`/files/public/download/${token}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.originalName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      setDownloading(false);
      setError(
        err.response?.data?.message || "Failed to download file via link."
      );
    }
  };

  if (error && !fileInfo) {
    return <div className="error-message">{error}</div>;
  }

  if (!fileInfo) {
    return <p className="center-text">Checking link…</p>;
  }

  return (
    <div className="page">
      <h1 className="page-title">Shared file</h1>
      <p className="page-subtitle">
        This file is shared with you via a secure link.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <div className="card-header">
          <div className="card-title">{fileInfo.originalName}</div>
          <div className="card-subtitle">
            {fileInfo.mimetype} · {(fileInfo.size / 1024).toFixed(2)} KB
          </div>
        </div>

        <button
          className="btn btn-primary mt-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Downloading…" : "Download"}
        </button>
      </div>
    </div>
  );
};

export default LinkAccessPage;
// frontend/src/pages/LinkAccessPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const LinkAccessPage = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkLink = async () => {
      try {
        // ✅ public metadata endpoint
        const res = await api.get(`/files/public/access/${token}`);
        setFileInfo(res.data.file);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to access shared link."
        );
      }
    };
    checkLink();
  }, [token]);

  const handleDownload = async () => {
    if (!fileInfo) return;
    try {
      setDownloading(true);
      // ✅ public download endpoint
      const res = await api.get(`/files/public/download/${token}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.originalName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      setDownloading(false);
      setError(
        err.response?.data?.message || "Failed to download file via link."
      );
    }
  };

  if (error && !fileInfo) {
    return <div className="error-message">{error}</div>;
  }

  if (!fileInfo) {
    return <p className="center-text">Checking link…</p>;
  }

  return (
    <div className="page">
      <h1 className="page-title">Shared file</h1>
      <p className="page-subtitle">
        This file is shared with you via a secure link.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <div className="card-header">
          <div className="card-title">{fileInfo.originalName}</div>
          <div className="card-subtitle">
            {fileInfo.mimetype} · {(fileInfo.size / 1024).toFixed(2)} KB
          </div>
        </div>

        <button
          className="btn btn-primary mt-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Downloading…" : "Download"}
        </button>
      </div>
    </div>
  );
};

export default LinkAccessPage;
