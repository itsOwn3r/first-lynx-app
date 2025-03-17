import { useCallback, useState  } from '@lynx-js/react'

import '../App.css';

export function DoorOpener() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");


  const handleFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setResponse("");

      const res = await lynx.fetch('http://192.168.1.108:3001/api/esp32', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setResponse("در باز شد!");
      } else {
        setResponse("خطا در باز کردن در!");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setResponse("خطا در باز کردن در!");
    } finally {
      setIsLoading(false);
    }
  }, [response])


  return (
        <view className="Holder">
          
          {response && <text className="rtl text-right my-8 response">{response}</text>}
          <view  className="switch cursor-pointer">
          <input
            type="checkbox" 
            id="1" 
            checked={isLoading}
            disabled={isLoading} 
            className='switchInner'
          />
            <view className={`bullet ${isLoading && 'bulletTransform'}`} />
            <view bindtap={handleFetch} className={`slider ${isLoading && "switchInner"}`} />
          </view>
        </view>
  )
}