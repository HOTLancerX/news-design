import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style5(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    const bg = resolveBoxBg(b);
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "row" }}>
            <div style={{ width: "45%", height: "100%", flexShrink: 0, position: "relative" }}>
                {b.showPostImage && p.images[0] && (
                    <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                )}
            </div>
            <div style={{ flex: 1, background: bg, display: "flex", flexDirection: "column", padding: "18px 16px", justifyContent: "space-between" }}>
                <div>
                    {b.showDate && <span style={{ color: isLightColor(bg) ? "#999" : "rgba(255,255,255,0.7)", fontSize: 11, display: "block", marginBottom: 8 }}>{formatDate(p.createdAt)}</span>}
                    {b.showCategory && p.category && (
                        <span style={{ display: "inline-block", background: p.category.color || "#dc2626", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3, marginBottom: 10 }}>{p.category.name}</span>
                    )}
                    {b.showTitle && (
                        <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: "6px 0 0" }}>{parseTitle(p.title, b.titleColor, b.titleHighlightColor)}</h3>
                    )}
                </div>
                <div>
                    {b.showUser && p.user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            {p.user.image && <img src={p.user.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />}
                            <span style={{ color: isLightColor(bg) ? "#555" : "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>
                        </div>
                    )}
                    {b.showReadMore && (
                        <span style={{ display: "inline-block", padding: "6px 18px", background: s.primaryColor, color: "#fff", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.readMoreText}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
