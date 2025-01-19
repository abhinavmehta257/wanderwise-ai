import { useState } from 'react';
import axios from 'axios';
import NavBar from './components/ui/NavBar';
import { SendOutlined } from '@mui/icons-material';
import { useEffect } from 'react';


  const renderMessage = (message, index) => (
    <div className={`flex items-center p-2 my-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} key={index}> 
      {message.role === 'assistant' && <img src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww`} alt="Avatar" className="w-8 h-8 object-cover rounded-full mr-2" />}
      <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}> 
        {message.content}
        <div className={`text-xs text-right mt-1  ${message.role === 'user' ? ' text-gray-300' : 'text-gray-500'}`}>{message.timestamp}</div>
      </div>
    </div>
  );  

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const sendMessage = async (message = input) => {
        if (message.trim()) {
            const userMessage = { role: 'User', message };
            setMessages([...messages, userMessage]);

            try {
                const response = await axios.post('/api/chat', userMessage);
                const assistantMessage = { role: 'Assistant', message: response.data.prompt };
                setMessages([...messages, userMessage, assistantMessage]);
                setSuggestions(response.data.suggestions || []);
            } catch (error) {
                console.error('Error sending message:', error);
            }

            setInput('');
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('/api/chat');
                setMessages(response.data || []);
            } catch (error) {
                console.log('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="min-h-screen bg-white h-[100vh]">
            <NavBar />
            <div className="bg-gray-100 border rounded-lg p-4 mx-auto w-full lg:w-[50%] flex flex-col justify-between">
            <div className="overflow-y-auto">
                {messages.map((message, index) => { console.log(message); return renderMessage(message, index)})}
            </div>
            <div className="flex items-center mt-4">
                <input type="text" placeholder="Type your message here..." className="flex-1 p-2 border rounded mr-2" onChange={(e)=>setInput(e.target.value)} />
                <button onClick={()=>sendMessage()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                    <SendOutlined className="mr-2" /> Send
                </button>
            </div>
            </div>
        </div>
    );
}
