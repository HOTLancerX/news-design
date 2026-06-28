import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style8(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: "#ffffff", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 18px 14px", zIndex: 5 }}>
                {b.showCategory && p.category && (
                    <span style={{ color: p.category.color || "#dc2626", fontSize: 11, fontWeight: 600, marginBottom: 6, display: "block" }}>{p.category.name}</span>
                )}
                {b.showTitle && (
                    <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0 }}>{parseTitle(p.title, b.titleColor, b.titleHighlightColor)}</h3>
                )}
            </div>
            <div style={{ flex: 1, padding: "0 18px", display: "flex", alignItems: "center" }}>
                {b.showPostImage && p.images[0] && (
                    <div style={{ width: "100%", height: "100%", borderRadius: 6, overflow: "hidden" }}>
                        <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                    </div>
                )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #f0f0f0", zIndex: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {b.showUser && p.user && p.user.image && <img src={p.user.image} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />}
                    {b.showUser && p.user && <span style={{ color: "#555", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>}
                </div>
                {b.showDate && <span style={{ color: "#999", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
            </div>
        </div>
    );
}
