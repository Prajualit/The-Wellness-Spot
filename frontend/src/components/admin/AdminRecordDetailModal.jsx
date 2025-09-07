import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

const AdminRecordDetailModal = ({ isOpen, onClose, record, userName }) => {
    if (!record) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const DetailItem = ({ label, value, className = "" }) => (
        <div className={`flex justify-between items-center py-2 border-b border-gray-200 ${className}`}>
            <span className="font-medium text-black">{label}:</span>
            <span className="text-black font-light">{value}</span>
        </div>
    );

    const getColorForValue = (value, type) => {
        const colorMaps = {
            energy: {
                'Low': 'text-red-600 bg-red-50',
                'Moderate': 'text-yellow-600 bg-yellow-50',
                'High': 'text-green-600 bg-green-50',
                'Very High': 'text-blue-600 bg-blue-50'
            },
            quality: {
                'Poor': 'text-red-600 bg-red-50',
                'Fair': 'text-yellow-600 bg-yellow-50',
                'Good': 'text-green-600 bg-green-50',
                'Excellent': 'text-blue-600 bg-blue-50'
            },
            frequency: {
                'Never': 'text-green-600 bg-green-50',
                'Rarely': 'text-blue-600 bg-blue-50',
                'Sometimes': 'text-yellow-600 bg-yellow-50',
                'Often': 'text-orange-600 bg-orange-50',
                'Very Often': 'text-red-600 bg-red-50'
            },
            intensity: {
                'None': 'text-green-600 bg-green-50',
                'Very Low': 'text-green-600 bg-green-50',
                'Light': 'text-blue-600 bg-blue-50',
                'Mild': 'text-blue-600 bg-blue-50',
                'Low': 'text-blue-600 bg-blue-50',
                'Moderate': 'text-yellow-600 bg-yellow-50',
                'Strong': 'text-orange-600 bg-orange-50',
                'High': 'text-orange-600 bg-orange-50',
                'Intense': 'text-red-600 bg-red-50',
                'Very High': 'text-red-600 bg-red-50',
                'Very Strong': 'text-red-600 bg-red-50',
                'Very Intense': 'text-red-600 bg-red-50'
            }
        };

        return colorMaps[type]?.[value] || 'text-gray-600 bg-gray-50';
    };

    const StatusBadge = ({ value, type }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorForValue(value, type)}`}>
            {value}
        </span>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[60%] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-medium mt-5 text-black">
                        Health Record Details
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Complete health assessment record for {userName || 'User'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Basic Information */}
                    <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-black mb-3">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Name" value={userName || 'User'} />
                            <DetailItem label="Age" value={`${record.age} years`} />
                            <DetailItem label="Height" value={`${record.height} cm`} />
                            <DetailItem label="Date Recorded" value={formatDate(record.createdAt)} />
                        </div>
                    </div>

                    {/* Weight & BMI */}
                    <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-black mb-3">Weight & BMI</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Starting Weight" value={`${record.startingWeight || record.weight} kg`} />
                            <DetailItem label="Current Weight" value={`${record.lastWeight || record.weight} kg`} />
                            <DetailItem label="BMI" value={record.bmi} />
                            <DetailItem
                                label="Weight Change"
                                value={record.startingWeight && record.lastWeight
                                    ? `${(record.lastWeight - record.startingWeight) >= 0 ? '+' : ''}${(record.lastWeight - record.startingWeight).toFixed(1)} kg`
                                    : 'N/A'
                                }
                            />
                        </div>
                    </div>

                    {/* Health Metrics */}
                    {(record.energy || record.digestion || record.sleepQuality || record.stressLevel) && (
                        <div className="bg-neutral-50 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold text-black mb-3">Health Metrics</h3>
                            <div className="space-y-3">
                                {record.energy && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-black">Energy Level:</span>
                                        <StatusBadge value={record.energy} type="energy" />
                                    </div>
                                )}
                                {record.digestion && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-black">Digestion:</span>
                                        <StatusBadge value={record.digestion} type="quality" />
                                    </div>
                                )}
                                {record.sleepQuality && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-black">Sleep Quality:</span>
                                        <StatusBadge value={record.sleepQuality} type="quality" />
                                    </div>
                                )}
                                {record.stressLevel && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-black">Stress Level:</span>
                                        <StatusBadge value={record.stressLevel} type="intensity" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Lifestyle Habits */}
                    {(record.snackingHabit || record.sugarSaltCravings || record.exercise || record.waterIntake) && (
                        <div className="bg-neutral-50 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold text-black mb-3">Lifestyle Habits</h3>
                            <div className="space-y-3">
                                {record.snackingHabit && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-black">Snacking Habit:</span>
                                        <StatusBadge value={record.snackingHabit} type="frequency" />
                                    </div>
                                )}
                                {record.sugarSaltCravings && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-black">Sugar/Salt Cravings:</span>
                                        <StatusBadge value={record.sugarSaltCravings} type="intensity" />
                                    </div>
                                )}
                                {record.exercise && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-black">Exercise:</span>
                                        <StatusBadge value={record.exercise} type="intensity" />
                                    </div>
                                )}
                                {record.waterIntake && (
                                    <DetailItem label="Water Intake" value={`${record.waterIntake} liters`} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Medicine History */}
                    {record.medicineHistory && (
                        <div className="bg-neutral-50 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold text-black mb-3">Medicine History</h3>
                            <div className="bg-white p-3 rounded border">
                                <p className="text-black">{record.medicineHistory}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AdminRecordDetailModal;
