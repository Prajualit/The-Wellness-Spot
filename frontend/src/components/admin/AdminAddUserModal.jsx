import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "../../lib/axios";
import { sendOTP, confirmOTP } from "@/firebase/otp.js";

const AdminAddUserModal = ({ isOpen, onClose, onAdd, existingPhones = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    const cleanValue = field === 'phone'
      ? value.replace(/\D/g, '').slice(0, 10)
      : value;

    setFormData(prev => ({
      ...prev,
      [field]: cleanValue
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOtpChange = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleanValue);

    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: ''
      }));
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    return /^[6-9]\d{9}$/.test(phoneNumber);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name (at least 2 characters)';
    }

    if (!formData.phone || !validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    } else {
      const fullPhone = `+91${formData.phone}`;
      if (existingPhones.includes(fullPhone)) {
        newErrors.phone = 'User with this phone number already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetRecaptcha = () => {
    if (typeof window === 'undefined') return;
    delete window.recaptchaVerifier;
    delete window.recaptchaWidgetId;
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSendingOtp(true);
    try {
      resetRecaptcha();
      const fullPhone = `+91${formData.phone}`;
      const result = await sendOTP(fullPhone);

      if (!result) {
        throw new Error('Failed to send OTP. Please try again.');
      }

      setConfirmationResult(result);
      setIsOtpSent(true);
      setErrors({});
    } catch (error) {
      console.error('Error sending OTP:', error);
      let message = 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number. Please check and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many OTP requests. Please try again later.';
      } else if (error.message) {
        message = error.message;
      }
      setErrors({ general: message });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp || !/^\d{6}$/.test(otp)) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    if (!confirmationResult) {
      setErrors({ general: 'Please request OTP first' });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await confirmOTP(confirmationResult, otp);

      if (!result || !result.user) {
        throw new Error('OTP verification failed');
      }

      const response = await axios.post('/admin/add-user', {
        name: formData.name.trim(),
        phone: formData.phone,
      });

      if (response.data.success) {
        onAdd && onAdd();
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error adding user:', error);

      if (error.response?.status === 409) {
        setErrors({
          general: error.response.data?.message || 'User with this phone number already exists.'
        });
      } else if (error.code === 'auth/invalid-verification-code') {
        setErrors({ otp: 'Invalid OTP. Please check and try again.' });
      } else {
        setErrors({
          general: error.response?.data?.message || 'Failed to add user. Please try again.'
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: ''
    });
    setOtp('');
    setConfirmationResult(null);
    setIsOtpSent(false);
    setErrors({});
    resetRecaptcha();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-medium mt-5 text-black">
            Add New User
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Verify the phone number with OTP before adding the user
          </DialogDescription>
        </DialogHeader>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">{errors.general}</p>
          </div>
        )}

        {/* Step 1: User Information + Send OTP */}
        {!isOtpSent && (
          <form onSubmit={handleSendOTP} className="space-y-6 mt-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-4">User Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Full Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter user's full name"
                    disabled={isSendingOtp}
                    className={`bg-white border-gray-300 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Phone Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      +91
                    </span>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      disabled={isSendingOtp}
                      maxLength={10}
                      className="bg-white border-gray-300 rounded-l-none"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isSendingOtp}
                className="px-6 bg-green-700 hover:bg-green-800 cursor-pointer text-white w-[50%]"
              >
                {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSendingOtp}
                className="px-6 cursor-pointer w-[50%]"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {isOtpSent && (
          <form onSubmit={handleVerifyOTP} className="space-y-6 mt-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Verify OTP</h3>
              <p className="text-sm text-gray-600 mb-4">
                OTP sent to +91{formData.phone}
              </p>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Enter OTP *</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  disabled={isVerifying}
                  maxLength={6}
                  className={`bg-white border-gray-300 ${errors.otp ? 'border-red-500' : ''}`}
                />
                {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isVerifying || !otp || otp.length < 6}
                className="px-6 bg-green-700 hover:bg-green-800 cursor-pointer text-white w-[50%]"
              >
                {isVerifying ? 'Adding User...' : 'Verify & Add User'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setErrors({});
                  setIsOtpSent(false);
                  setOtp('');
                  setConfirmationResult(null);
                  resetRecaptcha();
                }}
                disabled={isVerifying}
                className="px-6 cursor-pointer w-[50%]"
              >
                Back
              </Button>
            </div>
          </form>
        )}

        <div id="recaptcha-container" />
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddUserModal;
