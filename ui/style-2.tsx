import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style2(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    const bg = resolveBoxBg(b);
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: bg, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 5 }}>
                {b.showDate && <span style={{ color: "#666", fontSize: 12, fontWeight: 500 }}>{formatDate(p.createdAt)}</span>}
                {s.logo && <img src={s.logo} alt="" style={{ height: 30, objectFit: "contain" }} crossOrigin="anonymous" />}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "12px 18px 10px", zIndex: 2 }}>
                {b.showPostImage && p.images[0] && (
                    <div style={{ flex: 1, position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                        <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                    </div>
                )}
                {b.showCategory && p.category && (
                    <span style={{ display: "inline-block", background: p.category.color || "#dc2626", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3, marginBottom: 8, alignSelf: "flex-start" }}>{p.category.name}</span>
                )}
                {b.showTitle && (
                    <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0, textAlign: "center" }}>{parseTitle(p.title, b.titleColor, b.titleHighlightColor)}</h3>
                )}
                <span style={{ fontSize: 11, color: "#999", marginTop: 4, textAlign: "center" }}>File Photo</span>
            </div>
        </div>
    );
}
