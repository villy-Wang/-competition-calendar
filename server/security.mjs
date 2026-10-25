import{randomBytes,scryptSync,timingSafeEqual,createHash}from'node:crypto';

export const SESSION_AGE=60*60*24*14;
export function hashPassword(password){const salt=randomBytes(16).toString('hex');const hash=scryptSync(password,salt,64).toString('hex');return`${salt}:${hash}`}
export function verifyPassword(password,stored){try{const[salt,hash]=stored.split(':');const actual=scryptSync(password,salt,64);return timingSafeEqual(actual,Buffer.from(hash,'hex'))}catch{return false}}
export function newSession(){const token=randomBytes(32).toString('base64url');return{token,hash:createHash('sha256').update(token).digest('hex')}}
export function tokenHash(token){return createHash('sha256').update(token).digest('hex')}
export function getCookie(request,name){const raw=request.headers.cookie||'';for(const part of raw.split(';')){const[k,...v]=part.trim().split('=');if(k===name)return v.join('=')}return''}
export function sessionCookie(token,secure=false){return`cc_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_AGE}${secure?'; Secure':''}`}
export function clearSessionCookie(secure=false){return`cc_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure?'; Secure':''}`}
export function allowOrigin(request,origin){const received=request.headers.origin;return!received||received===origin}
export function limiter(max=20,period=60_000){const seen=new Map();return key=>{const now=Date.now();let item=seen.get(key);if(!item||now-item.at>period){item={at:now,count:0};seen.set(key,item)}item.count++;return item.count<=max}}
