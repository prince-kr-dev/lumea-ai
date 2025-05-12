import { useState, useRef, useEffect } from "react";
import "../assets/Start.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Start() {
  const [message, setMessage] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const hitRequest = () => {
    if (message.trim()) {
      generateResponse(message.trim());
    } else {
      alert("Input should not be empty!");
    }
  };

  const generateResponse = async (msg) => {
    const genAI = new GoogleGenerativeAI("AIzaSyCjgpALngkt3AzK0w0adC0zXFV_96zw3x0");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(msg);

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "userMsg", text: msg },
      { type: "responseMsg", text: result.response.text() },
    ]);

    setIsAnswer(true);
    setMessage("");
    console.log(result.response.text());
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const presetQuestions = [
    "What is coding, and how does it help build websites and applications?",
    "How can I start learning to code, and what resources should I follow?",
    "What are the best programming languages to learn for a beginner?",
  ];

  const handleNewChat = () => {
    setIsAnswer(false);
    setMessages([]);
  };

  return (
    <div>
      <div className="h-screen">
        <div className="py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-medium">Lumea AI</h1>
          <button
            onClick={handleNewChat}
            className="font-medium bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 transition-all flex gap-2"
          >
            <i className="ri-chat-new-line text-xl"></i> New Chat
          </button>
        </div>

        <div className="h-[85vh] flex flex-col justify-between overflow-auto">
          {isAnswer ? (
            <div className="messages px-2 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={msg.type}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-[70vh] flex flex-col items-center justify-center">
              <h1 className="text-2xl font-medium md:text-4xl mb-5">
                How can I help you!
              </h1>
              <div className="flex flex-col items-center gap-3 md:flex md:flex-row">
                {presetQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-[#212121] md:w-45 w-70 p-4 rounded-xl text-md cursor-pointer hover:bg-[#2d2d2d] transition"
                    onClick={() => {
                      setMessage(question);
                      generateResponse(question);
                    }}
                  >
                    <p>{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-[45px] w-full bg-[#212121] rounded-full relative flex items-center mt-2">
            <input
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") hitRequest();
              }}
              value={message}
              type="text"
              placeholder="Ask anything..."
              className="h-[45px] w-full rounded-full px-3 text-lg outline-0 bg-transparent text-white"
            />
            <i
              onClick={hitRequest}
              className="ri-arrow-up-line absolute right-0 text-3xl bg-blue-600 rounded-full px-6 pt-1 pb-1 cursor-pointer hover:bg-blue-700 transition-all"
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
