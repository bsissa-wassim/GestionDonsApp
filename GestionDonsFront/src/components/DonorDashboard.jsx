import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DonationDetail from './DonationDetail';
import DonationModal from './DonationModal';
import './DonorDashboard.css';

const DonorDashboard = ({ user, onBack }) => {
    // viewMode: 'menu', 'history', 'donate'
    const [viewMode, setViewMode] = useState('menu');
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [stats, setStats] = useState({ total: 0, accepted: 0, pending: 0 });

    useEffect(() => {
        if (user) {
            fetchDonations();
        }
    }, [user]);

    const fetchDonations = async () => {
        const mockData = [
            { id: 101, type: 'objet', name: 'Vêtements bébé', status: 'accepté', date: '2023-09-15', transport_method: 'depot', transport_status: 'Don déposé' },
            { id: 102, type: 'argent', amount: 30, status: 'accepté', date: '2023-11-20' },
            { id: 103, type: 'objet', name: 'Table basse', status: 'en attente', date: '2023-12-10' }
        ];

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .eq('donor_id', user.id);

            if (error) throw error;
            const donationData = data && data.length > 0 ? data : mockData;
            setDonations(donationData);

            // Calculate stats
            setStats({
                total: donationData.length,
                accepted: donationData.filter(d => d.status === 'accepté').length,
                pending: donationData.filter(d => d.status === 'en attente').length
            });

        } catch (error) {
            console.error('Error fetching donations:', error);
            setDonations(mockData);
            setStats({
                total: mockData.length,
                accepted: mockData.filter(d => d.status === 'accepté').length,
                pending: mockData.filter(d => d.status === 'en attente').length
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStats = () => (
        <section className="stats-section">
            <div className="stats-container">
                <div className="stat-card total">
                    <div className="stat-icon">
                        <i className="fas fa-hand-holding-heart"></i>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Dons</p>
                        <p className="stat-value">{stats.total}</p>
                    </div>
                </div>

                <div className="stat-card accepted">
                    <div className="stat-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Acceptés</p>
                        <p className="stat-value">{stats.accepted}</p>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">En Attente</p>
                        <p className="stat-value">{stats.pending}</p>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderContent = () => {
        if (viewMode === 'donate') {
            return (
                <div className="donor-dashboard">
                    <DonationModal onClose={() => setViewMode('menu')} />
                </div>
            );
        }

        if (viewMode === 'history') {
            return (
                <div className="content-wrapper">
                    <header className="content-header">
                        <button onClick={() => setViewMode('menu')} className="btn-back">← Retour</button>
                        <h2>Historique de mes Dons</h2>
                    </header>
                    <div className="table-responsive">
                        <table className="donations-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Détail</th>
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((donation) => (
                                    <tr key={donation.id}>
                                        <td>#{donation.id}</td>
                                        <td>{donation.type}</td>
                                        <td>{donation.type === 'argent' ? `${donation.amount} DT` : donation.name}</td>
                                        <td>{new Date(donation.date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-pill ${donation.status}`}>
                                                {donation.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-view"
                                                onClick={() => setSelectedDonation(donation)}
                                            >
                                                Voir détails
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {donations.length === 0 && (
                                    <tr><td colSpan="6" className="no-data">Aucun don trouvé.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="action-cards-container">
                <div className="action-card" onClick={() => setViewMode('donate')}>
                    <div className="action-icon">
                        <i className="fas fa-gift"></i>
                    </div>
                    <h3>Faire un Don</h3>
                    <p>Proposez un nouvel objet ou faites un don financier.</p>
                </div>

                <div className="action-card" onClick={() => setViewMode('history')}>
                    <div className="action-icon">
                        <i className="fas fa-history"></i>
                    </div>
                    <h3>Mes Dons</h3>
                    <p>Consultez l'historique et le statut de vos dons.</p>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="donor-dashboard">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="donor-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <img src="/logo - Copy.png" alt="Donarise" className="logo" />
                        <h1>Espace Donateur</h1>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <i className="fas fa-user-circle"></i>
                            <div className="user-details">
                                <p className="user-name">{user?.user_metadata?.first_name || 'Donateur'}</p>
                                <p className="user-email">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={onBack} className="btn-logout-header">
                            <i className="fas fa-sign-out-alt"></i> Accueil
                        </button>
                    </div>
                </div>
            </header>

            {renderStats()}

            <main className="dashboard-main">
                {renderContent()}
            </main>

            {selectedDonation && (
                <DonationDetail
                    donation={selectedDonation}
                    onClose={() => setSelectedDonation(null)}
                />
            )}
        </div>
    );
};

export default DonorDashboard;
