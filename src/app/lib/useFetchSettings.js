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

        const cachedCredentials = localStorage.getItem('credentials');
        const cachedWebhookList = localStorage.getItem('webhookList');

        let credentialsData, webhookListData;
        if (cachedCredentials) {
          credentialsData = JSON.parse(cachedCredentials);
          const cacheKey = `ClientId_${credentialsData.client_id}`;
          if (localStorage.getItem(cacheKey)) {
            credentialsData.client_secret = 'xxxxxxxxxxxxxxxx';
          }
        } else {
          const credentialsResponse = await apiRequest('GET', '/v1/merchant/get-client-setting');
          credentialsData = credentialsResponse.Result || {};
          localStorage.setItem('credentials', JSON.stringify(credentialsData));
        }

        if (cachedWebhookList) {
          webhookListData = JSON.parse(cachedWebhookList);
        } else {
          const webhookListResponse = await apiRequest('POST', '/v1/merchant/webhook/list');
          webhookListData = webhookListResponse.Result || [];
          localStorage.setItem('webhookList', JSON.stringify(webhookListData));
        }
        // Set state with fetched or cached data
        setCredentials(credentialsData);
        setWebhookList(webhookListData);
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
