type Props={
  officialDate:string|null;
  personalDate?:string;
  onChange:(date:string)=>void;
};

export default function DeadlineEditor({officialDate,personalDate,onChange}:Props){
  return <div className="deadline-editor">
    <label>我的报名截止日（以本校通知为准）
      <input type="date" value={personalDate||''} onChange={event=>onChange(event.target.value)}/>
    </label>
    {personalDate&&<button className="text-button" onClick={()=>onChange('')}>清除自设日期</button>}
    <p className="fine">{personalDate
      ? '这是你自行填写的日期，仅保存在此浏览器；日历、备赛提醒和 .ics 导出会使用它。'
      : officialDate
        ? `官方页面日期：${officialDate}。如学校提前截止，可在这里填写本校日期。`
        : '官方未给出统一截止日。查到本校日期后填写，日历与提醒才会显示。'}</p>
  </div>
}
