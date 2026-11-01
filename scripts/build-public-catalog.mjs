import {readFileSync,writeFileSync} from 'node:fs';

// Public catalog uses only Attachment 4 names and independent university directory links.
// Personal school rules and AI notes are account data and must never enter this file.
const path=new URL('../public/competitions.json',import.meta.url);
const links=JSON.parse(readFileSync(new URL('../data/kmu-2025-reference-links.json',import.meta.url),'utf8')).entries;
const current=JSON.parse(readFileSync(path,'utf8'));
const byNumber=new Map();
for(const item of current)if(item.catalogNumber&&!byNumber.has(item.catalogNumber))byNumber.set(item.catalogNumber,item);
const exactNames={19:'全国大学生机器人大赛',27:'蓝桥杯全国软件和信息技术专业人才大赛',28:'米兰设计周中国高校设计学科师生优秀作品展',71:'全国大学生数字媒体科技作品及创意竞赛'};
const catalog=Array.from({length:84},(_,index)=>{
 const number=index+1,original=byNumber.get(number);
 if(!original)throw Error(`缺少附件4序号 ${number}`);
 const name=exactNames[number]||original.name;
 const ai=/人工智能|AIGC|\bAI\b/i.test(name);
 const discipline=/计算机|软件|程序|信息安全|ICT|物联网|智能汽车|机器人|芯片/.test(name)?'计算机与信息':/医学|生命科学|生物/.test(name)?'医学与生命':/数学|物理|统计|地质|力学/.test(name)?'数理与自然':/设计|艺术|广告|创意|数字媒体/.test(name)?'设计与艺术':/金融|经济|商业|企业|税收|电商|物流|创业/.test(name)?'经管与创新':/英语|外语|经典|跨文化/.test(name)?'语言与人文':/工程|机械|化工|能源|建筑|测绘|水利|电子/.test(name)?'工程与制造':'综合与创新';
 const entry=links[number];
 return {id:`ranking-${String(number).padStart(2,'0')}`,name,category:[discipline],majors:[],schools:[],education:[],grades:[],format:'待核对',minTeam:1,maxTeam:99,work:'请查看当届赛事及赛道规则。',eligibility:'学历、专业、年级、学校和组队条件须按当届通知核对。',deadline:null,deadlineNote:'附件4没有提供可用于当前届次的统一报名截止日。',source:entry?'用户提供的附件4；昆明学院教务处 2025 年赛事入口目录（入口及当届规则待核对）':'用户提供的附件4',...(entry?{sourceUrl:entry.url}:{}),verified:false,description:`附件4第 ${number} 项。具体赛道、资格与报名安排以当届官方通知为准。`,catalogNumber:number,schoolTier:null,aiFocus:ai,discipline};
});
writeFileSync(path,`${JSON.stringify(catalog,null,2)}\n`);
console.log(`已生成 ${catalog.length} 条公开参考赛事；个人文件内容未加入。`);
