/* eslint-disable no-unused-vars, react/prop-types */
import React from "react";

export default function Delete({ title, description, visible, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center zindex-1050">
      <div className="bg-white w-50 max-w-500px p-4 rounded shadow">
        <div className="d-flex flex-column gap-3 text-center">
          <h2 className="h4">{title}</h2>
          <p>{description}</p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-primary px-4 py-2 rounded"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary px-4 py-2 rounded"
              onClick={onCancel}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
