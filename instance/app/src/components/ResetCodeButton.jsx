import React, { useState } from 'react';
import './ResetCodeButton.css';  // Import the CSS file

const ResetCodeButton = ({ onConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (onConfirm) onConfirm(); // call your reset logic
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="reset-modal-button" onClick={handleResetClick}>
        Reset Code
      </button>

      {isModalOpen && (
        <div className="reset-modal-overlay">
          <div className="reset-modal-content">
            <div className="reset-modal-header">
              <h2>Reset Code</h2>
              <p>
                Are you sure you want to reset? This will remove all current changes and restore the original code for this task only.
              </p>
            </div>
            <div className="reset-modal-buttons">
              <button className="reset-modal-yes-button" onClick={handleConfirm}>
                Yes, Reset
              </button>
              <button className="reset-modal-no-button" onClick={handleCancel}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetCodeButton;
