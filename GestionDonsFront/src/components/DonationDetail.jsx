import React from 'react';
import './DonationDetail.css';

const DonationDetail = ({ donation, onClose, role = 'donor' }) => {
    if (!donation) return null;

    const isRefused = donation.status === 'refusé';
    const isAccepted = donation.status === 'accepté';
    const isMoney = donation.type === 'argent';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Détails du Don #{donation.id}</h2>

                <div className="detail-row">
                    <strong>Type:</strong> <span>{donation.type}</span>
                </div>
                <div className="detail-row">
                    <strong>{isMoney ? 'Montant' : 'Objet'}:</strong>
                    <span>{isMoney ? `${donation.amount} DT` : donation.name}</span>
                </div>
                <div className="detail-row">
                    <strong>Date:</strong> <span>{new Date(donation.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                    <strong>Statut:</strong>
                    <span className={`status-badge ${donation.status}`}>
                        {donation.status}
                    </span>
                </div>

                {isRefused && (
                    <div className="detail-section error">
                        <h3>❌ Motif du refus</h3>
                        <p>{donation.refusal_reason || "Aucune raison spécifiée."}</p>
                    </div>
                )}

                {isAccepted && !isMoney && (
                    <div className="detail-section success">
                        <h3>✅ Transport & Logistique</h3>
                        <div className="detail-row">
                            <strong>Méthode:</strong> <span>{donation.transport_method}</span>
                        </div>
                        {donation.transport_method === 'transporteur' && (
                            <div className="detail-row">
                                <strong>Adresse de récupération:</strong> <span>{donation.pickup_address}</span>
                            </div>
                        )}
                        {donation.transport_method === 'depot' && (
                            <div className="detail-row">
                                <strong>Lieu de dépôt:</strong> <span>{donation.dropoff_location || 'Point de collecte principal'}</span>
                            </div>
                        )}
                        <div className="detail-row">
                            <strong>Statut Transport:</strong> <span>{donation.transport_status || 'En attente'}</span>
                        </div>
                    </div>
                )}

                {/* Admin specific fields could go here */}
                {role === 'admin' && (
                    <div className="admin-actions">
                        {/* Placeholder for admin actions */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationDetail;
