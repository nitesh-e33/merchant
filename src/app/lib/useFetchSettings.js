import { useState, useEffect } from 'react';
import { apiRequest } from './apiHelper';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { decryptedData, encryptData } from './helper';

const useFetchSettings = () => {
  const [credentials, setCredentials] = useState(null);
  const [webhookList, setWebhookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const encryptedUser = localStorage.getItem('user');
        let userData = {};
        if (encryptedUser) {
          userData = decryptedData(encryptedUser);
        }

        if (!userData?.isKYCVerified) {
          toast.error('Your Profile is Under Verification');
          setLoading(false);
          router.back();
          return;
        }

        // Retrieve and decrypt cached credentials and webhook list
        const cachedCredentials = localStorage.getItem('credentials');
        const cachedWebhookList = localStorage.getItem('webhookList');

        let credentialsData, webhookListData;
        if (cachedCredentials) {
          credentialsData = decryptedData(cachedCredentials);
          const cacheKey = `ClientId_${credentialsData.client_id}`;
          if (localStorage.getItem(cacheKey)) {
            credentialsData.client_secret = 'xxxxxxxxxxxxxxxx';
          }
        } else {
          const credentialsResponse = await apiRequest('GET', '/v1/merchant/get-client-setting');
          credentialsData = credentialsResponse.Result || {};
          const encryptedCredentials = encryptData(credentialsData);
          localStorage.setItem('credentials', encryptedCredentials);
        }

        if (cachedWebhookList) {
          webhookListData = decryptedData(cachedWebhookList);
        } else {
          const webhookListResponse = await apiRequest('POST', '/v1/merchant/webhook/list');
          webhookListData = webhookListResponse.Result || [];
          const encryptedWebhookList = encryptData(webhookListData);
          localStorage.setItem('webhookList', encryptedWebhookList);
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
