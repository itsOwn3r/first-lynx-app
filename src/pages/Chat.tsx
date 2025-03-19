import { useState } from '@lynx-js/react'
import '../App.css';
import { useEffect } from 'react';

export function Chat() {
    const [messages, setMessages] = useState([{ sender: "me", message: "Ask AI anything..." }]);
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    
const handleInput = (e: { detail: { value: string } }) => {
    setPrompt(e.detail.value);
};

const handleError = async (msg: string) => {
    setMessages((oldState) => [...oldState, { sender: "error", message: msg }]);
}

  const handleFetch = async () => {
      try {
          setIsLoading(true);
          
          if (prompt === "") {
            handleError("Please enter the prompt!");
            return;
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
  };


useEffect(() => {
    setMessages((oldState) => [...oldState, { sender: "server", message: "Feel free to ask anything..." }]);
}, [])


return (
        <view scroll-orientation="vertical" className="Holder white min-h-[100vh] w-full relative overflow-scroll">
        <view className='flex flex-col w-full h-full px-3 pb-32 max-h-80vh overflow-scroll'>
            <scroll-view scroll-orientation="vertical" className='w-full h-full container flex flex-col justify-start items-center overflow-y-auto'>
                {Array.isArray(messages) ? messages.map((item, i) => (
                    <view key={i} className={`flex w-full mb-8 ${item.sender === "me" ? "justify-end" : ""}`}>
                        {item.sender === "server" ? (<text className='whitespace-break-spaces pb-2 border-b text-black'><text>{item.message}</text></text>) : (item.sender === "error" ? <text className='whitespace-break-spaces pb-2 text-orange text-center'>{item.message} </text> : <text className='whitespace-break-spaces pb-2 text-black'>{item.message}</text>)}
                    </view>
                )) : <view className='white'>Nothing to see here!</view>}
            </scroll-view>
        </view>
        <view className='w-full fixed bottom-0 left-0 bg-white/80 backdrop-blur-sm py-4 px-3'>
            <view className="max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto">
                <view className="w-full flex cursor-text flex-col rounded-3xl px-3 py-1">
                    <input 
                        placeholder=''  
                        value={prompt}

                        // @ts-expect-error bindinput type is not defined but it works and it's in the docs
                        bindinput={(e) => handleInput(e)}
                        type="text"
                        id='prompt'
                        disabled={isLoading}
                        className='w-full h-full text-lg min-h-[50px] py-4 px-6 
                            rounded-2xl border-2 border-gray-300 
                            text-black outline-none
                            focus:border-green-500 focus:ring-2 focus:ring-green-200
                            transition-all duration-300
                            placeholder:text-gray-400
                            disabled:bg-gray-100 disabled:cursor-not-allowed
                            shadow-sm hover:shadow-md' 
                    />
                    <view className='w-full flex justify-center items-center'>
                        <text
                            bindtap={handleFetch}
                            className={`px-6 py-3 ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-400'} duration-500 transition-all rounded-xl mt-5 text-xl cursor-pointer`}
                            aria-label={isLoading ? "Sending message" : "Send message"}
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </text>
                    </view>
                </view>
            </view>
        </view>
        </view>
  )
}