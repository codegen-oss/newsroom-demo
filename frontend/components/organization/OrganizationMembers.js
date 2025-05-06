import { useState } from 'react';

export default function OrganizationMembers({ members, currentUserId }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, this would send an invitation via the API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: `Invitation sent to ${inviteEmail}`,
      });
      setInviteEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send invitation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would remove the member via the API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Member removed successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to remove member. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (memberId, newRole) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would update the member's role via the API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Member role updated successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update role. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {message.text && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Invite New Member</h3>
        <form onSubmit={handleInvite} className="flex gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="input flex-1"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary whitespace-nowrap"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Organization Members</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                          {member.id === currentUserId && (
                            <span className="ml-2 text-xs text-gray-500">(You)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {member.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <select
                        className="text-sm border border-gray-300 rounded-md py-1 px-2"
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        disabled={member.id === currentUserId}
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                      
                      {member.id !== currentUserId && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

