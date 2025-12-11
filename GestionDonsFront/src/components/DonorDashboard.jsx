import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DonationDetail from './DonationDetail';
import './DonorDashboard.css';

const DonorDashboard = ({ user, onBack }) => {
    // viewMode: 'menu', 'history', 'donate'
    const [viewMode, setViewMode] = useState('menu');
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        if (user && viewMode === 'history') {
            fetchDonations();
        }
    }, [user, viewMode]);

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
            // Use real data if available, otherwise use mock data (for testing empty DB)
            setDonations(data && data.length > 0 ? data : mockData);
        } catch (error) {
            console.error('Error fetching donations:', error);
            // Fallback to mock data
            setDonations(mockData);
        } finally {
            setLoading(false);
        }
    };

    if (viewMode === 'donate') {
        return (
            <div className="donor-dashboard">
                <header className="dashboard-header">
                    <button onClick={() => setViewMode('menu')} className="btn-back">← Retour</button>
                    <h1>Faire un don</h1>
                </header>
                <div className="dashboard-content">
                    {/* Placeholder for donation form */}
                    <div className="donate-placeholder" style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Formulaire de don à venir ici...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (viewMode === 'history') {
        return (
            <div className="donor-dashboard">
                <header className="dashboard-header">
                    <button onClick={() => setViewMode('menu')} className="btn-back">← Retour</button>
                    <h1>Mes Dons précédents</h1>
                </header>

                <div className="dashboard-content">
                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
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
                                        <tr><td colSpan="6" className="no-data">Aucun don passé trouvé.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {selectedDonation && (
                    <DonationDetail
                        donation={selectedDonation}
                        onClose={() => setSelectedDonation(null)}
                    />
                )}
            </div>
        );
    }

    // Default 'menu' view
    return (
        <div className="donor-dashboard">
            <header className="dashboard-header">
                <button onClick={onBack} className="btn-back">← Accueil</button>
                <h1>Mon Espace Donateur</h1>
            </header>

            <div className="dashboard-content donor-menu">
                <button
                    className="btn-menu-action btn-donate"
                    onClick={() => setViewMode('donate')}
                >
                    Faire un don
                </button>

                <button
                    className="btn-menu-action btn-history"
                    onClick={() => setViewMode('history')}
                >
                    Mes dons
                </button>
            </div>
        </div>
    );
};

export default DonorDashboard;
