import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, FileText, Paperclip, MoreVertical, Search, Check, 
  Image, AlertCircle, Sparkles, MessageSquare, Plus, CheckCircle2 
} from 'lucide-react';
import { DirectMessage, NetworkConnection } from '../types';

interface MessagingProps {
  messages: DirectMessage[];
  contacts: NetworkConnection[];
  currentUserId: string;
  onSendMessage: (recipientId: string, content: string, imageUrl?: string, fileName?: string) => void;
}

export function Messaging({ messages, contacts, currentUserId, onSendMessage }: MessagingProps) {
  // Only message contacts that are "Connected"
  const connectedContacts = contacts.filter(c => c.status === 'Connected');
  
  const [activeContactId, setActiveContactId] = useState<string>(
    connectedContacts[0]?.userId || 'user_daniel_lim'
  );
  const [inputContent, setInputContent] = useState('');
  
  // Simulated file attach states
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [typedFileUrl, setTypedFileUrl] = useState('');
  const [typedFileName, setTypedFileName] = useState('');
  const [fileMime, setFileMime] = useState<'image' | 'document'>('document');

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeContact = contacts.find(c => c.userId === activeContactId);

  // Filter messages for current thread
  const threadMessages = messages.filter(msg => 
    (msg.senderId === currentUserId && msg.recipientId === activeContactId) ||
    (msg.senderId === activeContactId && msg.recipientId === currentUserId)
  );

  // Scroll to bottom when thread updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadMessages]);

  const handleSend = () => {
    if (!inputContent.trim()) return;
    onSendMessage(activeContactId, inputContent);
    setInputContent('');
  };

  const handleAttachMock = () => {
    if (!typedFileName) return;
    if (fileMime === 'image') {
      onSendMessage(activeContactId, `Shared a screenshot: ${typedFileName}`, typedFileUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200');
    } else {
      onSendMessage(activeContactId, `Submitted document reference.`, undefined, typedFileName);
    }
    setTypedFileName('');
    setTypedFileUrl('');
    setShowAttachOptions(false);
  };

  return (
    <div id="messaging_panel" className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Intro info heading */}
      <div className="mb-6 text-left">
        <h2 className="text-xl font-display font-semibold text-sleek-heading tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> Executive Messaging Desk
        </h2>
        <p className="text-xs text-sleek-muted font-sans mt-1">Directly chat, schedule calls, and pitch materials securely to verified recruiters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-sleek-main bg-sleek-card rounded-2xl overflow-hidden min-h-[580px] h-[580px] shadow-sm">
        
        {/* Left Side: Contact Threads */}
        <div className="md:col-span-4 border-r border-sleek-main bg-sleek-sidebar/55 flex flex-col pt-4">
          <div className="px-5 pb-4 text-left">
            <h3 className="font-display font-semibold text-xs text-sleek-heading tracking-wide uppercase">Conversations</h3>
            <span className="text-[10px] text-sleek-muted font-sans mt-0.5 block">Hiring Managers & Engineers</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 border-t border-sleek-main pt-2">
            {connectedContacts.length === 0 ? (
              <div className="p-8 text-center text-xs text-sleek-muted font-sans">
                Build network connections to open new direct chat threads.
              </div>
            ) : (
              connectedContacts.map((contact) => (
                <div
                  key={contact.userId}
                  onClick={() => setActiveContactId(contact.userId)}
                  className={`px-5 py-3.5 flex items-center gap-3.5 cursor-pointer transition-all border-l-3 text-left ${
                    activeContactId === contact.userId
                      ? 'bg-sleek-active/90 border-indigo-500 text-sleek-heading'
                      : 'border-transparent hover:bg-sleek-active/40 text-sleek-main'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={contact.avatar}
                      alt={contact.fullName}
                      className="w-10 h-10 object-cover rounded-full border border-sleek-input"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-sleek-card rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-1">
                      <span className="font-display font-semibold text-xs text-sleek-heading truncate">{contact.fullName}</span>
                      <span className="text-[8px] text-emerald-500 font-mono font-bold uppercase">Online</span>
                    </div>
                    <span className="text-[10px] text-sleek-muted mt-0.5 block truncate max-w-[170px]">{contact.headline}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Active Discussion */}
        <div id="active_thread_col" className="md:col-span-8 flex flex-col justify-between h-full bg-sleek-card/40">
          {activeContact ? (
            <>
              {/* Msg Header */}
              <div className="px-6 py-4.5 border-b border-sleek-main bg-sleek-sidebar/30 flex items-center justify-between">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="relative">
                    <img
                      referrerPolicy="no-referrer"
                      src={activeContact.avatar}
                      alt={activeContact.fullName}
                      className="w-10 h-10 object-cover rounded-full border border-sleek-input"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-sleek-card rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-xs sm:text-sm text-sleek-heading leading-tight">{activeContact.fullName}</h4>
                    <span className="text-[10px] text-indigo-400 mt-0.5 block font-sans font-medium">{activeContact.headline}</span>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-sleek-muted hover:text-sleek-heading cursor-pointer" />
              </div>

              {/* Chat flow scroll lock list */}
              <div id="messages_scroll_box" className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {threadMessages.length === 0 && (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <div className="p-3 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 w-fit rounded-2xl mb-3 text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-sleek-muted font-sans max-w-sm">
                      Send a message to <strong>{activeContact.fullName}</strong>. Introduce your developer profile and pitch why you're a great fit.
                    </span>
                  </div>
                )}

                {threadMessages.map((msg) => {
                  const isOwn = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] sm:max-w-md rounded-2xl p-4 text-xs text-left shadow-sm ${
                        isOwn 
                          ? 'bg-indigo-600 text-white font-sans font-medium rounded-tr-none' 
                          : 'bg-sleek-input border border-sleek-input text-sleek-main font-sans rounded-tl-none'
                      }`}>
                        
                        <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                        {/* Image assets */}
                        {msg.imageUrl && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-sleek-input max-w-[200px]">
                            <img
                              referrerPolicy="no-referrer"
                              src={msg.imageUrl}
                              alt="DM file attachment"
                              className="object-cover w-full h-auto"
                            />
                          </div>
                        )}

                        {/* Document references */}
                        {msg.fileName && (
                          <div className={`mt-3 flex items-center gap-2 p-2.5 rounded-xl border text-[10px] font-mono ${
                            isOwn 
                              ? 'bg-indigo-700 border-indigo-550 text-white' 
                              : 'bg-sleek-card border-sleek-main text-sleek-muted'
                          }`}>
                            <FileText className="w-4 h-4 shrink-0 text-indigo-400" />
                            <span className="truncate max-w-[155px]">{msg.fileName}</span>
                            <span className="text-[8px] opacity-75 font-sans font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase">DOC</span>
                          </div>
                        )}

                        <div className={`text-[8px] font-mono text-right mt-2 ${
                          isOwn ? 'text-indigo-100/75' : 'text-sleek-muted'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Form Bar */}
              <div className="p-4 bg-sleek-sidebar/45 border-t border-sleek-main">
                
                {/* Simulated mockup document uploads drawer */}
                <AnimatePresence>
                  {showAttachOptions && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-sleek-card border border-sleek-main p-4 rounded-xl mb-4 space-y-3 shadow-inner text-left"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-sleek-main text-[10px] font-bold text-sleek-muted uppercase font-display">
                        <span>Simulate Document attachments</span>
                        <button onClick={() => setShowAttachOptions(false)} className="text-zinc-400 hover:text-sleek-heading cursor-pointer hover:underline text-[9px]">Cancel</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-sleek-muted uppercase mb-1">Mime Profile</label>
                          <select
                            value={fileMime}
                            onChange={(e) => setFileMime(e.target.value as any)}
                            className="w-full bg-sleek-input border border-sleek-input rounded-lg px-2 py-1.5 text-[10px] text-sleek-main focus:outline-none"
                          >
                            <option value="document">PDF Resume Showcase</option>
                            <option value="image">PNG Interactive Mockup</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-sleek-muted uppercase mb-1">Uploaded Filename</label>
                          <input
                            type="text"
                            placeholder="e.g. sarah_resume_2026.pdf"
                            value={typedFileName}
                            onChange={(e) => setTypedFileName(e.target.value)}
                            className="w-full bg-sleek-input border border-sleek-input rounded-lg px-2 py-1.5 text-[10px] text-sleek-main focus:outline-none"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleAttachMock}
                            className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-[10px] rounded-lg cursor-pointer"
                          >
                            Send Attachment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2.5 items-center">
                  <button
                    type="button"
                    onClick={() => setShowAttachOptions(!showAttachOptions)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      showAttachOptions
                        ? 'bg-indigo-500/10 border-indigo-550/40 text-indigo-400'
                        : 'bg-sleek-input border-sleek-input text-sleek-muted hover:text-sleek-heading'
                    }`}
                    title="Mock upload files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                    placeholder="Type message pitch..."
                    className="flex-1 bg-sleek-input border border-sleek-input focus:border-indigo-500/50 focus:outline-none text-xs rounded-xl py-3 px-4 text-sleek-main font-sans placeholder:text-sleek-muted"
                  />

                  <button
                    id="btn_send_message_action"
                    onClick={handleSend}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm transition-all focus:scale-95 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-sleek-muted flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-10 h-10 text-sleek-muted opacity-40 mb-3" />
              <div>No chat conversations active. Make a connection network first.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
