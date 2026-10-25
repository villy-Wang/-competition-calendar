export const reminderDays=[30,14,7,1] as const;
export function addDays(date:string,days:number){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function daysUntil(date:string){const a=new Date(date+'T12:00:00');const b=new Date();b.setHours(12,0,0,0);return Math.round((a.getTime()-b.getTime())/86400000)}
