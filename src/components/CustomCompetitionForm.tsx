import {useState, type FormEvent} from 'react';
import type {Competition} from '../types';
import {safeSourceUrl} from '../lib/validate';

type Props={initial?:Competition|null;onCancel:()=>void;onSave:(item:Competition,notice?:File)=>Promise<void>};

export default function CustomCompetitionForm({initial,onCancel,onSave}:Props){
 const [name,setName]=useState(initial?.name||'');
 const [source,setSource]=useState(initial?.source==='我添加的赛事（仅存本机）'?'':initial?.source||'');
 const [sourceUrl,setSourceUrl]=useState(initial?.sourceUrl||'');
 const [deadline,setDeadline]=useState(initial?.deadline||'');
 const [category,setCategory]=useState(initial?.category.join('、')||'');
 const [format,setFormat]=useState<Competition['format']>(initial?.format||'个人');
 const [teamSize,setTeamSize]=useState(initial?.maxTeam||1);
 const [eligibility,setEligibility]=useState(initial?.eligibility||'');
 const [work,setWork]=useState(initial?.work||'');
 const [notice,setNotice]=useState<File>();
 const [error,setError]=useState('');
 const [saving,setSaving]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setError('');
  if(!name.trim()){setError('请填写赛事名称');return}
  if(sourceUrl.trim()&&!safeSourceUrl(sourceUrl.trim())){setError('来源链接须为 http 或 https 地址');return}
  if(notice&&notice.size>25*1024*1024){setError('通知文件不能超过 25 MB');return}
  const submittedDeadline=String(new FormData(event.currentTarget).get('deadline')||deadline);
  const item:Competition={id:initial?.id||`mine-${crypto.randomUUID()}`,name:name.trim(),category:category.split(/[、,，]/).map(x=>x.trim()).filter(Boolean),majors:[],schools:[],education:[],grades:[],format,minTeam:1,maxTeam:Math.max(1,Number(teamSize)||1),work:work.trim(),eligibility:eligibility.trim(),deadline:submittedDeadline||null,deadlineNote:submittedDeadline?'请以学校或主办方最新通知为准':'请自行核对报名截止日',source:source.trim()||'我添加的赛事（仅存本机）',sourceUrl:sourceUrl.trim()||undefined,verified:false,description:'个人记录的赛事；参赛资格和日期请自行核对。'};
  setSaving(true);try{await onSave(item,notice)}catch(e){setError((e as Error).message)}finally{setSaving(false)}
 }
 return <div className="modal-backdrop" onClick={onCancel}><form className="modal custom-competition-modal" onClick={e=>e.stopPropagation()} onSubmit={e=>void submit(e)}><div className="modal-head"><div><div className="eyebrow">仅存本机</div><h2>{initial?'编辑我的赛事':'手动添加赛事'}</h2></div><button type="button" onClick={onCancel} aria-label="关闭">×</button></div><p>填写学校认可或想参加的赛事。这里不会自动核验资格，也不会把赛事发布给其他用户。</p><div className="form-grid"><label>赛事名称 *<input value={name} onChange={e=>setName(e.target.value)} maxLength={150} required placeholder="例如：本校创新创业大赛"/></label><label>学校或主办方通知来源<input value={source} onChange={e=>setSource(e.target.value)} maxLength={200} placeholder="例如：教务处通知"/></label><label>来源链接（可选）<input type="url" value={sourceUrl} onChange={e=>setSourceUrl(e.target.value)} placeholder="https://..."/></label><label>报名截止日（可后补）<input type="date" name="deadline" value={deadline} onChange={e=>setDeadline(e.target.value)}/></label><label>领域关键词<input value={category} onChange={e=>setCategory(e.target.value)} placeholder="如：数学、创新创业"/></label><label>参赛形式<select value={format} onChange={e=>setFormat(e.target.value as Competition['format'])}><option>个人</option><option>团队</option><option>均可</option></select></label><label>最多组队人数<input type="number" min="1" max="100" value={teamSize} onChange={e=>setTeamSize(Number(e.target.value))}/></label><label>作品要求<input value={work} onChange={e=>setWork(e.target.value)} maxLength={500}/></label></div><label className="custom-wide-label">资格或学校认可说明<textarea value={eligibility} onChange={e=>setEligibility(e.target.value)} maxLength={2000} rows={3} placeholder="记录需要核对的参赛条件"/></label><label className="custom-wide-label">关联赛事通知文件（可选，25 MB 内）<input type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" onChange={e=>setNotice(e.target.files?.[0])}/></label><p className="fine">通知文件保存在当前浏览器；请另行保留原件。添加后可在“文件管理”继续上传参赛材料。</p>{error&&<p role="alert" className="form-error">{error}</p>}<div className="button-row"><button type="button" className="secondary" onClick={onCancel}>取消</button><button type="submit" className="primary" disabled={saving}>{saving?'保存中…':'保存到我的赛事'}</button></div></form></div>
}
