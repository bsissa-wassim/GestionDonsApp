import React, { useState, useEffect } from 'react';
import DonationDetail from './DonationDetail';
import AdminDonationManager from './AdminDonationManager';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onBack }) => {
    const [activeTab, setActiveTab] = useState('dons');
    const [donations, setDonations] = useState([]);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'manage'

    useEffect(() => {
        fetchDonations();
    }, [activeTab]);

    const fetchDonations = async () => {
        // Mock data for client-side testing
        const mockData = [
            { id: 1, type: 'objet', name: 'Vêtements hiver', status: 'accepté', date: '2023-10-25', transport_method: 'depot', transport_status: 'En attente', donor_name: 'Jean Dupont', dropoff_location: 'Centre Ville' },
            { id: 2, type: 'argent', amount: 50, status: 'accepté', date: '2023-11-02', donor_name: 'Marie Curie' },
            { id: 3, type: 'objet', name: 'Chaise cassée', status: 'refusé', date: '2023-11-05', refusal_reason: 'Objet endommagé', donor_name: 'Paul Martin' },
            { id: 4, type: 'objet', name: 'Canapé', status: 'accepté', date: '2023-11-06', transport_method: 'transporteur', transport_status: 'En attente', pickup_address: '123 Rue de la Paix', pickup_slots: 'Lundi Matin', donor_name: 'Sophie Germain' },
            { id: 5, type: 'argent', amount: 100, status: 'accepté', date: '2023-11-07', donor_name: 'Albert Einstein' },
            { id: 6, type: 'objet', name: 'Vélo enfant', status: 'en attente', date: '2023-12-01', donor_name: 'Alice Wonderland', description: 'Vélo rouge 24 pouces' },
            { id: 7, type: 'objet', name: 'Livres scolaires', status: 'en attente', date: '2023-12-05', donor_name: 'Bob Builder', description: 'Maths et Physique' }
        ];

        try {
            // Fetch real data from Supabase
            const { data, error } = await supabase.from('donations').select('*');
            if (error) {
                console.error('Error fetching donations:', error);
                setDonations(mockData); // Fallback to mock data on error
            } else {
                // Use real data if available, otherwise use mock data (for testing empty DB)
                setDonations(data && data.length > 0 ? data : mockData);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setDonations(mockData); // Fallback on crash
        }
    };

    // Filter helper
    const getFilteredDonations = () => {
        if (activeTab === 'dons') {
            // "Dons" -> Objects that admin can manage. (Assuming these are accepted objects)
            return donations.filter(d => d.status === 'accepté' && d.type === 'objet');
        } else if (activeTab === 'accepted_readonly') {
            // "Dons acceptés" -> Read only view of accepted donations (Objects)
            return donations.filter(d => d.status === 'accepté' && d.type === 'objet');
        } else if (activeTab === 'refused') {
            return donations.filter(d => d.status === 'refusé');
        } else if (activeTab === 'money') {
            return donations.filter(d => d.type === 'argent');
        }
        return [];
    };

    const displayDonations = getFilteredDonations();

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
                    className={`tab ${activeTab === 'dons' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dons')}
                >
                    Dons
                </button>
                <button
                    className={`tab ${activeTab === 'accepted_readonly' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accepted_readonly')}
                >
                    Dons Acceptés
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
                            {(activeTab === 'dons' || activeTab === 'accepted_readonly') && <th>Transport</th>}
                            {(activeTab === 'dons' || activeTab === 'accepted_readonly') && <th>Statut Transport</th>}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayDonations.map(d => (
                            <tr key={d.id}>
                                <td>#{d.id}</td>
                                <td>{d.donor_name}</td>
                                <td>{d.type === 'argent' ? `${d.amount} DT` : d.name}</td>
                                <td>{new Date(d.date).toLocaleDateString()}</td>

                                {(activeTab === 'dons' || activeTab === 'accepted_readonly') && (
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
                                    {activeTab === 'dons' ? (
                                        <button className="btn-manage" onClick={() => handleManage(d)}>Gérer</button>
                                    ) : (
                                        <button className="btn-view-admin" onClick={() => handleViewDetails(d)}>Voir détails</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {displayDonations.length === 0 && (
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
