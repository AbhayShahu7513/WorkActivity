import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CameraCapture from '../components/CameraCapture';
import ImagePreviewList from '../components/ImagePreviewList';
import { getCategories, submitWork } from '../api/endpoints';

const PublicForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(c => c.id === parseInt(selectedCategory));
      setWorks(category ? category.works : []);
      setSelectedWork('');
    }
  }, [selectedCategory, categories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      let categoriesData = response.data;
      if (categoriesData && !Array.isArray(categoriesData) && categoriesData.results) {
        categoriesData = categoriesData.results;
      }
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      toast.error('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesCaptured = (newFiles) => {
    setImages(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!selectedWork) {
      toast.error('Please select work type');
      return;
    }
    if (images.length === 0) {
      toast.error('Please capture at least one photo');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('category', selectedCategory);
    formData.append('work', selectedWork);
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      await submitWork(formData);
      toast.success('Work submitted successfully!');
      setSelectedCategory('');
      setSelectedWork('');
      setImages([]);
    } catch (error) {
      toast.error('Failed to submit work');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Work Activity Submission</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Work Type *</Form.Label>
              <Form.Select
                value={selectedWork}
                onChange={(e) => setSelectedWork(e.target.value)}
                disabled={!selectedCategory}
                required
              >
                <option value="">Select Work</option>
                {works.map(work => (
                  <option key={work.id} value={work.id}>{work.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Photos *</Form.Label>
              <CameraCapture onImagesCaptured={handleImagesCaptured} />
              {images.length > 0 && (
                <ImagePreviewList images={images} onRemove={removeImage} />
              )}
            </Form.Group>

            <Button
              type="submit"
              variant="success"
              className="w-100"
              disabled={submitting}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : 'Submit Work'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PublicForm;