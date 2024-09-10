import { useState } from 'react';
import { toast } from 'react-toastify';
import { Drawer, Button, Input } from 'rsuite';

function LinkGenerationForm({ open, onClose }) {
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    phone: '',
    productTitle: '',
    amount: '',
    reference_id: '',
    linkExpiry: '',
    udfFields: []
  });
  const [errors, setErrors] = useState({});

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
      if (!formValue.udfFields.some(field => field.key === `UDF${i}`)) {
        return `UDF${i}`;
      }
    }
    return null;
  };

  const removeUdfField = (index) => {
    const updatedUdfs = formValue.udfFields.filter((_, i) => i !== index);
    setFormValue({ ...formValue, udfFields: updatedUdfs });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
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

  const generateLink = () => {
    // Add the logic to generate the payment link
  };

  return (
    <>
      <Drawer placement="right" open={open} onClose={onClose} size="sm">
        <Drawer.Header>
          <Drawer.Title>Payment Generation Link</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="form-group">
            <label>Name:</label>
            <Input name="name" value={formValue.name} onChange={handleFieldChange} />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <Input name="email" value={formValue.email} onChange={handleFieldChange} />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <Input name="phone" value={formValue.phone} onChange={handleFieldChange} />
            {errors.phone && <span className="text-danger">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Product Title:</label>
            <Input name="productTitle" value={formValue.productTitle} onChange={handleFieldChange} />
            {errors.productTitle && <span className="text-danger">{errors.productTitle}</span>}
          </div>

          <div className="form-group">
            <label>Amount (Rs):</label>
            <Input name="amount" value={formValue.amount} onChange={handleFieldChange} />
            {errors.amount && <span className="text-danger">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label>Reference ID (Optional):</label>
            <Input name="reference_id" value={formValue.reference_id} onChange={handleFieldChange} />
          </div>

          <div className="form-group">
            <label>Link Expiry:</label>
            <Input type="date" name="linkExpiry" value={formValue.linkExpiry} onChange={handleFieldChange} />
          </div>

          <Button appearance="ghost" onClick={addUdfField}>Add Extra Fields</Button>
          {formValue.udfFields.map((field, index) => (
            <div key={index} className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flexGrow: 1 }}>
                <label>{field.key}:</label>
                <Input value={field.value} onChange={(e) => {
                  const updatedFields = [...formValue.udfFields];
                  updatedFields[index].value = e.target.value;
                  setFormValue({ ...formValue, udfFields: updatedFields });
                }} />
              </div>
              <Button
                appearance="subtle"
                color="red"
                onClick={() => removeUdfField(index)}
                style={{ marginLeft: '10px', flexShrink: 0 }}
              >
                Remove
              </Button>
            </div>
          ))}

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Button appearance="primary" onClick={handleSubmit}>Submit</Button>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
}

export default LinkGenerationForm;
