import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style4(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: resolveBoxBg(b) }}>
            {b.showPostImage && p.images[0] && (
                <img src={p.images[0]} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            )}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.9) 100%)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 18, zIndex: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {s.logo && <img src={s.logo} alt="" style={{ height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" }} crossOrigin="anonymous" />}
                </div>
                <div>
                    {b.showCategory && p.category && (
                        <span style={{ display: "inline-block", background: p.category.color || s.primaryColor, color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3, marginBottom: 8 }}>{p.category.name}</span>
                    )}
                    {b.showTitle && (
                        <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, color: "#ffffff", lineHeight: s.lineHeight, margin: 0 }}>{parseTitle(p.title, "#ffffff", b.titleHighlightColor)}</h3>
                    )}
                    {b.showUser && p.user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                            {p.user.image && <img src={p.user.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />}
                            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                        {b.showDate && <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{formatDate(p.createdAt)}</span>}
                        {b.showReadMore && <span style={{ color: "#fff", fontSize: 11, fontWeight: 600, opacity: 0.9 }}>{s.readMoreText}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
