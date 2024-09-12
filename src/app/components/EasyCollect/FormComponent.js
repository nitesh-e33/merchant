import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from 'rsuite';

function FormComponent({ initialData, onSubmit }) {
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    phone: '',
    item_name: '',
    amount: '',
    reference_id: '',
    linkExpiry: '',
    udfFields: [],
    order_id: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill form if initialData is provided
  useEffect(() => {
    if (initialData) {
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
        item_name: initialData.orders.item_name || '',
        amount: initialData.amount || '',
        reference_id: initialData.reference_id || '',
        linkExpiry: initialData.expiry_date || '',
        udfFields: prefilledUdfs || [],
        order_id: initialData.order_id || '',
      });
    }
  }, [initialData]);

  // Set default expiry date to +5 days
  useEffect(() => {
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 5);
    const formattedDate = defaultExpiryDate.toISOString().split('T')[0];
    setFormValue(prevFormValue => ({
      ...prevFormValue,
      linkExpiry: formattedDate,
    }));
  }, []);

  const handleFieldChange = (value, name) => {
    setFormValue({ ...formValue, [name]: value });
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

  const validateFormData = () => {
    const errors = {};
    if (!formValue.name) errors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formValue.email)) errors.email = 'Invalid email address';
    if (!/^[6-9]\d{9}$/.test(formValue.phone)) errors.phone = 'Invalid phone number';
    if (!formValue.item_name) errors.item_name = 'Product Title is required';
    if (!formValue.amount || !/^\d+\.\d{2}$/.test(formValue.amount)) errors.amount = 'Amount must be a valid number with two decimal places';
    return Object.keys(errors).length ? errors : null;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const formErrors = validateFormData();
    if (formErrors) {
      setErrors(formErrors);
      setIsSubmitting(false);
    } else {
      onSubmit(formValue);
    }
  };

  return (
    <>
      <div>
        {/* Name Field */}
        <div className="mb-4">
          <label>Name:</label>
          <Input
            name="name"
            value={formValue.name}
            onChange={(value) => handleFieldChange(value, 'name')}
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
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
            name="item_name"
            value={formValue.item_name}
            onChange={(value) => handleFieldChange(value, 'item_name')}
            className="mt-1 block w-full"
          />
          {errors.item_name && <span className="text-red-500 text-sm">{errors.item_name}</span>}
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
            <div className="mb-4">
              <label className="block text-gray-700">Reference ID (Optional):</label>
              <Input
                name="reference_id"
                value={formValue.reference_id}
                onChange={(value) => handleFieldChange(value, 'reference_id')}
                className="mt-1 block w-full"
              />
            </div>

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

          <div className="mt-6 text-right">
            <Button appearance="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitted' : 'Submit'}
            </Button>
          </div>
      </div>
    </>
  );
}

export default FormComponent;
