'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createChat, addMessageToChat, getChats, type Chat } from '@/lib/calcStore';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FAQS = [
  { q: 'How accurate is the solar sizing?', a: 'We use NASA POWER sun hour data for all 36 states + FCT, with AC duty cycle and temperature corrections — the same method used by professional engineers.' },
  { q: 'How do I get my final quote?', a: 'Fill in your appliances, submit the form, and the installer will contact you on WhatsApp within minutes with a detailed quote.' },
  { q: 'Can I add appliances not on the list?', a: 'Yes — scroll to the bottom of the appliance list and tap "+ Add Custom Appliance" to enter any device with its wattage.' },
  { q: 'What battery types are available?', a: 'The calculator supports both Tubular (lead-acid) and Lithium (LiFePO₄) batteries. Select your preference in the Battery section.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left gap-3"
      >
        <span className="text-xs font-semibold text-gray-800">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0"
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="text-xs text-gray-500 leading-relaxed pb-4">{a}</p>
      </motion.div>
    </div>
  );
}

interface CustomerChatProps {
  brandName: string;
}

export default function CustomerChat({ brandName }: CustomerChatProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'faqs' | 'messages'>('faqs');
  const [step, setStep] = useState<'name' | 'chat'>('name');
  const [customerName, setCustomerName] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reload chat messages (simulates sync — in production this would be Supabase Realtime)
  useEffect(() => {
    if (!chat) return;
    const interval = setInterval(() => {
      const fresh = getChats().find((c) => c.id === chat.id);
      if (fresh) setChat({ ...fresh });
    }, 2000);
    return () => clearInterval(interval);
  }, [chat]);

  useEffect(() => {
    if (open && tab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages.length, open, tab]);

  function startChat() {
    if (!customerName.trim()) return;
    setTab('messages');
    setStep('chat');
  }

  function sendMessage() {
    if (!inputText.trim()) return;
    setSending(true);

    if (!chat) {
      // First message — create the chat
      const newChat = createChat(customerName.trim(), inputText.trim());
      setChat(newChat);
    } else {
      addMessageToChat(chat.id, 'customer', inputText.trim());
      const fresh = getChats().find((c) => c.id === chat.id);
      if (fresh) setChat({ ...fresh });
    }

    setInputText('');
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <>
      {/* Floating bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={() => setOpen(true)}
            >
              💬 Need support?
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setOpen((v) => !v)}
          className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.svg key="close" className="w-5 h-5" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg key="chat" className="w-5 h-5" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 16  }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: 480 }}
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-white font-black text-base leading-tight">{brandName}</p>
                <p className="text-white/70 text-xs mt-0.5">How can we help?</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-white/70 text-xs">Online</span>
              </div>
            </div>

            {/* Name entry screen */}
            <AnimatePresence mode="wait">
              {tab === 'messages' && step === 'name' ? (
                <motion.div
                  key="namescreen"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-gray-900">What&apos;s your name?</p>
                    <p className="text-xs text-gray-400 mt-1">So the team knows who they&apos;re talking to</p>
                  </div>
                  <input
                    autoFocus
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && startChat()}
                    placeholder="e.g. Bola Adeyemi"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={startChat}
                    disabled={!customerName.trim()}
                    className="w-full bg-primary text-white font-bold text-sm py-3 rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-all"
                  >
                    Start Chat →
                  </button>
                </motion.div>
              ) : tab === 'messages' && step === 'chat' ? (
                <motion.div
                  key="chatscreen"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {/* Welcome */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-gray-100 rounded-2xl rounded-tl-md px-3.5 py-2.5">
                        <p className="text-xs text-gray-700 leading-relaxed">Hi {customerName.split(' ')[0]}! 👋 How can we help you today?</p>
                      </div>
                    </div>
                    {chat?.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                          msg.from === 'customer'
                            ? 'bg-primary text-white rounded-tr-md'
                            : 'bg-gray-100 text-gray-700 rounded-tl-md'
                        }`}>
                          <p className="text-xs leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {/* Installer typing indicator if no reply yet */}
                    {chat && chat.messages.every(m => m.from === 'customer') && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1 items-center">
                          {[0, 0.15, 0.3].map((d) => (
                            <motion.span
                              key={d}
                              className="w-1.5 h-1.5 rounded-full bg-gray-400"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: d }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="px-3 py-3 border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputText.trim() || sending}
                      className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-all flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* FAQs tab */
                <motion.div
                  key="faqscreen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 overflow-y-auto px-5 py-2"
                >
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 mb-1">Topics</p>
                  {FAQS.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab bar */}
            <div className="border-t border-gray-100 grid grid-cols-2 flex-shrink-0">
              {(['faqs', 'messages'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    if (t === 'messages' && step === 'name' && customerName.trim()) setStep('chat');
                  }}
                  className={`py-3 flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
                    tab === t ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t === 'faqs' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                  )}
                  {t === 'faqs' ? 'FAQs' : 'Messages'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
