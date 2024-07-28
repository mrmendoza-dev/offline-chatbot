import React, { useState } from "react";

const ChatComponent = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };



  const handleAskQuestion = async () => {
    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.text();
      setResponse(data);
    } catch (error) {
      setResponse("An error occurred while processing your request.");
    }
  };

  return (
    <div>
      <h1>Ask a Question</h1>
      <input type="text" value={question} onChange={handleQuestionChange} />
      <button onClick={handleAskQuestion}>Ask</button>
      <p>{response}</p>
    </div>
  );
};

export default ChatComponent;
