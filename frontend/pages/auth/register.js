import Head from 'next/head';
import RegisterForm from '../../components/auth/RegisterForm';

export default function Register() {
  return (
    <>
      <Head>
        <title>Create Account - News Room</title>
        <meta name="description" content="Create a new News Room account" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <RegisterForm />
      </div>
    </>
  );
}

