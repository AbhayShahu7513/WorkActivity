import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const DashboardStats = ({ stats }) => {
  const statCards = [
    { title: 'Total Submissions', value: stats.total_submissions, color: 'primary', icon: '📊' },
    { title: "Today's Submissions", value: stats.today_submissions, color: 'success', icon: '📅' },
    { title: 'Total Photos', value: stats.total_photos, color: 'info', icon: '🖼️' },
  ];

  return (
    <>
      <Row className="mb-4">
        {statCards.map((stat, idx) => (
          <Col md={4} key={idx} className="mb-3">
            <Card className={`text-white bg-${stat.color} h-100`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{stat.title}</h6>
                    <h2 className="mb-0">{stat.value}</h2>
                  </div>
                  <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Category Distribution</Card.Header>
            <Card.Body>
              {stats.category_counts?.map((cat, idx) => (
                <div key={idx} className="mb-2">
                  <strong>{cat.category__name || 'Unknown'}:</strong> {cat.count} submissions
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${(cat.count / stats.total_submissions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardStats;