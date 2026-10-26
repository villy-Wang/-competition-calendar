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
 const firstDay=(new Date(year,month,1).getDay()+6)%7;
 const dayCount=new Date(year,month+1,0).getDate();
 const linkedCompetition=(day:string)=>{const matches=mine.filter(x=>x.deadline===day);return matches.length===1?matches[0].id:undefined};
 return <>
  <div className="section-head"><div><div className="eyebrow">YEARLY CALENDAR</div><h1>{year} 年度日历</h1><p>点击日期查看赛事和文件；可将文件拖到日期格。</p></div>
   <div className="year-control"><div className="font-control mobile-only" aria-label="字体大小"><button onClick={decreaseFont} aria-label="缩小字体">A−</button><button onClick={increaseFont} aria-label="放大字体">A+</button></div><button onClick={()=>setYear(v=>v-1)} aria-label="上一年">‹</button><strong>{year}</strong><button onClick={()=>setYear(v=>v+1)} aria-label="下一年">›</button></div>
  </div>
  <div className="month-tabs">{Array.from({length:12},(_,i)=><button key={i} className={month===i?'active':''} onClick={()=>setMonth(i)}>{i+1}月</button>)}</div>
  <div className="calendar-layout"><div className="calendar panel"><div className="weekdays">{'一二三四五六日'.split('').map(x=><span key={x}>周{x}</span>)}</div><div className="days">
   {Array.from({length:firstDay},(_,i)=><span key={'blank'+i}/>)}
   {Array.from({length:dayCount},(_,i)=>{const d=`${year}-${String(month+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`;const due=mine.filter(x=>x.deadline===d);const remind=mine.filter(x=>!!x.deadline&&reminderDays.some(n=>addDays(x.deadline!,-n)===d));return <button key={d} className={`day ${date===d?'selected':''} ${due.length?'due':''}`} onClick={()=>setDate(d)} onDragOver={e=>e.preventDefault()} onDrop={(e:DragEvent)=>{e.preventDefault();if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files,d,linkedCompetition(d))}}><span>{i+1}</span>{due.length>0&&<small className="day-event">{due[0].name}</small>}{remind.length>0&&<small className="day-remind">备赛提醒 {remind.length}</small>}{files.some(f=>f.date===d)&&<FileText size={13}/>}</button>})}
  </div></div><div className="panel day-detail"><div className="eyebrow">SELECTED DATE</div><h2>{date}</h2><h3>赛事与提醒</h3>
   {events.length?events.map(c=><div className="detail-item" key={c.id}><strong>{c.name}</strong><p>报名截止</p><button className="text-button" onClick={()=>openDetail(c)}>查看详情 →</button></div>):<p className="muted">当天没有赛事截止。</p>}
   {mine.filter(x=>!!x.deadline&&reminderDays.some(n=>addDays(x.deadline!,-n)===date)).map(c=><div className="detail-item" key={c.id+'remind'}><strong>{c.name}</strong><p>备赛提醒</p></div>)}
   <h3>关联文件</h3>{dateFiles.map(f=><div className="file-row" key={f.id}><FileText size={16}/><button onClick={()=>downloadFile(f)}>{f.name}</button><button className="remove" onClick={()=>removeFile(f.id)} aria-label={`删除 ${f.name}`}>×</button></div>)}
   <label className="upload"><Upload size={17}/> 添加文件<input type="file" multiple onChange={e=>e.target.files&&addFiles(e.target.files,date,linkedCompetition(date))}/></label><p className="fine">文件仅保存在当前浏览器。单个文件上限 25 MB。</p>
  </div></div>
 </>
}
