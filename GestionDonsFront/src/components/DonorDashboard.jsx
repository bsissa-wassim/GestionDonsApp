import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DonationDetail from './DonationDetail';
import './DonorDashboard.css';

const DonorDashboard = ({ user, onBack }) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        if (user) {
            fetchDonations();
        }
    }, [user]);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual Supabase query when table exists
            // const { data, error } = await supabase
            //   .from('donations')
            //   .select('*')
            //   .eq('donor_id', user.id);

            // if (error) throw error;

            // Mock data for now
            const mockData = [
                { id: 1, type: 'objet', name: 'Vêtements hiver', status: 'accepté', date: '2023-10-25', transport_method: 'depot', transport_status: 'En attente' },
                { id: 2, type: 'argent', amount: 50, status: 'accepté', date: '2023-11-02' },
                { id: 3, type: 'objet', name: 'Chaise cassée', status: 'refusé', date: '2023-11-05', refusal_reason: 'Objet endommagé et non réparable' },
            ];

            setDonations(mockData);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donor-dashboard">
            <header className="dashboard-header">
                <button onClick={onBack} className="btn-back">← Retour</button>
                <h1>Mon Espace Donateur</h1>
            </header>

            <div className="dashboard-content">
                <h2>Mes Dons</h2>
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
};

export default DonorDashboard;
