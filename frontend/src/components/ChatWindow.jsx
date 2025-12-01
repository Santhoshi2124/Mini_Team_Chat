import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function ChatWindow({ backend, token, socket, online, user }){
  const [channel, setChannel] = useState(JSON.parse(localStorage.getItem('activeChannel') || 'null'));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingOlder, setLoadingOlder] = useState(false);
  const topRef = useRef();

  useEffect(()=> {
    const onNew = (msg) => {
      if (msg.channel === channel?._id) setMessages(m=>[...m, msg]);
    };
    socket?.on('message:new', onNew);
    const onPresence = (list)=>{};
    socket?.on('presence:update', onPresence);
    return ()=> {
      socket?.off('message:new', onNew);
    }
  }, [socket, channel]);

  useEffect(()=> {
    async function load() {
      if (!channel) return;
      const res = await axios.get(backend + '/api/messages/' + channel._id, { headers: { Authorization: 'Bearer ' + token }});
      setMessages(res.data);
    }
    load();
  }, [channel]);

  async function send(e){
    e.preventDefault();
    if (!text || !channel) return;
    socket.emit('message:create', { channelId: channel._id, text });
    setText('');
  }

  async function loadOlder() {
    if (!messages.length) return;
    setLoadingOlder(true);
    const before = messages[0].timestamp;
    const res = await axios.get(backend + '/api/messages/' + channel._id + '?before=' + encodeURIComponent(before), { headers: { Authorization: 'Bearer ' + token }});
    setMessages(prev => [...res.data, ...prev]);
    setLoadingOlder(false);
  }

  return (
    <div style={{flex:1, display:'flex', flexDirection:'column'}}>
      <div style={{padding:12, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
        <div>{channel ? '#' + channel.name : 'Select a channel'}</div>
        <div>Online: {online.length}</div>
      </div>
      <div style={{flex:1, overflow:'auto', padding:12}} ref={topRef}>
        {channel && <button onClick={loadOlder} disabled={loadingOlder}>{loadingOlder ? 'Loading...' : 'Load older messages'}</button>}
        {messages.map(m => <div key={m._id} style={{marginTop:8}}>
          <strong>{m.sender?.name || 'Unknown'}</strong>: {m.text} <small style={{color:'#666'}}>{new Date(m.timestamp).toLocaleString()}</small>
        </div>)}
      </div>
      <form onSubmit={send} style={{display:'flex', padding:8, borderTop:'1px solid #eee'}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder='Message' style={{flex:1, padding:8}} />
        <button style={{marginLeft:8}}>Send</button>
      </form>
    </div>
  )
}
