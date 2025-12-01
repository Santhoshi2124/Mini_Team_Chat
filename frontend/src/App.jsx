import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import ChannelList from './components/ChannelList';
import ChatWindow from './components/ChatWindow';
import { io } from 'socket.io-client';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState([]);

  useEffect(()=> {
    if (token && !socket) {
      const s = io(BACKEND, { auth: { token } });
      s.on('connect_error', (err) => console.error('socket error', err));
      s.on('presence:update', (list) => setOnline(list));
      setSocket(s);
    }
    return ()=> {
      if (socket) socket.disconnect();
    }
  }, [token]);

  if (!token) return <Login onAuth={(t,u)=>{ setToken(t); setUser(u); localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); }} />;

  return (
    <div style={{display:'flex', height:'100vh', fontFamily:'Arial, Helvetica, sans-serif'}}>
      <ChannelList backend={BACKEND} token={token} socket={socket} />
      <ChatWindow backend={BACKEND} token={token} socket={socket} online={online} user={user} />
    </div>
  );
}
