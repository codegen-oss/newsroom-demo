import { useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { withAuth } from '../utils/auth';
import { isValidEmail } from '../utils/auth';

type FormData = {
  name: string;
  email: string;
  bio?: string;
  location?: string;
};

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
      location: '',
    },
  });

  // Update form values when user data changes
  useState(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        bio: '',
        location: '',
      });
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateProfile({
        name: data.name,
        email: data.email,
      });
      
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
      location: '',
    });
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Profile | News Room</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="name"
                          type="text"
                          className="form-input"
                          {...register('name', {
                            required: 'Name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters',
                            },
                          })}
                        />
                        {errors.name && (
                          <p className="form-error">{errors.name.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          type="email"
                          className="form-input"
                          {...register('email', {
                            required: 'Email is required',
                            validate: (value) => isValidEmail(value) || 'Invalid email address',
                          })}
                        />
                        {errors.email && (
                          <p className="form-error">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          rows={3}
                          className="form-input"
                          placeholder="Tell us about yourself"
                          {...register('bio')}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="mt-1">
                        <input
                          id="location"
                          type="text"
                          className="form-input"
                          placeholder="City, Country"
                          {...register('location')}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                    <div className="mt-5 border-t border-gray-200 pt-5">
                      <dl className="divide-y divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Full name</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {user?.name}
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Email address</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {user?.email}
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Bio</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            Not provided
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Location</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            Not provided
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(Profile);

