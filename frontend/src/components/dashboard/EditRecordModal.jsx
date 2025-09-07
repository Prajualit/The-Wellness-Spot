import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/Slice/userSlice.js";
import axios from "@/lib/axios.js";
import LoadingButton from "@/components/ui/LoadingButton.jsx";

const EditRecordModal = ({ isOpen, onClose, record }) => {
    const [formData, setFormData] = useState({
        age: '',
        height: '',
        startingWeight: '',
        lastWeight: '',
        energy: '',
        digestion: '',
        sleepQuality: '',
        snackingHabit: '',
        sugarSaltCravings: '',
        medicineHistory: '',
        waterIntake: '',
        exercise: '',
        stressLevel: ''
    });
    const [pending, setPending] = useState(false);
    const dispatch = useDispatch();

    // Populate form when record changes
    useEffect(() => {
        if (record) {
            setFormData({
                age: record.age || '',
                height: record.height || '',
                startingWeight: record.startingWeight || record.weight || '',
                lastWeight: record.lastWeight || record.weight || '',
                energy: record.energy || '',
                digestion: record.digestion || '',
                sleepQuality: record.sleepQuality || '',
                snackingHabit: record.snackingHabit || '',
                sugarSaltCravings: record.sugarSaltCravings || '',
                medicineHistory: record.medicineHistory || '',
                waterIntake: record.waterIntake || '',
                exercise: record.exercise || '',
                stressLevel: record.stressLevel || ''
            });
        }
    }, [record]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            setPending(true);
            const response = await axios.put(`/users/update-record/${record._id}`, formData);

            if (response.status === 200) {
                const { updatedUser } = response.data.data;
                dispatch(updateUser(updatedUser));
                onClose();
            }
        } catch (error) {
            console.error('Error updating record:', error);
        } finally {
            setPending(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset form to original values
        if (record) {
            setFormData({
                age: record.age || '',
                height: record.height || '',
                startingWeight: record.startingWeight || record.weight || '',
                lastWeight: record.lastWeight || record.weight || '',
                energy: record.energy || '',
                digestion: record.digestion || '',
                sleepQuality: record.sleepQuality || '',
                snackingHabit: record.snackingHabit || '',
                sugarSaltCravings: record.sugarSaltCravings || '',
                medicineHistory: record.medicineHistory || '',
                waterIntake: record.waterIntake || '',
                exercise: record.exercise || '',
                stressLevel: record.stressLevel || ''
            });
        }
    };

    if (!record) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white h-fit w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-semibold">
                        Edit Health Record
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Update your health measurements and lifestyle information
                    </DialogDescription>
                </DialogHeader>

                <div className="text-sm text-neutral-500">
                    <Card className="w-full border-none shadow-none">
                        <CardContent className="pt-6">
                            <form className="space-y-6" onSubmit={handleSubmitEdit}>
                                {/* Basic Information */}
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="age">Age</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="Enter your age"
                                                value={formData.age}
                                                onChange={(e) => handleInputChange('age', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Measurements */}
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Physical Measurements</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="height">Height (cm)</Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                placeholder="Enter height in cm"
                                                value={formData.height}
                                                onChange={(e) => handleInputChange('height', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="startingWeight">Starting Weight (kg)</Label>
                                            <Input
                                                id="startingWeight"
                                                type="number"
                                                step="0.1"
                                                placeholder="Enter starting weight"
                                                value={formData.startingWeight}
                                                onChange={(e) => handleInputChange('startingWeight', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="lastWeight">Current Weight (kg)</Label>
                                            <Input
                                                id="lastWeight"
                                                type="number"
                                                step="0.1"
                                                placeholder="Enter current weight"
                                                value={formData.lastWeight}
                                                onChange={(e) => handleInputChange('lastWeight', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Health Metrics */}
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Health Metrics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="energy">Energy Level</Label>
                                            <Select value={formData.energy} onValueChange={(value) => handleInputChange('energy', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select energy level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Low">Low</SelectItem>
                                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                                    <SelectItem value="High">High</SelectItem>
                                                    <SelectItem value="Very High">Very High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="digestion">Digestion</Label>
                                            <Select value={formData.digestion} onValueChange={(value) => handleInputChange('digestion', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select digestion quality" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Poor">Poor</SelectItem>
                                                    <SelectItem value="Fair">Fair</SelectItem>
                                                    <SelectItem value="Good">Good</SelectItem>
                                                    <SelectItem value="Excellent">Excellent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="sleepQuality">Sleep Quality</Label>
                                            <Select value={formData.sleepQuality} onValueChange={(value) => handleInputChange('sleepQuality', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select sleep quality" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Poor">Poor</SelectItem>
                                                    <SelectItem value="Fair">Fair</SelectItem>
                                                    <SelectItem value="Good">Good</SelectItem>
                                                    <SelectItem value="Excellent">Excellent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="stressLevel">Stress Level</Label>
                                            <Select value={formData.stressLevel} onValueChange={(value) => handleInputChange('stressLevel', value)}>
                                                <SelectTrigger>
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
                                        </div>
                                    </div>
                                </div>

                                {/* Lifestyle Habits */}
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Lifestyle Habits</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="snackingHabit">Snacking Habit</Label>
                                            <Select value={formData.snackingHabit} onValueChange={(value) => handleInputChange('snackingHabit', value)}>
                                                <SelectTrigger>
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
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="sugarSaltCravings">Sugar/Salt Cravings</Label>
                                            <Select value={formData.sugarSaltCravings} onValueChange={(value) => handleInputChange('sugarSaltCravings', value)}>
                                                <SelectTrigger>
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
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="exercise">Exercise</Label>
                                            <Select value={formData.exercise} onValueChange={(value) => handleInputChange('exercise', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select exercise intensity" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="None">None</SelectItem>
                                                    <SelectItem value="Light">Light</SelectItem>
                                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                                    <SelectItem value="Intense">Intense</SelectItem>
                                                    <SelectItem value="Very Intense">Very Intense</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="waterIntake">Water Intake (Liters)</Label>
                                            <Input
                                                id="waterIntake"
                                                type="number"
                                                step="0.1"
                                                placeholder="Enter daily water intake"
                                                value={formData.waterIntake}
                                                onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Medicine History */}
                                <div className="bg-neutral-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Medicine History</h3>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="medicineHistory">Current Medications & History</Label>
                                        <Textarea
                                            id="medicineHistory"
                                            placeholder="Enter current medications, supplements, or relevant medical history..."
                                            value={formData.medicineHistory}
                                            onChange={(e) => handleInputChange('medicineHistory', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <LoadingButton
                                        type="submit"
                                        pending={pending}
                                        className="flex-1 bg-green-600 hover:bg-green-700 hover:text-white "
                                    >
                                        Update Record
                                    </LoadingButton>
                                    <LoadingButton
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 bg-neutral-50 hover:bg-neutral-200 text-black"
                                    >
                                        Cancel
                                    </LoadingButton>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditRecordModal;
