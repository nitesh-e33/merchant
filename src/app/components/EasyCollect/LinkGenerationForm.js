import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Drawer, Button, Input } from 'rsuite';
import { apiRequest } from '@/app/lib/apiHelper';
import { copyToClipboard } from '@/app/lib/helper'

function LinkGenerationForm({ open, onClose, initialData = null }) {
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    phone: '',
    productTitle: '',
    amount: '',
    reference_id: '',
    linkExpiry: '',
    udfFields: [],
    order_id: ''
  });

  useEffect(() => {
    if (initialData) {
      // Prefill the form with the initial data (edit mode)
      const prefilledUdfs = [];
      for (let i = 1; i <= 5; i++) {
        const udfKey = `udf${i}`;
        if (initialData[udfKey]) {
          prefilledUdfs.push({ key: udfKey, value: initialData[udfKey], isRemovable: false });
        }
      }

      setFormValue({
        name: initialData.customer_name || '',
        email: initialData.customer_email || '',
        phone: initialData.customer_phone || '',
        productTitle: initialData.orders.item_name || '',
        amount: initialData.amount || '',
        reference_id: initialData.reference_id || '',
        linkExpiry: initialData.expiry_date || '',
        udfFields: prefilledUdfs || [],
        order_id: initialData.order_id || '',
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [qrCode, setQrCode] = useState(null);
  const [paymentShortUrl, setPaymentShortUrl] = useState(null);

  // Set default link expiry date to +5 days
  useEffect(() => {
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 5);
    const formattedDate = defaultExpiryDate.toISOString().split('T')[0];
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      linkExpiry: formattedDate,
    }));
  }, []);

  const handleSubmit = () => {
    const formErrors = validateFormData();
    if (formErrors) {
      setErrors(formErrors);
      return;
    }
    generateLink();
  };

  const addUdfField = () => {
    if (formValue.udfFields.length < 5) {
      const nextAvailableUdf = getNextAvailableUdf();
      setFormValue({
        ...formValue,
        udfFields: [...formValue.udfFields, { key: nextAvailableUdf, value: '' }]
      });
    } else {
      toast.error('You can only add up to 5 UDF fields.');
    }
  };

  const getNextAvailableUdf = () => {
    for (let i = 1; i <= 5; i++) {
      if (!formValue.udfFields.some(field => field.key === `udf${i}`)) {
        return `udf${i}`;
      }
    }
    return null;
  };

  const removeUdfField = (index) => {
    const updatedUdfs = formValue.udfFields.filter((_, i) => i !== index);
    setFormValue({ ...formValue, udfFields: updatedUdfs });
  };

  // Updated handleFieldChange to take value directly and handle name separately
  const handleFieldChange = (value, name) => {
    setFormValue({ ...formValue, [name]: value });
  };

  const validateFormData = () => {
    const errors = {};
    if (!formValue.name) errors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formValue.email)) errors.email = 'Invalid email address';
    if (!/^[6-9]\d{9}$/.test(formValue.phone)) errors.phone = 'Invalid phone number';
    if (!formValue.productTitle) errors.productTitle = 'Product Title is required';
    if (!formValue.amount || !/^\d+\.\d{2}$/.test(formValue.amount)) errors.amount = 'Amount must be a valid number with two decimal places';
    return Object.keys(errors).length ? errors : null;
  };

  const generateLink = async () => {
    try {
      // Transform UDF fields into a flat structure
      const udfFields = formValue.udfFields.reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {});

      const formData = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        productTitle: formValue.productTitle,
        amount: formValue.amount,
        reference_id: formValue.reference_id,
        linkExpiry: formValue.linkExpiry,
        order_id: formValue.order_id,
        ...udfFields // Spread UDF fields here
      };

      // First API call to generate the payment link
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
    <>
      <Drawer backdrop={false} placement="right" open={open} onClose={onClose} size="sm">
        <Drawer.Header>
          <Drawer.Title>Payment Generation Link</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          { initialData && (
            <>
              <div className="mb-4">
                <Input type="hidden" name="order_id" value={formValue.order_id} onChange={(value) => handleFieldChange(value, 'order_id')} className="mt-1 block w-full" />
              </div>
            </>
          )}
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <Input
              name="name"
              value={formValue.name}
              onChange={(value) => handleFieldChange(value, 'name')}
              className="mt-1 block w-full"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <Input
              name="email"
              value={formValue.email}
              onChange={(value) => handleFieldChange(value, 'email')}
              className="mt-1 block w-full"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Phone:</label>
            <Input
              name="phone"
              value={formValue.phone}
              onChange={(value) => handleFieldChange(value, 'phone')}
              className="mt-1 block w-full"
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
          </div>

          {/* Product Title Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Product Title:</label>
            <Input
              name="productTitle"
              value={formValue.productTitle}
              onChange={(value) => handleFieldChange(value, 'productTitle')}
              className="mt-1 block w-full"
            />
            {errors.productTitle && <span className="text-red-500 text-sm">{errors.productTitle}</span>}
          </div>

          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Amount (Rs):</label>
            <Input
              name="amount"
              value={formValue.amount}
              onChange={(value) => handleFieldChange(value, 'amount')}
              className="mt-1 block w-full"
            />
            {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
          </div>

          {/* Conditionally render Reference ID and Expiry Date only in non-edit mode */}
          {!initialData && (
            <>
              {/* Reference ID Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Reference ID (Optional):</label>
                <Input
                  name="reference_id"
                  value={formValue.reference_id}
                  onChange={(value) => handleFieldChange(value, 'reference_id')}
                  className="mt-1 block w-full"
                />
              </div>

              {/* Link Expiry Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Link Expiry:</label>
                <Input
                  type="date"
                  name="linkExpiry"
                  value={formValue.linkExpiry}
                  onChange={(value) => handleFieldChange(value, 'linkExpiry')}
                  className="mt-1 block w-full"
                />
              </div>
            </>
          )}

          {/* Add Extra Fields Button */}
          <Button appearance="ghost" onClick={addUdfField}>Add Extra Fields</Button>
          {formValue.udfFields.map((field, index) => (
            <div key={index} className="flex items-center mt-4">
              <div className="flex-grow">
                <label className="block text-gray-700">{field.key}:</label>
                <Input
                  value={field.value}
                  onChange={(value) => {
                    const updatedFields = [...formValue.udfFields];
                    updatedFields[index].value = value;
                    setFormValue({ ...formValue, udfFields: updatedFields });
                  }}
                  className="mt-1 block w-full"
                />
              </div>
              <Button
                appearance="subtle"
                color="red"
                onClick={() => removeUdfField(index)}
                className="ml-4 mt-4"
              >
                Remove
              </Button>
            </div>
          ))}

          {/* Submit Button */}
          <div className="mt-6 text-right">
            <Button appearance="primary" onClick={handleSubmit}>Submit</Button>
          </div>

          {/* Display Payment Link, QR Code, and Copy Icon */}
          {paymentShortUrl && (
            <div className="mt-6">
              <Button appearance="subtle" onClick={() => copyToClipboard(paymentShortUrl)}>Copy Link</Button>
              {qrCode && (
                <div className="text-center mt-4">
                  <img src={qrCode} alt="QR Code" />
                </div>
              )}
            </div>
          )}
        </Drawer.Body>
      </Drawer>
    </>
  );
}

export default LinkGenerationForm;
