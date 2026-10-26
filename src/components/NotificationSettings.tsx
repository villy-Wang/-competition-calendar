import{useEffect,useState}from'react';
import type{Competition}from'../types';
import{addDays,reminderDays}from'../lib/calendar';
import{read,write}from'../lib/storage';

export default function NotificationSettings({mine}:{mine:Competition[]}){
 const[enabled,setEnabled]=useState(()=>read('notifications',false));
 const[supported]=useState(()=>typeof Notification!=='undefined');
 useEffect(()=>write('notifications',enabled),[enabled]);
 useEffect(()=>{if(!supported||!enabled||Notification.permission!=='granted')return;const check=()=>{const now=new Date();const date=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;for(const c of mine)for(const days of reminderDays){if(!c.deadline||c.deadline<date||addDays(c.deadline,-days)!==date)continue;const key=`notification:${c.id}:${days}:${date}`;if(localStorage.getItem(key))continue;new Notification('竞赛日历 · 备赛提醒',{body:`${c.name} 距报名截止还有 ${days} 天。请核对官方通知。`,tag:key});localStorage.setItem(key,'1')}};check();const timer=setInterval(check,60_000);return()=>clearInterval(timer)},[enabled,mine,supported]);
 async function enable(){if(!supported)return;const permission=await Notification.requestPermission();setEnabled(permission==='granted')}
 return <div className="notification-setting"><h2>浏览器备赛通知</h2><p>有明确截止日的赛事，在网页保持打开时，可于提前 30／14／7／1 天弹出系统通知。日期待确认的赛事须先到“我的赛事”填写本校日期。</p><button className="secondary" disabled={!supported} onClick={()=>enabled?setEnabled(false):void enable()}>{!supported?'当前浏览器不支持':enabled?'关闭通知':'开启通知'}</button><p className="fine">网页关闭后不会提醒；浏览器可能要求你手动允许通知。桌面端后台通知需单独安装。</p></div>
}
