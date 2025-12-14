import { supabase } from './supabase';

// Get all objects assigned to a specific transporter
export const getTransporterObjects = async (transporterId) => {
  try {
    const { data, error } = await supabase
      .from('objet_a_transporter')
      .select(`
        id,
        statut,
        date_affectation,
        objet_accepte:objet_accepte_id (
          id,
          objet:objet_id (
            id,
            nom,
            type,
            localisation,
            destination,
            type_destination
          )
        )
      `)
      .eq('transporteur_id', transporterId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching transporter objects:', error);
    throw error;
  }
};

// Get transporter profile with role check
export const getTransporterProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nom, email, numero, roles')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    // Check if user has transporteur role
    const isTransporter = data?.roles?.includes('transporteur');
    return { ...data, isTransporter };
  } catch (error) {
    console.error('Error fetching transporter profile:', error);
    throw error;
  }
};

// Update object transport status
export const updateObjectStatus = async (objetTransporterId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('objet_a_transporter')
      .update({ statut: newStatus })
      .eq('id', objetTransporterId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating object status:', error);
    throw error;
  }
};

// Get statistics for transporter dashboard
export const getTransporterStats = async (transporterId) => {
  try {
    const { data, error } = await supabase
      .from('objet_a_transporter')
      .select('statut')
      .eq('transporteur_id', transporterId);

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(obj => obj.statut === 'en attente').length,
      inTransport: data.filter(obj => obj.statut === 'en transport').length,
      delivered: data.filter(obj => obj.statut === 'livré').length,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching transporter stats:', error);
    throw error;
  }
};
