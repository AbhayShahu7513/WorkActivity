import React, { useRef, useState, useEffect } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';

const CameraCapture = ({ onImagesCaptured }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setLoading(true);
    try {
      // Request camera access with rear camera preference (mobile)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      // Fallback to any camera if "environment" fails
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr) {
        setError('Unable to access camera. Please allow camera permissions.');
        console.error(fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Convert canvas to blob (image file)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onImagesCaptured([file]); // send as array for consistency
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="camera-capture">
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      <div className="video-container" style={{ position: 'relative', marginBottom: '1rem' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', maxHeight: '400px', background: '#000', borderRadius: '8px' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <Button
        variant="primary"
        onClick={capturePhoto}
        disabled={!stream || loading}
        className="w-100"
      >
        📸 Capture Photo
      </Button>
      <small className="text-muted d-block mt-2 text-center">
        Click repeatedly to take multiple photos
      </small>
    </div>
  );
};

export default CameraCapture;