module.exports = [
"[project]/src/app/admin/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatDistanceToNow.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/locale/pt-BR.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const STAGE_LABELS = {
    WELCOME: 'Boas-vindas',
    WAITING_NAME: 'Aguardando nome',
    WAITING_EMAIL: 'Aguardando e-mail',
    SHOWING_CATEGORIES: 'Escolhendo categoria',
    BROWSING: 'Navegando catálogo',
    WAITING_MEASUREMENT: 'Aguardando medida',
    DONE: 'Orçamento gerado'
};
function StatCard({ label, value, growth, icon, color = 'blue', loading }) {
    const colors = {
        blue: {
            bg: '#eff6ff',
            text: '#2563eb',
            border: '#dbeafe'
        },
        indigo: {
            bg: '#eef2ff',
            text: '#4f46e5',
            border: '#e0e7ff'
        },
        slate: {
            bg: '#f8fafc',
            text: '#475569',
            border: '#f1f5f9'
        },
        cyan: {
            bg: '#ecfeff',
            text: '#0891b2',
            border: '#cffafe'
        }
    };
    const c = colors[color] || colors.blue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-5ee89004020b0a2e" + " " + "stat-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: c.bg,
                    border: `1px solid ${c.border}`
                },
                className: "jsx-5ee89004020b0a2e" + " " + "stat-icon",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: '1.5rem'
                    },
                    className: "jsx-5ee89004020b0a2e",
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/page.js",
                    lineNumber: 28,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/page.js",
                lineNumber: 27,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-5ee89004020b0a2e" + " " + "stat-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-5ee89004020b0a2e" + " " + "stat-label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 31,
                        columnNumber: 17
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-5ee89004020b0a2e" + " " + "skeleton skeleton-number"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 33,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "jsx-5ee89004020b0a2e" + " " + "stat-value",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 35,
                        columnNumber: 21
                    }, this),
                    growth !== undefined && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-5ee89004020b0a2e" + " " + `stat-growth ${growth >= 0 ? 'positive' : 'negative'}`,
                        children: [
                            growth >= 0 ? '↑' : '↓',
                            " ",
                            Math.abs(growth),
                            "% vs ontem"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 38,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/page.js",
                lineNumber: 30,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "5ee89004020b0a2e",
                children: ".stat-card.jsx-5ee89004020b0a2e{background:#fff;border:1px solid #e2e8f0;border-radius:1.25rem;align-items:center;gap:1.25rem;padding:1.75rem;transition:all .3s cubic-bezier(.4,0,.2,1);display:flex;box-shadow:0 1px 3px #00000005}.stat-card.jsx-5ee89004020b0a2e:hover{border-color:#cbd5e1;transform:translateY(-4px);box-shadow:0 10px 25px -5px #0000000a}.stat-icon.jsx-5ee89004020b0a2e{border-radius:1rem;flex-shrink:0;justify-content:center;align-items:center;width:56px;height:56px;display:flex}.stat-body.jsx-5ee89004020b0a2e{flex:1}.stat-label.jsx-5ee89004020b0a2e{color:#64748b;text-transform:uppercase;letter-spacing:.08em;font-size:.75rem;font-weight:700}.stat-value.jsx-5ee89004020b0a2e{color:#0f172a;letter-spacing:-.02em;margin:.1rem 0;font-size:1.875rem;font-weight:800;line-height:1}.stat-growth.jsx-5ee89004020b0a2e{font-size:.8rem;font-weight:700}.positive.jsx-5ee89004020b0a2e{color:#10b981}.negative.jsx-5ee89004020b0a2e{color:#ef4444}.skeleton.jsx-5ee89004020b0a2e{background:linear-gradient(90deg,#f8fafc 25%,#f1f5f9 50%,#f8fafc 75%) 0 0/200% 100%;border-radius:.5rem;animation:1.5s infinite shimmer}.skeleton-number.jsx-5ee89004020b0a2e{width:60%;height:2rem;margin-top:.25rem}@keyframes shimmer{to{background-position:-200% 0}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/page.js",
        lineNumber: 26,
        columnNumber: 9
    }, this);
}
function AdminDashboard() {
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch('/api/stats').then((res)=>res.json()).then((data)=>{
            setStats(data);
            setLoading(false);
        }).catch(()=>setLoading(false));
    }, []);
    const recentLeads = stats?.recentLeads || [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-b989df1d90d6b295" + " " + "dashboard",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-b989df1d90d6b295" + " " + "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b989df1d90d6b295",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-b989df1d90d6b295",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 124,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-b989df1d90d6b295",
                                children: "Visão geral do desempenho do bot em tempo real."
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 125,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 123,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b989df1d90d6b295" + " " + "header-date",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "EEEE, dd 'de' MMMM", {
                            locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ptBR"]
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 127,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/page.js",
                lineNumber: 122,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-b989df1d90d6b295" + " " + "stats-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Contatos Totais",
                        value: stats?.totalLeads ?? '-',
                        growth: stats?.leadsGrowth,
                        icon: "👥",
                        color: "blue",
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 134,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Orçamentos Gerados",
                        value: stats?.budgetsGenerated ?? '-',
                        growth: stats?.budgetGrowth,
                        icon: "📋",
                        color: "indigo",
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 142,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Taxa de Conversão",
                        value: `${stats?.conversionRate ?? '-'}%`,
                        icon: "🎯",
                        color: "cyan",
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 150,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Atendimento Humano",
                        value: stats?.botPausedCount ?? '-',
                        icon: "🧑‍💻",
                        color: "slate",
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 157,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/page.js",
                lineNumber: 133,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-b989df1d90d6b295" + " " + "bottom-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b989df1d90d6b295" + " " + "card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b989df1d90d6b295" + " " + "card-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-b989df1d90d6b295",
                                        children: "Últimas Interações"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 170,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/admin/chat",
                                        className: "jsx-b989df1d90d6b295" + " " + "view-all",
                                        children: "Ver todas →"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 171,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 169,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b989df1d90d6b295" + " " + "interactions-list",
                                children: loading ? [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b989df1d90d6b295" + " " + "interaction-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-b989df1d90d6b295" + " " + "skeleton skeleton-avatar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 177,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1
                                                },
                                                className: "jsx-b989df1d90d6b295",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-b989df1d90d6b295" + " " + "skeleton skeleton-line-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 179,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-b989df1d90d6b295" + " " + "skeleton skeleton-line-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 180,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 178,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 176,
                                        columnNumber: 33
                                    }, this)) : recentLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-b989df1d90d6b295" + " " + "empty-state",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-b989df1d90d6b295",
                                            children: "💬 Nenhuma interação ainda."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/page.js",
                                            lineNumber: 186,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-b989df1d90d6b295",
                                            children: "Aguarde os primeiros clientes chegarem!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/page.js",
                                            lineNumber: 187,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/page.js",
                                    lineNumber: 185,
                                    columnNumber: 29
                                }, this) : recentLeads.map((lead)=>{
                                    const lastMsg = lead.history?.[lead.history?.length - 1];
                                    const initials = (lead.name || lead.phoneNumber || '?').split(' ').slice(0, 2).map((n)=>n[0]).join('').toUpperCase();
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/admin/chat",
                                        className: "jsx-b989df1d90d6b295" + " " + "interaction-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-b989df1d90d6b295" + " " + "avatar",
                                                children: initials
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 196,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-b989df1d90d6b295" + " " + "interaction-body",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-b989df1d90d6b295" + " " + "interaction-header",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-b989df1d90d6b295" + " " + "interaction-name",
                                                                children: lead.name || lead.phoneNumber
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/page.js",
                                                                lineNumber: 199,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-b989df1d90d6b295" + " " + "interaction-time",
                                                                children: lead.lastInteraction ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDistanceToNow"])(new Date(lead.lastInteraction), {
                                                                    locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ptBR"],
                                                                    addSuffix: true
                                                                }) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/page.js",
                                                                lineNumber: 200,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 198,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-b989df1d90d6b295" + " " + "interaction-preview",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-b989df1d90d6b295" + " " + "stage-tag",
                                                                children: STAGE_LABELS[lead.stage] || lead.stage
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/page.js",
                                                                lineNumber: 207,
                                                                columnNumber: 49
                                                            }, this),
                                                            lastMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-b989df1d90d6b295" + " " + "last-msg",
                                                                children: [
                                                                    lastMsg.from === 'bot' ? '🤖 ' : lastMsg.from === 'agent' ? '👨‍💻 ' : '',
                                                                    lastMsg.text?.slice(0, 40),
                                                                    lastMsg.text?.length > 40 ? '...' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/page.js",
                                                                lineNumber: 211,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 206,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 197,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, lead._id, true, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 195,
                                        columnNumber: 37
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 173,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 168,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b989df1d90d6b295" + " " + "card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b989df1d90d6b295" + " " + "card-header",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "jsx-b989df1d90d6b295",
                                    children: "Funil de Atendimento"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/page.js",
                                    lineNumber: 228,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 227,
                                columnNumber: 21
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '1rem'
                                },
                                className: "jsx-b989df1d90d6b295",
                                children: [
                                    1,
                                    2,
                                    3,
                                    4
                                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: '1rem'
                                        },
                                        className: "jsx-b989df1d90d6b295",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: '1rem',
                                                    width: '60%',
                                                    marginBottom: '0.5rem',
                                                    borderRadius: '4px'
                                                },
                                                className: "jsx-b989df1d90d6b295" + " " + "skeleton"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 234,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: '0.75rem',
                                                    width: '100%',
                                                    borderRadius: '4px'
                                                },
                                                className: "jsx-b989df1d90d6b295" + " " + "skeleton"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 235,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 233,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 231,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b989df1d90d6b295" + " " + "funnel-list",
                                children: [
                                    (stats?.stageDistribution || []).map(({ _id: stage, count })=>{
                                        const total = stats?.totalLeads || 1;
                                        const pct = Math.round(count / total * 100);
                                        const stageColors = {
                                            DONE: '#10b981',
                                            WAITING_MEASUREMENT: '#6366f1',
                                            BROWSING: '#f59e0b',
                                            SHOWING_CATEGORIES: '#0ea5e9',
                                            WAITING_EMAIL: '#a855f7',
                                            WAITING_NAME: '#f43f5e',
                                            WELCOME: '#64748b'
                                        };
                                        const color = stageColors[stage] || '#94a3b8';
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-b989df1d90d6b295" + " " + "funnel-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b989df1d90d6b295" + " " + "funnel-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-b989df1d90d6b295" + " " + "funnel-label",
                                                            children: STAGE_LABELS[stage] || stage
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/page.js",
                                                            lineNumber: 257,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-b989df1d90d6b295" + " " + "funnel-count",
                                                            children: [
                                                                count,
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    className: "jsx-b989df1d90d6b295",
                                                                    children: [
                                                                        "(",
                                                                        pct,
                                                                        "%)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/page.js",
                                                                    lineNumber: 258,
                                                                    columnNumber: 84
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/page.js",
                                                            lineNumber: 258,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/page.js",
                                                    lineNumber: 256,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b989df1d90d6b295" + " " + "funnel-bar-bg",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: `${pct}%`,
                                                            background: color
                                                        },
                                                        className: "jsx-b989df1d90d6b295" + " " + "funnel-bar-fill"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 261,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/page.js",
                                                    lineNumber: 260,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, stage, true, {
                                            fileName: "[project]/src/app/admin/page.js",
                                            lineNumber: 255,
                                            columnNumber: 37
                                        }, this);
                                    }),
                                    (!stats?.stageDistribution || stats.stageDistribution.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b989df1d90d6b295" + " " + "empty-state",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-b989df1d90d6b295",
                                            children: "🤖 Nenhum dado de funil ainda."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/page.js",
                                            lineNumber: 271,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 270,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 240,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b989df1d90d6b295" + " " + "quick-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-b989df1d90d6b295",
                                        children: "Ações Rápidas"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 279,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b989df1d90d6b295" + " " + "actions-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/admin/chat",
                                                className: "jsx-b989df1d90d6b295" + " " + "action-btn",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b989df1d90d6b295",
                                                        children: "💬"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 282,
                                                        columnNumber: 33
                                                    }, this),
                                                    " Inbox"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 281,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/admin/products",
                                                className: "jsx-b989df1d90d6b295" + " " + "action-btn",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b989df1d90d6b295",
                                                        children: "📦"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 285,
                                                        columnNumber: 33
                                                    }, this),
                                                    " Produtos"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 284,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/admin/config",
                                                className: "jsx-b989df1d90d6b295" + " " + "action-btn",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b989df1d90d6b295",
                                                        children: "⚙️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 288,
                                                        columnNumber: 33
                                                    }, this),
                                                    " Configurações"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 287,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/admin/users",
                                                className: "jsx-b989df1d90d6b295" + " " + "action-btn",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b989df1d90d6b295",
                                                        children: "👥"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/page.js",
                                                        lineNumber: 291,
                                                        columnNumber: 33
                                                    }, this),
                                                    " Equipe"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/page.js",
                                                lineNumber: 290,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/page.js",
                                        lineNumber: 280,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/page.js",
                                lineNumber: 278,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/page.js",
                        lineNumber: 226,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/page.js",
                lineNumber: 166,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "b989df1d90d6b295",
                children: ".dashboard.jsx-b989df1d90d6b295{padding-bottom:3rem}.page-header.jsx-b989df1d90d6b295{flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1rem;margin-bottom:2.5rem;display:flex}.page-header.jsx-b989df1d90d6b295 h1.jsx-b989df1d90d6b295{color:#0f172a;letter-spacing:-.03em;margin:0 0 .25rem;font-size:2.25rem;font-weight:800}.page-header.jsx-b989df1d90d6b295 p.jsx-b989df1d90d6b295{color:#64748b;margin:0;font-size:1rem}.header-date.jsx-b989df1d90d6b295{color:#0f172a;text-transform:capitalize;background:#fff;border:1px solid #e2e8f0;border-radius:.75rem;padding:.625rem 1.25rem;font-size:.875rem;font-weight:600}.stats-grid.jsx-b989df1d90d6b295{grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-bottom:2.5rem;display:grid}@media (width<=1100px){.stats-grid.jsx-b989df1d90d6b295{grid-template-columns:repeat(2,1fr)}}@media (width<=640px){.stats-grid.jsx-b989df1d90d6b295{grid-template-columns:1fr}}.bottom-grid.jsx-b989df1d90d6b295{grid-template-columns:1fr 1fr;gap:2rem;display:grid}@media (width<=900px){.bottom-grid.jsx-b989df1d90d6b295{grid-template-columns:1fr}}.card.jsx-b989df1d90d6b295{background:#fff;border:1px solid #e2e8f0;border-radius:1.25rem;flex-direction:column;display:flex;overflow:hidden;box-shadow:0 1px 3px #00000005}.card-header.jsx-b989df1d90d6b295{border-bottom:1px solid #f1f5f9;justify-content:space-between;align-items:center;padding:1.5rem 1.75rem;display:flex}.card-header.jsx-b989df1d90d6b295 h2.jsx-b989df1d90d6b295{color:#0f172a;letter-spacing:-.01em;margin:0;font-size:1.1rem;font-weight:800}.view-all.jsx-b989df1d90d6b295{color:#2563eb;font-size:.875rem;font-weight:700;text-decoration:none}.view-all.jsx-b989df1d90d6b295:hover{text-decoration:underline}.interactions-list.jsx-b989df1d90d6b295{max-height:400px;overflow-y:auto}.interaction-item.jsx-b989df1d90d6b295{cursor:pointer;border-bottom:1px solid #f8fafc;align-items:center;gap:1rem;padding:1rem 1.75rem;text-decoration:none;transition:all .2s;display:flex}.interaction-item.jsx-b989df1d90d6b295:hover{background:#f8fafc}.interaction-item.jsx-b989df1d90d6b295:last-child{border-bottom:none}.avatar.jsx-b989df1d90d6b295{color:#fff;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:1rem;flex-shrink:0;justify-content:center;align-items:center;width:44px;height:44px;font-size:.9rem;font-weight:800;display:flex;box-shadow:0 4px 10px #2563eb33}.interaction-body.jsx-b989df1d90d6b295{flex:1;min-width:0}.interaction-header.jsx-b989df1d90d6b295{justify-content:space-between;align-items:center;margin-bottom:.15rem;display:flex}.interaction-name.jsx-b989df1d90d6b295{color:#0f172a;white-space:nowrap;text-overflow:ellipsis;font-size:.95rem;font-weight:700;overflow:hidden}.interaction-time.jsx-b989df1d90d6b295{color:#64748b;white-space:nowrap;margin-left:.5rem;font-size:.75rem}.interaction-preview.jsx-b989df1d90d6b295{flex-direction:column;gap:.15rem;display:flex}.stage-tag.jsx-b989df1d90d6b295{color:#2563eb;background:#eff6ff;border-radius:2rem;width:fit-content;padding:.1rem .5rem;font-size:.75rem;font-weight:700}.last-msg.jsx-b989df1d90d6b295{color:#64748b;white-space:nowrap;text-overflow:ellipsis;font-size:.8rem;overflow:hidden}.funnel-list.jsx-b989df1d90d6b295{flex-direction:column;gap:1.25rem;padding:1.75rem;display:flex}.funnel-header.jsx-b989df1d90d6b295{justify-content:space-between;align-items:center;margin-bottom:.5rem;display:flex}.funnel-label.jsx-b989df1d90d6b295{color:#334155;font-size:.875rem;font-weight:700}.funnel-count.jsx-b989df1d90d6b295{color:#0f172a;font-size:.9rem;font-weight:800}.funnel-count.jsx-b989df1d90d6b295 small.jsx-b989df1d90d6b295{color:#64748b;font-size:.75rem;font-weight:400}.funnel-bar-bg.jsx-b989df1d90d6b295{background:#f1f5f9;border-radius:999px;height:10px;overflow:hidden}.funnel-bar-fill.jsx-b989df1d90d6b295{border-radius:999px;height:100%;transition:width 1s cubic-bezier(.4,0,.2,1)}.quick-actions.jsx-b989df1d90d6b295{background:#fafafa;border-top:1px solid #f1f5f9;padding:1.75rem}.quick-actions.jsx-b989df1d90d6b295 h3.jsx-b989df1d90d6b295{color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin:0 0 1rem;font-size:.75rem;font-weight:800}.actions-grid.jsx-b989df1d90d6b295{grid-template-columns:repeat(2,1fr);gap:.75rem;display:grid}.action-btn.jsx-b989df1d90d6b295{color:#0f172a;cursor:pointer;background:#fff;border:1px solid #e2e8f0;border-radius:.875rem;justify-content:center;align-items:center;gap:.625rem;padding:.75rem;font-size:.875rem;font-weight:700;text-decoration:none;transition:all .2s;display:flex}.action-btn.jsx-b989df1d90d6b295:hover{color:#2563eb;background:#eff6ff;border-color:#2563eb;transform:translateY(-2px);box-shadow:0 4px 12px #2563eb1a}.empty-state.jsx-b989df1d90d6b295{text-align:center;color:#94a3b8;padding:3rem 1.5rem}.empty-state.jsx-b989df1d90d6b295 p.jsx-b989df1d90d6b295{margin:.25rem 0;font-size:.875rem}.skeleton.jsx-b989df1d90d6b295{background:linear-gradient(90deg,#f8fafc 25%,#f1f5f9 50%,#f8fafc 75%) 0 0/200% 100%;border-radius:.5rem;animation:1.5s infinite shimmer}.skeleton-avatar.jsx-b989df1d90d6b295{border-radius:1rem;flex-shrink:0;width:44px;height:44px}.skeleton-line-lg.jsx-b989df1d90d6b295{border-radius:4px;width:60%;height:1rem;margin-bottom:.5rem}.skeleton-line-sm.jsx-b989df1d90d6b295{border-radius:4px;width:85%;height:.8rem}@keyframes shimmer{to{background-position:-200% 0}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/page.js",
        lineNumber: 121,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=src_app_admin_page_949394bb.js.map