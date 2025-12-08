import React, { useState, useEffect } from 'react';
import DonationDetail from './DonationDetail';
import AdminDonationManager from './AdminDonationManager';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onBack }) => {
    const [activeTab, setActiveTab] = useState('accepted');
    const [donations, setDonations] = useState([]);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'manage'

    useEffect(() => {
        fetchDonations();
    }, [activeTab]);

    const fetchDonations = async () => {
        // Mock data
        const allDonations = [
            { id: 1, type: 'objet', name: 'Vêtements hiver', status: 'accepté', date: '2023-10-25', transport_method: 'depot', transport_status: 'En attente', donor_name: 'Jean Dupont', dropoff_location: 'Centre Ville' },
            { id: 2, type: 'argent', amount: 50, status: 'accepté', date: '2023-11-02', donor_name: 'Marie Curie' },
            { id: 3, type: 'objet', name: 'Chaise cassée', status: 'refusé', date: '2023-11-05', refusal_reason: 'Objet endommagé', donor_name: 'Paul Martin' },
            { id: 4, type: 'objet', name: 'Canapé', status: 'accepté', date: '2023-11-06', transport_method: 'transporteur', transport_status: 'En attente', pickup_address: '123 Rue de la Paix', pickup_slots: 'Lundi Matin', donor_name: 'Sophie Germain' },
            { id: 5, type: 'argent', amount: 100, status: 'accepté', date: '2023-11-07', donor_name: 'Albert Einstein' },
        ];

        let filtered = [];
        if (activeTab === 'accepted') {
            filtered = allDonations.filter(d => d.status === 'accepté' && d.type === 'objet');
        } else if (activeTab === 'refused') {
            filtered = allDonations.filter(d => d.status === 'refusé');
        } else if (activeTab === 'money') {
            filtered = allDonations.filter(d => d.type === 'argent');
        }
        setDonations(filtered);
    };

    const handleViewDetails = (donation) => {
        setSelectedDonation(donation);
        setViewMode('detail');
    };

    const handleManage = (donation) => {
        setSelectedDonation(donation);
        setViewMode('manage');
    };

    const handleUpdateStatus = (id, newStatusObj) => {
        // Update local state to reflect changes
        setDonations(prev => prev.map(d => d.id === id ? { ...d, ...newStatusObj } : d));
        // Also update selectedDonation if needed
        if (selectedDonation && selectedDonation.id === id) {
            setSelectedDonation(prev => ({ ...prev, ...newStatusObj }));
        }
    };

    if (viewMode === 'manage') {
        return (
            <AdminDonationManager
                donation={selectedDonation}
                onBack={() => setViewMode('list')}
                onUpdateStatus={handleUpdateStatus}
            />
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <button onClick={onBack} className="btn-back">← Accueil</button>
                <h1>Espace Administrateur</h1>
            </header>

            <div className="admin-tabs">
                <button
                    className={`tab ${activeTab === 'accepted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accepted')}
                >
                    Dons Acceptés (Objets)
                </button>
                <button
                    className={`tab ${activeTab === 'money' ? 'active' : ''}`}
                    onClick={() => setActiveTab('money')}
                >
                    Dons Argent
                </button>
                <button
                    className={`tab ${activeTab === 'refused' ? 'active' : ''}`}
                    onClick={() => setActiveTab('refused')}
                >
                    Dons Refusés
                </button>
            </div>

            <div className="admin-content">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Donateur</th>
                            <th>Objet/Montant</th>
                            <th>Date</th>
                            {activeTab === 'accepted' && <th>Transport</th>}
                            {activeTab === 'accepted' && <th>Statut Transport</th>}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(d => (
                            <tr key={d.id}>
                                <td>#{d.id}</td>
                                <td>{d.donor_name}</td>
                                <td>{d.type === 'argent' ? `${d.amount} DT` : d.name}</td>
                                <td>{new Date(d.date).toLocaleDateString()}</td>

                                {activeTab === 'accepted' && (
                                    <>
                                        <td>{d.transport_method === 'depot' ? 'Dépôt' : 'Transporteur'}</td>
                                        <td>
                                            <span className={`transport-badge ${d.transport_status === 'Don déposé' ? 'done' : 'pending'}`}>
                                                {d.transport_status || 'En attente'}
                                            </span>
                                        </td>
                                    </>
                                )}

                                <td>
                                    {activeTab === 'accepted' ? (
                                        <button className="btn-manage" onClick={() => handleManage(d)}>Gérer</button>
                                    ) : (
                                        <button className="btn-view-admin" onClick={() => handleViewDetails(d)}>Voir détails</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {donations.length === 0 && (
                            <tr><td colSpan="7" className="no-data">Aucun don trouvé.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {viewMode === 'detail' && selectedDonation && (
                <DonationDetail
                    donation={selectedDonation}
                    role="admin"
                    onClose={() => {
                        setSelectedDonation(null);
                        setViewMode('list');
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
