import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style1(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    const bg = resolveBoxBg(b);
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: bg }}>
            <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
                {s.logo && <img src={s.logo} alt="" style={{ height: 32, objectFit: "contain" }} crossOrigin="anonymous" />}
            </div>
            <div style={{ flex: 1, margin: "0 16px", borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px", position: "relative", zIndex: 2 }}>
                {b.showPostImage && p.images[0] && (
                    <img src={p.images[0]} alt="" style={{ width: "100%", height: "55%", objectFit: "cover", borderRadius: 4 }} crossOrigin="anonymous" />
                )}
                {b.showTitle && (
                    <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: "12px 0 8px", textAlign: "center" }}>{parseTitle(p.title, b.titleColor, b.titleHighlightColor)}</h3>
                )}
                {b.showReadMore && (
                    <span style={{ display: "inline-block", padding: "6px 20px", background: s.primaryColor, color: "#fff", borderRadius: 20, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{s.readMoreText}</span>
                )}
            </div>
            <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {s.logo && <img src={s.logo} alt="" style={{ height: 24, objectFit: "contain" }} crossOrigin="anonymous" />}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {b.showCategory && p.category && <span style={{ color: isLightColor(bg) ? p.category.color || "#dc2626" : "#ffffff", fontSize: 11, fontWeight: 600 }}>{p.category.name}</span>}
                    {b.showDate && <span style={{ color: isLightColor(bg) ? "#6b7280" : "#ffffff", fontSize: 11, opacity: 0.8 }}>{formatDate(p.createdAt)}</span>}
                </div>
            </div>
        </div>
    );
}
