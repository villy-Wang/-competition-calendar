import type {Competition} from '../types';
// 以下是演示条目和演示日期。正式赛事须由运营人员核对官方通知后更新。
export const seedCompetitions:Competition[]=[
 {id:'demo-innovation',name:'中国国际大学生创新大赛（演示）',category:['创新创业','商业'],majors:[],schools:[],education:['本科','研究生'],grades:[],format:'团队',minTeam:2,maxTeam:8,work:'项目计划书、路演材料',eligibility:'以当年官方通知为准',deadline:'2027-05-18',source:'演示数据',verified:false,description:'适合有项目想法和团队协作经验的同学。'},
 {id:'demo-model',name:'全国大学生数学建模竞赛（演示）',category:['数学','数据分析'],majors:[],schools:[],education:['本科'],grades:[],format:'团队',minTeam:3,maxTeam:3,work:'建模论文',eligibility:'以当年官方通知为准',deadline:'2027-09-05',source:'演示数据',verified:false,description:'围绕真实问题开展建模、求解和论文写作。'},
 {id:'demo-code',name:'程序设计挑战赛（演示）',category:['算法','软件开发'],majors:['计算机','软件','人工智能'],schools:[],education:['本科','研究生'],grades:[],format:'个人',minTeam:1,maxTeam:1,work:'程序代码',eligibility:'以赛事章程为准',deadline:'2027-03-20',source:'演示数据',verified:false,description:'面向程序设计与算法训练的示例赛事。'},
 {id:'demo-design',name:'全国大学生设计实践赛（演示）',category:['设计','艺术'],majors:['设计','艺术','建筑'],schools:[],education:['本科'],grades:[],format:'均可',minTeam:1,maxTeam:5,work:'设计作品集',eligibility:'以赛事章程为准',deadline:'2027-06-12',source:'演示数据',verified:false,description:'适合视觉、产品与空间设计方向。'},
 {id:'demo-electronics',name:'电子系统创新赛（演示）',category:['电子','硬件'],majors:['电子','通信','自动化'],schools:[],education:['本科'],grades:[],format:'团队',minTeam:2,maxTeam:4,work:'硬件原型和技术报告',eligibility:'以赛事章程为准',deadline:'2027-08-16',source:'演示数据',verified:false,description:'电子系统设计与实物实现的示例赛事。'},
 {id:'demo-business',name:'商业策划实践赛（演示）',category:['经管','商业'],majors:['管理','经济','金融','市场'],schools:[],education:['本科','研究生'],grades:[],format:'团队',minTeam:2,maxTeam:6,work:'商业策划书',eligibility:'以赛事章程为准',deadline:'2027-04-26',source:'演示数据',verified:false,description:'从市场研究到商业方案展示。'}
];
