import React, { useState } from 'react';
import { updateObjectStatus } from '../lib/transporterService';
import './TransportObjects.css';

const TransportObjects = ({ objects, activeTab, onStatusUpdate }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const filterObjects = () => {
    switch (activeTab) {
      case 'pending':
        return objects.filter(obj => obj.statut === 'en attente');
      case 'transport':
        return objects.filter(obj => obj.statut === 'en transport');
      case 'delivered':
        return objects.filter(obj => obj.statut === 'livré');
      default:
        return objects;
    }
  };

  const handleStatusChange = async (objetTransporterId, newStatus) => {
    try {
      setUpdatingId(objetTransporterId);
      await updateObjectStatus(objetTransporterId, newStatus);
      onStatusUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (statut) => {
    const statusMap = {
      'en attente': { class: 'status-pending', icon: 'fa-clock', label: 'En Attente' },
      'en transport': { class: 'status-transport', icon: 'fa-truck', label: 'En Transport' },
      'livré': { class: 'status-delivered', icon: 'fa-check-circle', label: 'Livré' },
    };
    return statusMap[statut] || statusMap['en attente'];
  };

  const filteredObjects = filterObjects();

  if (filteredObjects.length === 0) {
    return (
      <div className="transport-objects">
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>Aucun objet trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transport-objects">
      <div className="objects-list">
        {filteredObjects.map((obj) => {
          const objet = obj.objet_accepte?.objet;
          const status = getStatusBadge(obj.statut);
          const isExpanded = expandedId === obj.id;

          return (
            <div key={obj.id} className={`object-card ${isExpanded ? 'expanded' : ''}`}>
              {/* Card Header */}
              <div
                className="object-card-header"
                onClick={() => setExpandedId(isExpanded ? null : obj.id)}
              >
                <div className="object-card-left">
                  <div className={`status-badge ${status.class}`}>
                    <i className={`fas ${status.icon}`}></i>
                    <span>{status.label}</span>
                  </div>
                  <div className="object-info-basic">
                    <h3 className="object-name">{objet?.nom || 'N/A'}</h3>
                    <p className="object-type">
                      <i className="fas fa-tag"></i> {objet?.type || 'Non spécifié'}
                    </p>
                  </div>
                </div>
                <div className="object-card-right">
                  <span className="expand-icon">
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                  </span>
                </div>
              </div>

              {/* Card Content (Expandable) */}
              {isExpanded && (
                <div className="object-card-content">
                  {/* Location Info */}
                  <div className="info-section">
                    <h4 className="section-title">
                      <i className="fas fa-map-marker-alt"></i> Localisation
                    </h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Lieu de Départ:</label>
                        <p>{objet?.localisation || 'Non spécifié'}</p>
                      </div>
                      <div className="info-item">
                        <label>Destination:</label>
                        <p>{objet?.destination || 'Non spécifié'}</p>
                      </div>
                      <div className="info-item">
                        <label>Type de Destination:</label>
                        <p>{objet?.type_destination || 'Non spécifié'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Info */}
                  <div className="info-section">
                    <h4 className="section-title">
                      <i className="fas fa-calendar-alt"></i> Informations
                    </h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Date d'Affectation:</label>
                        <p>
                          {new Date(obj.date_affectation).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Update Actions */}
                  <div className="info-section actions-section">
                    <h4 className="section-title">
                      <i className="fas fa-tasks"></i> Actions
                    </h4>
                    <div className="action-buttons">
                      {obj.statut === 'en attente' && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleStatusChange(obj.id, 'en transport')}
                          disabled={updatingId === obj.id}
                        >
                          <i className="fas fa-truck"></i>
                          {updatingId === obj.id ? 'Mise à jour...' : 'Démarrer le Transport'}
                        </button>
                      )}

                      {obj.statut === 'en transport' && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleStatusChange(obj.id, 'livré')}
                          disabled={updatingId === obj.id}
                        >
                          <i className="fas fa-check-circle"></i>
                          {updatingId === obj.id ? 'Mise à jour...' : 'Marquer comme Livré'}
                        </button>
                      )}

                      {obj.statut === 'livré' && (
                        <div className="delivered-badge">
                          <i className="fas fa-check-double"></i>
                          Livraison Complète
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransportObjects;
