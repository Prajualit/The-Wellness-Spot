import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import axios from "../../lib/axios";

const AdminAddRecordModal = ({ isOpen, onClose, userName, userId, onUpdate }) => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    startingWeight: '',
    lastWeight: '',
    energy: '',
    digestion: '',
    sleepQuality: '',
    stressLevel: '',
    snackingHabit: '',
    sugarSaltCravings: '',
    exercise: '',
    waterIntake: '',
    medicineHistory: ''
  });

  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      age: 'Age',
      height: 'Height',
      startingWeight: 'Starting Weight',
      lastWeight: 'Current Weight',
      energy: 'Energy Level',
      digestion: 'Digestion',
      sleepQuality: 'Sleep Quality',
      stressLevel: 'Stress Level',
      snackingHabit: 'Snacking Habit',
      sugarSaltCravings: 'Sugar/Salt Cravings',
      exercise: 'Exercise',
      waterIntake: 'Water Intake'
    };

    Object.keys(requiredFields).forEach(field => {
      if (!formData[field] || formData[field] === '') {
        newErrors[field] = `${requiredFields[field]} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setErrors({});

    // Validate form before submission
    if (!validateForm()) {
      setIsAdding(false);
      return;
    }

    try {
      const response = await axios.post(`/admin/add-user-record/${userId}`, formData);
      
      if (response.data.success) {
        onUpdate && onUpdate(); // Refresh the data
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error adding record:', error);
      
      // Handle specific validation errors from backend
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Validation failed';
        if (errorMessage.includes('All required fields must be provided')) {
          setErrors({
            general: 'Please fill in all required fields. Make sure no field is left empty.'
          });
        } else {
          setErrors({
            general: errorMessage
          });
        }
      } else {
        setErrors({
          general: 'Failed to add record. Please try again.'
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setFormData({
      age: '',
      height: '',
      startingWeight: '',
      lastWeight: '',
      energy: '',
      digestion: '',
      sleepQuality: '',
      stressLevel: '',
      snackingHabit: '',
      sugarSaltCravings: '',
      exercise: '',
      waterIntake: '',
      medicineHistory: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[70%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-medium mt-5 text-black">
            Add New Health Record
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Add new health record for {userName || 'User'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Age (years) *</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className={`bg-white border-gray-300 ${errors.age ? 'border-red-500' : ''}`}
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Height (cm) *</label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="Enter height in cm"
                  min="50"
                  max="250"
                  className={`bg-white border-gray-300 ${errors.height ? 'border-red-500' : ''}`}
                />
                {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-4">Physical Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Starting Weight (kg) *</label>
                <Input
                  type="number"
                  value={formData.startingWeight}
                  onChange={(e) => handleChange('startingWeight', e.target.value)}
                  placeholder="Enter starting weight"
                  min="10"
                  max="300"
                  step="0.1"
                  className={`bg-white border-gray-300 ${errors.startingWeight ? 'border-red-500' : ''}`}
                />
                {errors.startingWeight && <p className="text-red-500 text-xs mt-1">{errors.startingWeight}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Current Weight (kg) *</label>
                <Input
                  type="number"
                  value={formData.lastWeight}
                  onChange={(e) => handleChange('lastWeight', e.target.value)}
                  placeholder="Enter current weight"
                  min="10"
                  max="300"
                  step="0.1"
                  className={`bg-white border-gray-300 ${errors.lastWeight ? 'border-red-500' : ''}`}
                />
                {errors.lastWeight && <p className="text-red-500 text-xs mt-1">{errors.lastWeight}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Water Intake (liters) *</label>
                <Input
                  type="number"
                  value={formData.waterIntake}
                  onChange={(e) => handleChange('waterIntake', e.target.value)}
                  placeholder="Enter daily water intake"
                  min="0"
                  max="10"
                  step="0.1"
                  className={`bg-white border-gray-300 ${errors.waterIntake ? 'border-red-500' : ''}`}
                />
                {errors.waterIntake && <p className="text-red-500 text-xs mt-1">{errors.waterIntake}</p>}
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-4">Health Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Energy Level *</label>
                <Select onValueChange={(value) => handleChange('energy', value)} value={formData.energy}>
                  <SelectTrigger className={`bg-white border-gray-300 ${errors.energy ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select energy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Very High">Very High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.energy && <p className="text-red-500 text-xs mt-1">{errors.energy}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Digestion *</label>
                <Select onValueChange={(value) => handleChange('digestion', value)} value={formData.digestion}>
                  <SelectTrigger className={`bg-white border-gray-300 ${errors.digestion ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select digestion quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.digestion && <p className="text-red-500 text-xs mt-1">{errors.digestion}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Sleep Quality *</label>
                <Select onValueChange={(value) => handleChange('sleepQuality', value)} value={formData.sleepQuality}>
                  <SelectTrigger className={`bg-white border-gray-300 ${errors.sleepQuality ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select sleep quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sleepQuality && <p className="text-red-500 text-xs mt-1">{errors.sleepQuality}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Stress Level *</label>
                <Select onValueChange={(value) => handleChange('stressLevel', value)} value={formData.stressLevel}>
                  <SelectTrigger className={`bg-white border-gray-300 ${errors.stressLevel ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select stress level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very Low">Very Low</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Very High">Very High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stressLevel && <p className="text-red-500 text-xs mt-1">{errors.stressLevel}</p>}
              </div>
            </div>
          </div>

          {/* Lifestyle Habits */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-4">Lifestyle Habits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Snacking Habit *</label>
                <Select onValueChange={(value) => handleChange('snackingHabit', value)} value={formData.snackingHabit}>
                  <SelectTrigger className={`bg-white border-gray-300 ${errors.snackingHabit ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select snacking frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Never</SelectItem>
                    <SelectItem value="Rarely">Rarely</SelectItem>
                    <SelectItem value="Sometimes">Sometimes</SelectItem>
                    <SelectItem value="Often">Often</SelectItem>
                    <SelectItem value="Very Often">Very Often</SelectItem>
                  </SelectContent>
                </Select>
                {errors.snackingHabit && <p className="text-red-500 text-xs mt-1">{errors.snackingHabit}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Sugar/Salt Cravings *</label>
                <Select onValueChange={(value) => handleChange('sugarSaltCravings', value)} value={formData.sugarSaltCravings}>
                  <SelectTrigger className={`bg-white border-gray-300 ${errors.sugarSaltCravings ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select craving intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Strong">Strong</SelectItem>
                    <SelectItem value="Very Strong">Very Strong</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sugarSaltCravings && <p className="text-red-500 text-xs mt-1">{errors.sugarSaltCravings}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-2">Exercise *</label>
                <Select onValueChange={(value) => handleChange('exercise', value)} value={formData.exercise}>
                  <SelectTrigger className={`bg-white border-gray-300 ${errors.exercise ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select exercise level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Intense">Intense</SelectItem>
                    <SelectItem value="Very Intense">Very Intense</SelectItem>
                  </SelectContent>
                </Select>
                {errors.exercise && <p className="text-red-500 text-xs mt-1">{errors.exercise}</p>}
              </div>
            </div>
          </div>

          {/* Medicine History */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-4">Medicine History</h3>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Medicine History</label>
              <Textarea
                value={formData.medicineHistory}
                onChange={(e) => handleChange('medicineHistory', e.target.value)}
                placeholder="Enter medicine history (current medications, allergies, previous treatments, etc.)"
                rows={3}
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isAdding}
              className="px-6 bg-green-700 hover:bg-green-800 cursor-pointer text-white w-[50%]"
            >
              {isAdding ? 'Adding Record...' : 'Add Record'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isAdding}
              className="px-6 cursor-pointer w-[50%] "
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddRecordModal;
