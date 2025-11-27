import { useState, useEffect } from 'react'
import './App.css'

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }
      handleRefresh();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateUser = async (id: number, userData: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/updateUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }
      handleRefresh();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteUser/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleAdd = async () => {
    try {
      setError(null);
      const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
      const newUser: User = {
        id: maxId + 1,
        name: '',
        email: '',
        password: ''
      };

      setUsers([...users, newUser]);
      setEditingId(newUser.id);
      setFormData(newUser);
    } catch (err) {
      setError('Failed to add new user');
      console.error('Error adding user:', err);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await handleDeleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleSave = async () => {
    if (editingId && formData.name && formData.email) {
      try {
        setError(null);
        const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
        const isNewUser = editingId >= maxId;

        if (isNewUser) {
          const { name, email, password } = formData;
          const result = await handleCreateUser({ name, email, password });

          if (result.success) {
            setUsers(users.map(user =>
              user.id === editingId ? result.data : user
            ));
          }
        } else {
          const result = await handleUpdateUser(editingId, formData);

          if (result.success) {
            setUsers(users.map(user =>
              user.id === editingId ? result.data : user
            ));
          }
        }

        setEditingId(null);
        setFormData({ id: 0, name: '', email: '', password: '' });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save user');
        console.error('Error saving user:', err);
      }
    } else {
      setError('Please fill all fields');
    }
  };

  const handleCancel = () => {
    if (editingId && editingId > 1000000000000) {
      setUsers(users.filter(user => user.id !== editingId));
    }
    setEditingId(null);
    setFormData({ id: 0, name: '', email: '', password: '' });
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h1 className="card-title text-3xl font-bold text-base-content">User Managements</h1>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="btn btn-outline btn-info"
                  onClick={handleRefresh}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleAdd}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add User
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={!editingId}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="btn btn-ghost btn-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Users Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-base font-bold">ID</th>
                    <th className="text-base font-bold">Name</th>
                    <th className="text-base font-bold">Email</th>
                    <th className="text-base font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-base-content/60">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="text-lg">No users found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-base-200 transition-colors">
                        <td className="font-mono">{user.id}</td>
                        <td>
                          {editingId === user.id ? (
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="input input-bordered input-sm w-full"
                              placeholder="Enter name"
                            />
                          ) : (
                            <span className="font-medium">{user.name}</span>
                          )}
                        </td>
                        <td>
                          {editingId === user.id ? (
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="input input-bordered input-sm w-full"
                              placeholder="Enter email"
                            />
                          ) : (
                            <span className="text-base-content/80">{user.email}</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {editingId === user.id ? (
                              <button
                                className="btn btn-outline btn-error btn-sm"
                                onClick={handleCancel}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                              </button>
                            ) : (
                              <>
                                <button
                                  className="btn btn-outline btn-warning btn-sm"
                                  onClick={() => handleEdit(user)}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline btn-error btn-sm"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App