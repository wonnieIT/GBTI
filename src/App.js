import React, { useState, useEffect } from 'react';
import './App.css';
import { OpenAI } from 'openai';
import ReactMarkdown from 'react-markdown';


function App() {
  const allQuestions = [
    {
      question: "당신이 슈퍼 히어로라면, 어떤 능력을 가지고 싶나요?",
      answers: ["순간이동", "마법 사용", "초능력", "불사신", "동물과 대화"]
    },
    {
      question: "지금 이 순간 갑자기 게임 세계로 들어간다면, 첫 번째로 하고 싶은 일은?",
      answers: ["최강의 무기부터 찾아본다", "주변 NPC와 대화한다", "맵을 탐험한다", "다른 플레이어를 찾아본다", "돈부터 모은다"]
    },
    {
      question: "당신의 게임 플레이 스타일을 동물로 표현한다면?",
      answers: ["호기심 많은 원숭이", "신중한 부엉이", "날렵한 치타", "사교적인 돌고래", "꼼꼼한 비버"]
    },
    {
      question: "게임 세상의 직업이 된다면?",
      answers: ["모험가 길드 마스터", "마법 도서관 관리인", "여관 주인", "왕실 기사단장", "상인 연합 회장"]
    },
    {
      question: "게임할 때 당신을 가장 짜증나게 하는 상황은?",
      answers: ["튜토리얼이 너무 길다", "저장을 못하고 죽었다", "파티원이 던전에서 도망갔다", "아이템 강화가 실패했다", "스토리를 스킵할 수 없다"]
    },
    {
      question: "당신의 게임 플레이 에너지가 보이는 시간대는?",
      answers: ["아침에 상쾌하게", "점심시간 틈틈이", "저녁에 진지하게", "새벽에 몰래"]
    },
    {
      question: "당신이 운영하는 게임 카페의 메인 메뉴는?",
      answers: ["빠른 테이크아웃 음료", "파티 세트 메뉴", "오랫동안 즐기는 코스 요리", "혼자만의 프리미엄 세트", "매일 바뀌는 랜덤 메뉴"]
    },
    {
      question: "게임 세상에서 당신의 집을 지을 때 가장 중요하게 생각하는 것은?",
      answers: ["다른 플레이어와 가까운 위치", "숨겨진 비밀 장소", "효율적인 동선", "아늑한 인테리어", "화려한 외관"]
    },
    {
      question: "게임 세상의 음식이 현실이 된다면, 가장 먼저 먹어보고 싶은 것은?",
      answers: ["마나 포션", "스태미나 회복 도시락", "랜덤 효과의 미스터리 요리", "파티원과 나누는 버프 음식", "HP 회복 물약"]
    },
    {
      question: "당신의 게임 인벤토리를 정리하는 방식은?",
      answers: ["희귀도순 완벽 정리", "그때그때 필요한 것만", "버리지 못하고 다 모음", "팔아서 돈으로 전환", "파티원과 나눠가짐"]
    },
    {
      question: "게임 세상의 펫을 고른다면?",
      answers: ["귀여운 슬라임", "전설의 드래곤", "요정 동료", "수집형 미니펫", "실용적인 물류 펫"]
    },
    {
      question: "게임 내 당신의 이상적인 하루는?",
      answers: ["던전 보스 레이드", "낚시와 채집", "퀘스트 완료", "아이템 제작", "PvP 경기"]
    },
    {
      question: "당신이 가장 선호하는 게임 배경음악은?",
      answers: ["웅장한 오케스트라", "신나는 팝", "몽환적인 분위기", "긴장감 넘치는 전자음", "잔잔한 어쿠스틱"]
    },
    {
      question: "게임 세상에서 탈 것을 고른다면?",
      answers: ["날아다니는 드래곤", "빠른 레이싱카", "귀여운 거품 구름", "기계장치 탑승물", "파티원과 함께 타는 마차"]
    },
    {
      question: "게임 속 당신의 비밀 아지트는?",
      answers: ["하늘 위 공중 요새", "숨겨진 비밀 상점", "아늑한 마법 도서관", "파티원 전용 길드하우스", "이동식 캠핑카"]
    },
    {
      question: "게임 보스와 맞닥뜨렸을 때 당신의 첫 반응은?",
      answers: ["패턴부터 분석", "일단 피격 테스트", "파티원 호출", "도망가서 레벨업", "대화로 해결 시도"]
    },
    {
      question: "게임 머니 100만 골드를 얻었다면?",
      answers: ["최강 무기 구매", "부동산 투자", "패션 아이템 구매", "파티원과 공평 분배", "레어 아이템 수집"]
    },
    {
      question: "게임 속 NPC가 된다면 어떤 역할을 맡고 싶나요?",
      answers: ["전설의 무기 대장장이", "퀘스트 주는 모험가", "마을 잡화점 주인", "던전 가이드", "신비한 마법상인"]
    }
  ];
  
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [answers, setAnswers] = useState([]);
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
      setQuestions(shuffledQuestions.slice(0, 7));
    }, []);
  
    const startQuiz = () => {
      setCurrentQuestion(0);
    };
  
    const handleAnswer = (answer) => {
      setAnswers([...answers, answer]);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    };
  
    const recommendGame = async () => {
      setLoading(true);
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
  
      const userResponses = questions.map((q, index) => {
        return `${q.question}: ${answers[index]}`;
      }).join("\n");
      
      console.log(userResponses)
      const messages = [
        { role: "system", content: "You are a helpful assistant that recommends games based on user preferences." },
        { role: "user", content: `다음은 사용자의 게임 선호도에 대한 질문과 답변입니다:\n${userResponses}\n이 정보를 기반으로 추천할 수 있는 게임은 무엇인가요?` }
      ];
  
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: messages,
          max_tokens: 3000,
        });
        console.log(response.choices[0].message.content.trim());
        setRecommendation(response.choices[0].message.content.trim());
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="App">
        <header className="App-header">
          {currentQuestion === -1 ? (
            <button className="start-button" onClick={startQuiz}>
              나의 성향으로 게임 찾기 시작하기
            </button>
          ) : currentQuestion < questions.length ? (
            <>
              <p>{questions[currentQuestion].question}</p>
              {questions[currentQuestion].answers.map((answer, index) => (
                <button key={index} onClick={() => handleAnswer(answer)}>
                  {answer}
                </button>
              ))}
            </>
          ) : (
            <div>
              {recommendation ? (
                <><div className="recommendation-card">
                  <h2>추천 게임</h2>
                  <ReactMarkdown>{recommendation}</ReactMarkdown>
                  <button className="restart-button" onClick={() => setCurrentQuestion(-1)}>
                  다시 시작하기
                </button>
                  </div>
                </>
              ) : (
                <>
                  {loading ? (
                    <div className="loader"></div> // 로딩 아이콘 표시
                  ) : (
                    <button className="result-button" onClick={recommendGame}>
                      결과 확인하기
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </header>
      </div>
    );
  }
  
  export default App;