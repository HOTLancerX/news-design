import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style6(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: "#ffffff", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "2px solid " + s.primaryColor }}>
                {s.logo && <img src={s.logo} alt="" style={{ height: 24, objectFit: "contain" }} crossOrigin="anonymous" />}
                {b.showDate && <span style={{ color: "#999", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 16px 10px" }}>
                {b.showPostImage && p.images[0] && (
                    <div style={{ borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                        <img src={p.images[0]} alt="" style={{ width: "100%", height: "55%", objectFit: "cover" }} crossOrigin="anonymous" />
                    </div>
                )}
                {b.showCategory && p.category && (
                    <span style={{ color: p.category.color || "#dc2626", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{p.category.name}</span>
                )}
                {b.showTitle && (
                    <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, flex: 1 }}>{parseTitle(p.title, b.titleColor, b.titleHighlightColor)}</h3>
                )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid #f0f0f0" }}>
                {b.showUser && p.user && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {p.user.image && <img src={p.user.image} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />}
                        <span style={{ color: "#555", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>
                    </div>
                )}
                {b.showReadMore && <span style={{ color: s.primaryColor, fontSize: 11, fontWeight: 600 }}>{s.readMoreText}</span>}
            </div>
        </div>
    );
}
