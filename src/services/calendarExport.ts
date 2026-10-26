import type{Competition}from'../types';
import{addDays,reminderDays}from'../lib/calendar';

const escape=(value:string)=>value.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const compact=(value:string)=>value.replace(/-/g,'');
const stamp=()=>new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function event(id:string,date:string,title:string,description:string){return ['BEGIN:VEVENT',`UID:${escape(id)}@competition-calendar.local`,`DTSTAMP:${stamp()}`,`DTSTART;VALUE=DATE:${compact(date)}`,`DTEND;VALUE=DATE:${compact(addDays(date,1))}`,`SUMMARY:${escape(title)}`,`DESCRIPTION:${escape(description)}`,'END:VEVENT'].join('\r\n')}
export function downloadCalendar(competitions:Competition[]){const events=competitions.filter(c=>!!c.deadline).flatMap(c=>[event(`${c.id}-deadline`,c.deadline!,`${c.name}：报名截止`,`来源：${c.source}。请以当年官方通知为准。`),...reminderDays.map(days=>event(`${c.id}-prepare-${days}`,addDays(c.deadline!,-days),`${c.name}：提前 ${days} 天备赛`,`报名截止：${c.deadline}。请核对赛事官方通知。`))]);const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Competition Calendar//Local//ZH-CN','CALSCALE:GREGORIAN','X-WR-CALNAME:竞赛日历',...events,'END:VCALENDAR'].join('\r\n')+'\r\n';const blob=new Blob([body],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='竞赛日历.ics';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
