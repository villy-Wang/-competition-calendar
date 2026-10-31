import type {DragEvent,Dispatch,SetStateAction} from 'react';
import{FileText,Upload}from'lucide-react';
import type{Competition,Attachment}from'../types';
import{addDays,reminderDays}from'../lib/calendar';
import{downloadFile}from'../services/files';


type Props={
 year:number;setYear:Dispatch<SetStateAction<number>>;
 month:number;setMonth:Dispatch<SetStateAction<number>>;
 date:string;setDate:(value:string)=>void;
 mine:Competition[];files:Attachment[];
 addFiles:(list:FileList|File[],targetDate?:string,competitionId?:string)=>Promise<void>;
 removeFile:(id:string)=>void;openDetail:(competition:Competition)=>void;
 decreaseFont:()=>void;increaseFont:()=>void;
};

export default function CalendarView({year,setYear,month,setMonth,date,setDate,mine,files,addFiles,removeFile,openDetail,decreaseFont,increaseFont}:Props){
 const events=mine.filter(x=>x.deadline===date);
 const dateFiles=files.filter(x=>x.date===date);
 const reminders=mine.flatMap(c=>c.deadline?reminderDays.filter(days=>addDays(c.deadline!,-days)===date).map(days=>({competition:c,days})):[]);
 const firstDay=(new Date(year,month,1).getDay()+6)%7;
 const dayCount=new Date(year,month+1,0).getDate();
 const linkedCompetition=(day:string)=>{const matches=mine.filter(x=>x.deadline===day);return matches.length===1?matches[0].id:undefined};
 const jump=(target:string)=>{setYear(Number(target.slice(0,4)));setMonth(Number(target.slice(5,7))-1);setDate(target)};
 return <>
  <div className="section-head"><div><div className="eyebrow">YEARLY CALENDAR</div><h1>{year} 年度日历</h1><p>点击日期查看赛事和文件；可将文件拖到日期格。</p></div>
   <div className="year-control"><div className="font-control mobile-only" aria-label="字体大小"><button onClick={decreaseFont} aria-label="缩小字体">A−</button><button onClick={increaseFont} aria-label="放大字体">A+</button></div><button onClick={()=>setYear(v=>v-1)} aria-label="上一年">‹</button><strong>{year}</strong><button onClick={()=>setYear(v=>v+1)} aria-label="下一年">›</button></div>
  </div>
  <div className="calendar-agenda panel"><strong>已选赛事安排（{mine.length}）</strong>{mine.length?<div className="agenda-items">{mine.map(c=><button className="agenda-item" key={c.id} onClick={()=>c.deadline?jump(c.deadline):openDetail(c)}><span>{c.deadline||'日期待确认'}</span><b>{c.name}</b><small>{c.deadline?'定位到日历':'查看赛事并填写本校日期'} →</small></button>)}</div>:<p>尚未加入赛事。加入后会在这里看到报名截止日；日期未定的赛事也会显示为待确认。</p>}</div>
  <div className="month-tabs">{Array.from({length:12},(_,i)=><button key={i} className={month===i?'active':''} onClick={()=>setMonth(i)}>{i+1}月</button>)}</div>
  <p className="calendar-legend"><span aria-hidden="true"/> 黄色日期为备赛节点，格内数字表示距赛事截止还有多少天。</p>
  <div className="calendar-layout"><div className="calendar panel"><div className="weekdays">{'一二三四五六日'.split('').map(x=><span key={x}>周{x}</span>)}</div><div className="days">
   {Array.from({length:firstDay},(_,i)=><span key={'blank'+i}/>)}
   {Array.from({length:dayCount},(_,i)=>{const d=`${year}-${String(month+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`;const due=mine.filter(x=>x.deadline===d);const remind=mine.flatMap(c=>c.deadline?reminderDays.filter(days=>addDays(c.deadline!,-days)===d).map(days=>({competition:c,days})):[]);const reminderLabel=remind.map(x=>`${x.competition.name}距截止${x.days}天`).join('；');return <button key={d} className={`day ${date===d?'selected':''} ${due.length?'due':''} ${remind.length?'reminder':''}`} aria-label={`${d}${due.length?`；截止：${due.map(x=>x.name).join('、')}`:''}${reminderLabel?`；${reminderLabel}`:''}`} onClick={()=>setDate(d)} onDragOver={e=>e.preventDefault()} onDrop={(e:DragEvent)=>{e.preventDefault();if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files,d,linkedCompetition(d))}}><span>{i+1}</span>{due.length>0&&<small className="day-event">{due[0].name}</small>}{remind.length>0&&<small className="day-remind">距截止 {remind[0].days} 天{remind.length>1?` · 另 ${remind.length-1} 项`:''}</small>}{files.some(f=>f.date===d)&&<FileText size={13}/>}</button>})}
  </div></div><div className="panel day-detail"><div className="eyebrow">选中日期</div><h2>{date}</h2><p className="fine">点击左侧日期查看该日的截止、备赛提醒及你关联的文件。</p><h3>赛事与提醒</h3>
   {events.map(c=><div className="detail-item" key={c.id}><strong>{c.name}</strong><p>报名截止</p><button className="text-button" onClick={()=>openDetail(c)}>查看详情 →</button></div>)}
   {reminders.map(({competition:c,days})=><div className="detail-item" key={c.id+'remind'+days}><strong>{c.name}</strong><p>距截止 {days} 天 · 备赛提醒</p><button className="text-button" onClick={()=>openDetail(c)}>查看详情 →</button></div>)}
   {!events.length&&!reminders.length&&<p className="muted">这一天没有已选赛事节点。可在上方点赛事定位日期。</p>}
   <h3>这一天的文件（{dateFiles.length}）</h3>{dateFiles.map(f=><div className="file-row" key={f.id}><FileText size={16}/><button onClick={()=>downloadFile(f)}>{f.name}</button><button className="remove" onClick={()=>removeFile(f.id)} aria-label={`删除 ${f.name}`}>×</button></div>)}
   {!dateFiles.length&&<p className="muted">尚未关联文件。可在这里添加，或拖到左侧日期格。</p>}
   <label className="upload"><Upload size={17}/> 添加文件<input type="file" multiple onChange={e=>e.target.files&&addFiles(e.target.files,date,linkedCompetition(date))}/></label><p className="fine">文件仅保存在当前浏览器。单个文件上限 25 MB。</p>
  </div></div>
 </>
}
