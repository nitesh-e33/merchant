import { API_ASSET_URL } from '@/app/lib/constant';
import React, { useState } from 'react';

interface BankProfileFormProps {
  userId: string;
  companyId: string;
  bankId: string;
  bankData: {
    ac_holder_name?: string;
    account_number?: string;
    bank_ifsc_code?: string;
    bank_name?: string;
    bank_branch_name?: string;
    bank_proof?: string;
    is_verified?: string;
  };
}

const BankProfileForm: React.FC<BankProfileFormProps> = ({
  userId,
  companyId,
  bankId,
  bankData,
}) => {
  const [accountHolderName, setAccountHolderName] = useState(bankData.ac_holder_name || '');
  const [accountNumber, setAccountNumber] = useState(bankData.account_number || '');
  const [ifscCode, setIfscCode] = useState(bankData.bank_ifsc_code || '');
  const [bankName, setBankName] = useState(bankData.bank_name || '');
  const [branchName, setBranchName] = useState(bankData.bank_branch_name || '');

  const submitBankForm = () => {
    // Your form submission logic here
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
              // readOnly={bankData.is_verified === 'yes'}
            />
            <p id="acc_holder_nameError" className="text-danger"></p>
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
            <p id="accNumberError" className="text-danger"></p>
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
            <p id="ifscCodeError" className="text-danger"></p>
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
            <p id="bankNameError" className="text-danger"></p>
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
            <p id="branchNameError" className="text-danger"></p>
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
            <input type="file" name="bank_proof" id="bank_proof" className="form-control" />
            <p id="bank_proofError" className="text-danger"></p>
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
            <input
              className="btn btn-success btn-block bankFormBtn"
              type="button"
              value="Next"
              onClick={submitBankForm}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default BankProfileForm;
