import type {Competition,Profile,Attachment} from '../types';
import{parseCompetitions}from'../lib/validate';
export const apiBase=import.meta.env.VITE_API_BASE_URL as string|undefined;
export async function fetchCompetitions():Promise<Competition[]>{const response=await fetch(`${import.meta.env.BASE_URL}competitions.json`,{cache:'no-cache'});if(!response.ok)throw Error('赛事数据暂不可用');return parseCompetitions(await response.text())}
export type SessionState={user:{id:string;email:string;name:string;role:'user'|'admin'};profile:Profile|null;selected:string[];files:Attachment[]};
async function request<T>(path:string,options:RequestInit={}):Promise<T>{if(!apiBase)throw Error('尚未配置后端');const response=await fetch(`${apiBase}${path}`,{credentials:'include',...options,headers:{'Content-Type':'application/json',...options.headers}});const data=await response.json();if(!response.ok)throw Error(data.error||'服务暂不可用');return data as T}
export function getSession(){return request<SessionState>('/auth/me')}
export function registerAccount(name:string,email:string,password:string){return request<SessionState>('/auth/register',{method:'POST',body:JSON.stringify({name,email,password})})}
export function loginAccount(email:string,password:string){return request<SessionState>('/auth/login',{method:'POST',body:JSON.stringify({email,password})})}
export function logoutAccount(){return request<{ok:boolean}>('/auth/logout',{method:'POST'})}
export function saveProfile(profile:Profile){return request<{ok:boolean}>('/profile',{method:'PUT',body:JSON.stringify(profile)})}
export function saveSelected(ids:string[]){return request<{ok:boolean}>('/selected',{method:'PUT',body:JSON.stringify({ids})})}
export function publishCompetitions(items:Competition[]){return request<{ok:boolean;count:number}>('/admin/competitions',{method:'PUT',body:JSON.stringify(items)})}
export async function requestAiExplanation(profile:Profile,competition:Competition):Promise<string>{if(!apiBase)return '当前为本地规则推荐演示，尚未连接 AI 服务。';const data=await request<{explanation:string}>('/ai/explain',{method:'POST',body:JSON.stringify({profile,competitionId:competition.id})});return data.explanation}
