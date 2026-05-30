import React, { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Row, Col, Spinner } from 'react-bootstrap';
import { getSubmissionDetail } from '../api/endpoints';
import { toast } from 'react-toastify';

const DetailModal = ({ show, onHide, submissionId }) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (show && submissionId) {
      fetchDetail();
    }
  }, [show, submissionId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await getSubmissionDetail(submissionId);
      setSubmission(response.data);
    } catch (error) {
      console.error('Detail fetch error:', error);
      toast.error('Failed to load details');
      onHide();
    } finally {
      setLoading(false);
    }
  };

  const openImageGallery = (index) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" />
          <p>Loading details...</p>
        </Modal.Body>
      </Modal>
    );
  }

  if (!submission) return null;

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Submission Details #{submission.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Category:</strong> {submission.category?.name || 'N/A'}
            </Col>
            <Col md={6}>
              <strong>Work Type:</strong> {submission.work?.name || 'N/A'}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Submission Date:</strong> {submission.submission_date || 'N/A'}
            </Col>
            <Col md={6}>
              <strong>Submission Time:</strong> {submission.submission_time || 'N/A'}
            </Col>
          </Row>
          <hr />
          <h6>Photos ({submission.images?.length || 0})</h6>
          <div className="d-flex flex-wrap gap-2">
            {submission.images && submission.images.length > 0 ? (
              submission.images.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt={`Work photo ${idx + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                  className="img-thumbnail"
                  onClick={() => openImageGallery(idx)}
                />
              ))
            ) : (
              <p className="text-muted">No photos available</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Fullscreen Gallery Modal */}
      <Modal show={showGallery} fullscreen onHide={() => setShowGallery(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Photo Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-center">
          {submission.images && submission.images.length > 0 ? (
            <Carousel
              activeIndex={selectedImageIndex}
              onSelect={setSelectedImageIndex}
              interval={null}
              style={{ maxWidth: '90%', maxHeight: '90vh' }}
            >
              {submission.images.map((img, idx) => (
                <Carousel.Item key={img.id}>
                  <img
                    src={img.image_url}
                    alt={`Gallery ${idx + 1}`}
                    style={{ maxHeight: '80vh', width: 'auto', margin: '0 auto' }}
                    className="d-block"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <p className="text-center">No images to display</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailModal;