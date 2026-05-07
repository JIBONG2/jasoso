export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export const generateInitialSOP = async (type: string, info: { 
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
  const prompt = `당신은 전문 취업 컨설턴트입니다. 다음 정보를 바탕으로 '${info.style}'를 적용하여 매력적인 '${type}' 자기소개서를 작성해주세요.
  
  [지원자 정보]
  성함: ${info.name}
  학력: ${info.education}
  자격 사항: ${info.certificates}
  
  [지원 목표]
  지원 회사: ${info.company}
  지원 직무: ${info.job}
  지원 동기: ${info.motive}
  
  [역량 및 경험]
  핵심 강점: ${info.strengths}
  주요 경험 및 성과: ${info.experience}
  
  작성 가이드:
  1. 한국어로 작성해주세요.
  2. ${info.style}를 반드시 유지하며 작성해주세요.
  3.${info.company}와 ${info.job}에 대한 지원자의 열정이 잘 드러나도록 해주세요.
  4. Markdown 형식을 사용하여 제목(#)과 소제목(##)을 절대적으로 구분해 주세요.
  5. 문서 최상단에 # [자기소개서] 제목을 크게 작성해주세요.
  6. 각 문항 시작 전 ## 1. 지원 동기 및 포부 와 같은 형태로 소제목을 크게 작성해주세요.
  7. 소제목 아래에는 실제 문서처럼 가독성 있게 내용을 배치해주세요.
  8. 구체적인 수치나 에피소드가 있다면 강조하여 진정성을 높여주세요.
  9. 문체는 정중하고 전문적인 어투(~합니다)를 기본으로 합니다.`;

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("Failed to generate SOP");
  const data = await response.json();
  return data.text;
};

export const refineSOP = async (history: ChatMessage[], currentSOP: string, feedback: string) => {
  const systemInstruction = `당신은 자기소개서 첨삭 전문가 'AI 쥬쥬'입니다. 사용자의 피드백을 반영하여 현재 자기소개서를 수정해주세요. 
      사용자가 특정 부분의 수정을 요청하면 그 부분을 중점적으로 고치되, 전체적인 흐름이 자연스러워야 합니다.
      답변에는 항상 '수정된 자기소개서 전체 내용'을 Markdown 형식으로 포함해야 합니다.
      제목은 # [자기소개서] 형식을 사용하고, 각 항목의 소제목은 ## 1. [제목] 형식을 사용하여 실제 문서처럼 가독성 있게 작성해주세요.`;

  const response = await fetch("/api/refine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, currentSOP, feedback, systemInstruction }),
  });

  if (!response.ok) throw new Error("Failed to refine SOP");
  const data = await response.json();
  return data.text;
};
