import * as React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Send } from "lucide-react";

interface BasicInfoFormProps {
  sopType: string;
  onBack: () => void;
  onSubmit: (info: { 
    name: string;
    style: string;
    company: string;
    job: string;
    motive: string;
    education: string;
    strengths: string; 
    experience: string; 
    certificates: string;
  }) => void;
  loading: boolean;
}

export function BasicInfoForm({ sopType, onBack, onSubmit, loading }: BasicInfoFormProps) {
  const [info, setInfo] = React.useState({ 
    name: "",
    style: "전문적이고 신뢰감 있는 말투",
    company: "",
    job: "",
    motive: "",
    education: "",
    strengths: "", 
    experience: "",
    certificates: "" 
  });

  const isFormValid = info.name.trim() && info.company.trim() && info.job.trim() && info.motive.trim();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        뒤로 가기
      </button>

      <div className="mb-10">
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{sopType}</span>
        <h2 className="text-3xl font-bold text-slate-900 mt-4">유이야, 너의 정보를 들려줘!</h2>
        <p className="text-slate-600 mt-2">입력한 내용이 많을수록 쥬쥬오빠(AI)가 더 멋지게 써줄 거야.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">이름</label>
          <input
            type="text"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            placeholder="홍길동"
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">작성 스타일</label>
          <select 
            value={info.style}
            onChange={(e) => setInfo({ ...info, style: e.target.value })}
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            <option>전문적이고 신뢰감 있는 말투</option>
            <option>열정적이고 도전적인 말투</option>
            <option>차분하고 논리적인 말투</option>
            <option>솔직하고 담백한 말투</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">지원 회사명</label>
          <input
            type="text"
            value={info.company}
            onChange={(e) => setInfo({ ...info, company: e.target.value })}
            placeholder="예: 유이소프트"
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">희망 직무</label>
          <input
            type="text"
            value={info.job}
            onChange={(e) => setInfo({ ...info, job: e.target.value })}
            placeholder="예: 서비스 기획자"
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">학력 사항</label>
          <input
            type="text"
            value={info.education}
            onChange={(e) => setInfo({ ...info, education: e.target.value })}
            placeholder="학교, 전공 등을 적어주세요."
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">강점 및 역량</label>
          <textarea
            value={info.strengths}
            onChange={(e) => setInfo({ ...info, strengths: e.target.value })}
            placeholder="자신있는 핵심 역량을 적어주세요."
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">주요 경험 및 성과</label>
          <textarea
            value={info.experience}
            onChange={(e) => setInfo({ ...info, experience: e.target.value })}
            placeholder="프로젝트, 대외활동 등 구체적인 경험을 적어주세요."
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none h-32 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">보유 자격증 (선택)</label>
          <input
            type="text"
            value={info.certificates}
            onChange={(e) => setInfo({ ...info, certificates: e.target.value })}
            placeholder="어학 성적, 자격증 등"
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">지원 동기</label>
          <textarea
            value={info.motive}
            onChange={(e) => setInfo({ ...info, motive: e.target.value })}
            placeholder="왜 이 회사와 직무여야 하나요?"
            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none h-32 resize-none"
          />
        </div>

        <button
          onClick={() => onSubmit(info)}
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center transition-all ${
            isFormValid && !loading 
              ? "bg-slate-950 text-white hover:bg-slate-800 shadow-lg" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              첫 초안 작성 중...
            </div>
          ) : (
            <>
              자소서 생성하기
              <Send size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
