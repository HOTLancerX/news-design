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
    user: { name: string; image: string };
    images: string[];
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
    layout: string;
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

const EMPTY_POST: Post = {
    _id: "", title: "", slug: "", type: "", status: "",
    createdAt: "", info: {}, user: { name: "", image: "" }, images: [],
};

function formatDate(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    const day = d.getDate();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[d.getMonth()]} ${day}, ${d.getFullYear()}`;
}

function getTextColor(bgType: string, bgValue: string): string {
    if (bgType === "color") return isLightColor(bgValue) ? "#1f2937" : "#ffffff";
    return "#ffffff";
}

function hexToRgba(hex: string, alpha: number): string {
    const c = hex.replace("#", "");
    if (c.length !== 6) return "rgba(0,0,0," + alpha + ")";
    return "rgba(" + parseInt(c.slice(0,2),16) + "," + parseInt(c.slice(2,4),16) + "," + parseInt(c.slice(4,6),16) + "," + alpha + ")";
}

function isLightColor(hex: string): boolean {
    const c = hex.replace("#", "");
    if (c.length !== 6) return false;
    const r = parseInt(c.slice(0,2),16);
    const g = parseInt(c.slice(2,4),16);
    const b = parseInt(c.slice(4,6),16);
    return (r*299 + g*587 + b*114) / 1000 > 128;
}

function resolveBoxBg(b: BoxConfig): string {
    if (b.bgType === "color") return b.bgValue || "#ffffff";
    if (b.bgType === "gradient") return b.bgValue || "linear-gradient(135deg, #667eea, #764ba2)";
    if (b.bgType === "image" && b.bgValue) return "url(" + b.bgValue + ") center/cover no-repeat";
    return "#ffffff";
}

type BoxRenderer = {
    (p: Post, b: BoxConfig, s: DefaultSettings): React.ReactNode;
};

const renderBox1: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: resolveBoxBg(b) }}>
        <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
            {s.logo && <img src={s.logo} alt="" style={{ height: 32, objectFit: "contain" }} crossOrigin="anonymous" />}
        </div>
        <div style={{ flex: 1, background: "#ffffff", margin: "0 16px", borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px", position: "relative", zIndex: 2 }}>
            {b.showPostImage && p.images[0] && (
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "55%", objectFit: "cover", borderRadius: 4 }} crossOrigin="anonymous" />
            )}
            {b.showTitle && (
                <h3 style={{ fontSize: Math.max(18, Number(s.fontSize) + 6) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: "12px 0 8px", textAlign: "center", color: "#1d4ed8" }}>{p.title}</h3>
            )}
            {b.showReadMore && (
                <span style={{ display: "inline-block", padding: "6px 20px", background: "#dc2626", color: "#fff", borderRadius: 20, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{s.readMoreText}</span>
            )}
        </div>
        <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {s.logo && <img src={s.logo} alt="" style={{ height: 24, objectFit: "contain" }} crossOrigin="anonymous" />}
            </div>
            {b.showDate && <span style={{ color: "#ffffff", fontSize: 11, opacity: 0.8 }}>{formatDate(p.createdAt)}</span>}
        </div>
    </div>
);

const renderBox2: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
        <div style={{ padding: "14px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
            {b.showDate && <span style={{ color: "#374151", fontSize: 12 }}>{formatDate(p.createdAt)}</span>}
            {s.logo && <img src={s.logo} alt="" style={{ height: 28, objectFit: "contain" }} crossOrigin="anonymous" />}
        </div>
        {b.showTitle && (
            <div style={{ padding: "8px 20px 12px", zIndex: 5 }}>
                <h3 style={{ fontSize: Math.max(18, Number(s.fontSize) + 6) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, color: "#1e3a5f", textAlign: "center" }}>{p.title}</h3>
            </div>
        )}
        {b.showPostImage && p.images[0] && (
            <div style={{ flex: 1, margin: "0 20px", borderRadius: 8, overflow: "hidden", zIndex: 2 }}>
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            </div>
        )}
        <div style={{ padding: "8px 20px 12px", textAlign: "center", zIndex: 5 }}>
            <span style={{ fontSize: 11, color: "#6b7280" }}>File Photo</span>
        </div>
    </div>
);

const renderBox3: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "#ffffff" }}>
        {b.showPostImage && p.images[0] && (
            <div style={{ position: "relative", height: "55%", overflow: "hidden" }}>
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 44, height: 44, borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 3 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff" }} />
                </div>
            </div>
        )}
        {b.showTitle && (
            <div style={{ padding: "16px 24px 8px", flex: 1, display: "flex", alignItems: "center", zIndex: 5 }}>
                <h3 style={{ fontSize: Math.max(18, Number(s.fontSize) + 6) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, color: "#dc2626", textAlign: "center", width: "100%" }}>{p.title}</h3>
            </div>
        )}
        <div style={{ padding: "8px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e5e7eb", zIndex: 5 }}>
            {b.showDate && <span style={{ color: "#374151", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
            <span style={{ color: "#6b7280", fontSize: 11 }}>{window?.location?.hostname || "website.com"}</span>
        </div>
    </div>
);

const renderBox4: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: "#111827", display: "flex", flexDirection: "column" }}>
        {b.showPostImage && p.images[0] && (
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }} />
            </div>
        )}
        <div style={{ position: "absolute", top: 14, left: 16, zIndex: 10, display: "flex", alignItems: "center", gap: 8 }}>
            {s.logo && <img src={s.logo} alt="" style={{ height: 28, objectFit: "contain" }} crossOrigin="anonymous" />}
        </div>
        <div style={{ flex: 1 }} />
        {b.showTitle && (
            <div style={{ padding: "0 20px 10px", zIndex: 10 }}>
                <h3 style={{ fontSize: Math.max(18, Number(s.fontSize) + 4) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, color: "#ffffff" }}>{p.title}</h3>
            </div>
        )}
        {b.showUser && p.user.name && (
            <div style={{ padding: "0 20px 8px", display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
                {p.user.image ? (
                    <img src={p.user.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />
                ) : (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>{p.user.name.charAt(0).toUpperCase()}</div>
                )}
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{p.user.name}</span>
            </div>
        )}
        <div style={{ padding: "8px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {b.showDate && <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
            {b.showReadMore && <span style={{ padding: "4px 14px", background: s.primaryColor, color: "#fff", borderRadius: 16, fontSize: 11, fontWeight: 600 }}>{s.readMoreText}</span>}
        </div>
    </div>
);

const renderBox5: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "row", background: "#ffffff" }}>
        <div style={{ width: "45%", position: "relative" }}>
            {b.showPostImage && p.images[0] && (
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            )}
        </div>
        <div style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "center", background: b.bgType === "color" ? b.bgValue : "#ffffff", zIndex: 2 }}>
            {b.showDate && <span style={{ color: "#9ca3af", fontSize: 11, marginBottom: 8 }}>{formatDate(p.createdAt)}</span>}
            {b.showTitle && (
                <h3 style={{ fontSize: Math.max(15, Number(s.fontSize)) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: "8px 0", color: getTextColor(b.bgType, b.bgValue) }}>{p.title}</h3>
            )}
            {b.showUser && p.user.name && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    {p.user.image ? (
                        <img src={p.user.image} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />
                    ) : (
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>{p.user.name.charAt(0).toUpperCase()}</div>
                    )}
                    <span style={{ color: isLightColor(b.bgType === "color" ? b.bgValue : "#ffffff") ? "#6b7280" : "rgba(255,255,255,0.75)", fontSize: 11 }}>{p.user.name}</span>
                </div>
            )}
            {b.showReadMore && (
                <span style={{ display: "inline-block", marginTop: 10, padding: "5px 14px", background: s.primaryColor, color: "#fff", borderRadius: 4, fontSize: 11, fontWeight: 600, alignSelf: "flex-start" }}>{s.readMoreText}</span>
            )}
        </div>
        {s.watermarkImage && <img src={s.watermarkImage} alt="" style={{ position: "absolute", bottom: 10, right: 10, maxHeight: 40, opacity: 0.15, zIndex: 1 }} crossOrigin="anonymous" />}
    </div>
);

const renderBox6: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "#ffffff", border: "1px solid #e5e7eb" }}>
        <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid " + s.primaryColor }}>
            {s.logo && <img src={s.logo} alt="" style={{ height: 24, objectFit: "contain" }} crossOrigin="anonymous" />}
            {b.showDate && <span style={{ color: "#6b7280", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
        </div>
        {b.showPostImage && p.images[0] && (
            <div style={{ margin: "12px 20px", borderRadius: 6, overflow: "hidden", flex: 1 }}>
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            </div>
        )}
        {b.showTitle && (
            <div style={{ padding: "0 20px 6px" }}>
                <h3 style={{ fontSize: Math.max(16, Number(s.fontSize) + 2) + "px", fontWeight: 700, lineHeight: s.lineHeight, margin: 0, color: "#111827" }}>{p.title}</h3>
            </div>
        )}
        {b.showUser && p.user.name && (
            <div style={{ padding: "4px 20px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700 }}>
                    {p.user.image ? <img src={p.user.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" /> : p.user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: "#6b7280", fontSize: 11 }}>{p.user.name}</span>
            </div>
        )}
    </div>
);

const renderBox7: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, " + s.primaryColor + ", " + s.secondaryColor + ")" }}>
        <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
            {s.logo && <img src={s.logo} alt="" style={{ height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" }} crossOrigin="anonymous" />}
            {b.showDate && <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
        </div>
        {b.showTitle && (
            <div style={{ padding: "8px 20px 12px", zIndex: 5 }}>
                <h3 style={{ fontSize: Math.max(18, Number(s.fontSize) + 4) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, color: "#ffffff" }}>{p.title}</h3>
            </div>
        )}
        {b.showPostImage && p.images[0] && (
            <div style={{ flex: 1, margin: "0 20px 12px", borderRadius: 8, overflow: "hidden", zIndex: 2 }}>
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            </div>
        )}
        {b.showUser && p.user.name && (
            <div style={{ padding: "0 20px 14px", display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
                {p.user.image ? (
                    <img src={p.user.image} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)" }} crossOrigin="anonymous" />
                ) : (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>{p.user.name.charAt(0).toUpperCase()}</div>
                )}
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>
            </div>
        )}
    </div>
);

const renderBox8: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "#ffffff" }}>
        {b.showTitle && (
            <div style={{ padding: "18px 20px 10px", zIndex: 5 }}>
                <h3 style={{ fontSize: Math.max(20, Number(s.fontSize) + 8) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, color: "#111827" }}>{p.title}</h3>
            </div>
        )}
        {b.showPostImage && p.images[0] && (
            <div style={{ flex: 1, margin: "8px 20px", borderRadius: 8, overflow: "hidden", zIndex: 2 }}>
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            </div>
        )}
        <div style={{ padding: "10px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", zIndex: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {b.showUser && p.user.name && (
                    <>
                        {p.user.image ? (
                            <img src={p.user.image} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />
                        ) : (
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>{p.user.name.charAt(0).toUpperCase()}</div>
                        )}
                        <span style={{ color: "#374151", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>
                    </>
                )}
            </div>
            {b.showDate && <span style={{ color: "#9ca3af", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
        </div>
        {s.watermarkImage && <img src={s.watermarkImage} alt="" style={{ position: "absolute", bottom: 10, right: 10, maxHeight: 40, opacity: 0.15, zIndex: 1 }} crossOrigin="anonymous" />}
    </div>
);

const renderBox9: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "row", background: s.primaryColor }}>
        <div style={{ width: 8, background: "#ffffff", zIndex: 3 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#ffffff", zIndex: 2 }}>
            <div style={{ padding: "14px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {s.logo && <img src={s.logo} alt="" style={{ height: 24, objectFit: "contain" }} crossOrigin="anonymous" />}
                {b.showDate && <span style={{ color: "#9ca3af", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
            </div>
            {b.showTitle && (
                <div style={{ padding: "4px 16px 8px" }}>
                    <h3 style={{ fontSize: Math.max(16, Number(s.fontSize) + 2) + "px", fontWeight: 700, lineHeight: s.lineHeight, margin: 0, color: "#111827" }}>{p.title}</h3>
                </div>
            )}
            {b.showPostImage && p.images[0] && (
                <div style={{ flex: 1, margin: "0 16px 12px", borderRadius: 6, overflow: "hidden" }}>
                    <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                </div>
            )}
            {b.showUser && p.user.name && (
                <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    {p.user.image ? (
                        <img src={p.user.image} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />
                    ) : (
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700 }}>{p.user.name.charAt(0).toUpperCase()}</div>
                    )}
                    <span style={{ color: "#6b7280", fontSize: 11 }}>{p.user.name}</span>
                </div>
            )}
        </div>
    </div>
);

const renderBox10: BoxRenderer = (p, b, s) => (
    <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "#ffffff" }}>
        {b.showPostImage && p.images[0] && (
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
            {s.logo && <img src={s.logo} alt="" style={{ height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" }} crossOrigin="anonymous" />}
            {b.showDate && <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
        </div>
        <div style={{ flex: 1 }} />
        {b.showTitle && (
            <div style={{ padding: "0 20px 8px", zIndex: 10 }}>
                <h3 style={{ fontSize: Math.max(18, Number(s.fontSize) + 6) + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, color: "#ffffff" }}>{p.title}</h3>
            </div>
        )}
        <div style={{ padding: "6px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {b.showUser && p.user.name && (
                    <>
                        {p.user.image ? (
                            <img src={p.user.image} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)" }} crossOrigin="anonymous" />
                        ) : (
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>{p.user.name.charAt(0).toUpperCase()}</div>
                        )}
                        <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>{p.user.name}</span>
                    </>
                )}
            </div>
            {b.showReadMore && <span style={{ padding: "5px 14px", background: s.primaryColor, color: "#fff", borderRadius: 16, fontSize: 11, fontWeight: 600 }}>{s.readMoreText}</span>}
        </div>
    </div>
);

const BOX_RENDERERS: Record<number, BoxRenderer> = {
    1: renderBox1, 2: renderBox2, 3: renderBox3, 4: renderBox4, 5: renderBox5,
    6: renderBox6, 7: renderBox7, 8: renderBox8, 9: renderBox9, 10: renderBox10,
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
                const list = postsData.posts ?? [];
                setPosts(list);
                if (settingsData.settings) setSettings({ ...DEFAULT_SETTINGS, ...settingsData.settings });
                if (boxesData.boxes) setBoxes(boxesData.boxes);
                if (list.length > 0) setSelectedPost(list[0]._id);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const currentPost = posts.find((p) => p._id === selectedPost) ?? null;

    const getPostLink = useCallback(() => {
        if (!currentPost) return "";
        return (typeof window !== "undefined" ? window.location.origin : "") + "/" + currentPost.slug;
    }, [currentPost]);

    const getCopyText = useCallback(() => {
        if (!currentPost) return "";
        return currentPost.title + "\n" + getPostLink();
    }, [currentPost, getPostLink]);

    const handleCopy = () => {
        navigator.clipboard.writeText(getCopyText());
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
                onclone: (doc: Document) => {
                    const allEls = doc.querySelectorAll<HTMLElement>("*");
                    for (let i = 0; i < allEls.length; i++) allEls[i].removeAttribute("class");
                    const sheets = doc.querySelectorAll("style, link[rel='stylesheet']");
                    for (let i = 0; i < sheets.length; i++) sheets[i].remove();
                },
            });
            const link = document.createElement("a");
            link.download = "news-design-box-" + boxId + ".png";
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
                        onChange={(e) => setSelectedPost(e.target.value)}
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

                {currentPost && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#f9fafb", borderRadius: 8 }}>
                        {currentPost.images[0] && <img src={currentPost.images[0]} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentPost.title}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                                {currentPost.user.image ? (
                                    <img src={currentPost.user.image} alt="" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: settings.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                                        {currentPost.user.name?.charAt(0)?.toUpperCase() ?? "A"}
                                    </div>
                                )}
                                <span style={{ fontSize: 12, color: "#6b7280" }}>{currentPost.user.name || "Unknown"}</span>
                                <span style={{ fontSize: 12, color: "#9ca3af" }}>{formatDate(currentPost.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {currentPost && boxes.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: 0 }}>Canvas Previews</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                        {boxes.map((box) => {
                            const renderer = BOX_RENDERERS[box.id] ?? BOX_RENDERERS[1];
                            return (
                                <div key={box.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, fontSize: 12, fontWeight: 700, color: "#fff", background: "#6366f1" }}>{box.id}</span>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{box.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(box.id)}
                                            disabled={downloading === box.id}
                                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#fff", background: downloading === box.id ? "#9ca3af" : "#10b981", border: "none", cursor: "pointer", opacity: downloading === box.id ? 0.55 : 1 }}
                                        >
                                            {downloading === box.id ? <Icon icon="svg-spinners:ring-resize" width={12} /> : <Icon icon="solar:download-bold" width={12} />}
                                            Download
                                        </button>
                                    </div>
                                    <div style={{ padding: 16, display: "flex", justifyContent: "center", overflow: "hidden" }}>
                                        <div ref={(el) => { if (el) canvasRefs.current.set(box.id, el); }}>
                                            {renderer(currentPost, box, settings)}
                                        </div>
                                    </div>
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
        </div>
    );
}
