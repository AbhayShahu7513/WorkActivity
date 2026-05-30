import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/DashboardStats';
import SubmissionsTable from '../components/SubmissionsTable';
import DetailModal from '../components/DetailModal';
import { getDashboardStats } from '../api/endpoints';

const Dashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    total_submissions: 0,
    today_submissions: 0,
    total_photos: 0,
    category_counts: []
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleViewDetail = (id) => {
    setSelectedSubmissionId(id);
    setShowDetailModal(true);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    fetchStats();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Work Activity Management - Admin Dashboard</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={handleRefresh} className="me-2">
              Refresh
            </Button>
            <Button variant="danger" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="px-4">
        <DashboardStats stats={stats} />
        <SubmissionsTable
          refreshTrigger={refreshTrigger}
          onViewDetail={handleViewDetail}
        />
      </Container>

      <DetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        submissionId={selectedSubmissionId}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Dashboard;