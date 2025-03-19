import { useCallback, useState  } from '@lynx-js/react'

import './App.css'

import { DoorOpener } from './pages/DoorOpener.jsx';
import { Chat } from './pages/Chat.jsx';

export function App() {
  const [currentRoute, setCurrentRoute] = useState('door')
  
  return (
    <view className='App min-h-[100%]'>
      <view className='Content w-full h-full min-h-[100%]'>
        {currentRoute === 'door' && <DoorOpener />}
        {currentRoute === 'chat' && <Chat />}

        <view className='relative'>

            <view className='Footer' style={{ color: '#000' }}>
              
              <text 
                bindtap={() => setCurrentRoute('door')} 
                style={{ cursor: 'pointer', color: '#000' }}
              >
                Door
              </text>

              <text 
                bindtap={() => setCurrentRoute('chat')} 
                style={{ cursor: 'pointer', color: '#000' }}
              >
                Chat
              </text>

            </view>

        </view>
        
      </view>
    </view>
  )
}