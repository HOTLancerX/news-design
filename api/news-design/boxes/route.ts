import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const COLLECTION = "news_design_boxes";
const DOC_ID = "boxes";

interface BoxConfig {
    id: number;
    name: string;
    bgType: "image" | "color" | "gradient";
    bgValue: string;
    titlePosition: "top" | "center" | "bottom";
    showTitle: boolean;
    showUser: boolean;
    showDate: boolean;
    showPostImage: boolean;
    showReadMore: boolean;
    width: number;
    height: number;
}

const DEFAULT_BOXES: BoxConfig[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Box ${i + 1}`,
    bgType: "color",
    bgValue: i % 2 === 0 ? "#1e40af" : "#ffffff",
    titlePosition: "center",
    showTitle: true,
    showUser: true,
    showDate: true,
    showPostImage: true,
    showReadMore: true,
    width: 400,
    height: 400,
}));

export async function GET() {
    try {
        const col = await getCollection(COLLECTION);
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

        const col = await getCollection(COLLECTION);
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
