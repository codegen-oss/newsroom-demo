import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext';
import { OrganizationProvider } from '../contexts/OrganizationContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <OrganizationProvider>
          <Component {...pageProps} />
        </OrganizationProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default MyApp;

