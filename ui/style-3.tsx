import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style3(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: "#ffffff", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", width: "100%", height: "55%", flexShrink: 0 }}>
                {b.showPostImage && p.images[0] && (
                    <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                )}
                <div style={{ position: "absolute", bottom: -18, left: 18, width: 36, height: 36, borderRadius: "50%", background: s.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                    {s.logo && <img src={s.logo} alt="" style={{ height: 18, width: 18, objectFit: "contain", filter: "brightness(0) invert(1)" }} crossOrigin="anonymous" />}
                </div>
            </div>
            <div style={{ flex: 1, padding: "28px 18px 0", display: "flex", flexDirection: "column" }}>
                {b.showCategory && p.category && (
                    <span style={{ color: p.category.color || "#dc2626", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{p.category.name}</span>
                )}
                {b.showTitle && (
                    <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, color: "#dc2626", lineHeight: s.lineHeight, margin: 0 }}>{parseTitle(p.title, b.titleColor, b.titleHighlightColor)}</h3>
                )}
                <div style={{ marginTop: "auto", borderTop: "2px solid #eee", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {b.showDate && <span style={{ color: "#999", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
                    {b.showReadMore && <span style={{ color: s.primaryColor, fontSize: 11, fontWeight: 600 }}>{s.readMoreText}</span>}
                </div>
            </div>
        </div>
    );
}
