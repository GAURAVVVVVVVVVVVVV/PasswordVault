import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import VaultDashboard from '../components/VaultDashboard';

export default function Vault() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  if (!isClient) {
    return null;
  }

  return <VaultDashboard />;
}