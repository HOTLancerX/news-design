import { addHook, type PluginMeta } from "@/hook";
import NewsDesignSettings from "./page/NewsDesignSettings";
import NewsDesignBoxSettings from "./page/NewsDesignBoxSettings";
import NewsDesignPage from "./page/NewsDesignPage";

export const PLUGINS: PluginMeta = {
    nx:          "com.system.news-design",
    name:        "news-design",
    version:     "1.0.0",
    description: "HTML to Canva design generator for news posts.",
    author:      "System",
    path:        "https://github.com/HOTLancerX/news-design.git",
    icon:        "solar:palette-bold",
    color:       "from-pink-500 to-rose-600",
};

export function register() {
    // ─── Admin nav items ────────────────────────────────────────────────────
    addHook("admin.nav", [
        {
            key: "news-design",
            label: "News Design",
            icon: "solar:palette-bold",
            slug: "news-design",
            parent: "",
            position: 35,
        },
        {
            key: "news-design-settings",
            label: "Default Settings",
            icon: "solar:settings-bold",
            slug: "news-design/settings",
            parent: "news-design",
            position: 1,
        },
        {
            key: "news-design-box",
            label: "Box Settings",
            icon: "solar:widget-bold",
            slug: "news-design/box",
            parent: "news-design",
            position: 2,
        },
        {
            key: "news-design-create",
            label: "Create Design",
            icon: "solar:pen-bold",
            slug: "news-design/create",
            parent: "news-design",
            position: 3,
        },
    ], PLUGINS.nx);

    // ─── Admin pages ────────────────────────────────────────────────────────
    addHook("admin.pages", [
        {
            key: "news-design/settings",
            label: "News Design Settings",
            type: "",
            slug: "settings",
            style: "left",
            position: 35,
            active: true,
            path: NewsDesignSettings,
        },
        {
            key: "news-design/box",
            label: "News Design Box Settings",
            type: "",
            slug: "box",
            style: "left",
            position: 36,
            active: true,
            path: NewsDesignBoxSettings,
        },
        {
            key: "news-design/create",
            label: "Create News Design",
            type: "",
            slug: "create",
            style: "left",
            position: 37,
            active: true,
            path: NewsDesignPage,
        },
    ], PLUGINS.nx);

    // ─── User nav items (reporter only) ─────────────────────────────────────
    addHook("user.nav", [
        {
            key: "news-design",
            label: "News Design",
            icon: "solar:palette-bold",
            slug: "news-design",
            parent: "",
            position: 20,
            reporterOnly: true,
        },
    ], PLUGINS.nx);

    // ─── User pages (reporter only) ─────────────────────────────────────────
    addHook("user.page", [
        {
            key: "news-design",
            label: "Create News Design",
            type: "",
            slug: "news-design",
            style: "left",
            position: 20,
            active: true,
            path: NewsDesignPage,
        },
    ], PLUGINS.nx);
}
