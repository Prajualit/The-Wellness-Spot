import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/Slice/userSlice.js";
import axios from "@/lib/axios.js";
import LoadingButton from "@/components/ui/LoadingButton.jsx";


const AddRecord = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [pending, setPending] = useState(false);

    const dispatch = useDispatch();

    const handleSubmitBMIdata = async (e) => {
        try {
            setPending(true);
            const response = await axios.post('/users/add-record', {
                weight,
                height,
                age,
            });

            if (response.status === 200) {
                console.log("Record added successfully:", response.data);
                const { newRecord, allRecords } = response.data.data;
                dispatch(updateUser({ records: allRecords }));
                setWeight('');
                setHeight('');
                setAge('');
            } else {
                console.log("Failed to add record: " + response.data.message);
            }
        } catch (error) {
            console.error("Error adding record:", error);
        } finally {
            setPending(false);
        }
    };



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer bg-[#eaeef1] text-[#101518] hover:bg-[#435c30] hover:text-white duration-300 h-10 rounded-xl px-4 ">
                    <span className="text-sm">
                        Add Record
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-white h-fit w-[40%]">
                <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
                <div className="text-sm text-neutral-500">
                    <Card className="w-full border-none shadow-none ">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">
                                Add a New Record
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="phone" className="w-full">
                                <TabsContent value="phone">
                                    <form className="space-y-4" onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmitBMIdata();
                                    }}>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="Weight">Weight</Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                placeholder="Enter your weight (K/G)"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="height">Height</Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                placeholder="Enter your height (cm)"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="age">Age</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="Enter your age"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <LoadingButton
                                            type="submit"
                                            pending={pending}
                                            className="w-full">
                                            Add Record
                                        </LoadingButton>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddRecord;
