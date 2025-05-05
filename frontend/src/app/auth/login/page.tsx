'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../../../store/services/apiSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { loginSuccess } from '../../../store/slices/authSlice';
import AuthForm, { AuthFormData } from '../../../components/ui/AuthForm';

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data: AuthFormData) => {
    try {
      const result = await login({ 
        email: data.email, 
        password: data.password 
      }).unwrap();
      
      dispatch(loginSuccess(result));
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.data?.message || 'Login failed. Please check your credentials and try again.');
      throw error;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
