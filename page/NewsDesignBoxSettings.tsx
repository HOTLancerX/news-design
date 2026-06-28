"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Gallery from "@/components/Gallery";

interface BoxConfig {
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

const DEFAULT_BOXES: BoxConfig[] = [
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

export default function NewsDesignBoxSettings() {
    const [boxes, setBoxes] = useState<BoxConfig[]>(DEFAULT_BOXES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [activeBox, setActiveBox] = useState(1);

    useEffect(() => {
        fetch("/api/news-design/boxes", { cache: "no-store" })
            .then((r) => r.json())
            .then((data) => {
                if (data.boxes && Array.isArray(data.boxes)) {
                    const merged = DEFAULT_BOXES.map((def) => {
                        const saved = data.boxes.find((b: BoxConfig) => b.id === def.id);
                        return saved ? { ...def, ...saved } : def;
                    });
                    setBoxes(merged);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const updateBox = (id: number, patch: Partial<BoxConfig>) => {
        setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/news-design/boxes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ boxes }),
            });
            if (!res.ok) throw new Error("Failed to save");
            setMessage("Box settings saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch {
            setMessage("Error saving box settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 0", color: "#9ca3af" }}>
                <Icon icon="svg-spinners:ring-resize" width={32} />
            </div>
        );
    }

    const currentBox = boxes.find((b) => b.id === activeBox) ?? boxes[0];

    const resolvePreviewBg = (): string => {
        if (currentBox.bgType === "color") return currentBox.bgValue || "#ffffff";
        if (currentBox.bgType === "gradient") return "linear-gradient(" + currentBox.gradientAngle + "deg, " + currentBox.bgValue + ", " + currentBox.gradientColor2 + ")";
        if (currentBox.bgType === "image" && currentBox.bgValue) return "url(" + currentBox.bgValue + ") center/cover";
        return "#ffffff";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>News Design Box Settings</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Configure each of the 10 box designs for your news canvases.</p>
            </div>

            {message && (
                <div style={{ borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 500, background: message.startsWith("Error") ? "#fef2f2" : "#f0fdf4", color: message.startsWith("Error") ? "#dc2626" : "#16a34a", border: "1px solid " + (message.startsWith("Error") ? "#fecaca" : "#bbf7d0") }}>
                    {message}
                </div>
            )}

            <div style={{ display: "flex", gap: 24, flexDirection: "row", flexWrap: "wrap" }}>
                {/* Box selector */}
                <div style={{ width: 192, flexShrink: 0 }}>
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, margin: "0 0 8px" }}>Select Box</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                            {boxes.map((box) => (
                                <button
                                    key={box.id}
                                    onClick={() => setActiveBox(box.id)}
                                    style={{ padding: 8, borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: activeBox === box.id ? "#6366f1" : "#f3f4f6", color: activeBox === box.id ? "#fff" : "#4b5563" }}
                                >
                                    {box.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Box settings */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
                            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "#eef2ff", color: "#6366f1", fontWeight: 700, fontSize: 14 }}>{currentBox.id}</span>
                            <input type="text" value={currentBox.name} onChange={(e) => updateBox(currentBox.id, { name: e.target.value })} style={{ flex: 1, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 14, fontWeight: 600, outline: "none" }} />
                        </div>

                        {/* Background Type */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Background Type</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {(["color", "gradient", "image"] as const).map((t) => (
                                    <button key={t} onClick={() => updateBox(currentBox.id, { bgType: t })} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, textTransform: "capitalize", border: "none", cursor: "pointer", background: currentBox.bgType === t ? "#6366f1" : "#f3f4f6", color: currentBox.bgType === t ? "#fff" : "#4b5563" }}>{t}</button>
                                ))}
                            </div>
                        </div>

                        {/* Background Value */}
                        {currentBox.bgType === "color" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Background Color</label>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <input type="color" value={currentBox.bgValue} onChange={(e) => updateBox(currentBox.id, { bgValue: e.target.value })} style={{ width: 40, height: 40, border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer" }} />
                                    <input type="text" value={currentBox.bgValue} onChange={(e) => updateBox(currentBox.id, { bgValue: e.target.value })} style={{ flex: 1, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 14, outline: "none" }} />
                                </div>
                            </div>
                        )}

                        {currentBox.bgType === "gradient" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Gradient Color 1</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="color" value={currentBox.bgValue} onChange={(e) => updateBox(currentBox.id, { bgValue: e.target.value })} style={{ width: 40, height: 40, border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer" }} />
                                        <input type="text" value={currentBox.bgValue} onChange={(e) => updateBox(currentBox.id, { bgValue: e.target.value })} style={{ flex: 1, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 14, outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Gradient Color 2</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="color" value={currentBox.gradientColor2} onChange={(e) => updateBox(currentBox.id, { gradientColor2: e.target.value })} style={{ width: 40, height: 40, border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer" }} />
                                        <input type="text" value={currentBox.gradientColor2} onChange={(e) => updateBox(currentBox.id, { gradientColor2: e.target.value })} style={{ flex: 1, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 14, outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Angle: {currentBox.gradientAngle}°</label>
                                    <input type="range" min={0} max={360} value={currentBox.gradientAngle} onChange={(e) => updateBox(currentBox.id, { gradientAngle: Number(e.target.value) })} style={{ width: "100%" }} />
                                </div>
                            </div>
                        )}

                        {currentBox.bgType === "image" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Background Image</label>
                                <Gallery
                                    multiple={false}
                                    value={currentBox.bgValue}
                                    onChange={(v) => updateBox(currentBox.id, { bgValue: typeof v === "string" ? v : (Array.isArray(v) ? (v[0] ?? "") : v) })}
                                    placeholder="Select background image"
                                />
                            </div>
                        )}

                        {/* Dimensions */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Width (px)</label>
                                <input type="number" value={currentBox.width} onChange={(e) => updateBox(currentBox.id, { width: Number(e.target.value) })} min={200} max={1200} style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 14, outline: "none" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Height (px)</label>
                                <input type="number" value={currentBox.height} onChange={(e) => updateBox(currentBox.id, { height: Number(e.target.value) })} min={200} max={1200} style={{ borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 14, outline: "none" }} />
                            </div>
                        </div>

                        {/* Title Position */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Title Position</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {(["top", "center", "bottom"] as const).map((pos) => (
                                    <button key={pos} onClick={() => updateBox(currentBox.id, { titlePosition: pos })} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, textTransform: "capitalize", border: "none", cursor: "pointer", background: currentBox.titlePosition === pos ? "#6366f1" : "#f3f4f6", color: currentBox.titlePosition === pos ? "#fff" : "#4b5563" }}>{pos}</button>
                                ))}
                            </div>
                        </div>

                        {/* Title Font Size */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Title Font Size: {currentBox.titleFontSize}px</label>
                            <input type="range" min={12} max={48} value={currentBox.titleFontSize} onChange={(e) => updateBox(currentBox.id, { titleFontSize: Number(e.target.value) })} style={{ width: "100%" }} />
                        </div>

                        {/* Title Colors */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Title Default Color</label>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <input type="color" value={currentBox.titleColor} onChange={(e) => updateBox(currentBox.id, { titleColor: e.target.value })} style={{ width: 36, height: 36, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" }} />
                                    <input type="text" value={currentBox.titleColor} onChange={(e) => updateBox(currentBox.id, { titleColor: e.target.value })} style={{ flex: 1, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 13, outline: "none" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Title Highlight Color <span style={{ fontWeight: 400, color: "#9ca3af" }}>[h]...[h]</span></label>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <input type="color" value={currentBox.titleHighlightColor} onChange={(e) => updateBox(currentBox.id, { titleHighlightColor: e.target.value })} style={{ width: 36, height: 36, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" }} />
                                    <input type="text" value={currentBox.titleHighlightColor} onChange={(e) => updateBox(currentBox.id, { titleHighlightColor: e.target.value })} style={{ flex: 1, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 13, outline: "none" }} />
                                </div>
                            </div>
                        </div>

                        {/* Toggle options */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                            {([
                                { key: "showTitle", label: "Title" },
                                { key: "showCategory", label: "Category" },
                                { key: "showUser", label: "User" },
                                { key: "showDate", label: "Date" },
                                { key: "showPostImage", label: "Post Image" },
                                { key: "showReadMore", label: "Read More" },
                            ] as const).map((opt) => {
                                const checked = currentBox[opt.key as keyof BoxConfig] as boolean;
                                return (
                                    <label key={opt.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid " + (checked ? "#c7d2fe" : "#e5e7eb"), background: checked ? "#eef2ff" : "#fff", color: checked ? "#4338ca" : "#6b7280", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                        <input type="checkbox" checked={checked} onChange={(e) => updateBox(currentBox.id, { [opt.key]: e.target.checked })} style={{ display: "none" }} />
                                        <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid " + (checked ? "#6366f1" : "#d1d5db"), background: checked ? "#6366f1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            {checked && <Icon icon="solar:check-read-bold" width={10} style={{ color: "#fff" }} />}
                                        </span>
                                        {opt.label}
                                    </label>
                                );
                            })}
                        </div>

                        {/* Preview */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Preview</label>
                            <div style={{ borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "#f9fafb" }}>
                                <div style={{ width: Math.min(currentBox.width, 300), height: Math.min(currentBox.height, 200), background: resolvePreviewBg(), display: "flex", alignItems: "center", justifyContent: "center", color: currentBox.titleColor, fontSize: currentBox.titleFontSize * 0.7, fontFamily: "sans-serif" }}>
                                    <div style={{ textAlign: "center", padding: "0 16px" }}>
                                        {currentBox.showTitle && <p style={{ fontWeight: 800, margin: 0 }}><span style={{ color: currentBox.titleColor }}>Sample </span><span style={{ color: currentBox.titleHighlightColor }}>Title</span></p>}
                                        {currentBox.showUser && <p style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>Author Name</p>}
                                        {currentBox.showDate && <p style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>2026-06-28</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={handleSave} disabled={saving} style={{ width: "100%", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 600, color: "#fff", background: "#6366f1", border: "none", cursor: "pointer", opacity: saving ? 0.55 : 1 }}>
                {saving ? "Saving..." : "Save All Box Settings"}
            </button>
        </div>
    );
}
