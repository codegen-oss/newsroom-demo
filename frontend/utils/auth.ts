import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '../contexts/AuthContext';

// Type for protected page component
export type ProtectedPageProps = {
  [key: string]: any;
};

// HOC to protect routes that require authentication
export function withAuth<P extends ProtectedPageProps>(
  WrappedComponent: NextPage<P>
) {
  const WithAuth: NextPage<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        });
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading or the component based on authentication state
    if (isLoading) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Copy getInitialProps if it exists
  if (WrappedComponent.getInitialProps) {
    WithAuth.getInitialProps = WrappedComponent.getInitialProps;
  }

  return WithAuth;
}

// Server-side authentication check
export const checkAuthServer = (context: GetServerSidePropsContext) => {
  const { req, resolvedUrl } = context;
  const token = req.cookies.auth_token;

  if (!token) {
    return {
      redirect: {
        destination: `/login?returnUrl=${encodeURIComponent(resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

