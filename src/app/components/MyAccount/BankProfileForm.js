import { apiRequest } from '@/app/lib/apiHelper';
import { API_ASSET_URL } from '@/app/lib/constant';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const BankProfileForm = ({ userId, companyId, bankId, bankData }) => {
  const [accountHolderName, setAccountHolderName] = useState(bankData.ac_holder_name || '');
  const [accountNumber, setAccountNumber] = useState(bankData.account_number || '');
  const [ifscCode, setIfscCode] = useState(bankData.bank_ifsc_code || '');
  const [bankName, setBankName] = useState(bankData.bank_name || '');
  const [branchName, setBranchName] = useState(bankData.bank_branch_name || '');
  const [bankProof, setBankProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    bankProof: '',
  });

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!accountHolderName) {
      newErrors.accountHolderName = 'Account Holder Name is required.';
      isValid = false;
    } else {
      const alphabetRegex = /^[a-zA-Z\s!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;
      if (!alphabetRegex.test(accountHolderName)) {
        newErrors.accountHolderName = 'Account Holder Name must contain only alphabets and allowed characters.';
        isValid = false;
      }
    }

    if (!accountNumber) {
      newErrors.accountNumber = 'Account Number is required.';
      isValid = false;
    }

    if (!ifscCode) {
      newErrors.ifscCode = 'IFSC Code is required.';
      isValid = false;
    } else {
      const ifscRegex = /^[A-Z]{4}0\d{6}$/;
      if (!ifscRegex.test(ifscCode)) {
        newErrors.ifscCode = 'Invalid IFSC Code format.';
        isValid = false;
      }
    }

    if (!bankName) {
      newErrors.bankName = 'Bank Name is required.';
      isValid = false;
    }

    if (!branchName) {
      newErrors.branchName = 'Branch Name is required.';
      isValid = false;
    }

    if (bankProof) {
      if (!['image/png', 'image/jpeg', 'image/webp', 'application/pdf'].includes(bankProof.type)) {
        newErrors.bankProof = 'File type must be png, jpg, jpeg, webp, or pdf';
        isValid = false;
      } else if (bankProof.size > 500 * 1024) {
        newErrors.bankProof = 'File size exceeds 500KB.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitBankForm = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('merchant_user_id', userId);
    formData.append('company_id', companyId);
    formData.append('user_account_id', bankId);
    formData.append('ac_holder_name', accountHolderName);
    formData.append('account_number', accountNumber);
    formData.append('bank_ifsc_code', ifscCode);
    formData.append('bank_name', bankName);
    formData.append('bank_branch_name', branchName);
    if (bankProof) formData.append('bank_proof', bankProof);

    const endpoint = bankId ? '/v1/merchant/update-bank-account' : '/v1/merchant/add-bank-account';
    const profileKey = `merchantProfile_${userId}`;
    localStorage.removeItem(profileKey);
    const response = await apiRequest('POST', endpoint, {
      post: formData,
    });
    if (response.StatusCode === '1') { 
      toast.success('Bank profile updated successfully');
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
  };

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      setBankProof(event.target.files[0]);
    }
  };

  return (
    <form action="" method="post" id="frmCreateBankProfile">
      <input type="hidden" name="merchant_user_id" id="merchant_user_id" value={userId} />
      <input type="hidden" name="company_id" id="company_id" value={companyId} />
      <input type="hidden" name="user_account_id" id="user_account_id" value={bankId} />
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>Account Holder Name *</label>
            <input
              type="text"
              name="ac_holder_name"
              id="acc_holder_name"
              placeholder="Account Holder Name"
              className="form-control"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              readOnly={bankData.is_verified === 'yes'}
            />
            <p id="acc_holder_nameError" className="text-danger">{errors.accountHolderName}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Account Number *</label>
            <input
              type="text"
              name="account_number"
              id="account_number"
              placeholder="Account Number"
              className="form-control"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              readOnly={bankData.is_verified === 'yes'}
            />
            <p id="accNumberError" className="text-danger">{errors.accountNumber}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>IFSC Code *</label>
            <input
              type="text"
              name="bank_ifsc_code"
              id="ifsc_code"
              placeholder="IFSC Code"
              className="form-control"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              readOnly={bankData.is_verified === 'yes'}
            />
            <p id="ifscCodeError" className="text-danger">{errors.ifscCode}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Bank Name *</label>
            <input
              type="text"
              name="bank_name"
              id="bank_name"
              placeholder="Bank Name"
              className="form-control"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              readOnly={bankData.is_verified === 'yes'}
            />
            <p id="bankNameError" className="text-danger">{errors.bankName}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Branch Name *</label>
            <input
              type="text"
              name="bank_branch_name"
              id="branch_name"
              placeholder="Branch Name"
              className="form-control"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              readOnly={bankData.is_verified === 'yes'}
            />
            <p id="branchNameError" className="text-danger">{errors.branchName}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Bank Proof</label>
            {bankData.bank_proof && (
              <a
                href={`${API_ASSET_URL}${bankData.bank_proof}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                Uploaded File
              </a>
            )}
            <input
              type="file"
              name="bank_proof"
              id="bank_proof"
              className="form-control"
              onChange={handleFileChange}
            />
            <p id="bank_proofError" className="text-danger">{errors.bankProof}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2 col-sm-offset-8">
          <a className="btn btn-info btn-block btnCancel" href="/my-account">
            Cancel
          </a>
        </div>
        {bankData.is_verified === 'no' && (
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-success btn-block"
              onClick={submitBankForm}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default BankProfileForm;
