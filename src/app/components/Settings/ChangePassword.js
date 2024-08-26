import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from '@/app/lib/apiHelper';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function ChangePassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  const [errors, setErrors] = useState({
    oldPasswordError: '',
    newPasswordError: '',
    confirmNewPasswordError: '',
  });

  const [passwordVisible, setPasswordVisible] = useState({
    old_password: false,
    new_password: false,
    confirm_new_password: false,
  });

  const togglePasswordVisibility = (fieldId) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [fieldId]: !prevState[fieldId],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [`${name}Error`]: '',
    });
  };

  const validateForm = () => {
    let isValid = true;
    let tempErrors = {};

    if (!formData.old_password) {
      tempErrors.oldPasswordError = 'Old password is required.';
      isValid = false;
    } else if (formData.old_password.length < 6 || formData.old_password.length > 20) {
      tempErrors.oldPasswordError = 'Old password must be between 6 to 20 characters.';
      isValid = false;
    }

    if (!formData.new_password) {
      tempErrors.newPasswordError = 'New password is required.';
      isValid = false;
    } else if (formData.new_password.length < 6 || formData.new_password.length > 20) {
      tempErrors.newPasswordError = 'New password must be between 6 to 20 characters.';
      isValid = false;
    }

    if (!formData.confirm_new_password) {
      tempErrors.confirmNewPasswordError = 'Confirmation password is required.';
      isValid = false;
    } else if (formData.new_password !== formData.confirm_new_password) {
      tempErrors.confirmNewPasswordError = 'New password and confirmation password do not match.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };  

  const changePassword = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      const requestData = {
        old_password: formData.old_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.confirm_new_password,
      };

      try {
        const response = await apiRequest('POST', '/v1/merchant/change-password', { post: requestData });
        if (response.StatusCode == '1') {
          localStorage.removeItem('user');
          toast.success(response.Message);
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setIsSubmitting(false);
          if (response.Result) {
            toast.error(response.Result);
          } else {
            toast.error('Something went wrong. Please try again later.');
          }
        }
      } catch (error) {
        setIsSubmitting(false);
        console.error('Error changing password:', error);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Change Password</h3>
      </div>
      <div className="card-body">
        <form id="frmChangePassword">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Old Password *</label>
                <div className="input-group">
                  <input
                    type={passwordVisible.old_password ? 'text' : 'password'}
                    name="old_password"
                    id="old_password"
                    placeholder="Old Password"
                    className="form-control"
                    value={formData.old_password}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" onClick={() => togglePasswordVisibility('old_password')}>
                      <FontAwesomeIcon icon={passwordVisible.old_password ? faEyeSlash : faEye} />
                    </span>
                  </div>
                </div>
                <p className="text-danger">{errors.oldPasswordError}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>New Password *</label>
                <div className="input-group">
                  <input
                    type={passwordVisible.new_password ? 'text' : 'password'}
                    name="new_password"
                    id="new_password"
                    placeholder="New Password"
                    className="form-control"
                    value={formData.new_password}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" onClick={() => togglePasswordVisibility('new_password')}>
                      <FontAwesomeIcon icon={passwordVisible.new_password ? faEyeSlash : faEye} />
                    </span>
                  </div>
                </div>
                <p className="text-danger">{errors.newPasswordError}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Confirm New Password *</label>
                <div className="input-group">
                  <input
                    type={passwordVisible.confirm_new_password ? 'text' : 'password'}
                    name="confirm_new_password"
                    id="confirm_new_password"
                    placeholder="Confirm New Password"
                    className="form-control"
                    value={formData.confirm_new_password}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" onClick={() => togglePasswordVisibility('confirm_new_password')}>
                      <FontAwesomeIcon icon={passwordVisible.confirm_new_password ? faEyeSlash : faEye} />
                    </span>
                  </div>
                </div>
                <p className="text-danger">{errors.confirmNewPasswordError}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-2">
              <input
                className="btn btn-success btn-block change-password"
                type="button"
                value="Confirm"
                onClick={changePassword}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
