import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const quizData = [
  {
    q: "Which branch of government is responsible for interpreting the laws and ensuring they are applied fairly?",
    options: ["Executive Branch", "Judicial Branch", "Legislative Branch", "Administrative Branch"],
    answerIndex: 1,
    explanation: "The Judicial Branch, headed by the Supreme Court, evaluates laws to ensure they align with the Constitution.",
  },
  {
    q: "What is the minimum voting age for citizens in India?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    answerIndex: 1,
    explanation: "The 61st Amendment Act of 1988 lowered the voting age for elections to the Lok Sabha and State Legislative Assemblies from 21 to 18 years.",
  },
  {
    q: "What does VVPAT stand for?",
    options: ["Voter Verifiable Paper Audit Trail", "Voting Verification Paper And Trail", "Voter Visual Paper Audit Trail", "Verified Voter Paper Audit Tool"],
    answerIndex: 0,
    explanation: "VVPAT provides a physical paper trail to voters using a ballotless voting system, ensuring their vote was recorded correctly.",
  },
  {
    q: "Who conducts the elections to the Parliament and State Legislatures in India?",
    options: ["State Election Commission", "President of India", "Election Commission of India", "Supreme Court"],
    answerIndex: 2,
    explanation: "The Election Commission of India is an autonomous constitutional authority responsible for administering election processes in India at the national and state levels.",
  },
  {
    q: "What does the NOTA option signify on an EVM?",
    options: ["A newly registered political party", "None Of The Above", "National Organization of Tribal Affairs", "Needs Official Ticket Authentication"],
    answerIndex: 1,
    explanation: "NOTA (None Of The Above) is an option that allows voters to officially register their disapproval of all candidates in the election.",
  }
];

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const question = quizData[currentQuestion];
  const progressPercent = (Math.max(currentQuestion + (answers[currentQuestion] !== undefined ? 1 : 0), Object.keys(answers).length) / quizData.length) * 100;

  const selectedOption = answers[currentQuestion] !== undefined ? answers[currentQuestion] : null;
  const isAnswered = selectedOption !== null;

  const handleOptionSelect = (index: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: index }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsFinished(false);
  };

  if (isFinished) {
    const score = Object.entries(answers).reduce((acc, [qIndex, selectedIdx]) => {
      return acc + (quizData[Number(qIndex)].answerIndex === selectedIdx ? 1 : 0);
    }, 0);
    const incorrectCount = quizData.length - score;
    const percentage = (score / quizData.length) * 100;
    
    let personalizedMessage = "";
    if (percentage === 100) {
      personalizedMessage = "Excellent! You are a voting expert. Ready to make an informed choice!";
    } else if (percentage >= 80) {
      personalizedMessage = "Great job! You have a solid grasp of the civic process.";
    } else if (percentage >= 60) {
      personalizedMessage = "Good effort! A little more reading and you'll be fully prepared.";
    } else {
      personalizedMessage = "This was a good practice. We recommend exploring the VoteGuide AI assistant to learn more about the voting process!";
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-grow pt-24 pb-12 px-6 max-w-[1280px] mx-auto w-full flex flex-col items-center justify-center relative"
      >
        <div className="w-full max-w-3xl glass-panel rounded-xl p-8 md:p-12 relative z-10 overflow-hidden text-center justify-center flex flex-col items-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Quiz Completed!</h2>
          <p className="text-on-surface-variant font-medium mb-8">Here's how you performed on the Civic Readiness check.</p>
          
          <div className="flex gap-4 md:gap-6 mb-8 w-full max-w-md justify-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex-1 shadow-sm">
                  <p className="text-4xl md:text-5xl font-black text-emerald-600 mb-1">{score}</p>
                  <p className="text-xs md:text-sm font-bold text-emerald-800 uppercase tracking-widest">Correct</p>
              </div>
              <div className="bg-error-container border border-error/20 rounded-2xl p-6 flex-1 shadow-sm">
                  <p className="text-4xl md:text-5xl font-black text-error mb-1">{incorrectCount}</p>
                  <p className="text-xs md:text-sm font-bold text-error uppercase tracking-widest">Incorrect</p>
              </div>
          </div>
          
          <div className="bg-surface p-6 rounded-xl border border-surface-variant mb-10 w-full max-w-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-on-surface">Score: {Math.round(percentage)}%</h3>
              <p className="text-on-surface-variant leading-relaxed">
                 {personalizedMessage}
              </p>
          </div>
          
          <button 
              onClick={restartQuiz}
              className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:scale-105 transition-all"
          >
              Retake Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pt-24 pb-12 px-6 max-w-[1280px] mx-auto w-full flex flex-col items-center justify-center relative"
    >
      <div className="w-full max-w-3xl glass-panel rounded-xl p-8 md:p-12 relative z-10 overflow-hidden">
        
        {/* Quiz Header & Progress */}
        <div className="mb-8 relative z-20">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-primary">Civic Readiness Quiz</h1>
            <span className="font-bold text-xs text-secondary bg-secondary-fixed px-3 py-1 rounded-full whitespace-nowrap ml-2">
              Question {currentQuestion + 1} of {quizData.length}
            </span>
          </div>
          
          {/* Progress Tracker */}
          <div className="w-full bg-surface-variant rounded-full h-2 mb-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full shadow-[0_0_8px_rgba(138,76,252,0.6)]" 
            />
          </div>
          <p className="text-sm text-outline text-right">{Math.round(progressPercent)}% Completed</p>
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-10 relative z-20"
          >
            <h2 className="text-2xl font-semibold text-on-surface mb-6 leading-tight min-h-[64px]">
              {question.q}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === question.answerIndex;
                const showCorrect = isAnswered && isCorrect;
                const showIncorrectRow = isAnswered && isSelected && !isCorrect;

                return (
                  <motion.button 
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswered}
                    aria-pressed={isSelected}
                    aria-label={`Option ${index + 1}: ${option}`}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3 text-base ${
                      showCorrect 
                        ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_12px_rgba(16,185,129,0.2)] text-emerald-900 font-semibold' 
                        : showIncorrectRow
                        ? 'border-error bg-error-container text-on-error-container'
                        : isAnswered 
                        ? 'border-outline-variant bg-surface-bright/50 opacity-50 cursor-not-allowed'
                        : 'border-outline-variant bg-surface-bright hover:border-secondary hover:bg-secondary-fixed text-on-surface group'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-colors ${
                      showCorrect ? 'border-emerald-500 bg-emerald-500' : 
                      showIncorrectRow ? 'border-error bg-error' :
                      isAnswered ? 'border-outline opacity-50' :
                      'border-outline group-hover:border-secondary'
                    }`}>
                      {showCorrect && <Check className="w-4 h-4 text-white" />}
                      {(!isAnswered) && <span className="w-3 h-3 rounded-full bg-transparent group-hover:bg-secondary transition-colors"></span>}
                    </div>
                    <span>{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Instant Feedback Area */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`mb-8 p-4 rounded-lg border flex items-start gap-3 ${
                selectedOption === question.answerIndex 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <Lightbulb className={`w-6 h-6 mt-1 shrink-0 ${
                  selectedOption === question.answerIndex ? 'text-emerald-600 fill-emerald-600' : 'text-orange-600 fill-orange-600'
                }`} />
                <div>
                  <h3 className={`text-xs font-bold mb-1 uppercase tracking-wider ${
                    selectedOption === question.answerIndex ? 'text-emerald-800' : 'text-orange-800'
                  }`}>
                    {selectedOption === question.answerIndex ? 'Spot on!' : 'Not quite.'}
                  </h3>
                  <p className={`text-sm ${
                    selectedOption === question.answerIndex ? 'text-emerald-900/80' : 'text-orange-900/80'
                  }`}>
                    {selectedOption !== question.answerIndex && (
                      <span className="font-semibold block mb-1">
                        The correct answer is: {question.options[question.answerIndex]}
                      </span>
                    )}
                    {question.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-surface-variant relative z-20">
          <button 
            onClick={prevQuestion}
            aria-label={currentQuestion === 0 ? "Back to Previous Page" : "Previous Question"}
            className="text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-wide text-on-surface-variant"
          >
            <ArrowLeft className="w-4 h-4" /> {currentQuestion === 0 ? 'Back' : 'Previous'}
          </button>
          
          <AnimatePresence mode="popLayout">
            {isAnswered && currentQuestion < quizData.length - 1 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={nextQuestion}
                aria-label="Next Question"
                className="bg-gradient-to-r from-secondary to-primary text-white px-8 py-3 rounded-full text-sm font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-all"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
            
            {isAnswered && currentQuestion === quizData.length - 1 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsFinished(true)}
                className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-all"
              >
                View Results
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
