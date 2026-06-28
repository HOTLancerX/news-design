"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Gallery from "@/components/Gallery";

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

const FONT_OPTIONS = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
];

export default function NewsDesignSettings() {
    const [settings, setSettings] = useState<DefaultSettings>(DEFAULT_VALUES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/news-design/settings", { cache: "no-store" })
            .then((r) => r.json())
            .then((data) => {
                if (data.settings) {
                    setSettings({ ...DEFAULT_VALUES, ...data.settings });
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/news-design/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings }),
            });
            if (!res.ok) throw new Error("Failed to save");
            setMessage("Settings saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch {
            setMessage("Error saving settings");
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

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">News Design Default Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configure default values for all news design canvases.
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

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                {/* Logo */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Logo</label>
                    <Gallery
                        multiple={false}
                        value={settings.logo}
                        onChange={(v) => setSettings({ ...settings, logo: Array.isArray(v) ? (v[0] ?? "") : v })}
                        placeholder="Select logo"
                    />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Primary Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.primaryColor}
                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Secondary Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.secondaryColor}
                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.secondaryColor}
                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Font Family */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Font Family</label>
                    <select
                        value={settings.fontFamily}
                        onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    >
                        {FONT_OPTIONS.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>

                {/* Font Size & Line Height */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Font Size (px)</label>
                        <input
                            type="number"
                            value={settings.fontSize}
                            onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                            min="8"
                            max="72"
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Line Height</label>
                        <input
                            type="number"
                            value={settings.lineHeight}
                            onChange={(e) => setSettings({ ...settings, lineHeight: e.target.value })}
                            min="1"
                            max="3"
                            step="0.1"
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Watermark */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Watermark Image</label>
                    <Gallery
                        multiple={false}
                        value={settings.watermarkImage}
                        onChange={(v) => setSettings({ ...settings, watermarkImage: Array.isArray(v) ? (v[0] ?? "") : v })}
                        placeholder="Select watermark image"
                    />
                </div>

                {/* Read More Text */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Read More Text</label>
                    <input
                        type="text"
                        value={settings.readMoreText}
                        onChange={(e) => setSettings({ ...settings, readMoreText: e.target.value })}
                        placeholder="Read details"
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-400">This text will appear on the canvas design</p>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-55 disabled:cursor-not-allowed"
            >
                {saving ? "Saving..." : "Save Settings"}
            </button>
        </div>
    );
}
