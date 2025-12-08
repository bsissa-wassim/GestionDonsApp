import React, { useState } from 'react';
import './AdminDonationManager.css';

const AdminDonationManager = ({ donation, onBack, onUpdateStatus }) => {
    const [selectedCarrier, setSelectedCarrier] = useState('');
    const [loading, setLoading] = useState(false);

    if (!donation) return null;

    const handleValidateDropoff = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateStatus(donation.id, { transport_status: 'Don déposé' });
            setLoading(false);
            alert('Dépôt validé avec succès !');
        }, 1000);
    };

    const handleAssignCarrier = async () => {
        if (!selectedCarrier) {
            alert('Veuillez sélectionner un transporteur.');
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateStatus(donation.id, {
                transport_status: 'Transporteur assigné',
                carrier: selectedCarrier
            });
            setLoading(false);
            alert(`Transporteur ${selectedCarrier} assigné !`);
        }, 1000);
    };

    // Mock carriers
    const carriers = [
        { id: 1, name: 'Transport Express' },
        { id: 2, name: 'Logistique Solidaire' },
        { id: 3, name: 'Ahmed Transport' },
    ];

    return (
        <div className="admin-manager">
            <button className="btn-back-admin" onClick={onBack}>← Retour à la liste</button>

            <div className="manager-header">
                <h2>Gestion du Don #{donation.id}</h2>
                <span className="status-badge accepté">Accepté</span>
            </div>

            <div className="manager-grid">
                <div className="card donor-info">
                    <h3>👤 Donateur</h3>
                    <p><strong>Nom:</strong> {donation.donor_name || 'Anonyme'}</p>
                    <p><strong>Contact:</strong> {donation.donor_contact || 'Non renseigné'}</p>
                    <p><strong>Email:</strong> {donation.donor_email || 'email@example.com'}</p>
                </div>

                <div className="card object-info">
                    <h3>📦 Objet</h3>
                    <div className="object-details">
                        {donation.image && <img src={donation.image} alt={donation.name} className="donation-img" />}
                        <div>
                            <p><strong>Nom:</strong> {donation.name}</p>
                            <p><strong>Type:</strong> {donation.type}</p>
                            <p><strong>Description:</strong> {donation.description || 'Aucune description'}</p>
                        </div>
                    </div>
                </div>

                <div className="card logistics-info">
                    <h3>🚚 Logistique & Transport</h3>
                    <p><strong>Méthode choisie:</strong> {donation.transport_method === 'depot' ? 'Je dépose moi-même' : 'Transporteur'}</p>
                    <p><strong>Statut actuel:</strong> <span className="transport-status">{donation.transport_status || 'En attente'}</span></p>

                    <div className="action-area">
                        {donation.transport_method === 'depot' ? (
                            <div className="depot-actions">
                                <p><strong>Lieu de dépôt:</strong> {donation.dropoff_location || 'Point de collecte principal'}</p>
                                {donation.transport_status !== 'Don déposé' ? (
                                    <button
                                        className="btn-validate"
                                        onClick={handleValidateDropoff}
                                        disabled={loading}
                                    >
                                        {loading ? 'Validation...' : '✅ Valider "Don déposé"'}
                                    </button>
                                ) : (
                                    <div className="success-msg">Le don a été déposé.</div>
                                )}
                            </div>
                        ) : (
                            <div className="carrier-actions">
                                <p><strong>Adresse de récupération:</strong> {donation.pickup_address}</p>
                                <p><strong>Créneaux:</strong> {donation.pickup_slots || 'Non spécifié'}</p>

                                {donation.transport_status !== 'Transporteur assigné' ? (
                                    <div className="assign-box">
                                        <label>Assigner un transporteur :</label>
                                        <select
                                            value={selectedCarrier}
                                            onChange={(e) => setSelectedCarrier(e.target.value)}
                                        >
                                            <option value="">-- Choisir --</option>
                                            {carriers.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn-assign"
                                            onClick={handleAssignCarrier}
                                            disabled={loading}
                                        >
                                            {loading ? 'Assignation...' : 'Assigner'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="success-msg">Transporteur assigné : {donation.carrier}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDonationManager;
