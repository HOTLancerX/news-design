import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const COLLECTION = "news_design_settings";
const DOC_ID = "default";

interface DefaultSettings {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    watermarkImage: string;
    readMoreText: string;
}

const DEFAULT_VALUES: DefaultSettings = {
    logo: "",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    fontFamily: "Arial",
    fontSize: "16",
    lineHeight: "1.5",
    watermarkImage: "",
    readMoreText: "Read details",
};

export async function GET() {
    try {
        const col = await getCollection(COLLECTION);
        const doc = await col.findOne({ _id: DOC_ID });
        return NextResponse.json({ settings: doc ? { ...DEFAULT_VALUES, ...doc, _id: undefined } : DEFAULT_VALUES });
    } catch (err) {
        console.error("News Design Settings GET error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const settings: DefaultSettings = { ...DEFAULT_VALUES, ...(body.settings ?? body) };

        const col = await getCollection(COLLECTION);
        await col.updateOne(
            { _id: DOC_ID },
            { $set: { ...settings, updatedAt: new Date() } },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("News Design Settings PUT error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
