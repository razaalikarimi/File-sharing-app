import React from "react";
import { Link } from "react-router-dom";

const FileList = ({ files, onDelete }) => {
  if (!files || files.length === 0) {
    return <p className="center-text">No files found yet.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>File name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Uploaded</th>
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f._id}>
              <td>{f.originalName}</td>
              <td>
                <span className="badge">
                  {f.mimetype?.split("/")?.[1] || f.mimetype}
                </span>
              </td>
              <td>{(f.size / 1024).toFixed(1)} KB</td>
              <td>{new Date(f.uploadDate).toLocaleString()}</td>
              {onDelete && (
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link className="link" to={`/files/${f._id}`}>
                      Details
                    </Link>
                    <button
                      className="btn btn-outline"
                      style={{ padding: "4px 10px", fontSize: 11 }}
                      onClick={() => onDelete(f._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
              {!onDelete && (
                <td>
                  <Link className="link" to={`/files/${f._id}`}>
                    Open details
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
