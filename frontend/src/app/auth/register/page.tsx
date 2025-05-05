'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../../../store/services/apiSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { loginSuccess } from '../../../store/slices/authSlice';
import AuthForm, { AuthFormData } from '../../../components/ui/AuthForm';

export default function RegisterPage() {
  const [error, setError] = useState<string | undefined>();
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async (data: AuthFormData) => {
    try {
      const result = await register({ 
        name: data.name || '', 
        email: data.email, 
        password: data.password 
      }).unwrap();
      
      dispatch(loginSuccess(result));
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.data?.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
