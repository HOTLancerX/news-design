import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import type { Document } from "mongodb";

export const dynamic = "force-dynamic";

const COLLECTION = "news_design_boxes";
const DOC_ID = "boxes";

export interface BoxConfig {
    id: number;
    name: string;
    bgType: "image" | "color" | "gradient";
    bgValue: string;
    gradientColor2: string;
    gradientAngle: number;
    titlePosition: "top" | "center" | "bottom";
    titleFontSize: number;
    titleColor: string;
    titleHighlightColor: string;
    showTitle: boolean;
    showCategory: boolean;
    showUser: boolean;
    showDate: boolean;
    showPostImage: boolean;
    showReadMore: boolean;
    width: number;
    height: number;
}

interface BoxesDoc extends Document {
    _id: string;
    boxes: BoxConfig[];
    updatedAt?: Date;
}

export const DEFAULT_BOXES: BoxConfig[] = [
    { id: 1,  name: "Box 1",  bgType: "color", bgValue: "#dc2626", gradientColor2: "#ffffff", gradientAngle: 135, titlePosition: "center", titleFontSize: 22, titleColor: "#1d4ed8", titleHighlightColor: "#dc2626", showTitle: true, showCategory: true, showUser: false, showDate: true, showPostImage: true, showReadMore: true, width: 400, height: 400 },
    { id: 2,  name: "Box 2",  bgType: "color", bgValue: "#f8f9fa", gradientColor2: "#e5e7eb", gradientAngle: 180, titlePosition: "top", titleFontSize: 22, titleColor: "#1e3a5f", titleHighlightColor: "#dc2626", showTitle: true, showCategory: false, showUser: false, showDate: true, showPostImage: true, showReadMore: false, width: 400, height: 480 },
    { id: 3,  name: "Box 3",  bgType: "color", bgValue: "#ffffff", gradientColor2: "#f3f4f6", gradientAngle: 180, titlePosition: "bottom", titleFontSize: 22, titleColor: "#dc2626", titleHighlightColor: "#111827", showTitle: true, showCategory: false, showUser: false, showDate: true, showPostImage: true, showReadMore: false, width: 400, height: 500 },
    { id: 4,  name: "Box 4",  bgType: "color", bgValue: "#111827", gradientColor2: "#1f2937", gradientAngle: 180, titlePosition: "bottom", titleFontSize: 20, titleColor: "#ffffff", titleHighlightColor: "#facc15", showTitle: true, showCategory: false, showUser: true, showDate: true, showPostImage: true, showReadMore: true, width: 400, height: 450 },
    { id: 5,  name: "Box 5",  bgType: "color", bgValue: "#ffffff", gradientColor2: "#f9fafb", gradientAngle: 180, titlePosition: "top", titleFontSize: 16, titleColor: "#111827", titleHighlightColor: "#dc2626", showTitle: true, showCategory: false, showUser: true, showDate: true, showPostImage: true, showReadMore: true, width: 480, height: 320 },
    { id: 6,  name: "Box 6",  bgType: "color", bgValue: "#ffffff", gradientColor2: "#f3f4f6", gradientAngle: 180, titlePosition: "top", titleFontSize: 18, titleColor: "#111827", titleHighlightColor: "#2563eb", showTitle: true, showCategory: true, showUser: true, showDate: true, showPostImage: true, showReadMore: false, width: 400, height: 440 },
    { id: 7,  name: "Box 7",  bgType: "gradient", bgValue: "linear-gradient(135deg, #667eea, #764ba2)", gradientColor2: "#764ba2", gradientAngle: 135, titlePosition: "top", titleFontSize: 20, titleColor: "#ffffff", titleHighlightColor: "#facc15", showTitle: true, showCategory: false, showUser: true, showDate: true, showPostImage: true, showReadMore: false, width: 400, height: 450 },
    { id: 8,  name: "Box 8",  bgType: "color", bgValue: "#ffffff", gradientColor2: "#f9fafb", gradientAngle: 180, titlePosition: "top", titleFontSize: 24, titleColor: "#111827", titleHighlightColor: "#dc2626", showTitle: true, showCategory: false, showUser: true, showDate: true, showPostImage: true, showReadMore: false, width: 400, height: 460 },
    { id: 9,  name: "Box 9",  bgType: "color", bgValue: "#ffffff", gradientColor2: "#f3f4f6", gradientAngle: 180, titlePosition: "top", titleFontSize: 18, titleColor: "#111827", titleHighlightColor: "#2563eb", showTitle: true, showCategory: false, showUser: true, showDate: true, showPostImage: true, showReadMore: false, width: 400, height: 400 },
    { id: 10, name: "Box 10", bgType: "color", bgValue: "#ffffff", gradientColor2: "#f9fafb", gradientAngle: 180, titlePosition: "bottom", titleFontSize: 22, titleColor: "#ffffff", titleHighlightColor: "#facc15", showTitle: true, showCategory: false, showUser: true, showDate: true, showPostImage: true, showReadMore: true, width: 400, height: 450 },
];

export async function GET() {
    try {
        const col = await getCollection<BoxesDoc>(COLLECTION);
        const doc = await col.findOne({ _id: DOC_ID });
        const boxes = doc?.boxes ?? DEFAULT_BOXES;
        return NextResponse.json({ boxes });
    } catch (err) {
        console.error("News Design Boxes GET error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const boxes: BoxConfig[] = body.boxes ?? DEFAULT_BOXES;

        const col = await getCollection<BoxesDoc>(COLLECTION);
        await col.updateOne(
            { _id: DOC_ID },
            { $set: { boxes, updatedAt: new Date() } },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("News Design Boxes PUT error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
