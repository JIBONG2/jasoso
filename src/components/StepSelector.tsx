import * as React from "react";
import { Briefcase, GraduationCap, User, Rocket, ChevronRight, History, Clock } from "lucide-react";
import { motion } from "motion/react";
import { SOPDraft } from "../types";

interface StepSelectorProps {
  onSelect: (type: string) => void;
  drafts: SOPDraft[];
  onLoadDraft: (draft: SOPDraft) => void;
}

const steps = [
  {
    id: "common",
    title: "일반 취업",
    description: "신입/경력사원 지원을 위한 표준 자기소개서",
    icon: Briefcase,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "intern",
    title: "인턴십/대외활동",
    description: "열정과 가능성을 보여주는 실무 경험 위주",
    icon: Rocket,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: "academic",
    title: "대학원/진학",
    description: "학문적 열의와 연구 계획을 강조하는 학업계획서",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "custom",
    title: "기타/자유 양식",
    description: "특수한 상황이나 자유로운 형식의 지원서",
    icon: User,
    color: "bg-emerald-50 text-emerald-600",
  },
];

export function StepSelector({ onSelect, drafts, onLoadDraft }: StepSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight text-slate-900 mb-4"
        >
          유이의 자기소개서 작성해버리기
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600"
        >
          유이야 아래에서 정해봐
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* New Draft Selection */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            새로 작성하기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(step.title)}
                className="flex items-center p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mr-4 shrink-0`}>
                  <step.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-0.5">{step.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-1">{step.description}</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent History Sidebar */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <History size={20} className="text-blue-600" />
            최근 작성 목록
          </h2>
          
          <div className="space-y-3">
            {drafts.length > 0 ? (
              drafts.map((draft, index) => (
                <motion.button
                  key={draft.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onLoadDraft(draft)}
                  className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {draft.type}
                    </span>
                    <div className="flex items-center text-slate-400 text-[10px]">
                      <Clock size={10} className="mr-1" />
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-slate-800 line-clamp-2 font-medium leading-relaxed group-hover:text-blue-700">
                    {draft.content.substring(0, 80)}...
                  </p>
                </motion.button>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                <History size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-xs text-slate-400 font-medium whitespace-pre-wrap leading-relaxed">
                  아직 작성된 자서가 없어요.<br />새로운 자서를 시작해보세요!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
