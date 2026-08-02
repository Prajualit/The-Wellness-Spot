import {
    PDFDocument,
    rgb,
    pushGraphicsState,
    popGraphicsState,
    setFillingRgbColor,
    setStrokingRgbColor,
    setLineWidth,
    moveTo,
    lineTo,
    appendQuadraticCurve,
    closePath,
    rectangle,
    fill,
    fillAndStroke,
    clip,
    endPath,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export const PAGE_WIDTH = 595.5;
export const PAGE_HEIGHT = 842.25;

const MARGIN_X = 52;
const CONTENT_LEFT = MARGIN_X;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BOTTOM_MARGIN = 55;

const CORNER_RADIUS = 6;
const ACCENT_BAR_WIDTH = 3.5;

const FIRST_PAGE_CONTENT_TOP = 646;
const CONTINUATION_CONTENT_TOP = 770;

const CARD_PADDING = 12;
const SECTION_GAP = 12;
const BODY_SIZE = 10.5;
const BODY_LINE_HEIGHT = 14.8;
const TITLE_SIZE = 12.5;

const COLORS = {
    ink: rgb(0.063, 0.082, 0.094),
    muted: rgb(0.361, 0.467, 0.541),
    deepGreen: rgb(0.153, 0.278, 0.125),
    deepGreenTitle: rgb(0.098, 0.314, 0.176),
    accent: rgb(0.569, 0.667, 0.424),
    cardBorder: rgb(0.796, 0.855, 0.702),
    divider: rgb(0.804, 0.851, 0.722),
    cardFill: rgb(1, 1, 1),
};

const roundedRectOps = (x, y, width, height, radius) => {
    const r = Math.min(radius, width / 2, height / 2);
    const x0 = x;
    const x1 = x + r;
    const x2 = x + width - r;
    const x3 = x + width;
    const y0 = y;
    const y1 = y + r;
    const y2 = y + height - r;
    const y3 = y + height;
    return [
        moveTo(x1, y0),
        lineTo(x2, y0),
        appendQuadraticCurve(x3, y0, x3, y1),
        lineTo(x3, y2),
        appendQuadraticCurve(x3, y3, x2, y3),
        lineTo(x1, y3),
        appendQuadraticCurve(x0, y3, x0, y2),
        lineTo(x0, y1),
        appendQuadraticCurve(x0, y0, x1, y0),
        closePath(),
    ];
};

const drawRoundedRect = ({
    page,
    x,
    y,
    width,
    height,
    radius,
    fillColor,
    borderColor,
    borderWidth,
}) => {
    page.pushOperators(
        pushGraphicsState(),
        setFillingRgbColor(fillColor.red, fillColor.green, fillColor.blue),
        setStrokingRgbColor(borderColor.red, borderColor.green, borderColor.blue),
        setLineWidth(borderWidth),
        ...roundedRectOps(x, y, width, height, radius),
        fillAndStroke(),
        popGraphicsState()
    );
};

const drawAccentBar = ({
    page,
    x,
    y,
    width,
    height,
    radius,
    barWidth,
    accentColor,
}) => {
    page.pushOperators(
        pushGraphicsState(),
        ...roundedRectOps(x, y, width, height, radius),
        clip(),
        endPath(),
        setFillingRgbColor(accentColor.red, accentColor.green, accentColor.blue),
        rectangle(x, y, barWidth, height),
        fill(),
        popGraphicsState()
    );
};

const wrapParagraph = (text, font, size, maxWidth) => {
    const words = String(text).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
        const candidate = `${current} ${words[i]}`;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
            current = candidate;
        } else {
            lines.push(current);
            current = words[i];
        }
    }
    lines.push(current);
    return lines;
};

