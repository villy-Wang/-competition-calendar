import{spawn}from'node:child_process';
const children=[];
function start(args){const child=spawn(process.execPath,args,{stdio:'inherit'});children.push(child);child.on('exit',code=>{if(code&&children.some(x=>x.exitCode===null))stop(code)});return child}
function stop(code=0){for(const child of children)if(child.exitCode===null)child.kill();process.exitCode=code}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
start(['--env-file-if-exists=.env.server','server/index.mjs']);
start(['node_modules/vite/bin/vite.js','--host','127.0.0.1','--mode','full']);
