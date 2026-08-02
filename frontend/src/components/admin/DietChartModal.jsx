"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
    Apple,
    ClipboardCopy,
    Download,
    MoonStar,
    RotateCcw,
    Salad,
    Save,
    Sparkles,
    SunMedium,
    Utensils,
} from "lucide-react";
import { downloadDietChartPdf } from "../../lib/dietChartPdfClient";
import axios from "../../lib/axios";

const mealSections = [
    { key: "breakfast", label: "Breakfast", icon: SunMedium, hint: "Main morning meal." },
    { key: "midMorning", label: "Mid-Morning Snack", icon: Apple, hint: "Small snack between meals." },
    { key: "lunch", label: "Lunch", icon: Salad, hint: "Midday meal." },
    { key: "eveningSnack", label: "Evening Snack", icon: Sparkles, hint: "Controlled late-afternoon snack." },
    { key: "dinner", label: "Dinner", icon: Utensils, hint: "Evening meal." },
    { key: "bedtime", label: "Bedtime Routine", icon: MoonStar, hint: "Optional night guidance." },
];

const toNumber = (value) => Number.parseFloat(value) || 0;

const formatWeightChange = (startingWeight, lastWeight) => {
    if (!startingWeight || !lastWeight) return "N/A";
    const difference = lastWeight - startingWeight;
    return `${difference >= 0 ? "+" : ""}${difference.toFixed(1)} kg`;
};

const getBmiRange = (bmi) => {
    if (!bmi) return "unknown BMI";
    if (bmi < 18.5) return "underweight range";
    if (bmi < 25) return "healthy range";
    if (bmi < 30) return "overweight range";
    return "obesity range";
};

const getGoalFromRecord = (record) => {
    const bmi = toNumber(record?.bmi);

    if (bmi && bmi < 18.5) return "Healthy weight gain and strength support";
    if (bmi && bmi >= 25) return "Fat-loss support with portion control";
    return "Maintenance with balanced nutrition";
};

const getHydrationTarget = (record) => {
    const water = toNumber(record?.waterIntake);
    return Math.max(water || 0, 2.5);
};

