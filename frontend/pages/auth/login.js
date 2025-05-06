import Head from 'next/head';
import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - News Room</title>
        <meta name="description" content="Sign in to your News Room account" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <LoginForm />
      </div>
    </>
  );
}

