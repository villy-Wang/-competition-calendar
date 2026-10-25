import{DatabaseSync}from'node:sqlite';
import{mkdirSync}from'node:fs';
import{resolve,join}from'node:path';

export function createStore(dataDirectory=process.env.DATA_DIR||'./runtime-data'){
 const dir=resolve(dataDirectory);mkdirSync(dir,{recursive:true});mkdirSync(join(dir,'uploads'),{recursive:true});
 const db=new DatabaseSync(join(dir,'calendar.sqlite'));db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
 db.exec(`CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user',created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS profiles(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,json TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS selections(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,json TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS user_files(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,name TEXT NOT NULL,type TEXT NOT NULL,size INTEGER NOT NULL,date TEXT NOT NULL,competition_id TEXT,path TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS audit_log(id INTEGER PRIMARY KEY AUTOINCREMENT,actor_id TEXT NOT NULL,action TEXT NOT NULL,details TEXT NOT NULL,created_at TEXT NOT NULL);`);
 return{db,dir};
}
