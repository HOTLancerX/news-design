import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style7(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    const bg = resolveBoxBg(b);
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: bg, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 18px 0", display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
                {s.logo && <img src={s.logo} alt="" style={{ height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" }} crossOrigin="anonymous" />}
                {b.showCategory && p.category && (
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 600, opacity: 0.85 }}>{p.category.name}</span>
                )}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "14px 18px 16px" }}>
                {b.showTitle && (
                    <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, color: "#ffffff", lineHeight: s.lineHeight, margin: 0 }}>{parseTitle(p.title, "#ffffff", b.titleHighlightColor)}</h3>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {b.showPostImage && p.images[0] && (
                        <div style={{ borderRadius: 8, overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" }}>
                            <img src={p.images[0]} alt="" style={{ width: "100%", height: "50%", objectFit: "cover", display: "block" }} crossOrigin="anonymous" />
                        </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {b.showUser && p.user && p.user.image && <img src={p.user.image} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />}
                            {b.showUser && p.user && <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>}
                        </div>
                        {b.showDate && <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
