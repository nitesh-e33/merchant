import { useState, useEffect } from 'react';
import { apiRequest } from './apiHelper';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const useFetchSettings = () => {
  const [credentials, setCredentials] = useState(null);
  const [webhookList, setWebhookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const userData = storedUser ? JSON.parse(storedUser) : null;

        if (!userData?.isKYCVerified) {
          toast.error('Your Profile is Under Verification');
          setLoading(false);
          router.back();
          return;
        }

        const [credentialsResponse, webhookListResponse] = await Promise.all([
          apiRequest('GET', '/v1/merchant/get-client-setting'),
          apiRequest('POST', '/v1/merchant/webhook/list'),
        ]);

        const cacheKey = `ClientId_${credentialsResponse.Result.client_id}`;
        if (localStorage.getItem(cacheKey)) {
          credentialsResponse.Result.client_secret = 'xxxxxxxxxxxxxxxx';
        }

        setCredentials(credentialsResponse.Result);
        setWebhookList(webhookListResponse.Result || []);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to fetch settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [router]);

  return { credentials, webhookList, loading };
};

export default useFetchSettings;
