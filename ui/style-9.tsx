import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style9(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", display: "flex", flexDirection: "row" }}>
            <div style={{ width: 8, flexShrink: 0, background: s.primaryColor }} />
            <div style={{ flex: 1, background: "#ffffff", display: "flex", flexDirection: "column", padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    {s.logo && <img src={s.logo} alt="" style={{ height: 22, objectFit: "contain" }} crossOrigin="anonymous" />}
                    {b.showDate && <span style={{ color: "#999", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
                </div>
                {b.showCategory && p.category && (
                    <span style={{ color: p.category.color || "#dc2626", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{p.category.name}</span>
                )}
                {b.showTitle && (
                    <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, lineHeight: s.lineHeight, margin: 0 }}>{parseTitle(p.title, b.titleColor, b.titleHighlightColor)}</h3>
                )}
                {b.showPostImage && p.images[0] && (
                    <div style={{ flex: 1, marginTop: 12, borderRadius: 4, overflow: "hidden" }}>
                        <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                    </div>
                )}
                {b.showUser && p.user && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 10 }}>
                        {p.user.image && <img src={p.user.image} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />}
                        <span style={{ color: "#555", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
