import React, { useState } from "react";
import api from "../api/axios";

const GenerateLinkModal = ({ isOpen, onClose, fileId }) => {
  const [expiresAt, setExpiresAt] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShareUrl("");

    try {
      const payload = {};
      if (expiresAt) {
        payload.expiresAt = expiresAt;
      }

      const res = await api.post(`/files/${fileId}/share/link`, payload);
      setShareUrl(res.data.shareUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate share link.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Generate shareable link</div>
          <button className="btn btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="label">Expiry (optional)</label>
              <input
                className="input"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <p className="text-sm">
                Leave empty if you don&apos;t want this link to expire.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
              <button className="btn btn-primary" type="submit">
                Generate
              </button>
            </div>
          </form>

          {shareUrl && (
            <div className="mt-3">
              <p className="label">Share this link</p>
              <textarea
                className="textarea"
                readOnly
                rows="2"
                value={shareUrl}
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateLinkModal;
