import React from 'react';

const ImagePreviewList = ({ images = [], onRemove }) => {
  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      {images.map((image, index) => (
        <div key={index} className="image-preview" style={{ position: 'relative' }}>
          <img
            src={URL.createObjectURL(image)}
            alt={`Preview ${index + 1}`}
            className="img-thumbnail"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
          <div
            className="remove-btn"
            onClick={() => onRemove(index)}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ×
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImagePreviewList;