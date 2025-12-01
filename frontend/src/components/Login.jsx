import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onAuth }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [mode,setMode]=useState('login');

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  async function submit(e){
    e.preventDefault();
    try {
      const url = backend + (mode === 'login' ? '/api/auth/login' : '/api/auth/signup');
      const payload = mode === 'login' ? { email, password } : { name, email, password };
      const res = await axios.post(url, payload);
      onAuth(res.data.token, res.data.user);
    } catch (err) { alert(err.response?.data?.msg || err.message); }
  }

  return (
    <div style={{margin:'auto', width:360, padding:20, border:'1px solid #ddd', borderRadius:8}}>
      <h3>{mode==='login'?'Log in':'Sign up'}</h3>
      {mode==='signup' && <input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />}
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />
      <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />
      <button onClick={submit} style={{width:'100%', padding:10}}>{mode==='login'?'Log in':'Create account'}</button>
      <div style={{marginTop:10, textAlign:'center'}}>
        <button onClick={()=>setMode(mode==='login'?'signup':'login')} style={{background:'none', border:'none', color:'#06f', cursor:'pointer'}}>
          {mode==='login'?'Create an account':'Have an account? Log in'}
        </button>
      </div>
    </div>
  )
}
