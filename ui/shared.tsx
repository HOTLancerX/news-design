export interface PostData {
    _id: string;
    title: string;
    slug: string;
    type: string;
    status: string;
    createdAt: string;
    info: Record<string, string>;
    user: { name: string; image: string };
    images: string[];
    category: { name: string; color: string } | null;
}

export interface BoxConfigData {
    id: number;
    name: string;
    bgType: "image" | "color" | "gradient";
    bgValue: string;
    gradientColor2: string;
    gradientAngle: number;
    titlePosition: "top" | "center" | "bottom";
    titleFontSize: number;
    titleColor: string;
    titleHighlightColor: string;
    showTitle: boolean;
    showCategory: boolean;
    showUser: boolean;
    showDate: boolean;
    showPostImage: boolean;
    showReadMore: boolean;
    width: number;
    height: number;
}

export interface SettingsData {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    watermarkImage: string;
    readMoreText: string;
}

export function resolveBoxBg(b: BoxConfigData): string {
    if (b.bgType === "color") return b.bgValue || "#ffffff";
    if (b.bgType === "gradient") return "linear-gradient(" + b.gradientAngle + "deg, " + b.bgValue + ", " + b.gradientColor2 + ")";
    if (b.bgType === "image" && b.bgValue) return "url(" + b.bgValue + ") center/cover no-repeat";
    return "#ffffff";
}

export function formatDate(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    const day = d.getDate();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + day + ", " + d.getFullYear();
}

export function isLightColor(hex: string): boolean {
    const c = hex.replace("#", "");
    if (c.length !== 6) return false;
    const r = parseInt(c.slice(0,2),16);
    const g = parseInt(c.slice(2,4),16);
    const b = parseInt(c.slice(4,6),16);
    return (r*299 + g*587 + b*114) / 1000 > 128;
}

export function hexToRgba(hex: string, alpha: number): string {
    const c = hex.replace("#", "");
    if (c.length !== 6) return "rgba(0,0,0," + alpha + ")";
    return "rgba(" + parseInt(c.slice(0,2),16) + "," + parseInt(c.slice(2,4),16) + "," + parseInt(c.slice(4,6),16) + "," + alpha + ")";
}

export function parseTitle(title: string, defaultColor: string, highlightColor: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /\[h\](.*?)\[h\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(title)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={lastIndex} style={{ color: defaultColor }}>{title.slice(lastIndex, match.index)}</span>);
        }
        parts.push(<span key={match.index} style={{ color: highlightColor }}>{match[1]}</span>);
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < title.length) {
        parts.push(<span key={lastIndex} style={{ color: defaultColor }}>{title.slice(lastIndex)}</span>);
    }
    if (parts.length === 0) {
        parts.push(<span key="full" style={{ color: defaultColor }}>{title}</span>);
    }
    return parts;
}
