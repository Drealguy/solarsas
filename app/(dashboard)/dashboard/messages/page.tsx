'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChats, addMessageToChat, markChatRead, type Chat } from '@/lib/calcStore';

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function refresh() {
    const fresh = getChats();
    setChats(fresh);
    if (!selectedId && fresh.length > 0) setSelectedId(fresh[0].id);
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedId) {
      markChatRead(selectedId);
      setChats((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unreadByInstaller: 0 } : c))
      );
    }
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, chats.find(c => c.id === selectedId)?.messages.length]);

  function sendReply() {
    if (!selectedId || !replyText.trim()) return;
    addMessageToChat(selectedId, 'installer', replyText.trim());
    setReplyText('');
    refresh();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); }
  }

  const selected = chats.find((c) => c.id === selectedId) ?? null;
  const totalUnread = chats.reduce((s, c) => s + c.unreadByInstaller, 0);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-base font-black text-gray-900">Messages</h1>
          <p className="text-xs text-gray-400">Support conversations from your calculator page</p>
        </div>
        {totalUnread > 0 && (
          <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {totalUnread} unread
          </span>
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

        {/* ── Conversation list ── */}
        <div className="w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-500">No messages yet</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                Customers can start a chat from your calculator page using the support widget.
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedId(chat.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                  selectedId === chat.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-black text-[11px]">
                    {chat.customerName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{chat.customerName}</p>
                    <p className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(chat.lastMessageAt)}</p>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {chat.messages[chat.messages.length - 1]?.text ?? ''}
                  </p>
                </div>
                {chat.unreadByInstaller > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                    {chat.unreadByInstaller}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* ── Chat detail ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-500">Select a conversation</p>
              </motion.div>
            ) : (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Chat header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-black text-[11px]">
                      {selected.customerName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selected.customerName}</p>
                    <p className="text-[11px] text-gray-400">Started {timeAgo(selected.createdAt)}</p>
                  </div>
                  <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    selected.status === 'open'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {selected.status === 'open' ? '● Open' : 'Closed'}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                  {/* System welcome */}
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Hi {selected.customerName.split(' ')[0]}! 👋 How can we help you today?
                      </p>
                    </div>
                  </div>

                  {selected.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === 'installer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.from === 'installer'
                          ? 'bg-primary text-white rounded-tr-md'
                          : 'bg-gray-100 text-gray-800 rounded-tl-md'
                      }`}>
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.from === 'installer' ? 'text-white/60' : 'text-gray-400'}`}>
                          {timeAgo(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply input */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a reply..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                    className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-all flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
