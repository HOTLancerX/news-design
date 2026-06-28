import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/post";
import PostInfo from "@/models/post_info";
import User from "@/models/Users";
import Cat from "@/models/cat";
import CatInfo from "@/models/cat_info";
import { ObjectId } from "mongodb";

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
        const rawUserIds = [...new Set(posts.map((p) => p.userId).filter(Boolean))];
        const catIds = [...new Set(posts.map((p) => p.category).filter(Boolean))];

        const userIds = rawUserIds.filter((id) => {
            try { return ObjectId.isValid(id); } catch { return false; }
        });

        const [infoRecords, users, cats, catInfoRecords] = await Promise.all([
            PostInfo.find({ postId: { $in: postIds } }).lean<any[]>(),
            userIds.length > 0
                ? User.find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } }).lean<any[]>()
                : [],
            catIds.length > 0
                ? Cat.find({ _id: { $in: catIds } }).lean<any[]>()
                : [],
            catIds.length > 0
                ? CatInfo.find({ catId: { $in: catIds } }).lean<any[]>()
                : [],
        ]);

        const infoMap = new Map<string, Record<string, string>>();
        infoRecords.forEach((r) => {
            const postId = String(r.postId);
            if (!infoMap.has(postId)) infoMap.set(postId, {});
            infoMap.get(postId)![r.name] = r.value ?? "";
        });

        const userMap = new Map<string, { name: string; image: string }>();
        users.forEach((u) => {
            userMap.set(String(u._id), {
                name: u.name ?? "",
                image: u.image ?? "",
            });
        });

        const catMap = new Map<string, { title: string; info: Record<string, string> }>();
        cats.forEach((c) => {
            catMap.set(String(c._id), { title: c.title ?? "", info: {} });
        });
        catInfoRecords.forEach((r) => {
            const catId = String(r.catId);
            const cat = catMap.get(catId);
            if (cat) cat.info[r.name] = r.value ?? "";
        });

        const result = posts.map((p) => {
            const info = infoMap.get(String(p._id)) ?? {};
            const user = p.userId ? userMap.get(p.userId) ?? { name: "", image: "" } : { name: "", image: "" };
            const cat = p.category ? catMap.get(String(p.category)) ?? null : null;

            let images: string[] = [];
            try {
                const parsed = JSON.parse(info["images"] ?? "[]");
                if (Array.isArray(parsed)) images = parsed;
            } catch { /* ignore */ }

            return {
                _id: String(p._id),
                title: p.title ?? "",
                slug: p.slug ?? "",
                type: p.type ?? "",
                status: p.status ?? "",
                createdAt: p.createdAt instanceof Date
                    ? p.createdAt.toISOString()
                    : String(p.createdAt ?? ""),
                info,
                user,
                images,
                category: cat ? {
                    name: cat.title,
                    color: cat.info["color"] || cat.info["category_color"] || "",
                } : null,
            };
        });

        return NextResponse.json({ posts: result });
    } catch (err) {
        console.error("News Design Posts API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
