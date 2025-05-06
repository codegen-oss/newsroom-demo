import React, { createContext, useState, useEffect, useContext } from 'react';
import { organizationAPI } from '../api';
import { useAuth } from './AuthContext';

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user's organizations when authenticated
    const fetchOrganizations = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orgsData = await organizationAPI.getOrganizations();
        setOrganizations(orgsData);
        
        // Set current organization to the first one if available
        if (orgsData.length > 0 && !currentOrganization) {
          setCurrentOrganization(orgsData[0]);
          fetchOrganizationMembers(orgsData[0].id);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch organizations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [isAuthenticated, user?.id]);

  const fetchOrganizationMembers = async (orgId) => {
    try {
      setLoading(true);
      const membersData = await organizationAPI.getOrganizationMembers(orgId);
      setMembers(membersData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch organization members');
    } finally {
      setLoading(false);
    }
  };

  const selectOrganization = async (orgId) => {
    try {
      setLoading(true);
      const orgData = await organizationAPI.getOrganization(orgId);
      setCurrentOrganization(orgData);
      await fetchOrganizationMembers(orgId);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to select organization');
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (orgData) => {
    try {
      setError(null);
      setLoading(true);
      const newOrg = await organizationAPI.createOrganization(orgData);
      setOrganizations(prev => [...prev, newOrg]);
      return newOrg;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create organization');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (orgId, orgData) => {
    try {
      setError(null);
      setLoading(true);
      const updatedOrg = await organizationAPI.updateOrganization(orgId, orgData);
      
      setOrganizations(prev => 
        prev.map(org => org.id === orgId ? updatedOrg : org)
      );
      
      if (currentOrganization?.id === orgId) {
        setCurrentOrganization(updatedOrg);
      }
      
      return updatedOrg;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update organization');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (orgId) => {
    try {
      setError(null);
      setLoading(true);
      await organizationAPI.deleteOrganization(orgId);
      
      setOrganizations(prev => 
        prev.filter(org => org.id !== orgId)
      );
      
      if (currentOrganization?.id === orgId) {
        setCurrentOrganization(organizations.length > 1 ? 
          organizations.find(org => org.id !== orgId) : null);
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete organization');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (orgId, memberData) => {
    try {
      setError(null);
      setLoading(true);
      const newMember = await organizationAPI.addOrganizationMember(orgId, memberData);
      
      if (currentOrganization?.id === orgId) {
        setMembers(prev => [...prev, newMember]);
      }
      
      return newMember;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (orgId, userId, memberData) => {
    try {
      setError(null);
      setLoading(true);
      const updatedMember = await organizationAPI.updateOrganizationMember(orgId, userId, memberData);
      
      if (currentOrganization?.id === orgId) {
        setMembers(prev => 
          prev.map(member => member.user_id === userId ? updatedMember : member)
        );
      }
      
      return updatedMember;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (orgId, userId) => {
    try {
      setError(null);
      setLoading(true);
      await organizationAPI.removeOrganizationMember(orgId, userId);
      
      if (currentOrganization?.id === orgId) {
        setMembers(prev => 
          prev.filter(member => member.user_id !== userId)
        );
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isOrgAdmin = (orgId) => {
    if (!user) return false;
    
    const membership = members.find(
      m => m.organization_id === orgId && m.user_id === user.id
    );
    
    return membership?.role === 'admin';
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        members,
        loading,
        error,
        selectOrganization,
        createOrganization,
        updateOrganization,
        deleteOrganization,
        addMember,
        updateMember,
        removeMember,
        isOrgAdmin,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);

export default OrganizationContext;

