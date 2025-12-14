import React, { useState, useEffect } from 'react';
import DonationDetail from './DonationDetail';
import AdminDonationManager from './AdminDonationManager';
import './AdminDashboard.css';
import { supabase } from '../lib/supabase';

const AdminDashboard = ({ user, onBack }) => {
    const [activeTab, setActiveTab] = useState('dons');
    const [donations, setDonations] = useState([]);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'manage'
    const [stats, setStats] = useState({ total_users: 150, pending_donations: 0, total_donations: 0 });

    useEffect(() => {
        fetchDonations();
    }, [activeTab]);

    const fetchDonations = async () => {
        // Mock data
        const mockData = [
            { id: 1, type: 'objet', name: 'Vêtements hiver', status: 'accepté', date: '2023-10-25', transport_method: 'depot', transport_status: 'En attente', donor_name: 'Jean Dupont', dropoff_location: 'Centre Ville' },
            { id: 2, type: 'argent', amount: 50, status: 'accepté', date: '2023-11-02', donor_name: 'Marie Curie' },
            { id: 3, type: 'objet', name: 'Chaise cassée', status: 'refusé', date: '2023-11-05', refusal_reason: 'Objet endommagé', donor_name: 'Paul Martin' },
            { id: 4, type: 'objet', name: 'Canapé', status: 'accepté', date: '2023-11-06', transport_method: 'transporteur', transport_status: 'En attente', pickup_address: '123 Rue de la Paix', pickup_slots: 'Lundi Matin', donor_name: 'Sophie Germain' },
            { id: 5, type: 'argent', amount: 100, status: 'accepté', date: '2023-11-07', donor_name: 'Albert Einstein' }
        ];

        try {
            const { data, error } = await supabase.from('donations').select('*');
            let finalData = data && data.length > 0 ? data : mockData;
            setDonations(finalData);

            setStats({
                total_users: 150, // Mock for now
                pending_donations: finalData.filter(d => d.status === 'en attente').length,
                total_donations: finalData.length
            });
        } catch (err) {
            console.error("Unexpected error:", err);
            setDonations(mockData);
        }
    };

    // Filter helper
    const getFilteredDonations = () => {
        if (activeTab === 'dons') return donations.filter(d => d.status === 'accepté' && d.type === 'objet');
        if (activeTab === 'accepted_readonly') return donations.filter(d => d.status === 'accepté' && d.type === 'objet');
        if (activeTab === 'refused') return donations.filter(d => d.status === 'refusé');
        if (activeTab === 'money') return donations.filter(d => d.type === 'argent');
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
        setDonations(prev => prev.map(d => d.id === id ? { ...d, ...newStatusObj } : d));
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
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <img src="/logo - Copy.png" alt="Donarise" className="logo" />
                        <h1>Administration</h1>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <i className="fas fa-user-shield"></i>
                            <div className="user-details">
                                <p className="user-name">{user?.user_metadata?.first_name || 'Admin'}</p>
                                <p className="user-email">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={onBack} className="btn-logout-header">
                            <i className="fas fa-sign-out-alt"></i> Accueil
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-card total">
                        <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
                        <div className="stat-content">
                            <p className="stat-label">Total Dons</p>
                            <p className="stat-value">{stats.total_donations}</p>
                        </div>
                    </div>
                    <div className="stat-card users">
                        <div className="stat-icon"><i className="fas fa-users"></i></div>
                        <div className="stat-content">
                            <p className="stat-label">Utilisateurs</p>
                            <p className="stat-value">{stats.total_users}</p>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-icon"><i className="fas fa-hourglass-half"></i></div>
                        <div className="stat-content">
                            <p className="stat-label">Dons en Attente</p>
                            <p className="stat-value">{stats.pending_donations}</p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="dashboard-main">
                <div className="content-wrapper">
                    <div className="tabs-section">
                        <div className="tabs">
                            <button className={`tab ${activeTab === 'dons' ? 'active' : ''}`} onClick={() => setActiveTab('dons')}>Dons à Gérer</button>
                            <button className={`tab ${activeTab === 'accepted_readonly' ? 'active' : ''}`} onClick={() => setActiveTab('accepted_readonly')}>Dons Acceptés</button>
                            <button className={`tab ${activeTab === 'money' ? 'active' : ''}`} onClick={() => setActiveTab('money')}>Dons Argent</button>
                            <button className={`tab ${activeTab === 'refused' ? 'active' : ''}`} onClick={() => setActiveTab('refused')}>Refusés</button>
                        </div>
                    </div>

                    <div className="table-container-padded">
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
                                                <td><span className={`transport-badge ${d.transport_status === 'Don déposé' ? 'done' : 'pending'}`}>{d.transport_status || 'En attente'}</span></td>
                                            </>
                                        )}
                                        <td>
                                            {activeTab === 'dons' ? (
                                                <button className="btn-manage" onClick={() => handleManage(d)}>Gérer</button>
                                            ) : (
                                                <button className="btn-view-admin" onClick={() => handleViewDetails(d)}>Voir</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {displayDonations.length === 0 && <tr><td colSpan="7" className="no-data">Aucun don trouvé.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {viewMode === 'detail' && selectedDonation && (
                <DonationDetail
                    donation={selectedDonation}
                    role="admin"
                    onClose={() => { setSelectedDonation(null); setViewMode('list'); }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
