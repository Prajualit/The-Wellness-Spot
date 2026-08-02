import { buildDietChartPdf } from "./dietChartPdf.mjs";
import TemplatePdfUrl from "../app/assets/templates/Green and Beige Simple Diet Planner Document.pdf";
import MontserratRegularUrl from "../app/assets/fonts/Montserrat-Regular.ttf";
import MontserratSemiBoldUrl from "../app/assets/fonts/Montserrat-SemiBold.ttf";
import MontserratBoldUrl from "../app/assets/fonts/Montserrat-Bold.ttf";

const fetchBytes = (url) => fetch(url).then((response) => response.arrayBuffer());

export const generateDietChartPdf = async ({ chart, dateLabel }) => {
    const [templateBuffer, regularFontBuffer, semiboldFontBuffer, boldFontBuffer] =
        await Promise.all([
            fetchBytes(TemplatePdfUrl),
            fetchBytes(MontserratRegularUrl),
            fetchBytes(MontserratSemiBoldUrl),
            fetchBytes(MontserratBoldUrl),
        ]);

    return buildDietChartPdf({
        templateBytes: new Uint8Array(templateBuffer),
        regularFontBytes: new Uint8Array(regularFontBuffer),
        semiboldFontBytes: new Uint8Array(semiboldFontBuffer),
        boldFontBytes: new Uint8Array(boldFontBuffer),
        chart,
        dateLabel,
    });
};

const safeFileName = (name) =>
    String(name || "Client")
        .replace(/[^\w\- ]+/g, "")
        .trim()
        .replace(/\s+/g, "-");

export const downloadDietChartPdf = async ({ chart, dateLabel }) => {
    const bytes = await generateDietChartPdf({ chart, dateLabel });
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Diet-Chart-${safeFileName(chart.clientName)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return bytes.length;
};
