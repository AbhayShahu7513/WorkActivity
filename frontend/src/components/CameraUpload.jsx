import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';

const CameraUpload = ({ onImagesSelected }) => {
  const fileInputRef = useRef(null);

  const handleCapture = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onImagesSelected(files);
    }
    // Reset input to allow selecting same file again
    e.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleCapture}
        style={{ display: 'none' }}
      />
      <Button
        variant="primary"
        onClick={() => fileInputRef.current.click()}
        className="w-100"
      >
        📸 Capture Photos
      </Button>
    </>
  );
};

export default CameraUpload;