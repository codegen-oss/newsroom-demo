import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MembersList = ({ 
  members, 
  onUpdateMember, 
  onRemoveMember, 
  onAddMember,
  isAdmin = false 
}) => {
  const { user } = useAuth();
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // In a real app, you would search for the user by email first
      // For this demo, we'll just show an error
      setError('User not found. In a real app, this would search for users.');
      
      // If found, you would call onAddMember with the user ID
      // await onAddMember({ user_id: foundUser.id, role: 'member' });
      
      // setNewMemberEmail('');
    } catch (err) {
      setError(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, userId, newRole) => {
    try {
      await onUpdateMember(userId, { role: newRole });
    } catch (err) {
      console.error('Failed to update member role:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Organization Members</h3>
      </div>
      
      {isAdmin && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email to invite"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </form>
          
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {member.user_id === user?.id ? user.display_name.charAt(0) : 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.user_id === user?.id ? user.display_name : 'User ' + member.user_id.substring(0, 8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.user_id === user?.id ? user.email : 'ID: ' + member.user_id.substring(0, 8) + '...'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isAdmin && member.user_id !== user?.id ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, member.user_id, e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {member.user_id !== user?.id && (
                        <button
                          onClick={() => onRemoveMember(member.user_id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 3 : 2} className="px-6 py-4 text-center text-sm text-gray-500">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersList;

