import{useState,type DragEvent}from'react';
import{FileText,Upload,Search}from'lucide-react';
import type{Attachment,Competition}from'../types';
import{downloadFile}from'../services/files';


type Props={files:Attachment[];mine:Competition[];today:string;addFiles:(list:FileList|File[],targetDate?:string,competitionId?:string)=>Promise<void>;removeFile:(id:string)=>void};

export default function FilesView({files,mine,today,addFiles,removeFile}:Props){
 const[targetDate,setTargetDate]=useState(today);
 const[competitionId,setCompetitionId]=useState('');
 const[query,setQuery]=useState('');
 const[dragging,setDragging]=useState(false);
 const shown=files.filter(f=>f.name.toLowerCase().includes(query.toLowerCase())||mine.find(c=>c.id===f.competitionId)?.name.includes(query));
 async function upload(list:FileList|File[]){await addFiles(list,targetDate,competitionId||undefined)}
 return <>
  <div className="section-head"><div><div className="eyebrow">MY FILES</div><h1>我的文件</h1><p>在本机保存参赛材料，并按赛事和日期查找。</p></div></div>
  <div className="file-purpose" role="note"><strong>这里能做什么？</strong><span>上传报名表、作品或证明材料 → 关联赛事和日期 → 在下方按名称查找、下载；点日历同一天也能看到文件。</span><small>文件不会自动提交给比赛主办方，也不会自动读取内容。</small></div>
  <div className="panel file-upload-panel"><div><h2>添加自己的文件</h2><p>先选择日期和赛事，再上传或拖入文件。赛事可留空。</p></div><div className="file-upload-controls"><label>关联日期<input type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)}/></label><label>关联赛事（可选）<select value={competitionId} onChange={e=>{setCompetitionId(e.target.value);const c=mine.find(x=>x.id===e.target.value);if(c?.deadline)setTargetDate(c.deadline)}}><option value="">仅关联日期</option>{mine.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label></div>
   <div className={`file-dropzone ${dragging?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={(e:DragEvent)=>{e.preventDefault();setDragging(false);if(e.dataTransfer.files.length)void upload(e.dataTransfer.files)}}><Upload size={25}/><strong>把文件拖到这里</strong><span>或</span><label className="primary upload">选择本机文件<input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.png,.jpg,.jpeg,.webp" onChange={e=>{if(e.target.files?.length)void upload(e.target.files);e.target.value=''}}/></label></div>
   <p className="fine">支持 PDF、Office、文本和常见图片；单个文件不超过 25 MB。文件仅保存在此浏览器。当前不会自动识别文件中的赛事。</p>
  </div>
  <div className="file-list-head"><h2>已保存文件 <span>({files.length})</span></h2><div className="searchbar"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="按文件名或关联赛事搜索"/></div></div>
  <div className="panel list-panel">{shown.length?shown.map(f=><div className="mine-row" key={f.id}><div className="file-icon"><FileText size={20}/></div><div><strong>{f.name}</strong><p>{f.date} · {f.competitionId?mine.find(x=>x.id===f.competitionId)?.name||'原关联赛事已移除':'仅关联日期'}{f.size?` · ${(f.size/1024/1024).toFixed(1)} MB`:''}</p></div><button className="secondary" onClick={()=>downloadFile(f)}>下载</button><button className="text-button" onClick={()=>removeFile(f.id)}>删除</button></div>):<div className="empty">{files.length?'没有匹配的文件。':'还没有文件。先选择日期，再上传自己的材料。'}</div>}</div>
 </>
}
