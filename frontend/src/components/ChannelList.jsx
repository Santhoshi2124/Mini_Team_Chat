import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChannelList({ backend, token, socket }){
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState('');
  const [active, setActive] = useState(null);

  useEffect(()=> { fetchChannels(); }, []);

  async function fetchChannels(){
    const res = await axios.get(backend + '/api/channels', { headers: { Authorization: 'Bearer ' + token }});
    setChannels(res.data);
  }

  async function create(){
    if (!name) return;
    try {
      await axios.post(backend + '/api/channels', { name }, { headers: { Authorization: 'Bearer ' + token }});
      setName('');
      fetchChannels();
    } catch (err) { alert(err.response?.data?.msg || err.message); }
  }

  return (
    <div style={{width:280, borderRight:'1px solid #eee', padding:12}}>
      <h4>Channels</h4>
      <div>
        {channels.map(c => <div key={c._id} style={{padding:8, cursor:'pointer'}} onClick={()=>{ setActive(c); localStorage.setItem('activeChannel', JSON.stringify(c)); if (socket) socket.emit('joinChannel', c._id); }}>
          #{c.name}
        </div>)}
      </div>
      <div style={{marginTop:12}}>
        <input placeholder='New channel' value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:6}}/>
        <button onClick={create} style={{marginTop:6, width:'100%'}}>Create</button>
      </div>
    </div>
  )
}
