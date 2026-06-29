import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './components/ui/NavBar';
import { SendOutlined } from '@mui/icons-material';

const CHAT_USER_ID = 'web-chat-user';

const renderMessage = (message, index) => (
  <div
    className={`my-1 flex items-center p-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    key={message.id || index}
  >
    {message.role === 'assistant' && (
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww"
        alt="Avatar"
        className="mr-2 h-8 w-8 rounded-full object-cover"
      />
    )}
    <div
      className={`rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
    >
      {message.content}
      <div
        className={`mt-1 text-right text-xs ${message.role === 'user' ? 'text-gray-300' : 'text-gray-500'}`}
      >
        {message.timestamp}
      </div>
    </div>
  </div>
);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const sendMessage = async (message = input) => {
    if (!message.trim()) return;

    try {
      const response = await axios.post('/api/chat', {
        user: CHAT_USER_ID,
        message,
      });
      const nextMessages = Array.isArray(response.data) ? response.data : [];
      setMessages(nextMessages);

      const latestAssistant = [...nextMessages]
        .reverse()
        .find((item) => item.role === 'assistant');
      setSuggestions(latestAssistant?.suggestions || []);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInput('');
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/chat');
        setMessages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="h-[100vh] min-h-screen bg-white">
      <NavBar />
      <div className="mx-auto flex w-full flex-col justify-between rounded-lg border bg-gray-100 p-4 lg:w-[50%]">
        <div className="overflow-y-auto">
          {messages.map((message, index) => renderMessage(message, index))}
        </div>
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={input}
            placeholder="Type your message here..."
            className="mr-2 flex-1 rounded border p-2"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') sendMessage();
            }}
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <SendOutlined className="mr-2" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