const wrapText = (text, font, size, maxWidth) => {
    const paragraphs = String(text || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    const lines = [];
    paragraphs.forEach((paragraph) => {
        lines.push(...wrapParagraph(paragraph, font, size, maxWidth));
    });
    if (!lines.length) return [""];
    return lines;
};

const computeSectionHeight = (title, bodyLines) => {
    const titleHeight = TITLE_SIZE * 1.45;
    const bodyHeight = bodyLines.length ? bodyLines.length * BODY_LINE_HEIGHT : 0;
    return CARD_PADDING * 2 + titleHeight + (bodyLines.length ? 5 + bodyHeight : 0);
};

const drawHeader = ({ page, chart, dateLabel, nameFont, dateFont }) => {
    const centerX = PAGE_WIDTH / 2;
    const clientName = String(chart.clientName || "Client");
    let nameSize = 19;
    while (
        nameSize > 12 &&
        nameFont.widthOfTextAtSize(clientName, nameSize) > CONTENT_WIDTH
    ) {
        nameSize -= 0.5;
    }
    page.drawText(clientName, {
        x: centerX - nameFont.widthOfTextAtSize(clientName, nameSize) / 2,
        y: 704,
        size: nameSize,
        font: nameFont,
        color: COLORS.deepGreen,
    });

    const dateText = String(dateLabel || "");
    const dateSize = 11.5;
    page.drawText(dateText, {
        x: centerX - dateFont.widthOfTextAtSize(dateText, dateSize) / 2,
        y: 681,
        size: dateSize,
        font: dateFont,
        color: COLORS.muted,
    });

    const dividerWidth = 140;
    page.drawLine({
        start: { x: centerX - dividerWidth / 2, y: 669 },
        end: { x: centerX + dividerWidth / 2, y: 669 },
        thickness: 1.2,
        color: COLORS.divider,
    });
};

const drawMetaCards = ({ page, top, items, labelFont, valueFont }) => {
    const gap = 10;
    const cardWidth = (CONTENT_WIDTH - gap * (items.length - 1)) / items.length;
    const cardHeight = 54;
    let x = CONTENT_LEFT;
    items.forEach((item) => {
        drawRoundedRect({
            page,
            x,
            y: top - cardHeight,
            width: cardWidth,
            height: cardHeight,
            radius: CORNER_RADIUS,
            fillColor: COLORS.cardFill,
            borderColor: COLORS.cardBorder,
            borderWidth: 1,
        });
        page.drawText(String(item.label).toUpperCase(), {
            x: x + 10,
            y: top - 17,
            size: 8.5,
            font: labelFont,
            color: COLORS.muted,
        });
        page.drawText(String(item.value || "N/A"), {
            x: x + 10,
            y: top - 34,
            size: 11.5,
            font: valueFont,
            color: COLORS.deepGreen,
        });
        x += cardWidth + gap;
    });
    return cardHeight + gap;
};

const drawSectionCard = ({ page, top, title, bodyLines, titleFont, bodyFont }) => {
    const titleHeight = TITLE_SIZE * 1.45;
    const bodyHeight = bodyLines.length ? bodyLines.length * BODY_LINE_HEIGHT : 0;
    const cardHeight =
        CARD_PADDING * 2 + titleHeight + (bodyLines.length ? 5 + bodyHeight : 0);
    const cardTop = top;
    const cardBottom = cardTop - cardHeight;
    const innerX = CONTENT_LEFT + CARD_PADDING + 4;

    drawRoundedRect({
        page,
        x: CONTENT_LEFT,
        y: cardBottom,
        width: CONTENT_WIDTH,
        height: cardHeight,
        radius: CORNER_RADIUS,
        fillColor: COLORS.cardFill,
        borderColor: COLORS.cardBorder,
        borderWidth: 1,
    });
    drawAccentBar({
        page,
        x: CONTENT_LEFT,
        y: cardBottom,
        width: CONTENT_WIDTH,
        height: cardHeight,
        radius: CORNER_RADIUS,
        barWidth: ACCENT_BAR_WIDTH,
        accentColor: COLORS.accent,
    });

    const titleBaseline = cardTop - CARD_PADDING - TITLE_SIZE * 0.72;
    page.drawText(String(title).toUpperCase(), {
        x: innerX,
        y: titleBaseline,
        size: TITLE_SIZE,
        font: titleFont,
        color: COLORS.deepGreenTitle,
    });

    if (bodyLines.length) {
        let baseline = titleBaseline - 7 - BODY_SIZE;
        bodyLines.forEach((line) => {
            page.drawText(line, {
                x: innerX,
                y: baseline,
                size: BODY_SIZE,
                font: bodyFont,
                color: COLORS.ink,
            });
            baseline -= BODY_LINE_HEIGHT;
        });
    }
    return cardHeight;
};

/**
 * Builds the final diet chart PDF.
 *
 * Layout:
 *  - Page 1 always uses the template's first page (logo + "DIET CHART" heading).
 *    Client name and the chart date are drawn just below the heading, then the
 *    meta cards and the chart sections follow.
 *  - Any overflow is drawn on fresh pages that always use the template's second
 *    page as their background.
 *
 * @param {Object} options
 * @param {Uint8Array} options.templateBytes - bytes of the 2-page template PDF
 * @param {Uint8Array} options.regularFontBytes - Montserrat Regular TTF bytes
 * @param {Uint8Array} options.semiboldFontBytes - Montserrat SemiBold TTF bytes
 * @param {Uint8Array} options.boldFontBytes - Montserrat Bold TTF bytes
 * @param {Object} options.chart - normalized diet chart object
 * @param {string} [options.dateLabel] - date string shown under the heading
 * @returns {Promise<Uint8Array>} the generated PDF bytes
 */
export const buildDietChartPdf = async ({
    templateBytes,
    regularFontBytes,
    semiboldFontBytes,
    boldFontBytes,
    chart,
    dateLabel,
}) => {
    const template = await PDFDocument.load(templateBytes);
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);

    const regularFont = await doc.embedFont(regularFontBytes, { subset: true });
    const semiboldFont = await doc.embedFont(semiboldFontBytes, { subset: true });
    const boldFont = await doc.embedFont(boldFontBytes, { subset: true });

    doc.setTitle(`Diet Chart - ${chart.clientName || "Client"}`);
    doc.setSubject("Personalized Diet Chart");
    doc.setCreator("The Wellness Spot");
    doc.setProducer("The Wellness Spot");

    const [templateFirstPage, templateSecondPage] = await doc.copyPages(template, [0, 1]);

    const templateBoxes = {
        mediaBox: template.getPage(0).getMediaBox(),
        cropBox: template.getPage(0).getCropBox(),
    };
    const preserveTemplateBoxes = (page) => {
        page.setMediaBox(
            templateBoxes.mediaBox.x,
            templateBoxes.mediaBox.y,
            templateBoxes.mediaBox.width,
            templateBoxes.mediaBox.height
        );
        page.setCropBox(
            templateBoxes.cropBox.x,
            templateBoxes.cropBox.y,
            templateBoxes.cropBox.width,
            templateBoxes.cropBox.height
        );
        return page;
    };

    doc.addPage(preserveTemplateBoxes(templateFirstPage));

    const sections = [
        { title: "Goal", body: chart.goal },
        { title: "Focus Areas", body: chart.focusAreas },
        { title: "Recommended Foods", body: chart.recommendedFoods },
        { title: "Breakfast", body: chart.breakfast },
        { title: "Mid-Morning Snack", body: chart.midMorning },
        { title: "Lunch", body: chart.lunch },
        { title: "Evening Snack", body: chart.eveningSnack },
        { title: "Dinner", body: chart.dinner },
        { title: "Bedtime Routine", body: chart.bedtime },
        { title: "Quick Summary", body: chart.quickSummary },
        { title: "Foods to Limit", body: chart.foodsToLimit },
        { title: "Notes", body: chart.notes },
    ];

    drawHeader({
        page: templateFirstPage,
        chart,
        dateLabel,
        nameFont: boldFont,
        dateFont: regularFont,
    });

    let cursor = FIRST_PAGE_CONTENT_TOP;
    cursor -= drawMetaCards({
        page: templateFirstPage,
        top: cursor,
        items: [
            { label: "Client", value: chart.clientName || "N/A" },
            { label: "BMI", value: chart.bmi || "N/A" },
            { label: "Weight Change", value: chart.weightChange || "N/A" },
            { label: "Water Target", value: chart.hydrationTarget || "N/A" },
        ],
        labelFont: regularFont,
        valueFont: semiboldFont,
    });

    let continuationPages = [preserveTemplateBoxes(templateSecondPage)];
    const currentPageFor = async (index) => {
        if (index === 0) return templateFirstPage;
        while (continuationPages.length < index) {
            const [copy] = await doc.copyPages(template, [1]);
            continuationPages.push(preserveTemplateBoxes(copy));
        }
        return continuationPages[index - 1];
    };

    let outputIndex = 0;
    for (const section of sections) {
        const bodyLines = wrapText(
            section.body,
            regularFont,
            BODY_SIZE,
            CONTENT_WIDTH - CARD_PADDING * 2 - 8
        );
        const cardHeight = computeSectionHeight(section.title, bodyLines);

        if (cursor - cardHeight < BOTTOM_MARGIN) {
            outputIndex += 1;
            cursor = CONTINUATION_CONTENT_TOP;
            const page = await currentPageFor(outputIndex);
            doc.addPage(page);
        }

        const height = drawSectionCard({
            page: await currentPageFor(outputIndex),
            top: cursor,
            title: section.title,
            bodyLines,
            titleFont: semiboldFont,
            bodyFont: regularFont,
        });
        cursor -= height + SECTION_GAP;
    }

    return doc.save();
};
