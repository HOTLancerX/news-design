import React from "react";
import type { PostData, BoxConfigData, SettingsData } from "./shared";
import { resolveBoxBg, formatDate, isLightColor, hexToRgba, parseTitle } from "./shared";

export default function Style10(p: PostData, b: BoxConfigData, s: SettingsData): React.ReactNode {
    return (
        <div style={{ width: b.width, height: b.height, fontFamily: s.fontFamily, position: "relative", overflow: "hidden", background: resolveBoxBg(b) }}>
            {b.showPostImage && p.images[0] && (
                <img src={p.images[0]} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            )}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.92) 100%)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 18, zIndex: 5 }}>
                <div>
                    {s.logo && <img src={s.logo} alt="" style={{ height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" }} crossOrigin="anonymous" />}
                </div>
                <div>
                    {b.showCategory && p.category && (
                        <span style={{ display: "inline-block", background: p.category.color || s.primaryColor, color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3, marginBottom: 8 }}>{p.category.name}</span>
                    )}
                    {b.showTitle && (
                        <h3 style={{ fontSize: b.titleFontSize + "px", fontWeight: 800, color: "#ffffff", lineHeight: s.lineHeight, margin: 0 }}>{parseTitle(p.title, "#ffffff", b.titleHighlightColor)}</h3>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {b.showUser && p.user && p.user.image && <img src={p.user.image} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} crossOrigin="anonymous" />}
                            {b.showUser && p.user && <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>{p.user.name}</span>}
                            {b.showDate && <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginLeft: 6 }}>{formatDate(p.createdAt)}</span>}
                        </div>
                        {b.showReadMore && (
                            <span style={{ display: "inline-block", padding: "5px 16px", background: s.primaryColor, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s.readMoreText}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
