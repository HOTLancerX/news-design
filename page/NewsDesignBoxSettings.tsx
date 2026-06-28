"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

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
            <div className="flex items-center justify-center py-24 text-gray-400">
                <Icon icon="svg-spinners:ring-resize" width={32} />
            </div>
        );
    }

    const currentBox = boxes.find((b) => b.id === activeBox) ?? boxes[0];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">News Design Box Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configure each of the 10 box designs for your news canvases.
                </p>
            </div>

            {message && (
                <div className={`rounded-lg px-4 py-3 text-sm font-medium border ${
                    message.startsWith("Error")
                        ? "bg-red-400/10 text-red-400 border-red-400/25"
                        : "bg-emerald-400/10 text-emerald-400 border-emerald-400/25"
                }`}>
                    {message}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Box selector */}
                <div className="lg:w-48 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Box</p>
                        <div className="grid grid-cols-5 lg:grid-cols-2 gap-2">
                            {boxes.map((box) => (
                                <button
                                    key={box.id}
                                    onClick={() => setActiveBox(box.id)}
                                    className={`flex items-center justify-center p-2 rounded-lg text-xs font-semibold transition ${
                                        activeBox === box.id
                                            ? "bg-indigo-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {box.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Box settings */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm">
                                {currentBox.id}
                            </span>
                            <input
                                type="text"
                                value={currentBox.name}
                                onChange={(e) => updateBox(currentBox.id, { name: e.target.value })}
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Background type */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Background Type</label>
                            <div className="flex gap-2">
                                {(["image", "color", "gradient"] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => updateBox(currentBox.id, { bgType: t })}
                                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                                            currentBox.bgType === t
                                                ? "bg-indigo-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Background value */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                {currentBox.bgType === "color" ? "Background Color" : currentBox.bgType === "gradient" ? "Gradient CSS" : "Background Image URL"}
                            </label>
                            {currentBox.bgType === "color" ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={currentBox.bgValue}
                                        onChange={(e) => updateBox(currentBox.id, { bgValue: e.target.value })}
                                        className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={currentBox.bgValue}
                                        onChange={(e) => updateBox(currentBox.id, { bgValue: e.target.value })}
                                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                    />
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={currentBox.bgValue}
                                    onChange={(e) => updateBox(currentBox.id, { bgValue: e.target.value })}
                                    placeholder={currentBox.bgType === "gradient" ? "linear-gradient(135deg, #1e40af, #3b82f6)" : "https://..."}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                />
                            )}
                        </div>

                        {/* Dimensions */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-700">Width (px)</label>
                                <input
                                    type="number"
                                    value={currentBox.width}
                                    onChange={(e) => updateBox(currentBox.id, { width: Number(e.target.value) })}
                                    min="200"
                                    max="1200"
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-700">Height (px)</label>
                                <input
                                    type="number"
                                    value={currentBox.height}
                                    onChange={(e) => updateBox(currentBox.id, { height: Number(e.target.value) })}
                                    min="200"
                                    max="1200"
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Title position */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Title Position</label>
                            <div className="flex gap-2">
                                {(["top", "center", "bottom"] as const).map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => updateBox(currentBox.id, { titlePosition: pos })}
                                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                                            currentBox.titlePosition === pos
                                                ? "bg-indigo-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle options */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {([
                                { key: "showTitle", label: "Show Title" },
                                { key: "showUser", label: "Show User" },
                                { key: "showDate", label: "Show Date" },
                                { key: "showPostImage", label: "Show Post Image" },
                                { key: "showReadMore", label: "Show Read More" },
                            ] as const).map((opt) => (
                                <label
                                    key={opt.key}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition ${
                                        currentBox[opt.key]
                                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                                            : "border-gray-200 bg-white text-gray-500"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={currentBox[opt.key]}
                                        onChange={(e) => updateBox(currentBox.id, { [opt.key]: e.target.checked })}
                                        className="sr-only"
                                    />
                                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                        currentBox[opt.key] ? "bg-indigo-500 border-indigo-500" : "border-gray-300"
                                    }`}>
                                        {currentBox[opt.key] && (
                                            <Icon icon="solar:check-read-bold" width={10} className="text-white" />
                                        )}
                                    </span>
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {/* Preview */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-700">Preview</label>
                            <div
                                className="rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center text-white text-sm font-semibold"
                                style={{
                                    width: Math.min(currentBox.width, 300),
                                    height: Math.min(currentBox.height, 200),
                                    background: currentBox.bgType === "color"
                                        ? currentBox.bgValue
                                        : currentBox.bgType === "gradient"
                                        ? currentBox.bgValue
                                        : `url(${currentBox.bgValue}) center/cover`,
                                    color: currentBox.bgType === "color" && isLightColor(currentBox.bgValue) ? "#1f2937" : "#ffffff",
                                }}
                            >
                                <div className="text-center px-4">
                                    {currentBox.showTitle && <p className="font-bold">Sample Title</p>}
                                    {currentBox.showUser && <p className="text-xs opacity-75 mt-1">Author Name</p>}
                                    {currentBox.showDate && <p className="text-xs opacity-75">2026-06-28</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-55 disabled:cursor-not-allowed"
            >
                {saving ? "Saving..." : "Save All Box Settings"}
            </button>
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
