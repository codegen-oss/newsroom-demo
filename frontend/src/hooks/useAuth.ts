import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { 
  loginFailure, 
  loginStart, 
  loginSuccess, 
  logout, 
  updatePreferences, 
  updateUser 
} from '../store/slices/authSlice';
import { LoginCredentials, RegisterData, User } from '../types';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useUpdateUserPreferencesMutation 
} from '../store/services/apiSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  
  const [loginApi] = useLoginMutation();
  const [registerApi] = useRegisterMutation();
  const [updatePreferencesApi] = useUpdateUserPreferencesMutation();
  
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch(loginStart());
      const result = await loginApi(credentials).unwrap();
      dispatch(loginSuccess(result));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch, loginApi]);
  
  const handleRegister = useCallback(async (data: RegisterData) => {
    try {
      dispatch(loginStart());
      const result = await registerApi(data).unwrap();
      dispatch(loginSuccess(result));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch, registerApi]);
  
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  
  const handleUpdateUser = useCallback((userData: Partial<User>) => {
    dispatch(updateUser(userData as User));
  }, [dispatch]);
  
  const handleUpdatePreferences = useCallback(async (preferences: User['preferences']) => {
    dispatch(updatePreferences(preferences));
    
    if (isAuthenticated) {
      try {
        await updatePreferencesApi(preferences).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to update preferences on server:', error);
        return false;
      }
    }
    
    return true;
  }, [dispatch, isAuthenticated, updatePreferencesApi]);
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: handleUpdateUser,
    updatePreferences: handleUpdatePreferences,
  };
};

