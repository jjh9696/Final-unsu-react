import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import './chatbot.css'; // 스타일 파일 import

function Chatbot() { 
  const [socket, setSocket] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const newSocket = new SockJS("http://localhost:8080/ws/chatbot");
    newSocket.onmessage = handleMessage;
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 함

  const handleMessage = (event) => {
    const data = JSON.parse(event.data);
    if (Array.isArray(data)) {
      setQuestions(data);
    } else {
      setAnswer(data.chatbotAnswer);
    }
  };

  const sendQuestion = (chatbotNo) => {
    if (socket) {
      socket.send(chatbotNo);
    }
  };

  return (
    <div className='row mt-4'>
      <div className="col">
        <div className="chatbot-container">
          <div className="question-wrapper">
            {questions.map((question) => (
              <button
                key={question.chatbotNo}
                onClick={() => sendQuestion(question.chatbotNo)}
                className="chatbot-question-button"
              >
                {question.chatbotQuestion}
              </button>
            ))}
          </div>
          <div className="answer-wrapper">
            {answer && <div className="chatbot-answer">{answer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;