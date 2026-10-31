import {readFileSync} from 'node:fs';

const items=JSON.parse(readFileSync(new URL('../public/competitions.json',import.meta.url),'utf8'));
if(!Array.isArray(items)||items.length===0)throw Error('赛事库不能为空');
const ids=new Set();
for(const item of items){
 if(!/^[a-z0-9_-]+$/i.test(item.id)||ids.has(item.id))throw Error('赛事 ID 无效或重复：'+item.id);
 ids.add(item.id);
 if(!item.name||item.name.includes('演示'))throw Error('请删除演示赛事：'+item.id);
 if(!Array.isArray(item.category)||!Array.isArray(item.education)||!Array.isArray(item.majors)||!Array.isArray(item.schools)||!Array.isArray(item.grades))throw Error('筛选字段格式错误：'+item.id);
 if(!['个人','团队','均可','待核对'].includes(item.format)||!Number.isInteger(item.minTeam)||!Number.isInteger(item.maxTeam)||item.minTeam<1||item.maxTeam<item.minTeam)throw Error('组队规则错误：'+item.id);
 if(item.deadline!==null&&!/^\d{4}-\d{2}-\d{2}$/.test(item.deadline))throw Error('报名截止日格式错误：'+item.id);
 if(item.deadline===null&&!item.deadlineNote)throw Error('日期待定时须说明原因：'+item.id);
 if(typeof item.verified!=='boolean'||!item.source||!item.eligibility||!item.work||!item.description)throw Error('赛事缺少来源或资格信息：'+item.id);
 if(item.verified&&(!/^\d{4}-\d{2}-\d{2}$/.test(item.verifiedAt)||!/^https:\/\//.test(item.sourceUrl)))throw Error('已核验赛事需要 HTTPS 官方来源和核验日期：'+item.id);
 if(item.schoolTier&&!['一类赛','二类赛','三类赛'].includes(item.schoolTier))throw Error('赛事级别无效：'+item.id);
}
const rankingNumbers=new Set(items.map(item=>item.catalogNumber).filter(Boolean));
for(let number=1;number<=84;number++)if(!rankingNumbers.has(number))throw Error('附件4榜单缺少第 '+number+' 项');
for(let number=1;number<=3;number++)if(!items.some(item=>item.catalogNumber===number&&item.schoolTier==='一类赛'))throw Error('重点赛事级别缺失：'+number);
console.log('已检查 '+items.length+' 条赛事数据');
