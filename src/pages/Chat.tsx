import { useCallback, useState  } from '@lynx-js/react'

import '../App.css';
import { useEffect, type FormEvent } from 'react';

export function Chat() {
    const [messages, setMessages] = useState([{ sender: "me", message: "Ask AI anything..." }]);
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);


  const handleFetch = useCallback(async (e) => {
    // Prevent default form submission behavior if event exists
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    try {
        setIsLoading(true);

        if (prompt === "") {
            // return;
        }

        const response = await lynx.fetch("http://192.168.1.108:3001/api/ai", {
            method: "POST",
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (data.success) {
            setMessages((oldState) => [...oldState, { sender: "me", message: prompt }]);
            setMessages((oldState) => [...oldState, { sender: "server", message: data.message }]);
            setPrompt("");
        } else {
            setMessages((oldState) => [...oldState, { sender: "server", message: `Something went wrong! full details: ${data.message}` }]);
        }
    } catch (error) {
        console.log((error as Error).message);
    } finally {
        setIsLoading(false);
    }
  }, [])


useEffect(() => {
    setMessages((oldState) => [...oldState, { sender: "server", message: "Feel free to ask anything..." }]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && prompt.trim()) {
            handleFetch(e);
        }
    }

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const newValue = target.value;
        setMessages((oldState) => [...oldState, { sender: "server", message: newValue }]);

        setPrompt(newValue);
        // Don't add message on every change, only when submitting
    }

    const inputElement = document.getElementById("prompt") as HTMLInputElement;
    
    // Add event listeners when component mounts
    if (typeof window !== 'undefined') {
        window.addEventListener('keydown', handleKeyDown);
        inputElement?.addEventListener('input', handleChange); // Changed from 'change' to 'input' for real-time updates

        // Cleanup event listeners when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            inputElement?.removeEventListener('input', handleChange);
        }
    }
}, [handleFetch, prompt]) // Added prompt to dependencies

  return (
        <view className="Holder white min-h-[100dvh] w-full">
        <view className='flex justify-around items-center flex-col w-full h-full px-3'>
            <view className='w-full h-full container flex flex-col justify-center items-center'>
                {Array.isArray(messages) ? messages.map((item, i) => (
                    <view key={i} className={`flex w-full mb-8 ${item.sender === "me" ? "justify-end" : ""}`}>
                        {item.sender === "server" ? (<text className='whitespace-break-spaces pb-2 border-b text-black'><text>{item.message}</text></text>) : `${item.message}`}
                    </view>
                )) : <view className='white'>Nothing to see here!</view>}
            </view>
            <view className='w-full h-full flex justify-center items-center'>
                <view className="max-w-full md:max-w-[70%] lg:max-w-[50%] w-full h-full">
                    <view onSubmit={handleFetch} className="w-full flex cursor-text flex-col rounded-3xl px-3 py-1">
                        <input 
                            placeholder='Ask...'  
                            value={prompt} 
                            type="text"
                            // bindinput={(e) => setPrompt(e.detail.value)}
                            // onChange={(e) => setPrompt(e.target.value)}
                            // onChangeCapture={(e) => setPrompt(e.target.value)}
                            id='prompt'
                            disabled={isLoading}
                            className='w-full h-full text-lg min-h-[44px] py-4 px-2 rounded-xl border-2 border-gray-300 text-black outline-none' 
                        />
                        <view className='w-full flex justify-center items-center'>
                            <text bindtap={handleFetch} className='px-6 py-3 bg-green-600 hover:bg-green-400 duration-500 transition-all rounded-xl mt-5 -mb-20 text-xl'>
                                Send
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        </view>
  )
}