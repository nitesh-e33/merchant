import { useEffect, useState } from 'react';
import { Drawer, Button } from 'rsuite';
import { toast } from 'react-toastify';
import FormComponent from './FormComponent';
import { apiRequest } from '@/app/lib/apiHelper';
import { copyToClipboard } from '@/app/lib/helper';
import Image from 'next/image';

function LinkGenerationForm({ open, onClose, initialData }) {
  const [qrCode, setQrCode] = useState(null);
  const [paymentShortUrl, setPaymentShortUrl] = useState(null);

  useEffect(() => {
    if (open) {
      setPaymentShortUrl(null);
      setQrCode(null);
    }
  }, [open]);

  const handleFormSubmit = async (formData) => {
    try {
      // First API call to generate the payment link
      localStorage.removeItem('easyCollectData');
      localStorage.removeItem('easyCollectData_timestamp');
      const response = await apiRequest('POST', '/v1/merchant/generate-easy-collect-payment-link', { post: formData });

      if (response.StatusCode === "1") {
        toast.success(response.Message);

        const paymentShortUrl = response.Result.payment_short_url;
        setPaymentShortUrl(paymentShortUrl);

        // Second API call to generate QR code
        const qrResponse = await fetch(`/api/generate-qr-code?url=${encodeURIComponent(paymentShortUrl)}`);
        const result = await qrResponse.json();

        if (result.qrCodeDataUrl) {
          setQrCode(result.qrCodeDataUrl);
        } else {
          toast.error('QR not generated. Please try again later.');
        }
      } else {
        toast.error(response.Message || 'Failed to generate payment link.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Drawer backdrop={false} placement="right" open={open} onClose={onClose} size="sm">
      <Drawer.Header>
        <Drawer.Title>Payment Generation Link</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <FormComponent initialData={initialData} onSubmit={handleFormSubmit} />

        {/* Display Payment Link, QR Code, and Copy Icon */}
        {paymentShortUrl && (
          <div className="mt-6">
            <Button appearance="subtle" onClick={() => copyToClipboard(paymentShortUrl)}>Copy Link</Button>
            {qrCode && (
              <div className="text-center mt-4">
                <Image src={qrCode} alt="QR Code" width={200} height={200} />
              </div>
            )}
          </div>
        )}
      </Drawer.Body>
    </Drawer>
  );
}

export default LinkGenerationForm;
