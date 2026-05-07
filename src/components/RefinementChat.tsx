import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Copy, RefreshCw, MessageSquare, FileText, Check, Home, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface RefinementChatProps {
  initialSOP: string;
  onRefine: (feedback: string) => Promise<string>;
  onHome: () => void;
}

export function RefinementChat({ initialSOP, onRefine, onHome }: RefinementChatProps) {
  const [sop, setSop] = React.useState(initialSOP);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const newSOP = await onRefine(userMsg);
      setSop(newSOP);
      setMessages(prev => [...prev, { role: "model", text: "요청하신 부분을 반영하여 자기소개서를 수정했습니다. 왼쪽 문서에서 내용을 확인해보세요!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", text: "오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sop);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Document View */}
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={onHome}
            className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            처음으로
          </button>
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[80vh] p-8 lg:p-12 relative group mb-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center text-slate-400 text-sm font-medium uppercase tracking-widest">
                <FileText size={16} className="mr-2" />
                최종 자기소개서
              </div>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-all flex items-center gap-2"
              >
                {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                <span className="text-xs font-semibold">{isCopied ? "복사완료" : "복사하기"}</span>
              </button>
            </div>
            
            <div className="markdown-body prose prose-slate max-w-none 
              prose-h1:text-5xl prose-h1:font-extrabold prose-h1:text-center prose-h1:mb-12 prose-h1:text-slate-900
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-slate-800 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4
              prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-6
              prose-strong:text-blue-600 prose-strong:font-semibold">
              <ReactMarkdown>{sop}</ReactMarkdown>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-3xl">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <p className="text-slate-600 font-medium animate-pulse">유이야 좀만 기다려 쥬쥬오빠가 변경해줄겡</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-full lg:w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white ring-4 ring-blue-50">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI 쥬쥬</h3>
            <p className="text-xs text-slate-500">대화하며 자소서를 완성해줄겡</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="text-center py-10 px-4">
              <p className="text-slate-400 text-sm">
                "성격의 장점을 좀 더 강조해줘"<br/>
                "전체적으로 좀 더 부드러운 말투로 바꿔줘"<br/>
                등의 요청을 해보세요!
              </p>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-slate-900 text-white rounded-tr-none" 
                      : "bg-slate-100 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="수정 요청사항을 적어주세요..."
              className="w-full p-4 pr-12 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800 "
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-200 transition-all shadow-sm"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">
            AI는 실수를 할 수 있으니 항상 최종 검토해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
