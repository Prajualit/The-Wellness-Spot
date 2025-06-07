import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const ViewRecord = ({ records, userName }) => {
    const Thead = ['Date', 'BMI', 'Weight', 'Height', 'Age'];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                    View Records
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-white w-[80%] min-h-[50%] max-h-[90vh] overflow-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                        {userName ? `${userName}'s Records` : 'User Records'}
                    </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-neutral-500">
                    <Card className="w-full border-none shadow-none">
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            {Thead.map((item, index) => (
                                                <th
                                                    key={index}
                                                    className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal border-b"
                                                >
                                                    {item}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!records || records.length === 0 ? (
                                            <tr className="border-t border-t-[#d4dde2]">
                                                <td
                                                    colSpan={5}
                                                    className="text-center w-full text-[#5c778a] text-sm font-normal leading-normal py-8"
                                                >
                                                    No records found for this user.
                                                </td>
                                            </tr>
                                        ) : (
                                            records.map((item) => {
                                                const itemList = [
                                                    item?.createdAt
                                                        ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })
                                                        : 'N/A',
                                                    item.bmi || 'N/A',
                                                    item.weight ? `${item.weight} kg` : 'N/A',
                                                    item.height ? `${item.height} cm` : 'N/A',
                                                    item.age || 'N/A'
                                                ];

                                                return (
                                                    <tr
                                                        key={item._id}
                                                        className="border-t border-t-[#d4dde2]"
                                                    >
                                                        {itemList.map((value, index) => (
                                                            <td
                                                                key={`${item._id}-${index}`}
                                                                className="px-4 py-3 text-[#5c778a] text-sm font-normal leading-normal"
                                                            >
                                                                {value}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewRecord;