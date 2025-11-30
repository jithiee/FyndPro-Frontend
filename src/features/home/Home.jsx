import React, { useEffect, useState, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import elec from './assets/elec.png';
import clean from './assets/clean.png';
import glass from './assets/glass.png';
import home from './assets/home.png';
import roof from './assets/roof.png';
import HeaderText from './HeaderText';
import Maincarousel from './Maincarousel';
import EmployeeSection from './EmployeeSection';
import AnimatedShowcase from './AnimatedShowcase';
import axios from "../../api/axios";

const Home = () => {
  const images = [elec, clean, glass, home, roof];
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! How can I help you with our services today..? 😃' }
  ]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { sender: 'user', text: inputMessage };
    setChatHistory((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await axios.post('/chatbot/', {
        message: userMessage.text
      });

      const botMessage = {
        sender: 'bot',
        text: response.data.reply || "Sorry, I couldn't understand that."
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: "Something went wrong. Please try again." }
      ]);
    }
  };

  return (
    <>
      {/* Carousel */}
      <div className="flex flex-col items-center mt-14 px-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-40 lg:h-40 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={images[currentIndex]}
            alt="service"
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
      </div>

      <HeaderText />

      {/* --- AI Chat Bot --- */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-80 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 animate-fade-in-up">
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <FaRobot />
                <span className="font-bold">AI Assistant</span>
              </div>
              <button onClick={toggleChat} className="hover:text-gray-200">
                <FaTimes />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
              >
                <FaPaperPlane size={14} />
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <div className="relative group cursor-pointer" onClick={toggleChat}>
          {!isChatOpen && (
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          )}
          <button className="relative bg-blue-500 p-4 rounded-full shadow-2xl text-white transform transition-transform duration-300 hover:scale-110 flex items-center justify-center">
             {isChatOpen ? <FaTimes size={24} /> : <FaRobot size={30} />}
          </button>
        </div>
      </div>

      <Maincarousel />
      <EmployeeSection />
      <AnimatedShowcase />
    </>
  );
};

export default Home;
