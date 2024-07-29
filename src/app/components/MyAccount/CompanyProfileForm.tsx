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
    company_logo?: string;
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'pincode') {
      handlePincodeInput(value);
    } else {
      // validateForm();
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

  const submitCompanyForm = () => {
    // Your form submission logic here
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