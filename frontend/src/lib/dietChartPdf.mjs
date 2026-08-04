import {
    PDFDocument,
    PDFHexString,
    rgb,
    pushGraphicsState,
    popGraphicsState,
    setFillingRgbColor,
    setStrokingRgbColor,
    setLineWidth,
    beginText,
    endText,
    setFontAndSize,
    setTextMatrix,
    showText,
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
import * as fontkit from "fontkit";

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
const TITLE_SIZE = 12.5;

const TYPOGRAPHY = {
    en: { bodySize: 10.5, bodyLineHeight: 14.8, shaped: false },
    hi: { bodySize: 10.5, bodyLineHeight: 18, shaped: true },
};

const DEVANAGARI_PATTERN = /[\u0900-\u097F\uA8E0-\uA8FF\u1CD0-\u1CFF]/;

const containsDevanagari = (text) => DEVANAGARI_PATTERN.test(String(text || ""));

const chartHasHindi = (chart) => {
    if (!chart) return false;
    return Object.values(chart).some((value) => containsDevanagari(value));
};

const HINDI_LABELS = {
    client: "ग्राहक",
    bmi: "बीएमआई",
    weightChange: "वज़न बदलाव",
    hydrationTarget: "पानी की मात्रा",
    date: "दिनांक",
};

const HINDI_MONTHS = {
    January: "जनवरी",
    February: "फ़रवरी",
    March: "मार्च",
    April: "अप्रैल",
    May: "मई",
    June: "जून",
    July: "जुलाई",
    August: "अगस्त",
    September: "सितंबर",
    October: "अक्टूबर",
    November: "नवंबर",
    December: "दिसंबर",
};

const HINDI_SECTION_TITLES = {
    Goal: "लक्ष्य",
    "Focus Areas": "फोकस क्षेत्र",
    "Recommended Foods": "अनुशंसित खाद्य पदार्थ",
    Breakfast: "नाश्ता",
    "Mid-Morning Snack": "मध्य-सुबह का नाश्ता",
    Lunch: "दोपहर का भोजन",
    "Evening Snack": "शाम का नाश्ता",
    Dinner: "रात का खाना",
    "Bedtime Routine": "सोने की दिनचर्या",
    "Quick Summary": "त्वरित सारांश",
    "Foods to Limit": "सीमित करने योग्य खाद्य पदार्थ",
    Notes: "नोट्स",
};

const localizeDateLabel = (label) => {
    let text = String(label || "").replace(/^Date\s*:/i, `${HINDI_LABELS.date}:`);
    return text.replace(
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g,
        (month) => HINDI_MONTHS[month] || month
    );
};

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

const toGlyphHex = (glyphId) => glyphId.toString(16).padStart(4, "0");

const shapedFontKeys = new WeakMap();

const fontKeyFor = (page, font) => {
    let pageKeys = shapedFontKeys.get(page);
    if (!pageKeys) {
        pageKeys = new Map();
        shapedFontKeys.set(page, pageKeys);
    }
    let key = pageKeys.get(font);
    if (!key) {
        key = page.node.newFontDictionary(font.name, font.ref);
        pageKeys.set(font, key);
    }
    return key;
};

const drawShapedText = ({ page, text, font, size, x, y, color }) => {
    const fontkitFont = font.embedder.font;
    const scale = size / fontkitFont.unitsPerEm;
    const paragraphs = String(text || "")
        .split(/\r?\n/)
        .filter((line) => line.trim());
    const runs = paragraphs.length
        ? paragraphs.map((paragraph) => fontkitFont.layout(paragraph))
        : [fontkitFont.layout("")];
    const ops = [];
    runs.forEach((run) => {
        let cursorX = x;
        run.glyphs.forEach((glyph, index) => {
            const position = run.positions[index];
            const glyphX = cursorX + position.xOffset * scale;
            const glyphY = y + position.yOffset * scale;
            ops.push(
                setTextMatrix(1, 0, 0, 1, glyphX, glyphY),
                showText(PDFHexString.of(toGlyphHex(glyph.id)))
            );
            cursorX += (position.xAdvance || glyph.advanceWidth) * scale;
        });
    });
    page.pushOperators(
        setFillingRgbColor(color.red, color.green, color.blue),
        beginText(),
        setFontAndSize(fontKeyFor(page, font), size),
        ...ops,
        endText()
    );
};

const drawTextLine = ({ page, text, font, size, x, y, color, shaped }) => {
    if (shaped) {
        drawShapedText({ page, text, font, size, x, y, color });
    } else {
        page.drawText(text, { x, y, size, font, color });
    }
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

const computeSectionHeight = (title, bodyLines, typography) => {
    const titleHeight = TITLE_SIZE * 1.45;
    const bodyHeight = bodyLines.length
        ? bodyLines.length * typography.bodyLineHeight
        : 0;
    return CARD_PADDING * 2 + titleHeight + (bodyLines.length ? 5 + bodyHeight : 0);
};

const drawHeader = ({ page, chart, dateLabel, nameFont, dateFont, shaped }) => {
    const centerX = PAGE_WIDTH / 2;
    const clientName = String(chart.clientName || "Client");
    let nameSize = 19;
    while (
        nameSize > 12 &&
        nameFont.widthOfTextAtSize(clientName, nameSize) > CONTENT_WIDTH
    ) {
        nameSize -= 0.5;
    }
    drawTextLine({
        page,
        text: clientName,
        x: centerX - nameFont.widthOfTextAtSize(clientName, nameSize) / 2,
        y: 704,
        size: nameSize,
        font: nameFont,
        color: COLORS.deepGreen,
        shaped,
    });

    const dateText = String(dateLabel || "");
    const dateSize = 11.5;
    drawTextLine({
        page,
        text: dateText,
        x: centerX - dateFont.widthOfTextAtSize(dateText, dateSize) / 2,
        y: 681,
        size: dateSize,
        font: dateFont,
        color: COLORS.muted,
        shaped,
    });

    const dividerWidth = 140;
    page.drawLine({
        start: { x: centerX - dividerWidth / 2, y: 669 },
        end: { x: centerX + dividerWidth / 2, y: 669 },
        thickness: 1.2,
        color: COLORS.divider,
    });
};

const drawMetaCards = ({ page, top, items, labelFont, valueFont, shaped }) => {
    const gap = 10;
    const cardWidth = (CONTENT_WIDTH - gap * (items.length - 1)) / items.length;
    const cardHeight = 54;
    const labelMaxWidth = cardWidth - 20;
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
        const labelText = String(item.label).toUpperCase();
        let labelSize = 8.5;
        while (
            labelSize > 6 &&
            labelFont.widthOfTextAtSize(labelText, labelSize) > labelMaxWidth
        ) {
            labelSize -= 0.25;
        }
        drawTextLine({
            page,
            text: labelText,
            x: x + 10,
            y: top - 17,
            size: labelSize,
            font: labelFont,
            color: COLORS.muted,
            shaped,
        });
        drawTextLine({
            page,
            text: String(item.value || "N/A"),
            x: x + 10,
            y: top - 34,
            size: 11.5,
            font: valueFont,
            color: COLORS.deepGreen,
            shaped,
        });
        x += cardWidth + gap;
    });
    return cardHeight + gap;
};

