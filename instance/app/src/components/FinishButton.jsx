import React, { useState } from 'react';
import "./FinishButton.css";

const FinishButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFinishClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    window.location.href = "../survey"
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={handleFinishClick}>
        Finish
      </button>

      {isModalOpen && (
        <div className="finish-modal-overlay">
          <div className="finish-modal-content">
            <h2>Submit Code</h2>
            <p>Are you ready to submit your code? You won't be able to make changes after this.</p>
            <div className="finish-modal-buttons">
              <button className="finish-modal-yes-button" onClick={handleConfirm}>
                Yes, Submit
              </button>
              <button className="finish-modal-no-button" onClick={handleCancel}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FinishButton;
