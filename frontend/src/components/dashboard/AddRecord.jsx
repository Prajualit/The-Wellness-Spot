import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/Slice/userSlice.js";
import axios from "@/lib/axios.js";



const AddRecord = () => {
    const [file, setFile] = useState(null);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    const handleSubmitBMIdata = async () => {
        try {
            const response = await axios.post('/users/add-record', {
                weight: weight,
                height: height,
            });

            if (response.status === 200) {
                alert("Record added successfully!");
                dispatch(updateUser({ weight: response.data.data.weight, height: response.data.data.height }));
                setWeight('');
                setHeight('');
            } else {
                alert("Failed to add record: " + response.data.message);
            }
        } catch (error) {
            console.error("Error adding record:", error);
            alert("An error occurred while adding the record.");
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer bg-[#eaeef1] text-[#101518] hover:bg-black hover:text-white duration-300 h-10 rounded-xl px-4 ">
                    <span className="text-sm">
                        Add Record
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-white h-fit w-[40%]">
                <DialogDescription className="text-sm text-neutral-500">
                    <Card className="w-full border-none shadow-none ">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">
                                Add a New Record
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="phone" className="w-full">
                                <TabsContent value="phone">
                                    <form className="space-y-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="Weight">Weight</Label>
                                            <Input
                                                id="weight"
                                                type="text"
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
                                                type="text"
                                                placeholder="Enter your height (cm)"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button className="w-full" type="submit">Add Record</Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default AddRecord;
