import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  getTransporterObjects,
  getTransporterProfile,
  getTransporterStats,
} from '../lib/transporterService';
import TransportObjects from './TransportObjects';
import './TransporterDashboard.css';

const TransporterDashboard = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [objects, setObjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tous');

  useEffect(() => {
    loadTransporterData();
  }, [user]);

  const loadTransporterData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Get profile and check role
      const profileData = await getTransporterProfile(user.id);

      if (!profileData.isTransporter) {
        setError('Accès refusé. Vous n\'avez pas les permissions de transporteur.');
        return;
      }

      setProfile(profileData);

      // Get transporter objects
      const objetsData = await getTransporterObjects(user.id);
      setObjects(objetsData);

      // Get statistics
      const statsData = await getTransporterStats(user.id);
      setStats(statsData);
    } catch (err) {
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = () => {
    // Refresh data after status update
    loadTransporterData();
  };

  if (loading) {
    return (
      <div className="transporter-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transporter-dashboard">
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
          <button onClick={onLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transporter-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logo - Copy.png" alt="Donarise" className="logo" />
            <h1>Tableau de Bord Transporteur</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <i className="fas fa-user-circle"></i>
              <div className="user-details">
                <p className="user-name">{profile?.nom}</p>
                <p className="user-email">{profile?.email}</p>
              </div>
            </div>
            <button onClick={onLogout} className="btn-logout-header">
              <i className="fas fa-sign-out-alt"></i> Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card total">
            <div className="stat-icon">
              <i className="fas fa-boxes"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total</p>
              <p className="stat-value">{stats?.total || 0}</p>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">En Attente</p>
              <p className="stat-value">{stats?.pending || 0}</p>
            </div>
          </div>

          <div className="stat-card in-transport">
            <div className="stat-icon">
              <i className="fas fa-truck"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">En Transport</p>
              <p className="stat-value">{stats?.inTransport || 0}</p>
            </div>
          </div>

          <div className="stat-card delivered">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Livrés</p>
              <p className="stat-value">{stats?.delivered || 0}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-wrapper">
          {/* Tabs */}
          <div className="tabs-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'tous' ? 'active' : ''}`}
                onClick={() => setActiveTab('tous')}
              >
                Tous les Objets
              </button>
              <button
                className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                En Attente
              </button>
              <button
                className={`tab ${activeTab === 'transport' ? 'active' : ''}`}
                onClick={() => setActiveTab('transport')}
              >
                En Transport
              </button>
              <button
                className={`tab ${activeTab === 'delivered' ? 'active' : ''}`}
                onClick={() => setActiveTab('delivered')}
              >
                Livrés
              </button>
            </div>
          </div>

          {/* Objects List */}
          <TransportObjects
            objects={objects}
            activeTab={activeTab}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </main>
    </div>
  );
};

export default TransporterDashboard;
