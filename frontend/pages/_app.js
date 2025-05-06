import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext';
import { NewsFeedProvider } from '../contexts/NewsFeedContext';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <NewsFeedProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NewsFeedProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default MyApp;

