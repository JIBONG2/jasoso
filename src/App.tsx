import * as React from "react";
import { StepSelector } from "./components/StepSelector";
import { BasicInfoForm } from "./components/BasicInfoForm";
import { RefinementChat } from "./components/RefinementChat";
import { generateInitialSOP, refineSOP, ChatMessage } from "./services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { SOPDraft } from "./types";

type AppStep = "TYPE_SELECTION" | "INFO_INPUT" | "REFINEMENT";

export default function App() {
  const [step, setStep] = React.useState<AppStep>("TYPE_SELECTION");
  const [sopType, setSopType] = React.useState("");
  const [initialSOP, setInitialSOP] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [drafts, setDrafts] = React.useState<SOPDraft[]>([]);

  // Load history on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("uiee_sop_drafts");
    if (saved) {
      try {
        setDrafts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse drafts", e);
      }
    }
  }, []);

  const saveToHistory = (content: string, type: string) => {
    const newDraft: SOPDraft = {
      id: Date.now().toString(),
      type,
      content,
      updatedAt: Date.now(),
    };
    const updated = [newDraft, ...drafts.filter(d => d.content !== content)].slice(0, 10);
    setDrafts(updated);
    localStorage.setItem("uiee_sop_drafts", JSON.stringify(updated));
  };

  const updateHistory = (content: string) => {
    const updated = drafts.map(d => 
      d.content === initialSOP ? { ...d, content, updatedAt: Date.now() } : d
    );
    setDrafts(updated);
    localStorage.setItem("uiee_sop_drafts", JSON.stringify(updated));
    setInitialSOP(content);
  };

  const handleSelectType = (type: string) => {
    setSopType(type);
    setStep("INFO_INPUT");
  };

  const handleLoadDraft = (draft: SOPDraft) => {
    setSopType(draft.type);
    setInitialSOP(draft.content);
    setChatHistory([]);
    setStep("REFINEMENT");
  };

  const handleGenerateSOP = async (info: { 
    name: string;
    style: string;
    company: string;
    job: string;
    motive: string;
    education: string;
    strengths: string; 
    experience: string; 
    certificates: string;
  }) => {
    setLoading(true);
    try {
      const text = await generateInitialSOP(sopType, info);
      const content = text || "";
      setInitialSOP(content);
      saveToHistory(content, sopType);
      setStep("REFINEMENT");
    } catch (error) {
      console.error("Failed to generate SOP", error);
      alert("자기소개서 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (feedback: string) => {
    const newChatHistory = [...chatHistory, { role: "user" as const, text: feedback }];
    const text = await refineSOP(chatHistory, initialSOP, feedback);
    
    const refinedText = text || initialSOP;
    updateHistory(refinedText);
    setChatHistory([...newChatHistory, { role: "model" as const, text: "수정 완료" }]);
    return refinedText;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header (Only on first 2 steps) */}
      {step !== "REFINEMENT" && (
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span>유이야 자소서 쉽게 쓰게해줄게</span>
          </div>
        </header>
      )}

      <main>
        <AnimatePresence mode="wait">
          {step === "TYPE_SELECTION" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StepSelector 
                onSelect={handleSelectType} 
                drafts={drafts}
                onLoadDraft={handleLoadDraft}
              />
            </motion.div>
          )}

          {step === "INFO_INPUT" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BasicInfoForm 
                sopType={sopType} 
                onBack={() => setStep("TYPE_SELECTION")} 
                onSubmit={handleGenerateSOP}
                loading={loading}
              />
            </motion.div>
          )}

          {step === "REFINEMENT" && (
            <motion.div
              key="refinement"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <RefinementChat 
                initialSOP={initialSOP} 
                onRefine={handleRefine} 
                onHome={() => {
                  setStep("TYPE_SELECTION");
                  setChatHistory([]);
                  setSopType("");
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