const formatChartDate = (record) => {
    const date = record?.createdAt ? new Date(record.createdAt) : new Date();
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const createDraftChart = (record, userName) => {
    const startWeight = toNumber(record?.startingWeight || record?.weight);
    const currentWeight = toNumber(record?.lastWeight || record?.weight);
    const bmi = toNumber(record?.bmi);
    const hydrationTarget = getHydrationTarget(record);

    return {
        clientName: userName || "User",
        bmi: bmi ? bmi.toFixed(1) : "N/A",
        bmiRange: getBmiRange(bmi),
        weightChange: formatWeightChange(startWeight, currentWeight),
        hydrationTarget: `${hydrationTarget.toFixed(1)} L/day`,
        goal: getGoalFromRecord(record),
        breakfast: "",
        midMorning: "",
        lunch: "",
        eveningSnack: "",
        dinner: "",
        bedtime: "",
        quickSummary: "",
        focusAreas: "",
        recommendedFoods: "",
        foodsToLimit: "",
        notes: "",
    };
};

const splitLines = (value) =>
    String(value || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

const formatChartForCopy = (record, chart) => {
    const lines = [
        `Diet Chart for ${chart.clientName}`,
        `Date: ${formatChartDate(record)}`,
        `BMI: ${chart.bmi}`,
        `Goal: ${chart.goal}`,
        `Weight Change: ${chart.weightChange}`,
        `Water Target: ${chart.hydrationTarget}`,
        "",
        "Breakfast:",
        chart.breakfast,
        "",
        "Mid-Morning Snack:",
        chart.midMorning,
        "",
        "Lunch:",
        chart.lunch,
        "",
        "Evening Snack:",
        chart.eveningSnack,
        "",
        "Dinner:",
        chart.dinner,
        "",
        "Bedtime Routine:",
        chart.bedtime,
        "",
        "Focus Areas:",
        ...splitLines(chart.focusAreas).map((item) => `- ${item}`),
        "",
        "Recommended Foods:",
        ...splitLines(chart.recommendedFoods).map((item) => `- ${item}`),
        "",
        "Foods to Limit:",
        ...splitLines(chart.foodsToLimit).map((item) => `- ${item}`),
        "",
        "Notes:",
        chart.notes,
    ];

    return lines.join("\n");
};

const DietChartRow = ({ label, value }) => (
    <div className="rounded-lg border border-[#d4dde2] bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-[#5c778a]">{label}</p>
        <p className="mt-1 text-sm font-medium text-[#101518]">{value}</p>
    </div>
);

const DietChartModal = ({ isOpen, onClose, record, userName, userId }) => {
    const [chart, setChart] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [downloading, setDownloading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen || !record) return;
        const savedDraft = record.dietChart;
        setChart(
            savedDraft && typeof savedDraft === "object"
                ? { ...createDraftChart(record, userName), ...savedDraft }
                : createDraftChart(record, userName)
        );
        setStatusMessage(savedDraft ? "Loaded the previously saved draft." : "");
    }, [isOpen, record, userName]);

    if (!record) return null;

    const activeChart = chart || createDraftChart(record, userName);

    const saveDraft = async ({ silent = false } = {}) => {
        if (!userId || !record?._id) return null;
        if (!silent) {
            setSaving(true);
            setStatusMessage("Saving draft...");
        }
        try {
            await axios.patch(`/admin/update-diet-chart/${userId}/${record._id}`, {
                dietChart: activeChart,
            });
            record.dietChart = { ...activeChart };
            if (!silent) setStatusMessage("Draft saved.");
            return true;
        } catch (error) {
            console.error("Failed to save diet chart draft:", error);
            if (!silent) setStatusMessage("Could not save the draft. Please try again.");
            return false;
        } finally {
            if (!silent) setSaving(false);
        }
    };

    const handleOpenChange = (open) => {
        if (!open) {
            saveDraft({ silent: true });
        }
        onClose();
    };

    const handleFieldChange = (field, value) => {
        setChart((prev) => ({
            ...(prev || activeChart),
            [field]: value,
        }));
    };

    const handleGoalInput = (event) => {
        const value = event.currentTarget.textContent || "";
        setChart((prev) => ({
            ...(prev || activeChart),
            goal: value,
        }));
    };

    const handleReset = () => {
        setChart(createDraftChart(record, userName));
        setStatusMessage("Diet chart reset.");
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formatChartForCopy(record, activeChart));
            setStatusMessage("Diet chart copied to clipboard.");
        } catch (error) {
            setStatusMessage("Copy failed. Use the download button or try again.");
        }
    };

    const handleDownloadPdf = async () => {
        setDownloading(true);
        setStatusMessage("Preparing PDF...");
        try {
            const bytes = await downloadDietChartPdf({
                chart: activeChart,
                dateLabel: `Date: ${formatChartDate(record)}`,
            });
            setStatusMessage(`PDF downloaded (${Math.ceil(bytes / 1024)} KB).`);
        } catch (error) {
            console.error("Diet chart PDF generation failed:", error);
            setStatusMessage("Could not generate the PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-[92vw] w-full max-h-[92vh] overflow-y-auto bg-[#f7f5ef] border-[#d4dde2] p-0">
                <DialogHeader className="border-b border-[#d4dde2] bg-[#f3efe4] px-6 py-5">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-[#101518]">Diet Chart Builder</DialogTitle>
                            <DialogDescription className="text-[#5c778a]">
                                Build a diet chart from the user's current record.
                            </DialogDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={() => saveDraft({})} disabled={saving} className="cursor-pointer gap-2">
                                <Save className="h-4 w-4" />
                                {saving ? "Saving..." : "Save Draft"}
                            </Button>
                            <Button variant="outline" onClick={handleReset} className="cursor-pointer gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Reset Draft
                            </Button>
                            <Button variant="outline" onClick={handleCopy} className="cursor-pointer gap-2">
                                <ClipboardCopy className="h-4 w-4" />
                                Copy Chart
                            </Button>
                            <Button onClick={handleDownloadPdf} disabled={downloading} className="cursor-pointer gap-2 bg-green-700 text-white hover:bg-green-800">
                                <Download className="h-4 w-4" />
                                {downloading ? "Generating..." : "Download PDF"}
                            </Button>
                        </div>
                    </div>
                    {statusMessage && (
                        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm text-[#101518]">
                            {statusMessage}
                        </p>
                    )}
                </DialogHeader>

                <div className="grid gap-6 px-6 py-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <DietChartRow label="Client" value={activeChart.clientName} />
                            <DietChartRow label="BMI" value={activeChart.bmi} />
                            <DietChartRow label="Weight Change" value={activeChart.weightChange} />
                            <DietChartRow label="Water Target" value={activeChart.hydrationTarget} />
                        </div>

                        <div className="rounded-2xl border border-[#d4dde2] bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-wide text-[#5c778a]">Chart Goal</p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <div className="rounded-xl bg-[#f7f5ef] p-4">
                                    <p className="text-sm font-semibold text-[#101518]">Focus areas</p>
                                    <Textarea
                                        value={activeChart.focusAreas}
                                        onChange={(event) => handleFieldChange("focusAreas", event.target.value)}
                                        placeholder={`Use the record to describe priorities based on BMI ${activeChart.bmi}, weight trend ${activeChart.weightChange}, energy, digestion, sleep, cravings, exercise, and water intake.`}
                                        className="mt-2 min-h-[140px] border-[#d4dde2] bg-white text-sm text-[#101518]"
                                    />
                                </div>
                                <div className="rounded-xl bg-[#f7f5ef] p-4">
                                    <p className="text-sm font-semibold text-[#101518]">Recommended foods</p>
                                    <Textarea
                                        value={activeChart.recommendedFoods}
                                        onChange={(event) => handleFieldChange("recommendedFoods", event.target.value)}
                                        placeholder="List foods that fit the current record here."
                                        className="mt-2 min-h-[140px] border-[#d4dde2] bg-white text-sm text-[#101518]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {mealSections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <div key={section.key} className="rounded-2xl border border-[#d4dde2] bg-white p-5 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-[#101518]">{section.label}</h4>
                                                <p className="text-sm text-[#5c778a]">{section.hint}</p>
                                            </div>
                                        </div>
                                        <Textarea
                                            value={activeChart[section.key]}
                                            onChange={(event) => handleFieldChange(section.key, event.target.value)}
                                            placeholder={`Write the ${section.label.toLowerCase()} using the current record data.`}
                                            className="mt-4 min-h-[120px] border-[#d4dde2] bg-[#fafaf7] text-sm text-[#101518]"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-[#d4dde2] bg-white p-5 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#101518]">Quick summary</h3>
                            <Textarea
                                value={activeChart.quickSummary}
                                onChange={(event) => handleFieldChange("quickSummary", event.target.value)}
                                placeholder={`Write the summary using the record data, such as BMI ${activeChart.bmi}, weight change ${activeChart.weightChange}, and hydration target ${activeChart.hydrationTarget}.`}
                                className="mt-4 min-h-[140px] border-[#d4dde2] bg-[#fafaf7] text-sm text-[#101518]"
                            />
                        </div>

                        <div className="rounded-2xl border border-[#d4dde2] bg-white p-5 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#101518]">Foods to limit</h3>
                            <Textarea
                                value={activeChart.foodsToLimit}
                                onChange={(event) => handleFieldChange("foodsToLimit", event.target.value)}
                                placeholder={`List foods to limit using the record data, such as items that do not suit BMI ${activeChart.bmi}, digestion, cravings, energy, or sleep pattern.`}
                                className="mt-4 min-h-[140px] border-[#d4dde2] bg-[#fafaf7] text-sm text-[#101518]"
                            />
                        </div>

                        <div className="rounded-2xl border border-[#d4dde2] bg-white p-5 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#101518]">Notes</h3>
                            <Textarea
                                value={activeChart.notes}
                                onChange={(event) => handleFieldChange("notes", event.target.value)}
                                placeholder={`Add record-specific notes here using BMI ${activeChart.bmi}, weight change ${activeChart.weightChange}, and water target ${activeChart.hydrationTarget}.`}
                                className="mt-4 min-h-[160px] border-[#d4dde2] bg-[#fafaf7] text-sm text-[#101518]"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DietChartModal;
