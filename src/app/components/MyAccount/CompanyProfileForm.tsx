import { API_ASSET_URL } from '@/app/lib/constant';
import React from 'react';

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

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ userId, companyId, bankId, companyData, entityList }) => {
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
              defaultValue={companyData.company_name || ''}
            />
            <p id="c_nameError" className="text-danger"></p>
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
              defaultValue={companyData.company_alias_name || ''}
            />
            <p id="aliasNameError" className="text-danger"></p>
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
              defaultValue={companyData.host_name || ''}
            />
            <p id="hostNameError" className="text-danger"></p>
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
              defaultValue={companyData.company_email || ''}
            />
            <p id="c_emailError" className="text-danger"></p>
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
              defaultValue={companyData.company_phone || ''}
            />
            <p id="c_phoneError" className="text-danger"></p>
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
              defaultValue={companyData.company_address1 || ''}
            />
            <p id="c_address1Error" className="text-danger"></p>
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
              defaultValue={companyData.company_address2 || ''}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Logo</label>
            {companyData.company_logo && (
              <a
                href={`${API_ASSET_URL}${companyData.company_logo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${API_ASSET_URL}${companyData.company_logo}`}
                  alt="company logo"
                  width="30px"
                  height="30px"
                />
              </a>
            )}
            <input type="file" name="company_logo" id="company_logo" className="form-control" />
            <p id="c_logoError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Entity Business Type *</label>
            <select name="entity_type" id="entity_type" className="form-control">
              <option value="">--Select Entity Type--</option>
              {entityList.map((entity) => (
                <option
                  key={entity.id}
                  value={entity.id}
                  selected={entity.id === companyData.entity_type}
                >
                  {entity.entity_name}
                </option>
              ))}
            </select>
            <p id="entityTypeError" className="text-danger"></p>
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
              defaultValue={companyData.pincode || ''}
            />
            <p id="c_pincodeError" className="text-danger"></p>
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
              defaultValue={companyData.city || ''}
              readOnly
            />
            <p id="c_cityError" className="text-danger"></p>
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
              defaultValue={companyData.state || ''}
              readOnly
            />
            <p id="c_stateError" className="text-danger"></p>
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
