(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/admin/chat/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatDistanceToNow.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/locale/pt-BR.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    DONE: 'Orçamento gerado ✅'
};
function ChatDashboard() {
    _s();
    const [leads, setLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeLeadId, setActiveLeadId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messageInput, setMessageInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const previousCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const scrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatDashboard.useCallback[scrollToBottom]": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["ChatDashboard.useCallback[scrollToBottom]"], []);
    const fetchLeads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatDashboard.useCallback[fetchLeads]": async ()=>{
            try {
                const res = await fetch('/api/leads');
                if (res.ok) {
                    const data = await res.json();
                    setLeads({
                        "ChatDashboard.useCallback[fetchLeads]": (prev)=>{
                            // Detect new messages for current lead
                            if (activeLeadId) {
                                const prevLead = prev.find({
                                    "ChatDashboard.useCallback[fetchLeads].prevLead": (l)=>l._id === activeLeadId
                                }["ChatDashboard.useCallback[fetchLeads].prevLead"]);
                                const newLead = data.find({
                                    "ChatDashboard.useCallback[fetchLeads].newLead": (l)=>l._id === activeLeadId
                                }["ChatDashboard.useCallback[fetchLeads].newLead"]);
                                if (newLead && prevLead && newLead.history.length > prevLead.history.length) {
                                    setTimeout(scrollToBottom, 100);
                                }
                            }
                            return data;
                        }
                    }["ChatDashboard.useCallback[fetchLeads]"]);
                }
            } catch (e) {
                console.error(e);
            } finally{
                setLoading(false);
            }
        }
    }["ChatDashboard.useCallback[fetchLeads]"], [
        activeLeadId,
        scrollToBottom
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDashboard.useEffect": ()=>{
            fetchLeads();
            const interval = setInterval(fetchLeads, 5000);
            return ({
                "ChatDashboard.useEffect": ()=>clearInterval(interval)
            })["ChatDashboard.useEffect"];
        }
    }["ChatDashboard.useEffect"], [
        fetchLeads
    ]);
    // Scroll to bottom when switching leads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDashboard.useEffect": ()=>{
            if (activeLeadId) {
                setTimeout(scrollToBottom, 100);
            }
        }
    }["ChatDashboard.useEffect"], [
        activeLeadId,
        scrollToBottom
    ]);
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if (!messageInput.trim() || !activeLead) return;
        setSending(true);
        // Optimistic update
        const optimisticMsg = {
            from: 'agent',
            text: messageInput,
            timestamp: new Date()
        };
        setLeads((prev)=>prev.map((l)=>l._id === activeLeadId ? {
                    ...l,
                    history: [
                        ...l.history,
                        optimisticMsg
                    ]
                } : l));
        const sentText = messageInput;
        setMessageInput('');
        setTimeout(scrollToBottom, 50);
        try {
            const res = await fetch(`/api/leads/${activeLead._id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: sentText
                })
            });
            if (res.ok) {
                fetchLeads();
            }
        } catch (error) {
            console.error('Failed to send:', error);
        }
        setSending(false);
    };
    const activeLead = leads.find((l)=>l._id === activeLeadId);
    const toggleBotPause = async ()=>{
        if (!activeLead) return;
        setLeads((prev)=>prev.map((l)=>l._id === activeLeadId ? {
                    ...l,
                    botPaused: !l.botPaused
                } : l));
        try {
            await fetch(`/api/leads/${activeLead._id}/pause`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paused: !activeLead.botPaused
                })
            });
            fetchLeads();
        } catch (error) {
            console.error('Failed to toggle bot status', error);
        }
    };
    const filteredLeads = leads.filter((lead)=>{
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (lead.name || '').toLowerCase().includes(q) || (lead.phoneNumber || '').includes(q);
    });
    // Count unread (last message from customer)
    const unreadCount = leads.filter((l)=>l.history?.[l.history.length - 1]?.from === 'customer').length;
    if (loading && leads.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "jsx-47bbec0baa79aa15" + " " + "flex-center h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-47bbec0baa79aa15" + " " + "spinner"
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/chat/page.js",
                    lineNumber: 132,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "47bbec0baa79aa15",
                    children: ".flex-center.jsx-47bbec0baa79aa15{justify-content:center;align-items:center;display:flex}.h-screen.jsx-47bbec0baa79aa15{height:80vh}.spinner.jsx-47bbec0baa79aa15{border:3px solid #e2e8f0;border-top-color:#10b981;border-radius:50%;width:40px;height:40px;animation:.8s linear infinite spin}@keyframes spin{to{transform:rotate(360deg)}}"
                }, void 0, false, void 0, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/chat/page.js",
            lineNumber: 131,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-3f9d1e59d25f46d9" + " " + "chat-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3f9d1e59d25f46d9" + " " + "sidebar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3f9d1e59d25f46d9" + " " + "sidebar-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3f9d1e59d25f46d9" + " " + "sidebar-title",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-3f9d1e59d25f46d9",
                                        children: [
                                            "Inbox",
                                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-3f9d1e59d25f46d9" + " " + "badge",
                                                children: unreadCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 151,
                                                columnNumber: 49
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 149,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-3f9d1e59d25f46d9",
                                        children: [
                                            leads.length,
                                            " conversas"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 153,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/chat/page.js",
                                lineNumber: 148,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3f9d1e59d25f46d9" + " " + "search-box",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-3f9d1e59d25f46d9" + " " + "search-icon",
                                        children: "🔍"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 156,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Buscar cliente...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "jsx-3f9d1e59d25f46d9"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 157,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/chat/page.js",
                                lineNumber: 155,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 147,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3f9d1e59d25f46d9" + " " + "leads-list",
                        children: filteredLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3f9d1e59d25f46d9" + " " + "empty-leads",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-3f9d1e59d25f46d9",
                                children: searchQuery ? 'Nenhum resultado encontrado.' : 'Nenhuma conversa ainda.'
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/chat/page.js",
                                lineNumber: 169,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/chat/page.js",
                            lineNumber: 168,
                            columnNumber: 25
                        }, this) : filteredLeads.map((lead)=>{
                            const lastMsg = lead.history?.[lead.history.length - 1];
                            const isUnread = lastMsg?.from === 'customer';
                            const initials = (lead.name || lead.phoneNumber || '?').split(' ').slice(0, 2).map((n)=>n[0]).join('').toUpperCase();
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setActiveLeadId(lead._id),
                                className: "jsx-3f9d1e59d25f46d9" + " " + `lead-item ${activeLeadId === lead._id ? 'active' : ''} ${isUnread ? 'unread' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3f9d1e59d25f46d9" + " " + "lead-avatar",
                                        children: [
                                            initials,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3f9d1e59d25f46d9" + " " + `lead-dot ${lead.botPaused ? 'paused' : 'active'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 186,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 184,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3f9d1e59d25f46d9" + " " + "lead-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3f9d1e59d25f46d9" + " " + "lead-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + "lead-name",
                                                        children: lead.name || lead.phoneNumber
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 190,
                                                        columnNumber: 45
                                                    }, this),
                                                    lastMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + "lead-time",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(lastMsg.timestamp), 'HH:mm')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 192,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 189,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3f9d1e59d25f46d9" + " " + "lead-preview-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + `lead-preview ${isUnread ? 'bold' : ''}`,
                                                        children: lastMsg ? `${lastMsg.from === 'bot' ? '🤖 ' : lastMsg.from === 'agent' ? '👨‍💻 ' : ''}${lastMsg.text?.slice(0, 35)}${lastMsg.text?.length > 35 ? '…' : ''}` : 'Nenhuma mensagem'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 198,
                                                        columnNumber: 45
                                                    }, this),
                                                    isUnread && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + "unread-dot"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 203,
                                                        columnNumber: 58
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 197,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 188,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, lead._id, true, {
                                fileName: "[project]/src/app/admin/chat/page.js",
                                lineNumber: 179,
                                columnNumber: 33
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 166,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/chat/page.js",
                lineNumber: 146,
                columnNumber: 13
            }, this),
            activeLead ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3f9d1e59d25f46d9" + " " + "main-chat",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3f9d1e59d25f46d9" + " " + "chat-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3f9d1e59d25f46d9" + " " + "chat-header-info",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3f9d1e59d25f46d9" + " " + "chat-avatar",
                                        children: (activeLead.name || activeLead.phoneNumber || '?').split(' ').slice(0, 2).map((n)=>n[0]).join('').toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 218,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3f9d1e59d25f46d9",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-3f9d1e59d25f46d9",
                                                children: [
                                                    activeLead.name || 'Cliente sem nome',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + "phone-badge",
                                                        children: [
                                                            "📞 ",
                                                            activeLead.phoneNumber
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 225,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 223,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-3f9d1e59d25f46d9",
                                                children: [
                                                    "Estágio: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + "stage-highlight",
                                                        children: STAGE_LABELS[activeLead.stage] || activeLead.stage
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 228,
                                                        columnNumber: 46
                                                    }, this),
                                                    activeLead.lastInteraction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + "last-seen",
                                                        children: [
                                                            "· Última atividade ",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistanceToNow"])(new Date(activeLead.lastInteraction), {
                                                                locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ptBR"],
                                                                addSuffix: true
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 230,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 227,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 222,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/chat/page.js",
                                lineNumber: 217,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3f9d1e59d25f46d9" + " " + "actions",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleBotPause,
                                    className: "jsx-3f9d1e59d25f46d9" + " " + `btn-toggle ${activeLead.botPaused ? 'btn-resume' : 'btn-pause'}`,
                                    children: activeLead.botPaused ? '▶ Reativar Robô Lia' : '⏸ Assumir Atendimento'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/chat/page.js",
                                    lineNumber: 239,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/chat/page.js",
                                lineNumber: 238,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 216,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3f9d1e59d25f46d9" + " " + "messages-area",
                        children: activeLead.history.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3f9d1e59d25f46d9" + " " + "flex-center h-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-3f9d1e59d25f46d9" + " " + "empty-state",
                                children: "Nenhuma mensagem trocada ainda."
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/chat/page.js",
                                lineNumber: 251,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/chat/page.js",
                            lineNumber: 250,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                activeLead.history.map((msg, idx)=>{
                                    const isMe = msg.from === 'bot' || msg.from === 'agent';
                                    const showDate = idx === 0 || new Date(msg.timestamp).toDateString() !== new Date(activeLead.history[idx - 1]?.timestamp).toDateString();
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3f9d1e59d25f46d9",
                                        children: [
                                            showDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3f9d1e59d25f46d9" + " " + "date-divider",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-3f9d1e59d25f46d9",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(msg.timestamp), "dd 'de' MMMM", {
                                                        locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$pt$2d$BR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ptBR"]
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/chat/page.js",
                                                    lineNumber: 265,
                                                    columnNumber: 53
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 264,
                                                columnNumber: 49
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-3f9d1e59d25f46d9" + " " + `message-wrapper ${isMe ? 'message-out' : 'message-in'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + `message-bubble ${msg.from === 'bot' ? 'bubble-bot' : msg.from === 'agent' ? 'bubble-agent' : 'bubble-customer'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-3f9d1e59d25f46d9",
                                                            children: msg.text
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/chat/page.js",
                                                            lineNumber: 272,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 271,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-3f9d1e59d25f46d9" + " " + "message-meta",
                                                        children: [
                                                            msg.from === 'bot' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-3f9d1e59d25f46d9" + " " + "meta-bot",
                                                                children: "🤖 Lia · "
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                                lineNumber: 275,
                                                                columnNumber: 76
                                                            }, this),
                                                            msg.from === 'agent' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-3f9d1e59d25f46d9" + " " + "meta-agent",
                                                                children: "👨‍💻 Equipe · "
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                                lineNumber: 276,
                                                                columnNumber: 78
                                                            }, this),
                                                            msg.timestamp ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(msg.timestamp), 'HH:mm') : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/chat/page.js",
                                                        lineNumber: 274,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 270,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 262,
                                        columnNumber: 41
                                    }, this);
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messagesEndRef,
                                    className: "jsx-3f9d1e59d25f46d9"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/chat/page.js",
                                    lineNumber: 283,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 248,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3f9d1e59d25f46d9" + " " + "input-area",
                        children: activeLead.botPaused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSendMessage,
                            className: "jsx-3f9d1e59d25f46d9" + " " + "message-form",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-3f9d1e59d25f46d9" + " " + "input-wrapper",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: messageInput,
                                        onChange: (e)=>setMessageInput(e.target.value),
                                        placeholder: "Digite sua resposta para o cliente... (Enter para enviar)",
                                        onKeyDown: (e)=>{
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        },
                                        rows: 1,
                                        className: "jsx-3f9d1e59d25f46d9"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 292,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/chat/page.js",
                                    lineNumber: 291,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: sending || !messageInput.trim(),
                                    className: "jsx-3f9d1e59d25f46d9" + " " + "btn-send",
                                    children: sending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-3f9d1e59d25f46d9" + " " + "mini-spinner"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 307,
                                        columnNumber: 41
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "jsx-3f9d1e59d25f46d9",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "22",
                                                y1: "2",
                                                x2: "11",
                                                y2: "13",
                                                className: "jsx-3f9d1e59d25f46d9"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 310,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                points: "22 2 15 22 11 13 2 9 22 2",
                                                className: "jsx-3f9d1e59d25f46d9"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/chat/page.js",
                                                lineNumber: 311,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/chat/page.js",
                                        lineNumber: 309,
                                        columnNumber: 41
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/chat/page.js",
                                    lineNumber: 305,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/chat/page.js",
                            lineNumber: 290,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3f9d1e59d25f46d9" + " " + "bot-active-warning",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-3f9d1e59d25f46d9",
                                    children: "🤖"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/chat/page.js",
                                    lineNumber: 318,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-3f9d1e59d25f46d9",
                                    children: [
                                        "Robô ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "jsx-3f9d1e59d25f46d9",
                                            children: "Lia"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/chat/page.js",
                                            lineNumber: 319,
                                            columnNumber: 41
                                        }, this),
                                        " ativo. Clique em ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                            className: "jsx-3f9d1e59d25f46d9",
                                            children: '"Assumir Atendimento"'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/chat/page.js",
                                            lineNumber: 319,
                                            columnNumber: 79
                                        }, this),
                                        " para enviar mensagens."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/chat/page.js",
                                    lineNumber: 319,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/chat/page.js",
                            lineNumber: 317,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 288,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/chat/page.js",
                lineNumber: 215,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3f9d1e59d25f46d9" + " " + "no-chat-selected",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3f9d1e59d25f46d9" + " " + "no-chat-icon",
                        children: "💬"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 326,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "jsx-3f9d1e59d25f46d9",
                        children: "Selecione uma conversa"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 327,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-3f9d1e59d25f46d9",
                        children: "Escolha um cliente na lista ao lado para ver o histórico ou assumir o atendimento da Lia."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/chat/page.js",
                        lineNumber: 328,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/chat/page.js",
                lineNumber: 325,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "3f9d1e59d25f46d9",
                children: ".chat-container.jsx-3f9d1e59d25f46d9{background:#f8fafc;border:1px solid #e2e8f0;border-radius:1rem;height:calc(100vh - 4rem);margin:-1rem;display:flex;overflow:hidden;box-shadow:0 10px 40px #00000014}.sidebar.jsx-3f9d1e59d25f46d9{background:#fff;border-right:1px solid #e2e8f0;flex-direction:column;flex-shrink:0;width:340px;min-width:280px;display:flex}.sidebar-header.jsx-3f9d1e59d25f46d9{background:#f8fafc;border-bottom:1px solid #f1f5f9;padding:1.25rem}.sidebar-title.jsx-3f9d1e59d25f46d9{margin-bottom:.75rem}.sidebar-title.jsx-3f9d1e59d25f46d9 h2.jsx-3f9d1e59d25f46d9{color:#0f172a;align-items:center;gap:.5rem;margin:0 0 .15rem;font-size:1.1rem;font-weight:700;display:flex}.sidebar-title.jsx-3f9d1e59d25f46d9 p.jsx-3f9d1e59d25f46d9{color:#94a3b8;margin:0;font-size:.8rem}.badge.jsx-3f9d1e59d25f46d9{color:#fff;background:#ef4444;border-radius:999px;padding:.15rem .45rem;font-size:.7rem;font-weight:700}.search-box.jsx-3f9d1e59d25f46d9{background:#fff;border:1px solid #e2e8f0;border-radius:.5rem;align-items:center;gap:.5rem;padding:.5rem .75rem;display:flex}.search-icon.jsx-3f9d1e59d25f46d9{font-size:.875rem}.search-box.jsx-3f9d1e59d25f46d9 input.jsx-3f9d1e59d25f46d9{color:#334155;background:0 0;border:none;outline:none;width:100%;margin:0;padding:0;font-size:.85rem}.leads-list.jsx-3f9d1e59d25f46d9{flex:1;overflow-y:auto}.empty-leads.jsx-3f9d1e59d25f46d9{text-align:center;color:#94a3b8;padding:2rem;font-size:.875rem}.lead-item.jsx-3f9d1e59d25f46d9{cursor:pointer;border-bottom:1px solid #f8fafc;align-items:center;gap:.75rem;padding:.875rem 1.25rem;transition:background .15s;display:flex}.lead-item.jsx-3f9d1e59d25f46d9:hover{background:#f8fafc}.lead-item.active.jsx-3f9d1e59d25f46d9{background:#eff6ff;border-left:3px solid #3b82f6;padding-left:calc(1.25rem - 3px)}.lead-item.unread.jsx-3f9d1e59d25f46d9 .lead-name.jsx-3f9d1e59d25f46d9{color:#0f172a;font-weight:700}.lead-avatar.jsx-3f9d1e59d25f46d9{color:#fff;background:linear-gradient(135deg,#10b981,#0d9488);border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:42px;height:42px;font-size:.85rem;font-weight:700;display:flex;position:relative}.lead-dot.jsx-3f9d1e59d25f46d9{border:2px solid #fff;border-radius:50%;width:10px;height:10px;position:absolute;bottom:1px;right:1px}.lead-dot.active.jsx-3f9d1e59d25f46d9{background:#10b981}.lead-dot.paused.jsx-3f9d1e59d25f46d9{background:#f59e0b}.lead-info.jsx-3f9d1e59d25f46d9{flex:1;min-width:0}.lead-row.jsx-3f9d1e59d25f46d9{justify-content:space-between;align-items:center;margin-bottom:.2rem;display:flex}.lead-name.jsx-3f9d1e59d25f46d9{color:#334155;white-space:nowrap;text-overflow:ellipsis;font-size:.875rem;font-weight:600;overflow:hidden}.lead-time.jsx-3f9d1e59d25f46d9{color:#94a3b8;white-space:nowrap;font-size:.7rem}.lead-preview-row.jsx-3f9d1e59d25f46d9{justify-content:space-between;align-items:center;gap:.5rem;display:flex}.lead-preview.jsx-3f9d1e59d25f46d9{color:#94a3b8;white-space:nowrap;text-overflow:ellipsis;font-size:.78rem;overflow:hidden}.lead-preview.bold.jsx-3f9d1e59d25f46d9{color:#475569;font-weight:600}.unread-dot.jsx-3f9d1e59d25f46d9{background:#3b82f6;border-radius:50%;flex-shrink:0;width:8px;height:8px}.main-chat.jsx-3f9d1e59d25f46d9{flex-direction:column;flex:1;min-width:0;display:flex}.chat-header.jsx-3f9d1e59d25f46d9{background:#fff;border-bottom:1px solid #e2e8f0;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;padding:1rem 1.5rem;display:flex}.chat-header-info.jsx-3f9d1e59d25f46d9{align-items:center;gap:.875rem;display:flex}.chat-avatar.jsx-3f9d1e59d25f46d9{color:#fff;background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:44px;height:44px;font-size:1rem;font-weight:700;display:flex}.chat-header.jsx-3f9d1e59d25f46d9 h2.jsx-3f9d1e59d25f46d9{color:#0f172a;flex-wrap:wrap;align-items:center;gap:.5rem;margin:0 0 .2rem;font-size:1rem;font-weight:700;display:flex}.phone-badge.jsx-3f9d1e59d25f46d9{color:#64748b;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:999px;padding:.15rem .5rem;font-size:.72rem;font-weight:500}.chat-header.jsx-3f9d1e59d25f46d9 p.jsx-3f9d1e59d25f46d9{color:#64748b;margin:0;font-size:.78rem}.stage-highlight.jsx-3f9d1e59d25f46d9{color:#6366f1;font-weight:600}.last-seen.jsx-3f9d1e59d25f46d9{color:#94a3b8;font-weight:400}.btn-toggle.jsx-3f9d1e59d25f46d9{cursor:pointer;white-space:nowrap;border:1px solid #0000;border-radius:.5rem;padding:.5rem 1rem;font-size:.8rem;font-weight:600;transition:all .2s}.btn-resume.jsx-3f9d1e59d25f46d9{color:#059669;background:#ecfdf5;border-color:#a7f3d0}.btn-resume.jsx-3f9d1e59d25f46d9:hover{background:#d1fae5}.btn-pause.jsx-3f9d1e59d25f46d9{color:#d97706;background:#fffbeb;border-color:#fde68a}.btn-pause.jsx-3f9d1e59d25f46d9:hover{background:#fef3c7}.messages-area.jsx-3f9d1e59d25f46d9{background-image:radial-gradient(#cbd5e1 1px,#0000 1px);background-size:20px 20px;flex-direction:column;flex:1;gap:.5rem;padding:1.5rem;display:flex;overflow-y:auto}.flex-center.jsx-3f9d1e59d25f46d9{justify-content:center;align-items:center;display:flex}.h-full.jsx-3f9d1e59d25f46d9{height:100%}.date-divider.jsx-3f9d1e59d25f46d9{justify-content:center;align-items:center;margin:1rem 0 .5rem;display:flex}.date-divider.jsx-3f9d1e59d25f46d9 span.jsx-3f9d1e59d25f46d9{color:#94a3b8;background:#fffc;border:1px solid #e2e8f0;border-radius:999px;padding:.2rem .75rem;font-size:.72rem;font-weight:600}.message-wrapper.jsx-3f9d1e59d25f46d9{flex-direction:column;max-width:72%;animation:.2s fadeIn;display:flex}@keyframes fadeIn{0%{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.message-out.jsx-3f9d1e59d25f46d9{align-self:flex-end;align-items:flex-end}.message-in.jsx-3f9d1e59d25f46d9{align-self:flex-start;align-items:flex-start}.message-bubble.jsx-3f9d1e59d25f46d9{border-radius:1rem;max-width:100%;padding:.75rem 1rem;box-shadow:0 1px 2px #0000000f}.message-bubble.jsx-3f9d1e59d25f46d9 p.jsx-3f9d1e59d25f46d9{white-space:pre-wrap;margin:0;font-size:.9rem;line-height:1.5}.bubble-customer.jsx-3f9d1e59d25f46d9{color:#1e293b;background:#fff;border:1px solid #e2e8f0;border-bottom-left-radius:.25rem}.bubble-agent.jsx-3f9d1e59d25f46d9{color:#fff;background:linear-gradient(135deg,#4f46e5,#6366f1);border-bottom-right-radius:.25rem}.bubble-bot.jsx-3f9d1e59d25f46d9{color:#334155;background:#e2e8f0;border-bottom-right-radius:.25rem}.message-meta.jsx-3f9d1e59d25f46d9{color:#94a3b8;margin-top:.3rem;font-size:.7rem}.meta-bot.jsx-3f9d1e59d25f46d9{color:#0f766e;font-weight:600}.meta-agent.jsx-3f9d1e59d25f46d9{color:#4338ca;font-weight:600}.empty-state.jsx-3f9d1e59d25f46d9{color:#94a3b8;background:#fffc;border-radius:999px;padding:.5rem 1rem;font-size:.875rem}.input-area.jsx-3f9d1e59d25f46d9{background:#fff;border-top:1px solid #e2e8f0;padding:1rem 1.5rem}.message-form.jsx-3f9d1e59d25f46d9{align-items:flex-end;gap:.75rem;display:flex}.input-wrapper.jsx-3f9d1e59d25f46d9{flex:1}.message-form.jsx-3f9d1e59d25f46d9 textarea.jsx-3f9d1e59d25f46d9{resize:none;box-sizing:border-box;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:.75rem;outline:none;width:100%;min-height:48px;max-height:140px;margin:0;padding:.75rem 1rem;font-family:inherit;font-size:.9rem;line-height:1.5;transition:all .2s}.message-form.jsx-3f9d1e59d25f46d9 textarea.jsx-3f9d1e59d25f46d9:focus{background:#fff;border-color:#6366f1;box-shadow:0 0 0 3px #6366f11a}.btn-send.jsx-3f9d1e59d25f46d9{color:#fff;cursor:pointer;background:linear-gradient(135deg,#10b981,#059669);border:none;border-radius:.75rem;flex-shrink:0;justify-content:center;align-items:center;width:48px;height:48px;padding:0;transition:all .2s;display:flex}.btn-send.jsx-3f9d1e59d25f46d9:hover:not(:disabled){filter:brightness(1.1);transform:scale(1.05)}.btn-send.jsx-3f9d1e59d25f46d9:disabled{opacity:.4;cursor:not-allowed}.mini-spinner.jsx-3f9d1e59d25f46d9{border:2px solid #fff6;border-top-color:#fff;border-radius:50%;width:18px;height:18px;animation:.8s linear infinite spin}@keyframes spin{to{transform:rotate(360deg)}}.bot-active-warning.jsx-3f9d1e59d25f46d9{background:#f8fafc;border:1px solid #e2e8f0;border-radius:.75rem;align-items:center;gap:.75rem;padding:.875rem 1rem;font-size:.875rem;display:flex}.bot-active-warning.jsx-3f9d1e59d25f46d9 span.jsx-3f9d1e59d25f46d9{font-size:1.25rem}.bot-active-warning.jsx-3f9d1e59d25f46d9 p.jsx-3f9d1e59d25f46d9{color:#64748b;margin:0}.bot-active-warning.jsx-3f9d1e59d25f46d9 strong.jsx-3f9d1e59d25f46d9{color:#10b981}.bot-active-warning.jsx-3f9d1e59d25f46d9 em.jsx-3f9d1e59d25f46d9{color:#d97706;font-style:normal;font-weight:600}.no-chat-selected.jsx-3f9d1e59d25f46d9{text-align:center;background:#f8fafc;flex-direction:column;flex:1;justify-content:center;align-items:center;padding:2rem;display:flex}.no-chat-icon.jsx-3f9d1e59d25f46d9{opacity:.3;margin-bottom:1.5rem;font-size:4rem}.no-chat-selected.jsx-3f9d1e59d25f46d9 h2.jsx-3f9d1e59d25f46d9{color:#334155;margin:0 0 .75rem;font-size:1.25rem}.no-chat-selected.jsx-3f9d1e59d25f46d9 p.jsx-3f9d1e59d25f46d9{color:#94a3b8;max-width:260px;margin:0;font-size:.875rem;line-height:1.6}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/chat/page.js",
        lineNumber: 144,
        columnNumber: 9
    }, this);
}
_s(ChatDashboard, "3uHwR+VgceP1uYwltSc2iue8w9o=");
_c = ChatDashboard;
var _c;
__turbopack_context__.k.register(_c, "ChatDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_admin_chat_page_01bb2f3f.js.map