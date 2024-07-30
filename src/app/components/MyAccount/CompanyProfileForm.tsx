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
    is_email_verified?: boolean;
    company_phone?: string;
    is_phone_verified?: boolean;
    company_address1?: string;
    is_company__address_verified?: boolean;
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
  c_logoError: string,
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
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,  // Handle file input
    }));
  
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
        const data = await apiRequest('GET', '/city-state-pincode', { pincode });
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
    } else if (!/^(\+?[0-9]{1,5})?([7-9][0-9]{9})$/.test(formData.company_phone)) {
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

  const submitCompanyForm = async () => {
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key as keyof typeof formData] as any);
        });
  
        const response = await apiRequest('POST', '/v1/merchant/update-company-profile', formDataToSend);
        if (response.StatusCode === '1') {
          toast.success('Company profile updated successfully');
          window.location.reload();
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
    <form action="/my-account" method="post" id="frmCreateCompanyProfile">
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
              type="email"
              name="company_email"
              placeholder="Company Email"
              id="company_email"
              data-field="email"
              className="form-control"
              value={formData.company_email || ''}
              onChange={handleInputChange}
            />
            <p id="c_emailError" className="text-danger">{errors.c_emailError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Phone No. *</label>
            <input
              type="text"
              name="company_phone"
              id="company_phone"
              placeholder="Company Phone No."
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
                  alt="company logo"
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
              id="company_pincode"
              placeholder="Pin Code"
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
              placeholder="City"
              id="company_city"
              data-field="city"
              className="form-control"
              value={formData.city || ''}
              readOnly
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
              placeholder="State"
              id="company_state"
              data-field="state"
              className="form-control"
              value={formData.state || ''}
              readOnly
            />
            <p id="c_stateError" className="text-danger">{errors.c_stateError}</p>
          </div>
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
            className="btn btn-success btn-block companyFormBtn"
            type="button"
            value="Next"
            onClick={submitCompanyForm}
          />
        </div>
      </div>
    </form>
  );
};

export default CompanyProfileForm;