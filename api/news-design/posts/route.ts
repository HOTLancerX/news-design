import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/post";
import PostInfo from "@/models/post_info";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = req.nextUrl;
        const type = searchParams.get("type") ?? "blog";

        const posts = await Post.find({
            type,
            status: "published",
        })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean<any[]>();

        if (posts.length === 0) {
            return NextResponse.json({ posts: [] });
        }

        const postIds = posts.map((p) => p._id);
        const infoRecords = await PostInfo.find({
            postId: { $in: postIds },
        }).lean<any[]>();

        const infoMap = new Map<string, Record<string, string>>();
        infoRecords.forEach((r) => {
            const postId = String(r.postId);
            if (!infoMap.has(postId)) infoMap.set(postId, {});
            infoMap.get(postId)![r.name] = r.value ?? "";
        });

        const result = posts.map((p) => ({
            _id: String(p._id),
            title: p.title ?? "",
            slug: p.slug ?? "",
            type: p.type ?? "",
            status: p.status ?? "",
            createdAt: p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : String(p.createdAt ?? ""),
            info: infoMap.get(String(p._id)) ?? {},
        }));

        return NextResponse.json({ posts: result });
    } catch (err) {
        console.error("News Design Posts API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
