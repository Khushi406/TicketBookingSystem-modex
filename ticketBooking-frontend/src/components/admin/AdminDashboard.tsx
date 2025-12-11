import React from 'react';
import CreateShowForm from './CreateShowForm';
import ShowList from './ShowList';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title-section">
          <h1 className="admin-title">⚙️ Admin Dashboard</h1>
          <p className="admin-subtitle">Manage shows and bookings efficiently</p>
        </div>
      </div>
      
      <div className="admin-sections">
        <div className="admin-section create-section">
          <div className="section-header">
            <h2>➕ Create New Show</h2>
            <p>Add a new show to the system</p>
          </div>
          <CreateShowForm />
        </div>
        
        <div className="admin-section list-section">
          <div className="section-header">
            <h2>📋 All Shows</h2>
            <p>View and manage existing shows</p>
          </div>
          <ShowList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;