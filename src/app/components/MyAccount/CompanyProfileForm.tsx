import { apiRequest } from '@/app/lib/apiHelper';
import { API_ASSET_URL } from '@/app/lib/constant';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface CompanyProfileFormProps {
  userId: string;
  companyId: string;
  bankId: string;
  companyData: {
    company_name?: string;
    company_alias_name?: string;
    host_name?: string;
    company_email?: string;
    company_phone?: string;
    company_address1?: string;
    company_address2?: string;
    company_logo?: string | File;
    entity_type?: string;
    pincode?: string;
    city?: string;
    state?: string;
  };
  entityList: {
    id: string;
    entity_name: string;
  }[];
}

interface Errors {
  c_nameError: string;
  hostNameError: string;
  aliasNameError: string;
  c_emailError: string;
  c_phoneError: string;
  c_address1Error: string;
  c_logoError: string;
  entityTypeError: string;
  c_pincodeError: string;
  c_cityError: string;
  c_stateError: string;
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  userId,
  companyId,
  bankId,
  companyData,
  entityList,
}) => {
  const [formData, setFormData] = useState(companyData);

  const [errors, setErrors] = useState<Errors>({
    c_nameError: '',
    hostNameError: '',
    aliasNameError: '',
    c_emailError: '',
    c_phoneError: '',
    c_address1Error: '',
    c_logoError: '',
    entityTypeError: '',
    c_pincodeError: '',
    c_cityError: '',
    c_stateError: '',
  });

  useEffect(() => {
    setFormData(companyData);
  }, [companyData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target;

    if (name === 'company_logo') {
      if (files && files.length > 0) {
        const file = files[0];
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const fileSize = file.size;

        // Validate file type and size
        if (!['jpg', 'png', 'jpeg', 'webp'].includes(ext)) {
          setErrors(prevErrors => ({
            ...prevErrors,
            c_logoError: 'File type must be png, jpg, jpeg, or webp',
          }));
        } else if (fileSize > 300 * 1024) {
          setErrors(prevErrors => ({
            ...prevErrors,
            c_logoError: 'File size must be less than 300KB',
          }));
        } else {
          // File is valid
          setErrors(prevErrors => ({
            ...prevErrors,
            c_logoError: '',
          }));
          setFormData(prevData => ({
            ...prevData,
            company_logo: file,
          }));
        }
      } else {
        // Handle no file selected
        setErrors(prevErrors => ({
          ...prevErrors,
          c_logoError: '',
        }));
        setFormData(prevData => ({
          ...prevData,
          company_logo: '',
        }));
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  
    if (name === 'pincode') {
      handlePincodeInput(value);
    }
  };

  const handlePincodeInput = async (pincode: string) => {
    if (/^\d{6}$/.test(pincode)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        c_pincodeError: '',
      }));

      try {
        const data = await apiRequest('GET', '/city-state-pincode', {get: {pincode} });
        if (data.StatusCode === '1') {
          setFormData((prevData) => ({
            ...prevData,
            city: data.Result.city.city_name,
            state: data.Result.state.state_name,
          }));
        } else {
          if (data.redirect) {
            window.location.href = data.redirect;
          } else if (data.Result) {
            toast.error(data.Result);
          } else {
            console.error('Something went wrong. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error fetching city and state:', error);
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        c_pincodeError: 'Pincode should be 6 digits.',
      }));
      setFormData((prevData) => ({
        ...prevData,
        city: '',
        state: '',
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      c_nameError: '',
      hostNameError: '',
      aliasNameError: '',
      c_emailError: '',
      c_phoneError: '',
      c_address1Error: '',
      c_logoError: '',
      entityTypeError: '',
      c_pincodeError: '',
      c_cityError: '',
      c_stateError: '',
    };

    // Validate company name
    if (!formData.company_name) {
      newErrors.c_nameError = 'Company name is required';
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.company_name)) {
      newErrors.c_nameError = 'Company name should contain only alphabets';
      valid = false;
    }

    // Validate alias name
    if (!formData.company_alias_name) {
      newErrors.aliasNameError = 'Alias name is required';
      valid = false;
    }

    // Validate host name
    if (!formData.host_name) {
      newErrors.hostNameError = 'Host name is required';
      valid = false;
    }

    // Validate email
    if (!formData.company_email) {
      newErrors.c_emailError = 'Email is required';
      valid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(formData.company_email)) {
      newErrors.c_emailError = 'Invalid email format';
      valid = false;
    }

    // Validate phone
    if (!formData.company_phone) {
      newErrors.c_phoneError = 'Phone number is required';
      valid = false;
    } else if (!/^(\+?[0-9]{1,5})?([6-9][0-9]{9})$/.test(formData.company_phone)) {
      newErrors.c_phoneError = 'Invalid phone number';
      valid = false;
    }

    // Validate address 1
    if (!formData.company_address1) {
      newErrors.c_address1Error = 'Address is required';
      valid = false;
    }

    // Validate entity type
    if (!formData.entity_type) {
      newErrors.entityTypeError = 'Entity type is required';
      valid = false;
    }

    // Validate pincode
    if (!formData.pincode) {
      newErrors.c_pincodeError = 'Pincode is required';
      valid = false;
    }

    // Validate city
    if (!formData.city) {
      newErrors.c_cityError = 'City is required';
      valid = false;
    }

    // Validate state
    if (!formData.state) {
      newErrors.c_stateError = 'State is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const generateFilename = (file?: File) => {
    if (file) {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000) + 1;
      const originalName = file.name.replace(/\s+/g, '');
      const newFilename = `${timestamp}-${randomNum}-${originalName}`;
      const path = `/var/www/html/droompay/merchant/droom-pay/merchant/public/uploads/temp//${newFilename}`;
      return path;
    }
    return null;
  };

  const submitCompanyForm = async () => {
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();

        // Append only the required fields
        formDataToSend.append('company_name', formData.company_name || '');
        formDataToSend.append('company_alias_name', formData.company_alias_name || '');
        formDataToSend.append('host_name', formData.host_name || '');
        formDataToSend.append('company_email', formData.company_email || '');
        formDataToSend.append('company_phone', formData.company_phone || '');
        formDataToSend.append('company_address1', formData.company_address1 || '');
        formDataToSend.append('company_address2', formData.company_address2 || '');
        // Append company_logo only if it's a file
        if (formData.company_logo instanceof File) {
          formDataToSend.append('company_logo', formData.company_logo);
        }
        formDataToSend.append('entity_type', formData.entity_type || '');
        formDataToSend.append('pincode', formData.pincode || '');
        formDataToSend.append('city', formData.city || '');
        formDataToSend.append('state', formData.state || '');

        formDataToSend.append('merchant_user_id', userId);
        formDataToSend.append('company_id', companyId);
        formDataToSend.append('user_account_id', bankId);

        const response = await apiRequest('POST', '/v1/merchant/update-company-profile', {
          post: formDataToSend,
          files: formData.company_logo instanceof File ? { company_logo: generateFilename(formData.company_logo) } : undefined
        });
        if (response.StatusCode === '1') {
          toast.success('Company profile updated successfully');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          if (response.Result) {
            toast.error(response.Result);
          } else {
            toast.error('Something went wrong. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error saving company profile:', error);
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <form action="/my-account" encType='multipart/form-data' method="post" id="frmCreateCompanyProfile">
      <input type="hidden" name="merchant_user_id" value={userId} />
      <input type="hidden" name="company_id" value={companyId} />
      <input type="hidden" name="user_account_id" value={bankId} />
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              placeholder="Company Name"
              className="form-control"
              value={formData.company_name || ''}
              onChange={handleInputChange}
            />
            <p id="c_nameError" className="text-danger">{errors.c_nameError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Alias Name *</label>
            <input
              type="text"
              name="company_alias_name"
              id="company_alias_name"
              placeholder="Company Alias Name"
              className="form-control"
              value={formData.company_alias_name || ''}
              onChange={handleInputChange}
            />
            <p id="aliasNameError" className="text-danger">{errors.aliasNameError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Host Name *</label>
            <input
              type="text"
              name="host_name"
              id="host_name"
              placeholder="Host Name"
              className="form-control"
              value={formData.host_name || ''}
              onChange={handleInputChange}
            />
            <p id="hostNameError" className="text-danger">{errors.hostNameError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Email *</label>
            <input
              type="text"
              name="company_email"
              id="company_email"
              placeholder="Company Email"
              className="form-control"
              value={formData.company_email || ''}
              onChange={handleInputChange}
            />
            <p id="c_emailError" className="text-danger">{errors.c_emailError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Phone *</label>
            <input
              type="text"
              name="company_phone"
              id="company_phone"
              placeholder="Company Phone"
              className="form-control"
              value={formData.company_phone || ''}
              onChange={handleInputChange}
            />
            <p id="c_phoneError" className="text-danger">{errors.c_phoneError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Address 1 *</label>
            <input
              type="text"
              name="company_address1"
              id="company_address1"
              placeholder="Company Address 1"
              className="form-control"
              value={formData.company_address1 || ''}
              onChange={handleInputChange}
            />
            <p id="c_address1Error" className="text-danger">{errors.c_address1Error}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Address 2</label>
            <input
              type="text"
              name="company_address2"
              id="company_address2"
              placeholder="Company Address 2"
              className="form-control"
              value={formData.company_address2 || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Logo</label>
            {formData.company_logo && (
              <a
                href={`${API_ASSET_URL}${formData.company_logo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${API_ASSET_URL}${formData.company_logo}`}
                  alt="company_logo"
                  width="30px"
                  height="30px"
                />
              </a>
            )}
            <input
              type="file"
              name="company_logo"
              id="company_logo"
              className="form-control"
              onChange={handleInputChange}
            />
            <p id="c_logoError" className="text-danger">{errors.c_logoError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Entity Business Type *</label>
            <select
              name="entity_type"
              id="entity_type"
              className="form-control"
              value={formData.entity_type || ''}
              onChange={handleInputChange}
            >
              <option value="">--Select Entity Type--</option>
              {entityList.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.entity_name}
                </option>
              ))}
            </select>
            <p id="entityTypeError" className="text-danger">{errors.entityTypeError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              placeholder="Pincode"
              className="form-control"
              value={formData.pincode || ''}
              onChange={handleInputChange}
            />
            <p id="c_pincodeError" className="text-danger">{errors.c_pincodeError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City"
              className="form-control"
              value={formData.city || ''}
              onChange={handleInputChange}
              disabled
            />
            <p id="c_cityError" className="text-danger">{errors.c_cityError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              id="state"
              placeholder="State"
              className="form-control"
              value={formData.state || ''}
              onChange={handleInputChange}
              disabled
            />
            <p id="c_stateError" className="text-danger">{errors.c_stateError}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2 col-sm-offset-8">
            <a className="btn btn-info btn-block btnCancel" href="/my-account">
              Cancel
            </a>
          </div>
          <div className="col-sm-2">
            <input
              className="btn btn-success btn-block updateUserProfile"
              type="button"
              value="Next"
              onClick={submitCompanyForm}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CompanyProfileForm;