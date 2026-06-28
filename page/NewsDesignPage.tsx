"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import type { PostData, BoxConfigData, SettingsData } from "../ui/shared";
import Style1 from "../ui/style-1";
import Style2 from "../ui/style-2";
import Style3 from "../ui/style-3";
import Style4 from "../ui/style-4";
import Style5 from "../ui/style-5";
import Style6 from "../ui/style-6";
import Style7 from "../ui/style-7";
import Style8 from "../ui/style-8";
import Style9 from "../ui/style-9";
import Style10 from "../ui/style-10";

const DEFAULT_SETTINGS: SettingsData = {
    logo: "",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    fontFamily: "Arial",
    fontSize: "16",
    lineHeight: "1.5",
    watermarkImage: "",
    readMoreText: "Read details",
};

const STYLE_MAP: Record<number, (p: PostData, b: BoxConfigData, s: SettingsData) => React.ReactNode> = {
    1: Style1, 2: Style2, 3: Style3, 4: Style4, 5: Style5,
    6: Style6, 7: Style7, 8: Style8, 9: Style9, 10: Style10,
};

function formatDate(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

export default function NewsDesignPage() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [selectedPost, setSelectedPost] = useState("");
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
    const [boxes, setBoxes] = useState<BoxConfigData[]>([]);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState<number | null>(null);
    const [previewBox, setPreviewBox] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [customTitle, setCustomTitle] = useState("");
    const [downloadPreviewBox, setDownloadPreviewBox] = useState<number | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/news-design/posts", { cache: "no-store" }).then((r) => r.json()),
            fetch("/api/news-design/settings", { cache: "no-store" }).then((r) => r.json()),
            fetch("/api/news-design/boxes", { cache: "no-store" }).then((r) => r.json()),
        ])
            .then(([postsData, settingsData, boxesData]) => {
                const list = postsData.posts ?? [];
                setPosts(list);
                if (settingsData.settings) setSettings({ ...DEFAULT_SETTINGS, ...settingsData.settings });
                if (boxesData.boxes) setBoxes(boxesData.boxes);
                if (list.length > 0) setSelectedPost(list[0]._id);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const currentPost = posts.find((pp) => pp._id === selectedPost) ?? null;

    const displayPost: PostData | null = currentPost ? {
        ...currentPost,
        title: customTitle.trim() || currentPost.title,
    } : null;

    const getPostLink = useCallback(() => {
        if (!currentPost) return "";
        return (typeof window !== "undefined" ? window.location.origin : "") + "/" + currentPost.slug;
    }, [currentPost]);

    const getCopyText = useCallback(() => {
        if (!displayPost) return "";
        return displayPost.title + "\n" + getPostLink();
    }, [displayPost, getPostLink]);

    const handleCopy = () => {
        navigator.clipboard.writeText(getCopyText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async (boxId: number) => {
        const box = boxes.find((bb) => bb.id === boxId);
        if (!box || !displayPost) return;

        setDownloading(boxId);
        setDownloadPreviewBox(boxId);
        try {
            const html2canvas = (await import("html2canvas")).default;

            const offscreen = document.createElement("div");
            offscreen.style.position = "fixed";
            offscreen.style.left = "-9999px";
            offscreen.style.top = "0";
            offscreen.style.zIndex = "-1";
            document.body.appendChild(offscreen);

            const container = document.createElement("div");
            offscreen.appendChild(container);

            const { createElement } = await import("react");
            const { createRoot } = await import("react-dom/client");
            const root = createRoot(container);
            const renderer = STYLE_MAP[boxId] ?? STYLE_MAP[1];
            const result = renderer(displayPost, box, settings);
            root.render(createElement("div", null, result));

            await new Promise((r) => setTimeout(r, 600));

            const target = container.firstElementChild as HTMLElement;
            if (!target) {
                document.body.removeChild(offscreen);
                setDownloading(null);
                setDownloadPreviewBox(null);
                return;
            }

            const canvas = await html2canvas(target, {
                useCORS: true,
                allowTaint: true,
                scale: 1,
                width: box.width,
                height: box.height,
                onclone: (doc: Document) => {
                    const allEls = doc.querySelectorAll<HTMLElement>("*");
                    for (let i = 0; i < allEls.length; i++) allEls[i].removeAttribute("class");
                    const sheets = doc.querySelectorAll("style, link[rel='stylesheet']");
                    for (let i = 0; i < sheets.length; i++) sheets[i].remove();
                },
            });

            root.unmount();
            document.body.removeChild(offscreen);

            const link = document.createElement("a");
            link.download = "news-design-box-" + boxId + ".png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setDownloading(null);
            setDownloadPreviewBox(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 0", color: "#9ca3af" }}>
                <Icon icon="svg-spinners:ring-resize" width={32} />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Create News Design</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Select a post and preview your canvas designs.</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Select Post</label>
                    <select
                        value={selectedPost}
                        onChange={(e) => { setSelectedPost(e.target.value); setCustomTitle(""); }}
                        style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: "10px 12px", fontSize: 14, outline: "none" }}
                    >
                        <option value="">-- Choose a post --</option>
                        {posts.map((post) => (
                            <option key={post._id} value={post._id}>{post.title}</option>
                        ))}
                    </select>
                </div>

                {currentPost && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Custom Title <span style={{ fontWeight: 400, color: "#9ca3af" }}>(leave empty to use post title)</span></label>
                        <input
                            type="text"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            placeholder={currentPost.title}
                            style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: "10px 12px", fontSize: 14, outline: "none" }}
                        />
                    </div>
                )}

                {currentPost && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Title &amp; Link</label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <textarea
                                readOnly
                                value={getCopyText()}
                                rows={3}
                                style={{ flex: 1, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 13, fontFamily: "monospace", background: "#f9fafb", color: "#4b5563", resize: "none", cursor: "pointer" }}
                                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                            />
                            <button
                                onClick={handleCopy}
                                style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", background: copied ? "#10b981" : "#6366f1", border: "none", cursor: "pointer" }}
                            >
                                <Icon icon={copied ? "solar:check-read-bold" : "solar:copy-bold"} width={14} />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                )}

                {displayPost && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#f9fafb", borderRadius: 8 }}>
                        {displayPost.images[0] && <img src={displayPost.images[0]} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayPost.title}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                                {displayPost.user.image ? (
                                    <img src={displayPost.user.image} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: settings.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                                        {displayPost.user.name?.charAt(0)?.toUpperCase() ?? "A"}
                                    </div>
                                )}
                                <span style={{ fontSize: 12, color: "#6b7280" }}>{displayPost.user.name || "Unknown"}</span>
                                {displayPost.category && <span style={{ fontSize: 11, color: displayPost.category.color || "#6b7280", fontWeight: 600 }}>{displayPost.category.name}</span>}
                                <span style={{ fontSize: 12, color: "#9ca3af" }}>{formatDate(displayPost.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {currentPost && (
                    <div style={{ padding: 12, background: "#fffbeb", borderRadius: 8, border: "1px solid #fde68a" }}>
                        <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>
                            <strong>Tip:</strong> Use <code style={{ background: "#fef3c7", padding: "1px 4px", borderRadius: 3 }}>[h]text[h]</code> in title on the post to highlight text with the highlight color. Example: Hello [h]Bangladesh[h] World
                        </p>
                    </div>
                )}
            </div>

            {displayPost && boxes.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: 0 }}>Canvas Previews</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                        {boxes.map((box) => {
                            const renderer = STYLE_MAP[box.id] ?? STYLE_MAP[1];
                            const maxPreviewW = 310;
                            const scale = Math.min(maxPreviewW / box.width, 1);
                            const scaledH = Math.round(box.height * scale);
                            return (
                                <div key={box.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, fontSize: 12, fontWeight: 700, color: "#fff", background: "#6366f1" }}>{box.id}</span>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{box.name}</span>
                                            <span style={{ fontSize: 11, color: "#9ca3af" }}>{box.width}x{box.height}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <button
                                                onClick={() => { setPreviewBox(box.id); setZoom(1); }}
                                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#fff", background: "#6366f1", border: "none", cursor: "pointer" }}
                                            >
                                                <Icon icon="solar:eye-bold" width={12} />
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => handleDownload(box.id)}
                                                disabled={downloading === box.id}
                                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#fff", background: downloading === box.id ? "#9ca3af" : "#10b981", border: "none", cursor: "pointer", opacity: downloading === box.id ? 0.55 : 1 }}
                                            >
                                                {downloading === box.id ? <Icon icon="svg-spinners:ring-resize" width={12} /> : <Icon icon="solar:download-bold" width={12} />}
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ padding: 16, display: "flex", justifyContent: "center", overflow: "hidden" }}>
                                        <div style={{ width: box.width, height: box.height, transform: "scale(" + scale + ")", transformOrigin: "top center" }}>
                                            {renderer(displayPost, box, settings)}
                                        </div>
                                    </div>
                                    <div style={{ height: 0, marginTop: -(box.height - scaledH) }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {currentPost && boxes.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                    <Icon icon="solar:widget-bold" width={48} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
                    <p style={{ fontSize: 14 }}>No box designs configured. Go to Box Settings to set up your designs.</p>
                </div>
            )}

            {/* Preview Modal */}
            {previewBox !== null && displayPost && (
                <div
                    onClick={() => setPreviewBox(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(0,0,0,0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "relative",
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setPreviewBox(null)}
                            style={{
                                position: "absolute",
                                top: -40,
                                right: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "6px 12px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#fff",
                                background: "rgba(255,255,255,0.15)",
                                border: "none",
                                cursor: "pointer",
                                zIndex: 10,
                            }}
                        >
                            <Icon icon="solar:close-bold" width={14} />
                            Close
                        </button>

                        {/* Zoom controls */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 12px",
                                borderRadius: 8,
                                background: "rgba(255,255,255,0.12)",
                                zIndex: 10,
                            }}
                        >
                            <button
                                onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 700 }}
                            >
                                −
                            </button>
                            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, minWidth: 48, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
                            <button
                                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 700 }}
                            >
                                +
                            </button>
                            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
                            <button
                                onClick={() => setZoom(1)}
                                style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                            >
                                Reset
                            </button>
                        </div>

                        {/* Zoomable canvas */}
                        <div
                            style={{
                                overflow: "auto",
                                maxWidth: "85vw",
                                maxHeight: "80vh",
                                borderRadius: 8,
                                background: "rgba(0,0,0,0.3)",
                            }}
                        >
                            <div style={{ transform: "scale(" + zoom + ")", transformOrigin: "top center" }}>
                                {(() => {
                                    const box = boxes.find((bb) => bb.id === previewBox);
                                    if (!box) return null;
                                    const renderer = STYLE_MAP[box.id] ?? STYLE_MAP[1];
                                    return renderer(displayPost, box, settings);
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Preview Popup */}
            {downloadPreviewBox !== null && displayPost && (() => {
                const box = boxes.find((bb) => bb.id === downloadPreviewBox);
                if (!box) return null;
                const renderer = STYLE_MAP[box.id] ?? STYLE_MAP[1];
                const previewScale = Math.min((window.innerWidth * 0.85) / box.width, (window.innerHeight * 0.8) / box.height, 1);
                return (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 99999,
                            background: "rgba(0,0,0,0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 16,
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 20px",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.12)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                        }}>
                            <Icon icon="svg-spinners:ring-resize" width={18} />
                            Generating PNG — Box {box.id} ({box.width}×{box.height})...
                        </div>
                        <div style={{
                            overflow: "auto",
                            maxWidth: "90vw",
                            maxHeight: "80vh",
                            borderRadius: 8,
                            background: "rgba(0,0,0,0.3)",
                            padding: 8,
                        }}>
                            <div style={{
                                transform: "scale(" + previewScale + ")",
                                transformOrigin: "top center",
                            }}>
                                {renderer(displayPost, box, settings)}
                            </div>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>
                            Full-size preview — download will start automatically
                        </p>
                    </div>
                );
            })()}
        </div>
    );
}
