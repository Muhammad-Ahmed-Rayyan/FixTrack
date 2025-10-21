import { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

interface ChatbotTrigger {
  category: string;
  text: string;
}

interface ChatbotProps {
  onClose: () => void;
  trigger: ChatbotTrigger | null;
}

const Chatbot = ({ onClose, trigger }: ChatbotProps) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const chatbotRef = useRef<HTMLDivElement>(null);

  const responses = {
    pothole: {
      en: 'Thank you for your report. For your safety, please be cautious when driving near the reported area until our team addresses it.',
      ur: 'Aapki report ka shukriya. Apni hifazat ke liye, meherbani karke is ilaake mein gari chalate waqt ehtiyat karein jab tak hamari team isay theek na karle.'
    },
    light: {
      en: 'Thank you for reporting the street light issue. Please be careful in that area at night until it is resolved.',
      ur: 'Street light ke masle ki ittila dene ka shukriya. Meherbani karke raat ke waqt is ilaake mein ehtiyat karein jab tak yeh theek na hojaye.'
    },
    water: {
      en: 'Thank you for your report. If there is flooding, please avoid the area. Your report has been sent to the water department.',
      ur: 'Aapki report ka shukriya. Agar selab hai, to meherbani karke is ilaake se door rahein. Aapki report water department ko bhej di gayi hai.'
    },
    gas: {
      en: 'IMPORTANT: As a precaution, please turn off your main gas supply, open all windows and doors, and do not use any electronic devices or open flames. Emergency services have been notified.',
      ur: 'ZAROORI: Ehtiyati tadbeer ke tor par, meherbani karke apni main gas supply band kardein, tamam khirkiyan aur darwaze khol dein, aur koi bhi electronic aalaat ya aag istemal na karein. Emergency services ko ittila de di gayi hai.'
    },
    electricity: {
      en: 'IMPORTANT: Please stay at least 10 meters (33 feet) away from any downed power lines. Do not touch anything that may be in contact with a downed line. The electricity department has been alerted.',
      ur: 'ZAROORI: Meherbani karke giri hui bijli ki taaron se kam se kam 10 meter (33 feet) door rahein. Kisi aisi cheez ko na chooein jo giri hui taar se lagi ho. Bijli department ko aagah kar diya gaya hai.'
    },
    sewerage: {
      en: 'Thank you for your report. Please avoid contact with wastewater. Keep children and pets away from the area until the issue is resolved.',
      ur: 'Aapki report ka shukriya. Meherbani karke ganday paani se door rahein. Bachon aur paaltu janwaron ko is ilaake se door rakhein jab tak masla hal na hojaye.'
    },
    bridge: {
      en: 'Thank you for reporting the damage. Please avoid using the damaged structure and use an alternative route if possible.',
      ur: 'Nuqsan ki ittila dene ka shukriya. Meherbani karke tabah shuda dhanchay ka istemal na karein aur agar mumkin ho to mutabadil rasta istemal karein.'
    },
    garbage: {
      en: 'Thank you for your report. Please be careful of any sharp objects or hazardous materials in the overflowing garbage.',
      ur: 'Aapki report ka shukriya. Meherbani karke kachray mein mojood kisi bhi tez dhaar wali cheezon ya khatarnak mawad se mohtaat rahein.'
    },
    blockage: {
      en: 'IMPORTANT: If there are injuries, please ensure emergency services have been called. Avoid the area and do not approach any downed power lines. Your report has been received.',
      ur: 'ZAROORI: Agar koi zakhmi hai, to meherbani karke yaqeeni banayein ke emergency services ko call kar di gayi hai. Ilaake se door rahein aur kisi bhi giri hui bijli ki taaron ke paas na jayein. Aapki report mosool ho gayi hai.'
    },
    fire: {
      en: 'IMPORTANT: Please ensure you have called emergency services. Evacuate the area if necessary and follow the instructions of emergency personnel. Your report has been noted.',
      ur: 'ZAROORI: Meherbani karke yaqeeni banayein ke aapne emergency services ko call kar di hai. Agar zaroori ho to ilaaka khali kardein aur emergency amlay ki hidayaat par amal karein. Aapki report note karli gayi hai.'
    },
    greeting: {
      en: 'Hello! How can I help you today? You can ask me for help choosing an issue category.',
      ur: 'Assalam-o-Alaikum! Main aaj aapki kya madad kar sakta hoon? Aap mujhse masle ki category chunne mein madad le sakte hain.'
    },
    followUp: {
      en: 'Is there anything else I can help you with?',
      ur: 'Kya main aapki aur koi madad kar sakta hoon?'
    },
    default: {
      en: "I'm sorry, I don't understand. Can you please rephrase your question? I can help you choose the right category for your issue.",
      ur: "Maaf kijiye, main samajh nahi saka. Kya aap apna sawal doosre alfaz mein pooch sakte hain? Main aapko masle ki sahi category chunne mein madad kar sakta hoon."
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const detectLanguage = (input: string): 'en' | 'ur' => {
    const urduKeywords = ['kya', 'hai', 'mein', 'ko', 'ki', 'ka', 'aap', 'shukriya', 'masla', 'salam', 'madad', 'gari', 'ehtiyat'];
    const lowerInput = input.toLowerCase();
    for (const keyword of urduKeywords) {
      if (lowerInput.includes(keyword)) return 'ur';
    }
    return 'en';
  };
  
  const getResponseObject = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('pothole') || lowerInput.includes('road damage')) return responses.pothole;
    if (lowerInput.includes('light')) return responses.light;
    if (lowerInput.includes('water')) return responses.water;
    if (lowerInput.includes('gas')) return responses.gas;
    if (lowerInput.includes('electricity')) return responses.electricity;
    if (lowerInput.includes('sewerage') || lowerInput.includes('drainage')) return responses.sewerage;
    if (lowerInput.includes('bridge') || lowerInput.includes('footpath')) return responses.bridge;
    if (lowerInput.includes('garbage') || lowerInput.includes('overflow')) return responses.garbage;
    if (lowerInput.includes('road blockage') || lowerInput.includes('accident')) return responses.blockage;
    if (lowerInput.includes('fire') || lowerInput.includes('emergency')) return responses.fire;
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('salam')) return responses.greeting;
    return responses.default;
  }

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (trigger) {
      const lang = detectLanguage(trigger.text);
      const responseObject = getResponseObject(trigger.category);
      setMessages([{ text: responseObject[lang], sender: 'bot' as const }]);
      timeoutId = setTimeout(() => {
        setMessages(prev => [...prev, { text: responses.followUp[lang], sender: 'bot' as const }]);
      }, 2000);
    } else {
      const bilingualGreeting = `${responses.greeting.en}\n\n${responses.greeting.ur}`;
      setMessages([{ text: bilingualGreeting, sender: 'bot' as const }]);
    }

    return () => {
      clearTimeout(timeoutId);
    }
  }, [trigger]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' as const };
    setMessages((prev) => [...prev, userMessage]);

    const lang = detectLanguage(input);
    const responseObject = getResponseObject(input);
    const botResponse = responseObject[lang];

    setTimeout(() => {
        const botMessage = { text: botResponse, sender: 'bot' as const };
        setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  return (
    <div className="chatbot-container" ref={chatbotRef}>
      <div className="chatbot-header">
        <h3>AI Assistant / AI معاون</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for help / مدد کے لیے پوچھیں"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