const drawSectionCard = ({
    page,
    top,
    title,
    bodyLines,
    titleFont,
    bodyFont,
    typography,
}) => {
    const { bodySize, bodyLineHeight } = typography;
    const titleHeight = TITLE_SIZE * 1.45;
    const bodyHeight = bodyLines.length ? bodyLines.length * bodyLineHeight : 0;
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
    drawTextLine({
        page,
        text: String(title).toUpperCase(),
        x: innerX,
        y: titleBaseline,
        size: TITLE_SIZE,
        font: titleFont,
        color: COLORS.deepGreenTitle,
        shaped: typography.shaped,
    });

    if (bodyLines.length) {
        let baseline = titleBaseline - 7 - bodySize;
        bodyLines.forEach((line) => {
            drawTextLine({
                page,
                text: line,
                x: innerX,
                y: baseline,
                size: bodySize,
                font: bodyFont,
                color: COLORS.ink,
                shaped: typography.shaped,
            });
            baseline -= bodyLineHeight;
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
 * @param {Uint8Array} [options.hindiRegularFontBytes] - Mukta Regular TTF bytes (Devanagari)
 * @param {Uint8Array} [options.hindiSemiboldFontBytes] - Mukta SemiBold TTF bytes (Devanagari)
 * @param {Uint8Array} [options.hindiBoldFontBytes] - Mukta Bold TTF bytes (Devanagari)
 * @param {Object} options.chart - normalized diet chart object
 * @param {string} [options.dateLabel] - date string shown under the heading
 * @returns {Promise<Uint8Array>} the generated PDF bytes
 */
export const buildDietChartPdf = async ({
    templateBytes,
    regularFontBytes,
    semiboldFontBytes,
    boldFontBytes,
    hindiRegularFontBytes,
    hindiSemiboldFontBytes,
    hindiBoldFontBytes,
    chart,
    dateLabel,
}) => {
    const template = await PDFDocument.load(templateBytes);
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);

    const regularFont = await doc.embedFont(regularFontBytes);
    const semiboldFont = await doc.embedFont(semiboldFontBytes);
    const boldFont = await doc.embedFont(boldFontBytes);

    const hindiFontsAvailable = Boolean(
        hindiRegularFontBytes && hindiSemiboldFontBytes && hindiBoldFontBytes
    );
    const isHindi = hindiFontsAvailable && chartHasHindi(chart);

    const hindiRegularFont = isHindi
        ? await doc.embedFont(hindiRegularFontBytes)
        : null;
    const hindiSemiboldFont = isHindi
        ? await doc.embedFont(hindiSemiboldFontBytes)
        : null;
    const hindiBoldFont = isHindi
        ? await doc.embedFont(hindiBoldFontBytes)
        : null;

    const typography = isHindi ? TYPOGRAPHY.hi : TYPOGRAPHY.en;
    const nameFont = isHindi ? hindiBoldFont : boldFont;
    const titleFont = isHindi ? hindiSemiboldFont : semiboldFont;
    const bodyFont = isHindi ? hindiRegularFont : regularFont;
    const metaLabelFont = isHindi ? hindiRegularFont : regularFont;
    const metaValueFont = isHindi ? hindiSemiboldFont : semiboldFont;

    if (isHindi) {
        dateLabel = localizeDateLabel(dateLabel);
    }

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
    ].map((section) => ({
        ...section,
        title: isHindi
            ? HINDI_SECTION_TITLES[section.title] || section.title
            : section.title,
    }));

    drawHeader({
        page: templateFirstPage,
        chart,
        dateLabel,
        nameFont,
        dateFont: bodyFont,
        shaped: typography.shaped,
    });

    let cursor = FIRST_PAGE_CONTENT_TOP;
    cursor -= drawMetaCards({
        page: templateFirstPage,
        top: cursor,
        items: isHindi
            ? [
                { label: HINDI_LABELS.client, value: chart.clientName || "N/A" },
                { label: HINDI_LABELS.bmi, value: chart.bmi || "N/A" },
                { label: HINDI_LABELS.weightChange, value: chart.weightChange || "N/A" },
                { label: HINDI_LABELS.hydrationTarget, value: chart.hydrationTarget || "N/A" },
            ]
            : [
                { label: "Client", value: chart.clientName || "N/A" },
                { label: "BMI", value: chart.bmi || "N/A" },
                { label: "Weight Change", value: chart.weightChange || "N/A" },
                { label: "Water Target", value: chart.hydrationTarget || "N/A" },
            ],
        labelFont: metaLabelFont,
        valueFont: metaValueFont,
        shaped: typography.shaped,
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
            bodyFont,
            typography.bodySize,
            CONTENT_WIDTH - CARD_PADDING * 2 - 8
        );
        const cardHeight = computeSectionHeight(section.title, bodyLines, typography);

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
            titleFont,
            bodyFont,
            typography,
        });
        cursor -= height + SECTION_GAP;
    }

    return doc.save();
};
