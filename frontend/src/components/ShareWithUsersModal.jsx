import React, { useState } from "react";
import api from "../api/axios";

const ShareWithUsersModal = ({ isOpen, onClose, fileId, onShared }) => {
  const [emails, setEmails] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const emailList = emails
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);

    if (emailList.length === 0) {
      setError("Please enter at least one email");
      return;
    }

    try {
      await api.post(`/files/${fileId}/share/users`, {
        emails: emailList,
      });
      setMessage("File shared successfully");
      if (onShared) onShared();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to share file with users."
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Share with users</div>
          <button className="btn btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="label">Emails (comma separated)</label>
              <textarea
                className="textarea"
                rows="3"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="user1@example.com, user2@example.com"
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Share
              </button>
            </div>
          </form>

          <p className="text-sm mt-2">
            Users you add will see this file in their{" "}
            <strong>Shared with me</strong> tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareWithUsersModal;
