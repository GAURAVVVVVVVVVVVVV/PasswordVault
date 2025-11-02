import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/vault');
    }
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <AuthForm />
    </div>
  );
}