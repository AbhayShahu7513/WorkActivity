import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Pagination, Spinner, Badge } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { getSubmissions, deleteSubmission, exportCSV, exportExcel } from '../api/endpoints';
import { toast } from 'react-toastify';
import { getCategories } from '../api/endpoints'; // add to imports

const SubmissionsTable = ({ refreshTrigger, onViewDetail }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchSubmissions();
    fetchCategories();
  }, [currentPage, refreshTrigger]);

 const fetchCategories = async () => {
  try {
    const response = await getCategories();
    setCategories(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Failed to fetch categories');
  }
};

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        search: search,
        category: categoryFilter,
      };
      if (startDate) params.start_date = startDate.toISOString().split('T')[0];
      if (endDate) params.end_date = endDate.toISOString().split('T')[0];
      
      const response = await getSubmissions(params);
      setSubmissions(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSubmissions();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteSubmission(id);
        toast.success('Submission deleted successfully');
        fetchSubmissions();
      } catch (error) {
        toast.error('Failed to delete submission');
      }
    }
  };

  const handleExport = async (type) => {
    try {
      const response = type === 'csv' 
        ? await exportCSV() 
        : await exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions.${type === 'csv' ? 'csv' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search by category or work"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            placeholderText="Start Date"
            className="form-control"
          />
        </Col>
        <Col md={2}>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            placeholderText="End Date"
            className="form-control"
          />
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleSearch}>Search</Button>
        </Col>
        <Col md={1}>
          <Button variant="success" onClick={() => handleExport('csv')}>CSV</Button>
        </Col>
        <Col md={1}>
          <Button variant="info" onClick={() => handleExport('excel')}>Excel</Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th><th>Category</th><th>Work</th>
                <th>Photos</th><th>Date</th><th>Time</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td>{sub.category_name}</td>
                  <td>{sub.work_name}</td>
                  <td><Badge bg="info">{sub.total_photos}</Badge></td>
                  <td>{sub.submission_date}</td>
                  <td>{sub.submission_time}</td>
                  <td>
                    <Button size="sm" variant="info" onClick={() => onViewDetail(sub.id)} className="me-2">
                      View
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(sub.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </>
  );
};

export default SubmissionsTable;