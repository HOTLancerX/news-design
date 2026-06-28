"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";

interface Post {
    _id: string;
    title: string;
    slug: string;
    type: string;
    status: string;
    createdAt: string;
    info: Record<string, string>;
}

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

const DEFAULT_SETTINGS: DefaultSettings = {
    logo: "",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    fontFamily: "Arial",
    fontSize: "16",
    lineHeight: "1.5",
    watermarkImage: "",
    readMoreText: "Read details",
};

export default function NewsDesignPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<DefaultSettings>(DEFAULT_SETTINGS);
    const [boxes, setBoxes] = useState<BoxConfig[]>([]);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState<number | null>(null);
    const canvasRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    useEffect(() => {
        Promise.all([
            fetch("/api/news-design/posts", { cache: "no-store" }).then((r) => r.json()),
            fetch("/api/news-design/settings", { cache: "no-store" }).then((r) => r.json()),
            fetch("/api/news-design/boxes", { cache: "no-store" }).then((r) => r.json()),
        ])
            .then(([postsData, settingsData, boxesData]) => {
                setPosts(postsData.posts ?? []);
                if (settingsData.settings) setSettings({ ...DEFAULT_SETTINGS, ...settingsData.settings });
                if (boxesData.boxes) setBoxes(boxesData.boxes);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const currentPost = posts.find((p) => p._id === selectedPost);

    const getPostLink = useCallback(() => {
        if (!currentPost) return "";
        return `${typeof window !== "undefined" ? window.location.origin : ""}/${currentPost.slug}`;
    }, [currentPost]);

    const handleCopyLink = () => {
        const link = getPostLink();
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async (boxId: number) => {
        const el = canvasRefs.current.get(boxId);
        if (!el) return;

        setDownloading(boxId);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(el, {
                useCORS: true,
                allowTaint: true,
                scale: 2,
            });
            const link = document.createElement("a");
            link.download = `news-design-box-${boxId}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-gray-400">
                <Icon icon="svg-spinners:ring-resize" width={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create News Design</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Select a post and preview your canvas designs.
                </p>
            </div>

            {/* Post selector */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Select Post</label>
                    <select
                        value={selectedPost}
                        onChange={(e) => setSelectedPost(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    >
                        <option value="">-- Choose a post --</option>
                        {posts.map((post) => (
                            <option key={post._id} value={post._id}>
                                {post.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Post link */}
                {currentPost && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Post Link</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={getPostLink()}
                                readOnly
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50 font-mono text-gray-600"
                            />
                            <button
                                onClick={handleCopyLink}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                    copied
                                        ? "bg-emerald-500 text-white"
                                        : "bg-indigo-500 text-white hover:bg-indigo-400"
                                }`}
                            >
                                <Icon icon={copied ? "solar:check-read-bold" : "solar:copy-bold"} width={14} />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Box previews */}
            {currentPost && boxes.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-800">Canvas Previews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {boxes.map((box) => (
                            <div key={box.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Box header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-100 text-indigo-600 text-xs font-bold">
                                            {box.id}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-700">{box.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(box.id)}
                                        disabled={downloading === box.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold transition hover:bg-emerald-400 disabled:opacity-55"
                                    >
                                        {downloading === box.id ? (
                                            <Icon icon="svg-spinners:ring-resize" width={12} />
                                        ) : (
                                            <Icon icon="solar:download-bold" width={12} />
                                        )}
                                        Download
                                    </button>
                                </div>

                                {/* Canvas */}
                                <div className="p-4 flex justify-center">
                                    <div
                                        ref={(el) => {
                                            if (el) canvasRefs.current.set(box.id, el);
                                        }}
                                        style={{
                                            width: box.width,
                                            height: box.height,
                                            background: box.bgType === "color"
                                                ? box.bgValue
                                                : box.bgType === "gradient"
                                                ? box.bgValue
                                                : `url(${box.bgValue}) center/cover`,
                                            fontFamily: settings.fontFamily,
                                            position: "relative",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {/* Logo */}
                                        {settings.logo && (
                                            <div style={{
                                                position: "absolute",
                                                top: 16,
                                                left: 16,
                                                zIndex: 10,
                                            }}>
                                                <img
                                                    src={settings.logo}
                                                    alt="Logo"
                                                    style={{ maxHeight: 40, objectFit: "contain" }}
                                                    crossOrigin="anonymous"
                                                />
                                            </div>
                                        )}

                                        {/* Title */}
                                        {box.showTitle && (
                                            <div style={{
                                                position: "absolute",
                                                [box.titlePosition === "top" ? "top" : box.titlePosition === "bottom" ? "bottom" : "top"]: box.titlePosition === "center" ? "50%" : "80px",
                                                transform: box.titlePosition === "center" ? "translateY(-50%)" : "none",
                                                left: 16,
                                                right: 16,
                                                textAlign: "center",
                                                color: isLightColor(box.bgType === "color" ? box.bgValue : "#000000") ? "#1f2937" : "#ffffff",
                                                zIndex: 10,
                                            }}>
                                                <h3 style={{
                                                    fontSize: `${Math.max(18, Number(settings.fontSize) + 4)}px`,
                                                    fontWeight: 800,
                                                    lineHeight: settings.lineHeight,
                                                    margin: 0,
                                                    textShadow: box.bgType === "image" ? "0 1px 3px rgba(0,0,0,0.5)" : "none",
                                                }}>
                                                    {currentPost.title}
                                                </h3>
                                            </div>
                                        )}

                                        {/* Post image */}
                                        {box.showPostImage && currentPost.info?.images && (() => {
                                            try {
                                                const images = JSON.parse(currentPost.info.images);
                                                const imgUrl = Array.isArray(images) ? images[0] : "";
                                                if (!imgUrl) return null;
                                                return (
                                                    <div style={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: "40%",
                                                        zIndex: 5,
                                                    }}>
                                                        <img
                                                            src={imgUrl}
                                                            alt={currentPost.title}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                            crossOrigin="anonymous"
                                                        />
                                                        <div style={{
                                                            position: "absolute",
                                                            inset: 0,
                                                            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                                                        }} />
                                                    </div>
                                                );
                                            } catch { return null; }
                                        })()}

                                        {/* User info */}
                                        {box.showUser && (
                                            <div style={{
                                                position: "absolute",
                                                bottom: 16,
                                                left: 16,
                                                right: 16,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                zIndex: 15,
                                                color: isLightColor(box.bgType === "color" ? box.bgValue : "#000000") ? "#374151" : "#ffffff",
                                            }}>
                                                <div style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: "50%",
                                                    background: settings.primaryColor,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                }}>
                                                    A
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>Author</p>
                                                    <p style={{ fontSize: 10, opacity: 0.75, margin: 0 }}>
                                                        {new Date(currentPost.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Date */}
                                        {box.showDate && !box.showUser && (
                                            <div style={{
                                                position: "absolute",
                                                bottom: 16,
                                                left: 16,
                                                zIndex: 15,
                                                color: isLightColor(box.bgType === "color" ? box.bgValue : "#000000") ? "#6b7280" : "rgba(255,255,255,0.75)",
                                                fontSize: 12,
                                            }}>
                                                {new Date(currentPost.createdAt).toLocaleDateString()}
                                            </div>
                                        )}

                                        {/* Read more */}
                                        {box.showReadMore && (
                                            <div style={{
                                                position: "absolute",
                                                bottom: box.showUser ? 60 : 40,
                                                left: 16,
                                                right: 16,
                                                textAlign: "center",
                                                zIndex: 15,
                                            }}>
                                                <span style={{
                                                    display: "inline-block",
                                                    padding: "4px 12px",
                                                    background: settings.primaryColor,
                                                    color: "#fff",
                                                    borderRadius: 4,
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                }}>
                                                    {settings.readMoreText}
                                                </span>
                                            </div>
                                        )}

                                        {/* Watermark */}
                                        {settings.watermarkImage && (
                                            <div style={{
                                                position: "absolute",
                                                bottom: 16,
                                                right: 16,
                                                opacity: 0.15,
                                                zIndex: 1,
                                            }}>
                                                <img
                                                    src={settings.watermarkImage}
                                                    alt=""
                                                    style={{ maxHeight: 60, objectFit: "contain" }}
                                                    crossOrigin="anonymous"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {currentPost && boxes.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <Icon icon="solar:widget-bold" width={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No box designs configured. Go to Box Settings to set up your designs.</p>
                </div>
            )}
        </div>
    );
}

function isLightColor(hex: string): boolean {
    const c = hex.replace("#", "");
    if (c.length !== 6) return false;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
