// E-Traffic CCS — City Command System | app.js
'use strict';
'use strict';
// ════════════════════════════════════════
// MOCK BACKEND
// ════════════════════════════════════════
const API_BASE='http://localhost:3001/api';
let USE_MOCK=true;

const MOCK=(()=>{
  const h=s=>btoa(s);
  const db={
    users:[
      {id:'u1',username:'admin',  password:h('admin123'),  role:'government',name:'Adm. Rajesh Kumar',   badge:'GOV-001',rank:'Senior Traffic Officer',department:'Traffic Control HQ',zone:'Alpha',phone:'9800001111'},
      {id:'u2',username:'officer',password:h('officer123'),role:'government',name:'Insp. Priya Sharma',  badge:'GOV-002',rank:'Traffic Inspector',department:'Field Operations',zone:'Beta',phone:'9800002222'},
      {id:'u3',username:'public', password:h('public123'), role:'public',    name:'John Citizen',phone:'9876543210',city:'Pune'},
      {id:'u4',username:'riya',   password:h('riya123'),   role:'public',    name:'Riya Sharma',  phone:'9123456789',city:'Kothrud'},
    ],
    sessions:{},
    signals:[
      {id:'SIG-01',name:'MG Road × FC Road',   zone:'Alpha',phase:'green', timer:38,greenTime:45,redTime:50,yellowTime:5,volume:2340,status:'online',auto:true},
      {id:'SIG-02',name:'Deccan Gymkhana',      zone:'Alpha',phase:'red',   timer:22,greenTime:40,redTime:45,yellowTime:5,volume:1890,status:'online',auto:true},
      {id:'SIG-03',name:'Wakad Flyover',        zone:'Beta', phase:'yellow',timer:4, greenTime:35,redTime:40,yellowTime:5,volume:3120,status:'online',auto:true},
      {id:'SIG-04',name:'Baner Bridge',         zone:'Beta', phase:'green', timer:29,greenTime:50,redTime:55,yellowTime:5,volume:2670,status:'fault', auto:false},
      {id:'SIG-05',name:'Kothrud Circle',       zone:'Gamma',phase:'red',   timer:35,greenTime:38,redTime:42,yellowTime:5,volume:1540,status:'online',auto:true},
      {id:'SIG-06',name:'Hadapsar Junction',    zone:'Gamma',phase:'green', timer:12,greenTime:42,redTime:48,yellowTime:5,volume:2890,status:'online',auto:true},
      {id:'SIG-07',name:'Viman Nagar',          zone:'Delta',phase:'red',   timer:22,greenTime:44,redTime:50,yellowTime:5,volume:2100,status:'online',auto:true},
      {id:'SIG-08',name:'Kalyani Nagar',        zone:'Delta',phase:'green', timer:37,greenTime:36,redTime:40,yellowTime:5,volume:1760,status:'offline',auto:false},
    ],
    incidents:[
      {id:'INC-001',location:'MG Road × Ring Road',type:'Collision',   severity:'Critical',zone:'Alpha',time:'14:22',status:'Active',  reportedBy:'u2',reporterName:'Insp. Priya Sharma',notes:'Multi-vehicle collision, 2 lanes blocked.',vehicles:3,casualties:1},
      {id:'INC-002',location:'NH-48 km 22',         type:'Congestion',  severity:'Moderate',zone:'Beta', time:'13:55',status:'Active',  reportedBy:'u2',reporterName:'Insp. Priya Sharma',notes:'Heavy slow traffic.',vehicles:0,casualties:0},
      {id:'INC-003',location:'Deccan Gymkhana',     type:'Signal Fault',severity:'Moderate',zone:'Alpha',time:'13:10',status:'Active',  reportedBy:'u1',reporterName:'Adm. Rajesh Kumar',  notes:'Signal controller offline.',vehicles:0,casualties:0},
      {id:'INC-004',location:'Baner Bridge',        type:'Road Closure',severity:'Critical',zone:'Beta', time:'11:30',status:'Active',  reportedBy:'u2',reporterName:'Insp. Priya Sharma',notes:'Emergency road closure.',vehicles:0,casualties:0},
      {id:'INC-005',location:'Wakad Flyover',       type:'Congestion',  severity:'Low',     zone:'Beta', time:'10:45',status:'Resolved',reportedBy:'u3',reporterName:'John Citizen',  notes:'Traffic cleared.',vehicles:0,casualties:0},
    ],
    vehicles:[
      {plate:'MH12AB1234',type:'Car',  zone:'Alpha',speed:42,direction:'N',ownerName:'Arun Patil',  ownerPhone:'9811111111',status:'Active'},
      {plate:'MH14XY5678',type:'Truck',zone:'Beta', speed:28,direction:'E',ownerName:'Logistics Co', ownerPhone:'9822222222',status:'Active'},
      {plate:'MH20KL9012',type:'Bus',  zone:'Gamma',speed:35,direction:'S',ownerName:'PMPML',        ownerPhone:'9833333333',status:'Active'},
      {plate:'MH15PQ3456',type:'Bike', zone:'Delta',speed:55,direction:'W',ownerName:'Raj Mehta',    ownerPhone:'9844444444',status:'Flagged'},
    ],
    roads:[
      {id:'R01',name:'MG Road',        zone:'Alpha',length:4.2,lanes:4,congestion:72,speedLimit:50,condition:'Good',   authority:'PMC'},
      {id:'R02',name:'FC Road',        zone:'Alpha',length:2.8,lanes:2,congestion:61,speedLimit:40,condition:'Fair',   authority:'PMC'},
      {id:'R03',name:'NH-48 Corridor', zone:'Beta', length:18, lanes:6,congestion:88,speedLimit:80,condition:'Good',   authority:'NHAI'},
      {id:'R04',name:'Baner Road',     zone:'Beta', length:5.1,lanes:4,congestion:44,speedLimit:50,condition:'Poor',   authority:'PMC'},
      {id:'R05',name:'Sinhagad Road',  zone:'Gamma',length:7.3,lanes:2,congestion:35,speedLimit:40,condition:'Good',   authority:'PWD'},
      {id:'R06',name:'Hadapsar Bypass',zone:'Gamma',length:9.6,lanes:4,congestion:55,speedLimit:60,condition:'Fair',   authority:'MSRDC'},
    ],
    rules:[
      {id:'RULE-01',title:'Speed Limit – City Roads',category:'Speed',limit:'50 km/h',penalty:'₹1,000–₹2,000',points:2,section:'MV Act Sec 112',status:'Active'},
      {id:'RULE-02',title:'Speed Limit – National Highways',category:'Speed',limit:'80 km/h',penalty:'₹1,000–₹2,000',points:2,section:'MV Act Sec 112',status:'Active'},
      {id:'RULE-03',title:'Helmet Mandatory – Two-Wheelers',category:'Safety',limit:'N/A',penalty:'₹1,000',points:0,section:'MV Act Sec 129',status:'Active'},
      {id:'RULE-04',title:'Seat Belt – All Occupants',category:'Safety',limit:'N/A',penalty:'₹1,000',points:0,section:'MV Act Sec 194B',status:'Active'},
      {id:'RULE-05',title:'Signal Jump Prohibition',category:'Signals',limit:'N/A',penalty:'₹5,000',points:3,section:'MV Act Sec 119',status:'Active'},
      {id:'RULE-06',title:'Wrong Side Driving',category:'Driving',limit:'N/A',penalty:'₹5,000',points:3,section:'MV Act Sec 184',status:'Active'},
      {id:'RULE-07',title:'Mobile Phone While Driving',category:'Distraction',limit:'N/A',penalty:'₹5,000',points:3,section:'MV Act Sec 184',status:'Active'},
      {id:'RULE-08',title:'Drunk Driving (BAC > 0.03%)',category:'DUI',limit:'BAC 0.03%',penalty:'₹10,000 + Imprisonment',points:5,section:'MV Act Sec 185',status:'Active'},
      {id:'RULE-09',title:'No Parking Zone Violation',category:'Parking',limit:'N/A',penalty:'₹500',points:0,section:'MV Act Sec 122',status:'Active'},
      {id:'RULE-10',title:'Overloading – Passengers',category:'Overloading',limit:'As per RC',penalty:'₹2,000',points:1,section:'MV Act Sec 66',status:'Active'},
    ],
    challans:[],
    congestion:{Alpha:62,Beta:81,Gamma:44,Delta:55},
    nextInc:6,nextChallan:1001,nextRule:11,
  };

  setInterval(()=>{
    db.signals.forEach(s=>{
      if(!s.auto)return;
      s.timer--;
      if(s.timer<=0){
        s.phase=s.phase==='green'?'yellow':s.phase==='yellow'?'red':'green';
        s.timer=s.phase==='green'?s.greenTime:s.phase==='yellow'?s.yellowTime:s.redTime;
        s.volume=Math.max(500,s.volume+Math.floor(Math.random()*200-100));
      }
    });
    Object.keys(db.congestion).forEach(k=>{db.congestion[k]=Math.max(10,Math.min(98,db.congestion[k]+Math.floor(Math.random()*4-2)));});
  },1000);

  const ok=(data,s=200)=>({ok:s<400,status:s,json:()=>Promise.resolve(data)});
  const err=(msg,s=400)=>({ok:false,status:s,json:()=>Promise.resolve({error:msg})});
  const tNow=()=>new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false});

  return{fetch(url,opts={}){
    const method=opts.method||'GET';
    const body=opts.body?JSON.parse(opts.body):null;
    const token=(opts.headers||{})['Authorization']?.replace('Bearer ','');
    const user=token?db.users.find(u=>u.id===db.sessions[token]):null;
    const path=url.replace(API_BASE,'');

    if(path==='/auth/login'&&method==='POST'){
      const u=db.users.find(u=>u.username===body.username&&u.password===h(body.password));
      if(!u)return Promise.resolve(err('Invalid credentials',401));
      const tok='tok_'+Math.random().toString(36).slice(2);
      db.sessions[tok]=u.id;
      return Promise.resolve(ok({token:tok,user:{id:u.id,name:u.name,role:u.role,username:u.username,badge:u.badge,rank:u.rank,department:u.department,zone:u.zone}}));
    }
    if(path==='/auth/register'&&method==='POST'){
      if(db.users.find(u=>u.username===body.username))return Promise.resolve(err('Username already taken',409));
      const nu={id:'u'+Date.now(),username:body.username,password:h(body.password),role:body.role||'public',name:body.name,phone:body.phone||'',badge:body.badge||'',rank:body.rank||'',department:body.department||'',city:body.city||''};
      db.users.push(nu);
      const tok='tok_'+Math.random().toString(36).slice(2);
      db.sessions[tok]=nu.id;
      return Promise.resolve(ok({token:tok,user:{id:nu.id,name:nu.name,role:nu.role,username:nu.username,badge:nu.badge,rank:nu.rank,department:nu.department}}));
    }
    if(path==='/auth/me')return Promise.resolve(ok({id:user?.id,name:user?.name,role:user?.role,username:user?.username,badge:user?.badge,rank:user?.rank,department:user?.department,zone:user?.zone}));
    if(path==='/auth/logout'&&method==='POST'){delete db.sessions[token];return Promise.resolve(ok({message:'ok'}));}
    if(!user)return Promise.resolve(err('Unauthorized',401));
    const isGov=user.role==='government';

    if(path.startsWith('/signals')){
      if(method==='GET'&&!path.slice(9).includes('/'))return Promise.resolve(ok([...db.signals]));
      const id=path.split('/')[2];const sig=db.signals.find(s=>s.id===id);
      if(method==='GET')return Promise.resolve(sig?ok(sig):err('Not found',404));
      if(!isGov)return Promise.resolve(err('Gov only',403));
      if(method==='POST'){const ns={id:`SIG-${String(db.signals.length+1).padStart(2,'0')}`,phase:'red',timer:body.redTime||45,volume:0,status:'online',auto:true,...body};db.signals.push(ns);return Promise.resolve(ok(ns,201));}
      if(method==='PUT'){if(!sig)return Promise.resolve(err('Not found',404));Object.assign(sig,body);return Promise.resolve(ok(sig));}
      if(method==='DELETE'){const i=db.signals.findIndex(s=>s.id===id);if(i>-1)db.signals.splice(i,1);return Promise.resolve(ok({message:'Deleted'}));}
      if(path.endsWith('/phase')&&method==='PATCH'){if(body.phase){sig.phase=body.phase;sig.timer=body.phase==='green'?sig.greenTime:body.phase==='yellow'?sig.yellowTime:sig.redTime;}if(body.auto!==undefined)sig.auto=body.auto;return Promise.resolve(ok(sig));}
    }
    if(path.startsWith('/incidents')){
      if(method==='GET'){let list=[...db.incidents];if(!isGov)list=list.filter(i=>i.status==='Active'||i.reportedBy===user.id);const q=path.includes('?')?new URLSearchParams(path.split('?')[1]):new URLSearchParams();if(q.get('status')&&q.get('status')!=='all')list=list.filter(i=>i.status.toLowerCase()===q.get('status').toLowerCase());if(q.get('severity')&&q.get('severity')!=='all')list=list.filter(i=>i.severity.toLowerCase()===q.get('severity').toLowerCase());return Promise.resolve(ok(list));}
      if(method==='POST'){const inc={id:`INC-${String(db.nextInc++).padStart(3,'0')}`,time:tNow(),status:'Active',reportedBy:user.id,reporterName:user.name,...body};db.incidents.unshift(inc);return Promise.resolve(ok(inc,201));}
      const id=path.split('/')[2];const inc=db.incidents.find(i=>i.id===id);
      if(path.endsWith('/resolve')&&method==='PATCH'){if(!isGov)return Promise.resolve(err('Gov only',403));if(inc){inc.status='Resolved';}return Promise.resolve(ok(inc||{}));}
      if(method==='PUT'){if(!isGov)return Promise.resolve(err('Gov only',403));if(inc)Object.assign(inc,body);return Promise.resolve(ok(inc||{}));}
      if(method==='DELETE'){if(!isGov)return Promise.resolve(err('Gov only',403));const i=db.incidents.findIndex(x=>x.id===id);if(i>-1)db.incidents.splice(i,1);return Promise.resolve(ok({message:'Deleted'}));}
    }
    if(path.startsWith('/vehicles')){
      if(!isGov)return Promise.resolve(err('Gov only',403));
      if(method==='GET')return Promise.resolve(ok(db.vehicles));
      if(method==='POST'){const ex=db.vehicles.find(v=>v.plate===body.plate);if(ex){Object.assign(ex,body);return Promise.resolve(ok(ex));}db.vehicles.push({...body});return Promise.resolve(ok(body,201));}
      const plate=decodeURIComponent(path.split('/')[2]);
      if(method==='DELETE'){const i=db.vehicles.findIndex(v=>v.plate===plate);if(i>-1)db.vehicles.splice(i,1);return Promise.resolve(ok({message:'Deleted'}));}
    }
    if(path.startsWith('/roads')){
      if(method==='GET')return Promise.resolve(ok(db.roads));
      if(!isGov)return Promise.resolve(err('Gov only',403));
      if(method==='POST'){const r={id:'R'+Date.now(),...body};db.roads.push(r);return Promise.resolve(ok(r,201));}
      const id=path.split('/')[2];const road=db.roads.find(r=>r.id===id);
      if(method==='PUT'){if(road)Object.assign(road,body);return Promise.resolve(ok(road||{}));}
      if(method==='DELETE'){const i=db.roads.findIndex(r=>r.id===id);if(i>-1)db.roads.splice(i,1);return Promise.resolve(ok({message:'Deleted'}));}
    }
    if(path.startsWith('/rules')){
      if(method==='GET')return Promise.resolve(ok(db.rules));
      if(!isGov)return Promise.resolve(err('Gov only',403));
      if(method==='POST'){const r={id:`RULE-${String(db.nextRule++).padStart(2,'0')}`,status:'Active',...body};db.rules.push(r);return Promise.resolve(ok(r,201));}
      const id=path.split('/')[2];const rule=db.rules.find(r=>r.id===id);
      if(method==='PUT'){if(rule)Object.assign(rule,body);return Promise.resolve(ok(rule||{}));}
      if(method==='DELETE'){const i=db.rules.findIndex(r=>r.id===id);if(i>-1)db.rules.splice(i,1);return Promise.resolve(ok({message:'Deleted'}));}
    }
    if(path.startsWith('/challans')){
      if(!isGov)return Promise.resolve(err('Gov only',403));
      if(method==='GET')return Promise.resolve(ok(db.challans));
      if(method==='POST'){const c={id:`CH-${db.nextChallan++}`,issuedAt:tNow(),status:'Pending',issuedBy:user.name,issuedById:user.id,...body};db.challans.unshift(c);return Promise.resolve(ok(c,201));}
      const id=path.split('/')[2];const ch=db.challans.find(c=>c.id===id);
      if(method==='PUT'){if(ch)Object.assign(ch,body);return Promise.resolve(ok(ch||{}));}
      if(method==='DELETE'){const i=db.challans.findIndex(c=>c.id===id);if(i>-1)db.challans.splice(i,1);return Promise.resolve(ok({message:'Deleted'}));}
    }
    if(path==='/analytics/overview'){const active=db.incidents.filter(i=>i.status==='Active');return Promise.resolve(ok({totalVehicles:14284+Math.floor(Math.random()*200-100),avgSpeed:38+Math.floor(Math.random()*8-4),signalsOnline:db.signals.filter(s=>s.status==='online').length,totalSignals:db.signals.length,totalIncidents:db.incidents.length,activeIncidents:active.length,criticalIncidents:active.filter(i=>i.severity==='Critical').length,congestionIndex:Math.round(Object.values(db.congestion).reduce((a,b)=>a+b)/4),zones:db.congestion,totalChallans:db.challans.length,pendingChallans:db.challans.filter(c=>c.status==='Pending').length}));}
    if(path==='/analytics/volume'){const base=[310,180,120,90,110,280,720,1100,1380,1200,1050,980,1200,1350,1250,1100,1380,1600,1450,1200,900,750,550,400];return Promise.resolve(ok(base.map((c,i)=>({hour:i,count:c+Math.floor(Math.random()*80-40)}))));}
    if(path==='/analytics/congestion')return Promise.resolve(ok(db.congestion));
    if(path==='/public/report'&&method==='POST'){const inc={id:`INC-${String(db.nextInc++).padStart(3,'0')}`,type:body.type||'General',severity:'Low',zone:'Alpha',time:tNow(),status:'Active',reportedBy:user.id,reporterName:user.name,location:body.location,notes:body.description};db.incidents.unshift(inc);return Promise.resolve(ok(inc,201));}
    return Promise.resolve(err('Not found',404));
  }};
})();

let authToken=localStorage.getItem('etms_token')||'';
let currentUser=null;

async function apiFetch(path,opts={}){
  const headers={'Content-Type':'application/json',...(authToken?{Authorization:`Bearer ${authToken}`}:{})};
  try{const r=USE_MOCK?await MOCK.fetch(API_BASE+path,{...opts,headers:{...headers,...(opts.headers||{})}}):await fetch(API_BASE+path,{...opts,headers:{...headers,...(opts.headers||{})}});const data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');return data;}
  catch(e){if(USE_MOCK)throw e;USE_MOCK=true;return apiFetch(path,opts);}
}
const API={get:p=>apiFetch(p),post:(p,d)=>apiFetch(p,{method:'POST',body:JSON.stringify(d)}),put:(p,d)=>apiFetch(p,{method:'PUT',body:JSON.stringify(d)}),patch:(p,d)=>apiFetch(p,{method:'PATCH',body:JSON.stringify(d)}),del:p=>apiFetch(p,{method:'DELETE'})};

setInterval(()=>{const e=document.getElementById('topClock');if(e)e.textContent=new Date().toLocaleTimeString('en-IN',{hour12:false})+' IST';},1000);

// ════ LOGIN ════
function switchRole(role){
  document.querySelectorAll('.role-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('roleTab-'+role).classList.add('active');
  document.getElementById('pane-gov').style.display=role==='gov'?'block':'none';
  document.getElementById('pane-pub').style.display=role==='pub'?'block':'none';
}
function switchSubTab(portal,tab){
  const isGov=portal==='gov';
  document.getElementById((isGov?'g':'p')+'tab-login').classList.toggle('active',tab==='login');
  document.getElementById((isGov?'g':'p')+'tab-reg').classList.toggle('active',tab==='register');
  document.getElementById(portal+'-login-form').style.display=tab==='login'?'block':'none';
  document.getElementById(portal+'-reg-form').style.display=tab==='register'?'block':'none';
}
function fillDemo(portal,user,pass){
  if(portal==='gov'){document.getElementById('gov-user').value=user;document.getElementById('gov-pass').value=pass;}
  else{document.getElementById('pub-user').value=user;document.getElementById('pub-pass').value=pass;}
}
async function doLogin(portal){
  const isGov=portal==='gov';
  const u=document.getElementById(portal+'-user').value.trim();
  const p=document.getElementById(portal+'-pass').value;
  const e=document.getElementById(portal+'-err');e.classList.remove('show');
  try{const d=await API.post('/auth/login',{username:u,password:p});authToken=d.token;currentUser=d.user;localStorage.setItem('etms_token',authToken);startApp();}
  catch(ex){e.textContent=ex.message;e.classList.add('show');}
}
async function doGovRegister(){
  const e=document.getElementById('gov-reg-err');e.classList.remove('show');
  const n=document.getElementById('greg-name').value.trim(),u=document.getElementById('greg-user').value.trim(),p=document.getElementById('greg-pass').value;
  if(!n||!u||!p){e.textContent='Name, username and password are required.';e.classList.add('show');return;}
  if(p.length<6){e.textContent='Password must be at least 6 characters.';e.classList.add('show');return;}
  try{const d=await API.post('/auth/register',{name:n,username:u,password:p,role:'government',badge:document.getElementById('greg-badge').value,rank:document.getElementById('greg-rank').value,department:document.getElementById('greg-dept').value,phone:document.getElementById('greg-phone').value});authToken=d.token;currentUser=d.user;localStorage.setItem('etms_token',authToken);startApp();}
  catch(ex){e.textContent=ex.message;e.classList.add('show');}
}
async function doPubRegister(){
  const e=document.getElementById('pub-reg-err');e.classList.remove('show');
  const n=document.getElementById('preg-name').value.trim(),u=document.getElementById('preg-user').value.trim(),p=document.getElementById('preg-pass').value;
  if(!n||!u||!p){e.textContent='Name, username and password are required.';e.classList.add('show');return;}
  if(p.length<6){e.textContent='Password must be at least 6 characters.';e.classList.add('show');return;}
  try{const d=await API.post('/auth/register',{name:n,username:u,password:p,role:'public',phone:document.getElementById('preg-phone').value,city:document.getElementById('preg-city').value});authToken=d.token;currentUser=d.user;localStorage.setItem('etms_token',authToken);startApp();}
  catch(ex){e.textContent=ex.message;e.classList.add('show');}
}
async function logout(){try{await API.post('/auth/logout',{});}catch(e){}authToken='';currentUser=null;localStorage.removeItem('etms_token');document.getElementById('app').classList.remove('show');document.getElementById('loginScreen').style.display='flex';destroyCharts();}

// ════ APP START ════
function startApp(){
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('app').classList.add('show');
  const isGov=currentUser.role==='government';
  document.getElementById('tb-icon').className='topbar-icon '+(isGov?'gov':'pub');
  document.getElementById('userAvatar').textContent=currentUser.name[0].toUpperCase();
  document.getElementById('userAvatar').className='user-avatar '+(isGov?'gov':'pub');
  document.getElementById('userName').textContent=currentUser.name;
  if(isGov)buildGovPortal();else buildPublicPortal();
}
(async function init(){if(!authToken)return;try{currentUser=await API.get('/auth/me');if(currentUser?.role)startApp();}catch(e){localStorage.removeItem('etms_token');authToken='';}})();

// ════ GOV PORTAL ════
function buildGovPortal(){
  const pages=['dashboard','signals','incidents','vehicles','roads','rules','challans','data-entry'];
  const labels=['Dashboard','Signals','Incidents','Vehicles','Roads','Rules','Challans','Data Entry'];
  document.getElementById('topNav').innerHTML=pages.map((p,i)=>`<button class="nav-btn${i===0?' active':''}" onclick="govNav('${p}',this)">${labels[i]}</button>`).join('');
  document.getElementById('sidebar').innerHTML=`
    <div class="role-info">
      <div class="role-name">${currentUser.name}</div>
      <div class="role-sub">${currentUser.badge||''} · ${currentUser.rank||currentUser.department||'Officer'}</div>
    </div>
    <div class="sb-section">Navigation</div>
    <div class="sb-item active" onclick="govNav('dashboard',null,this)"><span class="sb-icon">📊</span>Dashboard</div>
    <div class="sb-item" onclick="govNav('signals',null,this)"><span class="sb-icon">🚦</span>Signal Control</div>
    <div class="sb-item" onclick="govNav('incidents',null,this)"><span class="sb-icon">🚨</span>Incidents<span class="sb-badge red" id="sb-inc">0</span></div>
    <div class="sb-item" onclick="govNav('vehicles',null,this)"><span class="sb-icon">🚗</span>Vehicles</div>
    <div class="sb-item" onclick="govNav('roads',null,this)"><span class="sb-icon">🛣️</span>Roads</div>
    <div class="sb-item" onclick="govNav('rules',null,this)"><span class="sb-icon">📜</span>Traffic Rules</div>
    <div class="sb-item" onclick="govNav('challans',null,this)"><span class="sb-icon">📋</span>Challans<span class="sb-badge amber" id="sb-ch">0</span></div>
    <div class="sb-divider"></div>
    <div class="sb-section">Operations</div>
    <div class="sb-item" onclick="govNav('data-entry',null,this)"><span class="sb-icon">✏️</span>Data Entry</div>
  `;
  document.getElementById('mainContent').innerHTML=`
    <div class="page active" id="page-dashboard">${govDashHTML()}</div>
    <div class="page" id="page-signals">${govSignalsHTML()}</div>
    <div class="page" id="page-incidents">${govIncHTML()}</div>
    <div class="page" id="page-vehicles">${govVehHTML()}</div>
    <div class="page" id="page-roads">${govRoadsHTML()}</div>
    <div class="page" id="page-rules">${govRulesHTML()}</div>
    <div class="page" id="page-challans">${govChallansHTML()}</div>
    <div class="page" id="page-data-entry">${govDataEntryHTML()}</div>
  `;
  initDash();startLive();
}
function govNav(page,tabEl,sbEl){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+page)?.classList.add('active');
  if(tabEl)tabEl.classList.add('active');
  if(sbEl)sbEl.classList.add('active');
  else{document.querySelector(`.sb-item[onclick*="'${page}'"]`)?.classList.add('active');document.querySelector(`.nav-btn[onclick*="'${page}'"]`)?.classList.add('active');}
  if(page==='dashboard')initDash();
  if(page==='signals')loadSignals();
  if(page==='incidents')loadIncidents();
  if(page==='vehicles')loadVehicles();
  if(page==='roads')loadRoads();
  if(page==='rules')loadRules();
  if(page==='challans')loadChallans();
}

// ── DASHBOARD HTML ──
function govDashHTML(){return`
<div class="ticker" id="ticker"><div class="ticker-lbl">⚠ Alerts</div><div style="overflow:hidden;flex:1"><span class="ticker-text" id="tickerTxt">Loading...</span></div></div>
<div class="pg-hdr"><div class="pg-title"><span>Command</span> Dashboard</div><div class="pg-actions"><button class="btn btn-ghost btn-sm" onclick="initDash()">↺ Refresh</button></div></div>
<div class="kpi-strip">
  <div class="kpi" style="--kc:var(--blue)"><div class="kpi-icon">🚗</div><div class="kpi-lbl">Active Vehicles</div><div class="kpi-val" id="kv1">--</div><div class="kpi-trend" id="kt1"></div></div>
  <div class="kpi" style="--kc:var(--amber)"><div class="kpi-icon">⚡</div><div class="kpi-lbl">Avg Speed</div><div class="kpi-val" id="kv2">--<sup> km/h</sup></div><div class="kpi-trend" id="kt2"></div></div>
  <div class="kpi" style="--kc:var(--green)"><div class="kpi-icon">🚦</div><div class="kpi-lbl">Signals Online</div><div class="kpi-val" id="kv3">--</div><div class="kpi-trend" id="kt3"></div></div>
  <div class="kpi" style="--kc:var(--red)"><div class="kpi-icon">🚨</div><div class="kpi-lbl">Active Incidents</div><div class="kpi-val" id="kv4">--</div><div class="kpi-trend" id="kt4"></div></div>
</div>
<div class="g-main gap16">
  <div class="card">
    <div class="card-hdr"><div class="card-title">📍 Live Traffic Map</div><span class="bdg bdg-green">● Live</span></div>
    <div class="map-wrap">
      <svg id="cityMap" viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg"></svg>
      <div id="mapTT" class="map-tt"><div class="map-tt-name" id="ttN"></div><div id="ttP"></div><div id="ttT" style="font-family:var(--mono);font-size:15px"></div><div id="ttV" style="font-size:11px;color:var(--text2);margin-top:2px"></div></div>
      <div class="map-zoom"><button class="zoom-btn" onclick="mapZoom(1.2)">+</button><button class="zoom-btn" onclick="mapZoom(0.83)">−</button></div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div class="card"><div class="card-hdr"><div class="card-title">🚦 Signal Status</div></div><div style="padding:10px;" id="sigMiniList"></div></div>
    <div class="card"><div class="card-hdr"><div class="card-title">📊 Zone Congestion</div></div><div style="padding:14px;" id="congBars"></div></div>
  </div>
</div>
<div class="g2 gap16">
  <div class="card"><div class="card-hdr"><div class="card-title">📈 Traffic Volume (24h)</div></div><div style="padding:14px;height:160px"><canvas id="volChart"></canvas></div></div>
  <div class="card"><div class="card-hdr"><div class="card-title">🚨 Recent Incidents</div><button class="btn btn-ghost btn-sm" onclick="govNav('incidents',null)">View all</button></div><div class="tbl-wrap" id="dashIncTbl"></div></div>
</div>
`;}

// ── SIGNALS HTML ──
function govSignalsHTML(){return`
<div class="pg-hdr">
  <div class="pg-title"><span>Signal</span> Control</div>
  <div class="pg-actions">
    <button class="btn btn-success btn-sm" onclick="allSignals('green')">✓ Green Wave</button>
    <button class="btn btn-danger btn-sm" onclick="allSignals('red')">⬛ Emergency Red</button>
    <button class="btn btn-ghost btn-sm" onclick="allSignals('auto')">↺ Auto Resume</button>
    <button class="btn btn-primary btn-sm" onclick="openAddSignalModal()">+ Add Signal</button>
  </div>
</div>
<div class="card" style="margin-bottom:16px;padding:14px 18px;background:var(--blue-lt);border-color:var(--blue-mid);">
  <div style="font-size:13px;color:var(--blue);font-weight:600;">📡 Live auto-updating every 1.5 seconds · Timers and phases refresh in real time</div>
</div>
<div id="signalGrid" class="g3"></div>
`;}

// ── INCIDENTS ──
function govIncHTML(){return`
<div class="pg-hdr">
  <div class="pg-title"><span>Incidents</span> Log</div>
  <button class="btn btn-primary" onclick="openAddIncidentModal()">+ Report Incident</button>
</div>
<div class="card">
  <div class="card-hdr" style="flex-wrap:wrap;gap:8px;">
    <div style="display:flex;gap:6px;">
      <button class="btn btn-ghost btn-sm" onclick="filterInc('all',this)">All</button>
      <button class="btn btn-ghost btn-sm" onclick="filterInc('active',this)">Active</button>
      <button class="btn btn-ghost btn-sm" onclick="filterInc('critical',this)">Critical</button>
      <button class="btn btn-ghost btn-sm" onclick="filterInc('resolved',this)">Resolved</button>
    </div>
  </div>
  <div class="tbl-wrap"><table class="tbl" id="incTable"></table></div>
</div>
`;}

// ── VEHICLES ──
function govVehHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Vehicles</span> Registry</div><button class="btn btn-primary" onclick="openAddVehicleModal()">+ Register</button></div>
<div class="card"><div class="tbl-wrap"><table class="tbl" id="vehTable"></table></div></div>
`;}

// ── ROADS ──
function govRoadsHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Roads</span> Database</div><button class="btn btn-primary" onclick="openAddRoadModal()">+ Add Road</button></div>
<div class="card"><div class="tbl-wrap"><table class="tbl" id="roadTable"></table></div></div>
`;}

// ── RULES ──
function govRulesHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Traffic</span> Rules</div><button class="btn btn-primary" onclick="openAddRuleModal()">+ Add Rule</button></div>
<div class="card"><div class="tbl-wrap"><table class="tbl" id="rulesTable"></table></div></div>
`;}

// ── CHALLANS ──
function govChallansHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Traffic</span> Challans</div><button class="btn btn-primary" onclick="openAddChallanModal()">+ Issue Challan</button></div>
<div class="kpi-strip" style="grid-template-columns:repeat(3,1fr);">
  <div class="kpi" style="--kc:var(--amber)"><div class="kpi-lbl">Total Issued</div><div class="kpi-val" id="ch-kv1">0</div></div>
  <div class="kpi" style="--kc:var(--red)"><div class="kpi-lbl">Pending</div><div class="kpi-val" id="ch-kv2">0</div></div>
  <div class="kpi" style="--kc:var(--green)"><div class="kpi-lbl">Paid</div><div class="kpi-val" id="ch-kv3">0</div></div>
</div>
<div class="card"><div class="tbl-wrap"><table class="tbl" id="challanTable"></table></div></div>
`;}

// ── DATA ENTRY ──
function govDataEntryHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Data</span> Entry Panel</div><div style="font-size:12px;color:var(--text2)">All entries logged under: ${currentUser?.name} · ${currentUser?.badge||'–'}</div></div>
<div class="g2 gap16">

  <!-- SIGNAL ENTRY -->
  <div class="card">
    <div class="card-hdr"><div class="card-title">🚦 Add Traffic Signal</div></div>
    <div class="card-body">
      <div class="ofh"><span class="ofh-icon">🚦</span><div><div class="ofh-title">Signal Registration</div><div class="ofh-sub">Officer: ${currentUser?.name} · ${currentUser?.badge||'–'}</div></div></div>
      <div class="form-section">
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Junction Name <span class="req">*</span></label><input class="form-control" id="de-sig-name" placeholder="e.g. MG Road × FC Road"/></div>
          <div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="de-sig-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div>
        </div>
        <div class="form-row-3">
          <div class="form-group"><label class="form-label">Green (s)</label><input class="form-control" type="number" id="de-sig-green" value="45" min="10" max="120"/></div>
          <div class="form-group"><label class="form-label">Red (s)</label><input class="form-control" type="number" id="de-sig-red" value="50" min="10" max="120"/></div>
          <div class="form-group"><label class="form-label">Yellow (s)</label><input class="form-control" type="number" id="de-sig-yellow" value="5" min="3" max="15"/></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Signal Type</label><select class="form-control" id="de-sig-type"><option>Standard 3-Phase</option><option>Pedestrian Crossing</option><option>Flyover Junction</option><option>Highway Merge</option><option>School Zone</option></select></div>
          <div class="form-group"><label class="form-label">Authority</label><select class="form-control" id="de-sig-auth"><option>PMC</option><option>NHAI</option><option>MSRDC</option><option>Traffic Police</option></select></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Latitude</label><input class="form-control" type="number" id="de-sig-lat" placeholder="18.5196" step="0.0001"/></div>
          <div class="form-group"><label class="form-label">Longitude</label><input class="form-control" type="number" id="de-sig-lng" placeholder="73.8553" step="0.0001"/></div>
        </div>
        <div class="form-group"><label class="form-label">Remarks</label><textarea class="form-control" id="de-sig-remarks" placeholder="Installation notes..." style="min-height:56px"></textarea></div>
        <button class="btn btn-primary btn-full" onclick="deAddSignal()">➕ Add Signal</button>
      </div>
    </div>
  </div>

  <!-- INCIDENT ENTRY -->
  <div class="card">
    <div class="card-hdr"><div class="card-title">🚨 Log Incident</div></div>
    <div class="card-body">
      <div class="form-section">
        <div class="form-group"><label class="form-label">Location <span class="req">*</span></label><input class="form-control" id="de-inc-loc" placeholder="e.g. MG Road × Ring Road"/></div>
        <div class="form-row-3">
          <div class="form-group"><label class="form-label">Type</label><select class="form-control" id="de-inc-type"><option>Collision</option><option>Congestion</option><option>Signal Fault</option><option>Road Closure</option><option>Breakdown</option><option>Flooding</option><option>Encroachment</option><option>VIP Movement</option><option>Protest</option></select></div>
          <div class="form-group"><label class="form-label">Severity</label><select class="form-control" id="de-inc-sev"><option>Critical</option><option>Moderate</option><option>Low</option></select></div>
          <div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="de-inc-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Vehicles Involved</label><input class="form-control" type="number" id="de-inc-vehicles" value="0" min="0"/></div>
          <div class="form-group"><label class="form-label">Casualties</label><input class="form-control" type="number" id="de-inc-casualties" value="0" min="0"/></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Reporting Officer</label><input class="form-control" id="de-inc-officer" value="${currentUser?.name||''}"/></div>
          <div class="form-group"><label class="form-label">Badge No.</label><input class="form-control" id="de-inc-badge" value="${currentUser?.badge||''}"/></div>
        </div>
        <div class="form-group"><label class="form-label">Description & Action Taken</label><textarea class="form-control" id="de-inc-notes" placeholder="Describe situation and immediate action..."></textarea></div>
        <button class="btn btn-primary btn-full" onclick="deAddIncident()">🚨 Log Incident</button>
      </div>
    </div>
  </div>

  <!-- VEHICLE ENTRY -->
  <div class="card">
    <div class="card-hdr"><div class="card-title">🚗 Register Vehicle</div></div>
    <div class="card-body">
      <div class="form-section">
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Number Plate <span class="req">*</span></label><input class="form-control" id="de-veh-plate" placeholder="MH12AB1234" style="text-transform:uppercase"/></div>
          <div class="form-group"><label class="form-label">Vehicle Type</label><select class="form-control" id="de-veh-type"><option>Car</option><option>Truck</option><option>Bus</option><option>Bike</option><option>Auto</option><option>LMV</option><option>HMV</option><option>School Bus</option></select></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Owner Name</label><input class="form-control" id="de-veh-owner" placeholder="Registered owner"/></div>
          <div class="form-group"><label class="form-label">Owner Mobile</label><input class="form-control" id="de-veh-phone" placeholder="10-digit number" type="tel"/></div>
        </div>
        <div class="form-row-4">
          <div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="de-veh-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div>
          <div class="form-group"><label class="form-label">Speed</label><input class="form-control" type="number" id="de-veh-speed" value="40" min="0"/></div>
          <div class="form-group"><label class="form-label">Direction</label><select class="form-control" id="de-veh-dir"><option>N</option><option>S</option><option>E</option><option>W</option><option>NE</option><option>NW</option><option>SE</option><option>SW</option></select></div>
          <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="de-veh-status"><option>Active</option><option>Flagged</option><option>Stolen</option><option>Seized</option></select></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="deAddVehicle()">🚗 Register Vehicle</button>
      </div>
    </div>
  </div>

  <!-- ROAD ENTRY -->
  <div class="card">
    <div class="card-hdr"><div class="card-title">🛣️ Add Road</div></div>
    <div class="card-body">
      <div class="form-section">
        <div class="form-group"><label class="form-label">Road Name <span class="req">*</span></label><input class="form-control" id="de-road-name" placeholder="e.g. MG Road Extension"/></div>
        <div class="form-row-3">
          <div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="de-road-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div>
          <div class="form-group"><label class="form-label">Speed Limit</label><input class="form-control" type="number" id="de-road-speed" value="50"/></div>
          <div class="form-group"><label class="form-label">Lanes</label><input class="form-control" type="number" id="de-road-lanes" value="2" min="1" max="12"/></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Length (km)</label><input class="form-control" type="number" id="de-road-len" value="2.0" step="0.1"/></div>
          <div class="form-group"><label class="form-label">Condition</label><select class="form-control" id="de-road-cond"><option>Good</option><option>Fair</option><option>Poor</option><option>Under Repair</option></select></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Category</label><select class="form-control" id="de-road-cat"><option>City Road</option><option>State Highway</option><option>National Highway</option><option>Ring Road</option><option>Service Road</option></select></div>
          <div class="form-group"><label class="form-label">Authority</label><select class="form-control" id="de-road-auth"><option>PMC</option><option>NHAI</option><option>PWD</option><option>MSRDC</option></select></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="deAddRoad()">🛣️ Add Road</button>
      </div>
    </div>
  </div>

  <!-- CHALLAN ENTRY -->
  <div class="card">
    <div class="card-hdr"><div class="card-title">📋 Issue Challan</div></div>
    <div class="card-body">
      <div class="ofh"><span class="ofh-icon">📋</span><div><div class="ofh-title">Challan Issuance</div><div class="ofh-sub">Issuing: ${currentUser?.name} · ${currentUser?.badge||'–'}</div></div></div>
      <div class="form-section">
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Vehicle Plate <span class="req">*</span></label><input class="form-control" id="de-ch-plate" placeholder="MH12AB1234" style="text-transform:uppercase"/></div>
          <div class="form-group"><label class="form-label">Owner Name</label><input class="form-control" id="de-ch-owner" placeholder="Registered owner"/></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Violation <span class="req">*</span></label><select class="form-control" id="de-ch-violation"><option>Over Speeding</option><option>Signal Jump</option><option>Wrong Side Driving</option><option>No Helmet</option><option>No Seat Belt</option><option>Drunk Driving</option><option>Mobile While Driving</option><option>Illegal Parking</option><option>Overloading</option><option>No PUC</option><option>Triple Riding</option></select></div>
          <div class="form-group"><label class="form-label">Fine Amount (₹)</label><input class="form-control" type="number" id="de-ch-fine" value="1000" min="100" step="100"/></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Location</label><input class="form-control" id="de-ch-loc" placeholder="Where violation occurred"/></div>
          <div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="de-ch-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Observed Speed (km/h)</label><input class="form-control" type="number" id="de-ch-speed" placeholder="If speeding"/></div>
          <div class="form-group"><label class="form-label">Vehicle Seized?</label><select class="form-control" id="de-ch-seized"><option value="No">No</option><option value="Yes">Yes</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">Remarks</label><textarea class="form-control" id="de-ch-remarks" placeholder="Additional details, witness info..." style="min-height:60px"></textarea></div>
        <button class="btn btn-primary btn-full" onclick="deIssueChallan()">📋 Issue Challan</button>
      </div>
    </div>
  </div>

  <!-- PATROL REPORT -->
  <div class="card">
    <div class="card-hdr"><div class="card-title">🚔 Patrol Duty Report</div></div>
    <div class="card-body">
      <div class="form-section">
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Officer Name</label><input class="form-control" id="de-pt-name" value="${currentUser?.name||''}"/></div>
          <div class="form-group"><label class="form-label">Badge / ID</label><input class="form-control" id="de-pt-badge" value="${currentUser?.badge||''}"/></div>
        </div>
        <div class="form-row-3">
          <div class="form-group"><label class="form-label">Duty Zone</label><select class="form-control" id="de-pt-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div>
          <div class="form-group"><label class="form-label">Shift</label><select class="form-control" id="de-pt-shift"><option>Morning 6AM–2PM</option><option>Afternoon 2PM–10PM</option><option>Night 10PM–6AM</option></select></div>
          <div class="form-group"><label class="form-label">Patrol Vehicle</label><input class="form-control" id="de-pt-veh" placeholder="Plate no."/></div>
        </div>
        <div class="form-row-3">
          <div class="form-group"><label class="form-label">Challans Issued</label><input class="form-control" type="number" id="de-pt-challans" value="0"/></div>
          <div class="form-group"><label class="form-label">Incidents Handled</label><input class="form-control" type="number" id="de-pt-inc" value="0"/></div>
          <div class="form-group"><label class="form-label">Km Covered</label><input class="form-control" type="number" id="de-pt-km" value="0" step="0.1"/></div>
        </div>
        <div class="form-group"><label class="form-label">Observations</label><textarea class="form-control" id="de-pt-notes" placeholder="Summary of patrol..."></textarea></div>
        <button class="btn btn-primary btn-full" onclick="deSubmitPatrol()">🚔 Submit Report</button>
      </div>
    </div>
  </div>

</div>
`;}

// ════ DASHBOARD INIT ════
let volCh=null;
async function initDash(){
  buildMap();
  try{
    const ov=await API.get('/analytics/overview');
    document.getElementById('kv1').innerHTML=Number(ov.totalVehicles).toLocaleString('en-IN')+'<sup> active</sup>';
    document.getElementById('kt1').innerHTML='<span style="color:var(--green)">↑ Live tracking</span>';
    document.getElementById('kv2').innerHTML=ov.avgSpeed+'<sup> km/h</sup>';
    document.getElementById('kv3').innerHTML=ov.signalsOnline+'<sup>/'+ov.totalSignals+'</sup>';
    document.getElementById('kt3').textContent='● '+(ov.totalSignals-ov.signalsOnline)+' offline';
    document.getElementById('kv4').innerHTML=ov.activeIncidents+'<sup> active</sup>';
    document.getElementById('kt4').innerHTML='<span style="color:var(--red)">'+ov.criticalIncidents+' critical</span>';
    const sbi=document.getElementById('sb-inc');if(sbi)sbi.textContent=ov.activeIncidents;
    const sbc=document.getElementById('sb-ch');if(sbc)sbc.textContent=ov.pendingChallans||0;
    const cb=document.getElementById('congBars');
    if(cb)cb.innerHTML=Object.entries(ov.zones).map(([z,p])=>{const col=p>75?'var(--red)':p>55?'var(--amber)':'var(--green)';return `<div class="bar-row"><div class="bar-label">Zone ${z}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${col}"></div></div><div class="bar-pct">${p}%</div></div>`;}).join('');
  }catch(e){}
  try{
    const vol=await API.get('/analytics/volume');
    const ctx=document.getElementById('volChart');
    if(ctx){if(volCh){volCh.destroy();volCh=null;}
      Chart.defaults.color='#7a95b0';Chart.defaults.borderColor='#dde3ec';
      volCh=new Chart(ctx,{type:'line',data:{labels:vol.map(v=>v.hour+'h'),datasets:[{data:vol.map(v=>v.count),borderColor:'var(--blue,#2563eb)',backgroundColor:'rgba(37,99,235,0.06)',tension:0.4,borderWidth:2,pointRadius:0,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:9}}},y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:9}}}}}});}
  }catch(e){}
  loadSigMini();loadDashInc();buildTicker();
}
async function loadSigMini(){
  try{const sigs=await API.get('/signals');const el=document.getElementById('sigMiniList');if(!el)return;el.innerHTML=sigs.slice(0,6).map(s=>`<div class="sig-mini"><div class="sig-lights-col"><div class="s-dot s-r ${s.phase==='red'?'on':''}"></div><div class="s-dot s-y ${s.phase==='yellow'?'on':''}"></div><div class="s-dot s-g ${s.phase==='green'?'on':''}"></div></div><div class="sig-mini-info"><div class="sig-mini-id">${s.id}</div><div class="sig-mini-name">${s.name}</div></div><div class="sig-mini-timer sig-t-${s.id}">0:${String(s.timer).padStart(2,'0')}</div><span class="bdg ${s.status==='online'?'bdg-green':s.status==='fault'?'bdg-amber':'bdg-red'}">${s.status}</span></div>`).join('');updateMapSigs(sigs);}catch(e){}
}
async function loadDashInc(){
  try{const incs=await API.get('/incidents');const el=document.getElementById('dashIncTbl');if(!el)return;el.innerHTML='<table class="tbl">'+incRows(incs.slice(0,5),true)+'</table>';}catch(e){}
}
async function buildTicker(){
  try{const r=await API.get('/analytics/overview');const t=`Active: ${r.activeIncidents} incidents | Critical: ${r.criticalIncidents} | Congestion: ${r.congestionIndex}% | Signals: ${r.signalsOnline}/${r.totalSignals} online | Challans pending: ${r.pendingChallans||0}`;const el=document.getElementById('tickerTxt');if(el)el.textContent=t+'   ·   '+t+'   ·   '+t;}catch(e){}
}

// ════ MAP ════
const MAP_POS={'SIG-01':{x:120,y:90},'SIG-02':{x:280,y:90},'SIG-03':{x:420,y:90},'SIG-04':{x:120,y:185},'SIG-05':{x:280,y:185},'SIG-06':{x:420,y:185},'SIG-07':{x:200,y:255},'SIG-08':{x:370,y:255}};
let mapScl=1;
function buildMap(){
  const svg=document.getElementById('cityMap');if(!svg)return;
  svg.innerHTML=`
    <defs><filter id="glow2"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <g id="mg">
    <rect width="560" height="300" fill="#e8edf5"/>
    ${Array.from({length:15},(_,i)=>`<line x1="${i*40}" y1="0" x2="${i*40}" y2="300" stroke="rgba(26,46,74,0.06)" stroke-width="1"/>`).join('')}
    ${Array.from({length:9},(_,i)=>`<line x1="0" y1="${i*40}" x2="560" y2="${i*40}" stroke="rgba(26,46,74,0.06)" stroke-width="1"/>`).join('')}
    <rect x="0" y="78" width="560" height="22" fill="#d0d8e8"/>
    <rect x="0" y="176" width="560" height="20" fill="#d0d8e8"/>
    <rect x="0" y="246" width="560" height="16" fill="#ccd4e4"/>
    <rect x="108" y="0" width="22" height="300" fill="#d0d8e8"/>
    <rect x="268" y="0" width="22" height="300" fill="#d0d8e8"/>
    <rect x="408" y="0" width="18" height="300" fill="#ccd4e4"/>
    <line x1="0" y1="89" x2="560" y2="89" stroke="rgba(255,193,7,0.5)" stroke-width="1" stroke-dasharray="14,10"/>
    <line x1="0" y1="186" x2="560" y2="186" stroke="rgba(255,193,7,0.5)" stroke-width="1" stroke-dasharray="14,10"/>
    <line x1="119" y1="0" x2="119" y2="300" stroke="rgba(255,193,7,0.5)" stroke-width="1" stroke-dasharray="14,10"/>
    <line x1="279" y1="0" x2="279" y2="300" stroke="rgba(255,193,7,0.5)" stroke-width="1" stroke-dasharray="14,10"/>
    ${[[10,8,90,62],[140,8,120,62],[298,8,102,62],[432,8,112,62],[10,108,90,60],[140,108,120,60],[298,108,102,60],[432,108,112,60],[10,204,90,36],[140,204,120,36],[298,204,102,36],[432,204,112,36],[10,270,90,26],[140,270,120,26],[298,270,102,26],[432,270,112,26]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c8d4e8" rx="3"/>`).join('')}
    <text x="14" y="22" font-family="sans-serif" font-size="8" fill="#7a95b0" font-weight="600">ALPHA</text>
    <text x="145" y="22" font-family="sans-serif" font-size="8" fill="#7a95b0" font-weight="600">BETA</text>
    <text x="302" y="22" font-family="sans-serif" font-size="8" fill="#7a95b0" font-weight="600">GAMMA</text>
    <text x="436" y="22" font-family="sans-serif" font-size="8" fill="#7a95b0" font-weight="600">DELTA</text>
    ${makeVehicles()}
    <circle cx="155" cy="140" r="9" fill="rgba(220,38,38,0.2)" stroke="#dc2626" stroke-width="1.5"><animate attributeName="r" values="9;16;9" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/></circle>
    <text x="151" y="144" font-family="sans-serif" font-size="9" fill="#dc2626" font-weight="bold">!</text>
    <g id="mapSigs"></g>
    </g>
  `;
  loadSigMini();setupMapTT();
}
function makeVehicles(){
  const paths=[['M 0,89 L 560,89','#2563eb',8],['M 560,186 L 0,186','#d97706',10],['M 119,0 L 119,300','#059669',7],['M 279,300 L 279,0','#475569',9],['M 0,254 L 560,254','#7c3aed',12],['M 408,0 L 408,300','#0891b2',8]];
  return paths.map(([p,c,d],i)=>{const h=i%3!==0;return `<rect width="${h?10:5}" height="${h?5:8}" rx="2" fill="${c}" opacity="0.7"><animateMotion dur="${d}s" repeatCount="indefinite" begin="-${i*1.3}s" path="${p}"/></rect>`;}).join('');
}
function updateMapSigs(sigs){
  const g=document.getElementById('mapSigs');if(!g)return;
  g.innerHTML=(sigs||[]).map(s=>{
    const p=MAP_POS[s.id]||{x:50,y:50};
    const col=s.phase==='green'?'#22c55e':s.phase==='yellow'?'#fbbf24':'#ef4444';
    return `<g class="map-sig-node" data-id="${s.id}"><circle cx="${p.x}" cy="${p.y}" r="12" fill="white" stroke="${col}" stroke-width="2" filter="url(#glow2)"/><circle cx="${p.x}" cy="${p.y}" r="5" fill="${col}"/><text x="${p.x}" y="${p.y+20}" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#7a95b0" font-weight="600">${s.id}</text></g>`;
  }).join('');
  setupMapTT();
}
async function setupMapTT(){
  const tt=document.getElementById('mapTT');if(!tt)return;
  document.querySelectorAll('.map-sig-node').forEach(node=>{
    node.onmouseenter=async()=>{
      try{const s=await API.get('/signals/'+node.dataset.id);
        const col=s.phase==='green'?'var(--green)':s.phase==='yellow'?'var(--amber)':'var(--red)';
        document.getElementById('ttN').textContent=s.name;
        document.getElementById('ttP').innerHTML=`<span class="phase-pill phase-${s.phase}">${s.phase}</span>`;
        document.getElementById('ttT').textContent=`0:${String(s.timer).padStart(2,'0')}`;
        document.getElementById('ttV').textContent=`${(s.volume||0).toLocaleString()} veh/hr`;
        const svgR=document.getElementById('cityMap').getBoundingClientRect();
        const pos=MAP_POS[s.id]||{x:0,y:0};
        tt.style.left=(pos.x*(svgR.width/560)+18)+'px';tt.style.top=(pos.y*(svgR.height/300)-18)+'px';
        tt.classList.add('show');
      }catch(e){}
    };
    node.onmouseleave=()=>tt.classList.remove('show');
  });
}
function mapZoom(f){mapScl=Math.max(0.5,Math.min(3,mapScl*f));const g=document.getElementById('mg');if(g)g.style.transform=`scale(${mapScl})`;}

// ════ SIGNALS ════
async function loadSignals(){
  try{const sigs=await API.get('/signals');const grid=document.getElementById('signalGrid');if(!grid)return;
    grid.innerHTML=sigs.map(s=>`
      <div class="card" id="sc-${s.id}">
        <div class="card-hdr">
          <div class="card-title">${s.id} — <span style="font-weight:400;color:var(--text2)">${s.zone}</span></div>
          <span class="bdg ${s.auto?'bdg-green':'bdg-amber'}">${s.auto?'Auto':'Manual'}</span>
        </div>
        <div class="card-body" style="text-align:center;">
          <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">${s.name}</div>
          <div style="display:flex;justify-content:center;margin-bottom:12px;">
            <div class="tl-box">
              <div class="tl-dot ${s.phase==='red'?'tl-r-on':'tl-r-off'}"></div>
              <div class="tl-dot ${s.phase==='yellow'?'tl-y-on':'tl-y-off'}"></div>
              <div class="tl-dot ${s.phase==='green'?'tl-g-on':'tl-g-off'}"></div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;background:var(--surface2);border-radius:8px;padding:8px 12px;">
            <span style="font-size:11px;color:var(--text2);">Timer</span>
            <span style="font-family:var(--mono);font-size:18px;font-weight:600;" class="sc-t-${s.id}">0:${String(s.timer).padStart(2,'0')}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:12px;color:var(--text2);">
            <span>Volume:</span><span style="font-weight:600;color:var(--text)">${(s.volume||0).toLocaleString()} v/h</span>
          </div>
          <div style="margin-bottom:12px;text-align:left;">
            <label style="font-size:11px;color:var(--text2);">Green: <span id="gt-${s.id}">${s.greenTime}s</span></label>
            <input type="range" min="10" max="90" value="${s.greenTime}" oninput="document.getElementById('gt-${s.id}').textContent=this.value+'s';updateSigGreen('${s.id}',this.value)" style="margin-top:4px"/>
          </div>
          <div style="display:flex;gap:5px;margin-bottom:6px;">
            <button class="btn btn-danger btn-sm" style="flex:1" onclick="setPhase('${s.id}','red')">Red</button>
            <button class="btn btn-amber btn-sm" style="flex:1" onclick="setPhase('${s.id}','yellow')">Yellow</button>
            <button class="btn btn-success btn-sm" style="flex:1" onclick="setPhase('${s.id}','green')">Green</button>
          </div>
          <button class="btn btn-ghost btn-sm btn-full" onclick="setAuto('${s.id}')">↺ Set Auto Mode</button>
          <button class="btn btn-danger btn-sm btn-full" style="margin-top:5px" onclick="delSig('${s.id}')">🗑 Remove</button>
          <span class="bdg ${s.status==='online'?'bdg-green':s.status==='fault'?'bdg-amber':'bdg-red'}" style="margin-top:8px;display:inline-block">${s.status}</span>
        </div>
      </div>`).join('');
  }catch(e){toast('Failed to load signals','error');}
}
async function setPhase(id,phase){try{await API.patch(`/signals/${id}/phase`,{phase,auto:false});toast(`Signal ${id} → ${phase}`,'warning');loadSignals();}catch(e){toast(e.message,'error');}}
async function setAuto(id){try{await API.patch(`/signals/${id}/phase`,{auto:true});toast(`Signal ${id} → Auto`,'success');loadSignals();}catch(e){}}
async function updateSigGreen(id,val){try{await API.put(`/signals/${id}`,{greenTime:Number(val)});}catch(e){}}
async function allSignals(mode){const sigs=await API.get('/signals');for(const s of sigs){if(mode==='green')await API.patch(`/signals/${s.id}/phase`,{phase:'green',auto:false});else if(mode==='red')await API.patch(`/signals/${s.id}/phase`,{phase:'red',auto:false});else await API.patch(`/signals/${s.id}/phase`,{auto:true});}toast(mode==='green'?'✓ Green Wave activated':mode==='red'?'Emergency Red activated':'Auto mode resumed','warning');loadSignals();}
async function delSig(id){if(!confirm(`Remove signal ${id}?`))return;try{await API.del(`/signals/${id}`);toast('Signal removed','info');loadSignals();}catch(e){}}
function openAddSignalModal(){openModal('➕ Add Signal',`<div class="form-section"><div class="form-row-2"><div class="form-group"><label class="form-label">Name *</label><input class="form-control" id="ms-name" placeholder="Junction name"/></div><div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="ms-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div></div><div class="form-row-2"><div class="form-group"><label class="form-label">Green (s)</label><input class="form-control" type="number" id="ms-green" value="45"/></div><div class="form-group"><label class="form-label">Red (s)</label><input class="form-control" type="number" id="ms-red" value="50"/></div></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Add',c:'btn btn-primary',f:'saveSig()'}]);}
async function saveSig(){const n=document.getElementById('ms-name').value.trim();if(!n){toast('Name required','warning');return;}try{await API.post('/signals',{name:n,zone:document.getElementById('ms-zone').value,greenTime:+document.getElementById('ms-green').value,redTime:+document.getElementById('ms-red').value,yellowTime:5});closeModal();toast('Signal added','success');loadSignals();}catch(e){toast(e.message,'error');}}

// ════ INCIDENTS ════
async function loadIncidents(filter){
  if(filter)window._incFilter=filter;
  const f=window._incFilter||'all';
  try{const p=f==='all'?'':f==='active'?'?status=active':f==='critical'?'?severity=critical':'?status=resolved';const incs=await API.get('/incidents'+p);const tbl=document.getElementById('incTable');if(tbl)tbl.innerHTML=incRows(incs,false);}catch(e){}
}
function filterInc(f,btn){document.querySelectorAll('#page-incidents .btn-ghost').forEach(b=>{b.style.background='';b.style.color='';b.style.borderColor='';});if(btn){btn.style.background='var(--blue-lt)';btn.style.color='var(--blue)';btn.style.borderColor='var(--blue-mid)';}loadIncidents(f);}
function incRows(incs,mini){
  return `<thead><tr><th>ID</th><th>Location</th><th>Type</th><th>Severity</th><th>Zone</th><th>Time</th><th>Status</th>${mini?'':'<th>Actions</th>'}</tr></thead><tbody>`+
    incs.map(i=>`<tr>
      <td class="tbl-id">${i.id}</td><td>${i.location}</td><td>${i.type}</td>
      <td><span class="bdg ${i.severity==='Critical'?'bdg-red':i.severity==='Moderate'?'bdg-amber':'bdg-green'}">● ${i.severity}</span></td>
      <td>${i.zone}</td><td style="font-family:var(--mono)">${i.time}</td>
      <td><span class="bdg ${i.status==='Active'?'bdg-orange':'bdg-green'}">${i.status}</span></td>
      ${mini?'':` <td><div style="display:flex;gap:4px;flex-wrap:wrap">
        ${i.status==='Active'?`<button class="btn btn-success btn-sm" onclick="resolveInc('${i.id}')">✓ Resolve</button>`:''}
        <button class="btn btn-ghost btn-sm" onclick="editInc('${i.id}')">✎</button>
        <button class="btn btn-danger btn-sm" onclick="delInc('${i.id}')">✕</button>
      </div></td>`}
    </tr>`).join('')+'</tbody>';
}
async function resolveInc(id){try{await API.patch(`/incidents/${id}/resolve`,{});toast('Incident resolved','success');loadIncidents();loadDashInc();}catch(e){}}
async function delInc(id){if(!confirm('Delete?'))return;try{await API.del(`/incidents/${id}`);toast('Deleted','info');loadIncidents();}catch(e){}}
function openAddIncidentModal(){openModal('🚨 Report Incident',`<div class="form-section"><div class="form-group"><label class="form-label">Location *</label><input class="form-control" id="mi-loc" placeholder="Junction or road"/></div><div class="form-row-2"><div class="form-group"><label class="form-label">Type</label><select class="form-control" id="mi-type"><option>Collision</option><option>Congestion</option><option>Signal Fault</option><option>Road Closure</option><option>Breakdown</option><option>Flooding</option></select></div><div class="form-group"><label class="form-label">Severity</label><select class="form-control" id="mi-sev"><option>Critical</option><option>Moderate</option><option>Low</option></select></div></div><div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="mi-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div><div class="form-group"><label class="form-label">Notes</label><textarea class="form-control" id="mi-notes" placeholder="Details..."></textarea></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Submit',c:'btn btn-primary',f:'saveInc()'}]);}
async function saveInc(){const l=document.getElementById('mi-loc').value.trim();if(!l){toast('Location required','warning');return;}try{await API.post('/incidents',{location:l,type:document.getElementById('mi-type').value,severity:document.getElementById('mi-sev').value,zone:document.getElementById('mi-zone').value,notes:document.getElementById('mi-notes').value});closeModal();toast('Incident reported','success');loadIncidents();loadDashInc();}catch(e){toast(e.message,'error');}}
async function editInc(id){try{const inc=await API.get(`/incidents/${id}`);openModal('✎ Edit Incident',`<div class="form-section"><div class="form-group"><label class="form-label">Location</label><input class="form-control" id="ei-loc" value="${inc.location}"/></div><div class="form-row-2"><div class="form-group"><label class="form-label">Type</label><select class="form-control" id="ei-type"><option>Collision</option><option>Congestion</option><option>Signal Fault</option><option>Road Closure</option><option>Breakdown</option></select></div><div class="form-group"><label class="form-label">Severity</label><select class="form-control" id="ei-sev"><option>Critical</option><option>Moderate</option><option>Low</option></select></div></div><div class="form-row-2"><div class="form-group"><label class="form-label">Status</label><select class="form-control" id="ei-status"><option>Active</option><option>Resolved</option></select></div><div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="ei-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div></div><div class="form-group"><label class="form-label">Notes</label><textarea class="form-control" id="ei-notes">${inc.notes||''}</textarea></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Save',c:'btn btn-primary',f:`saveEditInc('${id}')`}]);setTimeout(()=>{document.getElementById('ei-type').value=inc.type;document.getElementById('ei-sev').value=inc.severity;document.getElementById('ei-status').value=inc.status;document.getElementById('ei-zone').value=inc.zone;},50);}catch(e){}}
async function saveEditInc(id){try{await API.put(`/incidents/${id}`,{location:document.getElementById('ei-loc').value,type:document.getElementById('ei-type').value,severity:document.getElementById('ei-sev').value,status:document.getElementById('ei-status').value,zone:document.getElementById('ei-zone').value,notes:document.getElementById('ei-notes').value});closeModal();toast('Updated','success');loadIncidents();}catch(e){}}

// ════ VEHICLES ════
async function loadVehicles(){
  try{const v=await API.get('/vehicles');const t=document.getElementById('vehTable');if(!t)return;
    t.innerHTML=`<thead><tr><th>Plate</th><th>Type</th><th>Owner</th><th>Mobile</th><th>Zone</th><th>Speed</th><th>Status</th><th>Actions</th></tr></thead><tbody>`+
      v.map(v=>`<tr><td class="tbl-id">${v.plate}</td><td>${v.type}</td><td>${v.ownerName||'–'}</td><td style="font-family:var(--mono)">${v.ownerPhone||'–'}</td><td>${v.zone}</td><td style="color:var(--green);font-weight:600">${v.speed} km/h</td><td><span class="bdg ${v.status==='Active'?'bdg-green':v.status==='Flagged'?'bdg-amber':'bdg-red'}">${v.status||'Active'}</span></td><td><button class="btn btn-danger btn-sm" onclick="delVeh('${v.plate}')">✕</button></td></tr>`).join('')+'</tbody>';
  }catch(e){}
}
async function delVeh(p){if(!confirm('Remove '+p+'?'))return;try{await API.del('/vehicles/'+encodeURIComponent(p));toast('Removed','info');loadVehicles();}catch(e){}}
function openAddVehicleModal(){openModal('🚗 Register Vehicle',`<div class="form-section"><div class="form-row-2"><div class="form-group"><label class="form-label">Plate *</label><input class="form-control" id="mv-plate" style="text-transform:uppercase" placeholder="MH12AB1234"/></div><div class="form-group"><label class="form-label">Type</label><select class="form-control" id="mv-type"><option>Car</option><option>Truck</option><option>Bus</option><option>Bike</option><option>Auto</option></select></div></div><div class="form-row-2"><div class="form-group"><label class="form-label">Owner</label><input class="form-control" id="mv-owner" placeholder="Owner name"/></div><div class="form-group"><label class="form-label">Mobile</label><input class="form-control" id="mv-phone" placeholder="10-digit" type="tel"/></div></div><div class="form-row-3"><div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="mv-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div><div class="form-group"><label class="form-label">Speed</label><input class="form-control" type="number" id="mv-speed" value="40"/></div><div class="form-group"><label class="form-label">Direction</label><select class="form-control" id="mv-dir"><option>N</option><option>S</option><option>E</option><option>W</option></select></div></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Register',c:'btn btn-primary',f:'saveVeh()'}]);}
async function saveVeh(){const p=document.getElementById('mv-plate').value.trim().toUpperCase();if(!p){toast('Plate required','warning');return;}try{await API.post('/vehicles',{plate:p,type:document.getElementById('mv-type').value,ownerName:document.getElementById('mv-owner').value,ownerPhone:document.getElementById('mv-phone').value,zone:document.getElementById('mv-zone').value,speed:+document.getElementById('mv-speed').value,direction:document.getElementById('mv-dir').value,status:'Active'});closeModal();toast('Registered','success');loadVehicles();}catch(e){toast(e.message,'error');}}

// ════ ROADS ════
async function loadRoads(){
  try{const roads=await API.get('/roads');const t=document.getElementById('roadTable');if(!t)return;
    t.innerHTML=`<thead><tr><th>ID</th><th>Name</th><th>Zone</th><th>Length</th><th>Lanes</th><th>Speed Limit</th><th>Condition</th><th>Authority</th><th>Congestion</th><th>Actions</th></tr></thead><tbody>`+
      roads.map(r=>`<tr><td class="tbl-id">${r.id}</td><td>${r.name}</td><td>${r.zone}</td><td>${r.length} km</td><td>${r.lanes}</td><td>${r.speedLimit} km/h</td><td><span class="bdg ${r.condition==='Good'?'bdg-green':r.condition==='Fair'?'bdg-amber':'bdg-red'}">${r.condition||'–'}</span></td><td>${r.authority||'–'}</td><td><span class="bdg ${(r.congestion||0)>70?'bdg-red':(r.congestion||0)>50?'bdg-amber':'bdg-green'}">${r.congestion||0}%</span></td><td style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" onclick="editRoad('${r.id}')">✎</button><button class="btn btn-danger btn-sm" onclick="delRoad('${r.id}')">✕</button></td></tr>`).join('')+'</tbody>';
  }catch(e){}
}
async function delRoad(id){if(!confirm('Delete?'))return;try{await API.del('/roads/'+id);toast('Deleted','info');loadRoads();}catch(e){}}
function openAddRoadModal(){openModal('🛣️ Add Road',`<div class="form-section"><div class="form-group"><label class="form-label">Name *</label><input class="form-control" id="mr-name" placeholder="Road name"/></div><div class="form-row-2"><div class="form-group"><label class="form-label">Zone</label><select class="form-control" id="mr-zone"><option>Alpha</option><option>Beta</option><option>Gamma</option><option>Delta</option></select></div><div class="form-group"><label class="form-label">Speed Limit</label><input class="form-control" type="number" id="mr-speed" value="50"/></div></div><div class="form-row-2"><div class="form-group"><label class="form-label">Length (km)</label><input class="form-control" type="number" id="mr-len" value="2.0" step="0.1"/></div><div class="form-group"><label class="form-label">Lanes</label><input class="form-control" type="number" id="mr-lanes" value="2"/></div></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Add',c:'btn btn-primary',f:'saveRoad()'}]);}
async function saveRoad(){const n=document.getElementById('mr-name').value.trim();if(!n){toast('Name required','warning');return;}try{await API.post('/roads',{name:n,zone:document.getElementById('mr-zone').value,speedLimit:+document.getElementById('mr-speed').value,length:+document.getElementById('mr-len').value,lanes:+document.getElementById('mr-lanes').value,condition:'Good',authority:'PMC',congestion:0});closeModal();toast('Added','success');loadRoads();}catch(e){toast(e.message,'error');}}
async function editRoad(id){try{const roads=await API.get('/roads');const r=roads.find(x=>x.id===id);if(!r)return;openModal('✎ Edit Road',`<div class="form-section"><div class="form-group"><label class="form-label">Name</label><input class="form-control" id="er-name" value="${r.name}"/></div><div class="form-row-2"><div class="form-group"><label class="form-label">Congestion %</label><input class="form-control" type="number" id="er-cong" value="${r.congestion||0}"/></div><div class="form-group"><label class="form-label">Condition</label><select class="form-control" id="er-cond"><option>Good</option><option>Fair</option><option>Poor</option><option>Under Repair</option></select></div></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Save',c:'btn btn-primary',f:`saveEditRoad('${id}')`}]);setTimeout(()=>document.getElementById('er-cond').value=r.condition||'Good',50);}catch(e){}}
async function saveEditRoad(id){try{await API.put('/roads/'+id,{name:document.getElementById('er-name').value,congestion:+document.getElementById('er-cong').value,condition:document.getElementById('er-cond').value});closeModal();toast('Updated','success');loadRoads();}catch(e){}}

// ════ RULES ════
async function loadRules(){
  try{const rules=await API.get('/rules');const t=document.getElementById('rulesTable');if(!t)return;
    t.innerHTML=`<thead><tr><th>Rule ID</th><th>Title</th><th>Category</th><th>Limit</th><th>Penalty</th><th>Demerit Pts</th><th>MV Act</th><th>Status</th><th>Actions</th></tr></thead><tbody>`+
      rules.map(r=>`<tr><td class="tbl-id">${r.id}</td><td style="font-weight:500">${r.title}</td><td><span class="bdg bdg-blue">${r.category}</span></td><td>${r.limit}</td><td style="color:var(--amber);font-weight:600">${r.penalty}</td><td style="text-align:center">${r.points}</td><td style="font-family:var(--mono);font-size:11px">${r.section}</td><td><span class="bdg ${r.status==='Active'?'bdg-green':'bdg-red'}">${r.status}</span></td><td style="display:flex;gap:4px"><button class="btn btn-ghost btn-sm" onclick="editRule('${r.id}')">✎</button><button class="btn btn-danger btn-sm" onclick="delRule('${r.id}')">✕</button></td></tr>`).join('')+'</tbody>';
  }catch(e){}
}
async function delRule(id){if(!confirm('Delete rule?'))return;try{await API.del('/rules/'+id);toast('Rule deleted','info');loadRules();}catch(e){}}
function openAddRuleModal(){openModal('📜 Add Traffic Rule',`<div class="form-section"><div class="form-group"><label class="form-label">Rule Title *</label><input class="form-control" id="ru-title" placeholder="e.g. Speed Limit – School Zone"/></div><div class="form-row-2"><div class="form-group"><label class="form-label">Category</label><select class="form-control" id="ru-cat"><option>Speed</option><option>Safety</option><option>Signals</option><option>Driving</option><option>Parking</option><option>DUI</option><option>Distraction</option><option>Overloading</option></select></div><div class="form-group"><label class="form-label">Limit / Threshold</label><input class="form-control" id="ru-limit" placeholder="e.g. 30 km/h or N/A"/></div></div><div class="form-row-2"><div class="form-group"><label class="form-label">Penalty</label><input class="form-control" id="ru-penalty" placeholder="e.g. ₹2,000 + Imprisonment"/></div><div class="form-group"><label class="form-label">Demerit Points</label><input class="form-control" type="number" id="ru-pts" value="0" min="0" max="10"/></div></div><div class="form-group"><label class="form-label">MV Act Section</label><input class="form-control" id="ru-section" placeholder="e.g. MV Act Sec 112"/></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Add Rule',c:'btn btn-primary',f:'saveRule()'}]);}
async function saveRule(){const t=document.getElementById('ru-title').value.trim();if(!t){toast('Title required','warning');return;}try{await API.post('/rules',{title:t,category:document.getElementById('ru-cat').value,limit:document.getElementById('ru-limit').value||'N/A',penalty:document.getElementById('ru-penalty').value,points:+document.getElementById('ru-pts').value,section:document.getElementById('ru-section').value});closeModal();toast('Rule added','success');loadRules();}catch(e){toast(e.message,'error');}}
async function editRule(id){try{const rules=await API.get('/rules');const r=rules.find(x=>x.id===id);if(!r)return;openModal('✎ Edit Rule',`<div class="form-section"><div class="form-group"><label class="form-label">Title</label><input class="form-control" id="er2-title" value="${r.title}"/></div><div class="form-row-2"><div class="form-group"><label class="form-label">Penalty</label><input class="form-control" id="er2-penalty" value="${r.penalty}"/></div><div class="form-group"><label class="form-label">Status</label><select class="form-control" id="er2-status"><option>Active</option><option>Inactive</option></select></div></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Save',c:'btn btn-primary',f:`saveEditRule('${id}')`}]);setTimeout(()=>document.getElementById('er2-status').value=r.status,50);}catch(e){}}
async function saveEditRule(id){try{await API.put('/rules/'+id,{title:document.getElementById('er2-title').value,penalty:document.getElementById('er2-penalty').value,status:document.getElementById('er2-status').value});closeModal();toast('Rule updated','success');loadRules();}catch(e){}}

// ════ CHALLANS ════
async function loadChallans(){
  try{const ch=await API.get('/challans');
    const t=document.getElementById('challanTable');if(!t)return;
    const paid=ch.filter(c=>c.status==='Paid').length;const pend=ch.filter(c=>c.status==='Pending').length;
    const k1=document.getElementById('ch-kv1');const k2=document.getElementById('ch-kv2');const k3=document.getElementById('ch-kv3');
    if(k1)k1.textContent=ch.length;if(k2)k2.textContent=pend;if(k3)k3.textContent=paid;
    t.innerHTML=`<thead><tr><th>ID</th><th>Plate</th><th>Owner</th><th>Violation</th><th>Fine</th><th>Location</th><th>Issued By</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>`+
      (ch.length===0?`<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:24px;font-style:italic">No challans issued yet</td></tr>`:
      ch.map(c=>`<tr><td class="tbl-id">${c.id}</td><td style="font-family:var(--mono);font-weight:600">${c.vehiclePlate||'–'}</td><td>${c.ownerName||'–'}</td><td>${c.violation||'–'}</td><td style="color:var(--amber);font-weight:700">₹${(c.fineAmount||0).toLocaleString('en-IN')}</td><td>${c.location||'–'}</td><td style="font-size:12px">${c.issuedBy||'–'}</td><td style="font-family:var(--mono)">${c.issuedAt||'–'}</td><td><span class="bdg ${c.status==='Paid'?'bdg-green':c.status==='Contested'?'bdg-amber':'bdg-red'}">${c.status||'Pending'}</span></td><td style="display:flex;gap:4px"><button class="btn btn-success btn-sm" onclick="markPaid('${c.id}')">✓ Paid</button><button class="btn btn-danger btn-sm" onclick="delChallan('${c.id}')">✕</button></td></tr>`).join(''))+'</tbody>';
  }catch(e){}
}
async function markPaid(id){try{await API.put('/challans/'+id,{status:'Paid'});toast('Marked as paid','success');loadChallans();}catch(e){}}
async function delChallan(id){if(!confirm('Delete?'))return;try{await API.del('/challans/'+id);toast('Deleted','info');loadChallans();}catch(e){}}
function openAddChallanModal(){openModal('📋 Issue Challan',`<div class="form-section"><div class="form-row-2"><div class="form-group"><label class="form-label">Plate *</label><input class="form-control" id="mc-plate" style="text-transform:uppercase" placeholder="MH12AB1234"/></div><div class="form-group"><label class="form-label">Owner</label><input class="form-control" id="mc-owner" placeholder="Owner name"/></div></div><div class="form-row-2"><div class="form-group"><label class="form-label">Violation</label><select class="form-control" id="mc-viol"><option>Over Speeding</option><option>Signal Jump</option><option>Wrong Side Driving</option><option>No Helmet</option><option>No Seat Belt</option><option>Drunk Driving</option><option>Illegal Parking</option><option>Mobile While Driving</option></select></div><div class="form-group"><label class="form-label">Fine (₹)</label><input class="form-control" type="number" id="mc-fine" value="1000"/></div></div><div class="form-group"><label class="form-label">Location</label><input class="form-control" id="mc-loc" placeholder="Where violation occurred"/></div></div>`,[{l:'Cancel',c:'btn btn-ghost',f:'closeModal()'},{l:'Issue',c:'btn btn-primary',f:'saveChallan()'}]);}
async function saveChallan(){const p=document.getElementById('mc-plate').value.trim().toUpperCase();if(!p){toast('Plate required','warning');return;}try{await API.post('/challans',{vehiclePlate:p,ownerName:document.getElementById('mc-owner').value,violation:document.getElementById('mc-viol').value,fineAmount:+document.getElementById('mc-fine').value,location:document.getElementById('mc-loc').value});closeModal();toast('Challan issued','success');loadChallans();}catch(e){toast(e.message,'error');}}

// ════ DATA ENTRY ACTIONS ════
async function deAddSignal(){const n=document.getElementById('de-sig-name').value.trim();if(!n){toast('Name required','warning');return;}try{const s=await API.post('/signals',{name:n,zone:document.getElementById('de-sig-zone').value,greenTime:+document.getElementById('de-sig-green').value,redTime:+document.getElementById('de-sig-red').value,yellowTime:+document.getElementById('de-sig-yellow').value});toast(`✓ ${s.id} added`,'success');document.getElementById('de-sig-name').value='';}catch(e){toast(e.message,'error');}}
async function deAddIncident(){const l=document.getElementById('de-inc-loc').value.trim();if(!l){toast('Location required','warning');return;}try{const i=await API.post('/incidents',{location:l,type:document.getElementById('de-inc-type').value,severity:document.getElementById('de-inc-sev').value,zone:document.getElementById('de-inc-zone').value,notes:document.getElementById('de-inc-notes').value,vehicles:+document.getElementById('de-inc-vehicles').value,casualties:+document.getElementById('de-inc-casualties').value});toast(`✓ ${i.id} logged`,'success');document.getElementById('de-inc-loc').value='';}catch(e){toast(e.message,'error');}}
async function deAddVehicle(){const p=document.getElementById('de-veh-plate').value.trim().toUpperCase();if(!p){toast('Plate required','warning');return;}try{await API.post('/vehicles',{plate:p,type:document.getElementById('de-veh-type').value,ownerName:document.getElementById('de-veh-owner').value,ownerPhone:document.getElementById('de-veh-phone').value,zone:document.getElementById('de-veh-zone').value,speed:+document.getElementById('de-veh-speed').value,direction:document.getElementById('de-veh-dir').value,status:document.getElementById('de-veh-status').value});toast(`✓ ${p} registered`,'success');document.getElementById('de-veh-plate').value='';}catch(e){toast(e.message,'error');}}
async function deAddRoad(){const n=document.getElementById('de-road-name').value.trim();if(!n){toast('Name required','warning');return;}try{const r=await API.post('/roads',{name:n,zone:document.getElementById('de-road-zone').value,speedLimit:+document.getElementById('de-road-speed').value,length:+document.getElementById('de-road-len').value,lanes:+document.getElementById('de-road-lanes').value,condition:document.getElementById('de-road-cond').value,authority:document.getElementById('de-road-auth').value,congestion:0});toast(`✓ ${r.id} added`,'success');document.getElementById('de-road-name').value='';}catch(e){toast(e.message,'error');}}
async function deIssueChallan(){const p=document.getElementById('de-ch-plate').value.trim().toUpperCase();if(!p){toast('Plate required','warning');return;}try{const c=await API.post('/challans',{vehiclePlate:p,ownerName:document.getElementById('de-ch-owner').value,violation:document.getElementById('de-ch-violation').value,fineAmount:+document.getElementById('de-ch-fine').value,location:document.getElementById('de-ch-loc').value,zone:document.getElementById('de-ch-zone').value,observedSpeed:document.getElementById('de-ch-speed').value,vehicleSeized:document.getElementById('de-ch-seized').value,remarks:document.getElementById('de-ch-remarks').value});toast(`✓ ${c.id} issued for ${p}`,'success');document.getElementById('de-ch-plate').value='';}catch(e){toast(e.message,'error');}}
function deSubmitPatrol(){const n=document.getElementById('de-pt-name').value.trim();if(!n){toast('Name required','warning');return;}toast(`✓ Patrol report by ${n} submitted`,'success');document.getElementById('de-pt-notes').value='';}

// ════ LIVE UPDATES ════
let liveInt=null;
function startLive(){clearInterval(liveInt);liveInt=setInterval(async()=>{try{const sigs=await API.get('/signals');sigs.forEach(s=>{document.querySelectorAll(`.sig-t-${s.id},.sc-t-${s.id}`).forEach(el=>el.textContent=`0:${String(s.timer).padStart(2,'0')}`);const card=document.getElementById('sc-'+s.id);if(card){const dots=card.querySelectorAll('.tl-dot');if(dots.length===3){dots[0].className=`tl-dot ${s.phase==='red'?'tl-r-on':'tl-r-off'}`;dots[1].className=`tl-dot ${s.phase==='yellow'?'tl-y-on':'tl-y-off'}`;dots[2].className=`tl-dot ${s.phase==='green'?'tl-g-on':'tl-g-off'}`;}const sigMini=card.querySelector('.sig-mini-timer');if(sigMini)sigMini.textContent=`0:${String(s.timer).padStart(2,'0')}`;}});updateMapSigs(sigs);}catch(e){}},1500);setInterval(()=>{const ap=document.querySelector('.page.active');if(ap?.id==='page-dashboard')initDash();},9000);}
function destroyCharts(){[volCh,bigCh,cngCh].forEach(c=>{try{c?.destroy();}catch(e){}});volCh=bigCh=cngCh=null;}
let bigCh=null,cngCh=null;

// ════ PUBLIC PORTAL ════
function buildPublicPortal(){
  const pages=['pub-home','pub-alerts','pub-report','pub-map','pub-rules'];
  const labels=['Home','Live Alerts','Report Issue','Traffic Map','Road Rules'];
  const nav=document.getElementById('topNav');
  nav.innerHTML=pages.map((p,i)=>`<button class="nav-btn${i===0?' active':''} pub-mode" onclick="pubNav('${p}',this)">${labels[i]}</button>`).join('');
  document.getElementById('sidebar').innerHTML=`
    <div class="role-info pub">
      <div class="role-name">${currentUser.name}</div>
      <div class="role-sub">Citizen Portal</div>
    </div>
    <div class="sb-section">Menu</div>
    <div class="sb-item active pub-mode" onclick="pubNav('pub-home',null,this)"><span class="sb-icon">🏠</span>Home</div>
    <div class="sb-item pub-mode" onclick="pubNav('pub-alerts',null,this)"><span class="sb-icon">🚨</span>Live Alerts<span class="sb-badge red" id="pub-badge">0</span></div>
    <div class="sb-item pub-mode" onclick="pubNav('pub-report',null,this)"><span class="sb-icon">📝</span>Report Issue</div>
    <div class="sb-item pub-mode" onclick="pubNav('pub-map',null,this)"><span class="sb-icon">🗺️</span>Traffic Map</div>
    <div class="sb-item pub-mode" onclick="pubNav('pub-rules',null,this)"><span class="sb-icon">📜</span>Road Rules</div>
    <div class="sb-divider"></div>
    <div class="sb-item pub-mode" onclick="pubNav('pub-mine',null,this)"><span class="sb-icon">📋</span>My Reports<span class="sb-badge blue" id="pub-mine-badge">0</span></div>
  `;
  document.getElementById('mainContent').innerHTML=`
    <div class="page active" id="page-pub-home">${pubHomeHTML()}</div>
    <div class="page" id="page-pub-alerts">${pubAlertsHTML()}</div>
    <div class="page" id="page-pub-report">${pubReportHTML()}</div>
    <div class="page" id="page-pub-map">${pubMapHTML()}</div>
    <div class="page" id="page-pub-rules">${pubRulesHTML()}</div>
    <div class="page" id="page-pub-mine">${pubMineHTML()}</div>
  `;
  initPubHome();
}
function pubNav(page,tabEl,sbEl){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+page)?.classList.add('active');
  if(tabEl){tabEl.classList.add('active');}
  if(sbEl)sbEl.classList.add('active','pub-mode');
  if(page==='pub-alerts')loadPubAlerts();
  if(page==='pub-map'){buildMap();loadPubMap();}
  if(page==='pub-mine')loadMine();
  if(page==='pub-rules')loadPubRules();
}
function pubHomeHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Citizen</span> Traffic Portal</div></div>
<div class="kpi-strip">
  <div class="kpi" style="--kc:var(--teal)"><div class="kpi-icon">🚨</div><div class="kpi-lbl">Active Alerts</div><div class="kpi-val" id="p-kv1">--</div><div class="kpi-trend" id="p-kt1"></div></div>
  <div class="kpi" style="--kc:var(--amber)"><div class="kpi-icon">⚡</div><div class="kpi-lbl">Avg City Speed</div><div class="kpi-val" id="p-kv2">--<sup> km/h</sup></div><div class="kpi-trend" id="p-kt2"></div></div>
  <div class="kpi" style="--kc:var(--blue)"><div class="kpi-icon">🛣️</div><div class="kpi-lbl">Congestion Index</div><div class="kpi-val" id="p-kv3">--%</div><div class="kpi-trend" id="p-kt3"></div></div>
  <div class="kpi" style="--kc:var(--green)"><div class="kpi-icon">🚦</div><div class="kpi-lbl">Signals Online</div><div class="kpi-val" id="p-kv4">--</div><div class="kpi-trend" style="color:var(--green)">System OK</div></div>
</div>
<div class="g2 gap16">
  <div class="card"><div class="card-hdr"><div class="card-title">📍 Active Incidents</div></div><div style="padding:14px" id="p-inc-list"></div></div>
  <div class="card"><div class="card-hdr"><div class="card-title">📊 Zone Congestion</div></div><div style="padding:16px" id="p-cong"></div></div>
</div>
<div class="card gap16" style="margin-top:16px;">
  <div class="card-hdr"><div class="card-title">ℹ️ Traffic Advisory</div></div>
  <div style="padding:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
    <div style="background:var(--red-lt);border:1px solid #fecaca;border-radius:10px;padding:14px;"><div style="font-size:20px;margin-bottom:8px">🔴</div><div style="font-size:13px;font-weight:700;margin-bottom:4px">High Congestion</div><div style="font-size:12px;color:var(--text2)">Avoid Beta Zone 8–10 AM and 5–8 PM</div></div>
    <div style="background:var(--amber-lt);border:1px solid #fde68a;border-radius:10px;padding:14px;"><div style="font-size:20px;margin-bottom:8px">🚧</div><div style="font-size:13px;font-weight:700;margin-bottom:4px">Road Closure</div><div style="font-size:12px;color:var(--text2)">Baner Bridge closed. Use Aundh alternate.</div></div>
    <div style="background:var(--blue-lt);border:1px solid var(--blue-mid);border-radius:10px;padding:14px;"><div style="font-size:20px;margin-bottom:8px">📱</div><div style="font-size:13px;font-weight:700;margin-bottom:4px">Report Issues</div><div style="font-size:12px;color:var(--text2)">Officers respond within 30 minutes.</div></div>
  </div>
</div>
`;}
function pubAlertsHTML(){return`<div class="pg-hdr"><div class="pg-title"><span>Live</span> Alerts</div></div><div id="p-alerts-grid" class="g2"></div>`;}
function pubReportHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Report</span> an Issue</div></div>
<div style="max-width:560px;">
  <div class="card">
    <div class="card-hdr"><div class="card-title">📝 Submit Traffic Report</div></div>
    <div class="card-body">
      <div class="form-note" style="margin-bottom:16px;">Your report goes directly to the traffic control center. Response time: ~30 minutes.</div>
      <div class="form-section">
        <div class="form-group"><label class="form-label">Location / Landmark <span class="req">*</span></label><input class="form-control" id="p-r-loc" placeholder="e.g. Near Deccan Bus Stand, FC Road"/></div>
        <div class="form-row-2">
          <div class="form-group"><label class="form-label">Issue Type</label><select class="form-control" id="p-r-type"><option>Accident</option><option>Traffic Jam</option><option>Signal Not Working</option><option>Road Damage</option><option>Illegal Parking</option><option>Flooding</option><option>Other</option></select></div>
          <div class="form-group"><label class="form-label">Urgency</label><select class="form-control" id="p-r-urg"><option value="Critical">🔴 Emergency</option><option value="Moderate">🟡 Moderate</option><option value="Low" selected>🟢 Low</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">Description <span class="req">*</span></label><textarea class="form-control" id="p-r-desc" placeholder="Describe the issue in detail..."></textarea></div>
        <div style="font-size:12px;color:var(--text2);background:var(--teal-lt);padding:8px 12px;border-radius:8px;border-left:3px solid var(--teal)">Reporting as: <strong>${currentUser?.name}</strong></div>
        <button class="btn btn-teal btn-full" onclick="submitReport()">📤 Submit Report</button>
      </div>
    </div>
  </div>
</div>
`;}
function pubMapHTML(){return`
<div class="pg-hdr"><div class="pg-title"><span>Traffic</span> Map</div></div>
<div class="card">
  <div class="card-hdr"><div class="card-title">📍 Live City Map</div><span class="bdg bdg-green">● Real-Time</span></div>
  <div class="map-wrap"><svg id="cityMap" viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg"></svg><div id="mapTT" class="map-tt"><div class="map-tt-name" id="ttN"></div><div id="ttP"></div><div id="ttT" style="font-family:var(--mono);font-size:15px"></div><div id="ttV" style="font-size:11px;color:var(--text2)"></div></div><div class="map-zoom"><button class="zoom-btn" onclick="mapZoom(1.2)">+</button><button class="zoom-btn" onclick="mapZoom(0.83)">−</button></div></div>
</div>
<div class="g2" style="margin-top:16px;">
  <div class="card"><div class="card-hdr"><div class="card-title">🚦 Signal Status</div></div><div style="padding:12px" id="p-sig-list"></div></div>
  <div class="card"><div class="card-hdr"><div class="card-title">📊 Congestion</div></div><div style="padding:14px" id="p-cong-map"></div></div>
</div>
`;}
function pubRulesHTML(){return`<div class="pg-hdr"><div class="pg-title"><span>Road</span> Rules & Fines</div></div><div class="card"><div class="tbl-wrap"><table class="tbl" id="p-rules-table"></table></div></div>`;}
function pubMineHTML(){return`<div class="pg-hdr"><div class="pg-title"><span>My</span> Reports</div></div><div class="card"><div class="tbl-wrap"><table class="tbl" id="p-mine-tbl"></table></div></div>`;}

async function initPubHome(){
  try{const ov=await API.get('/analytics/overview');
    document.getElementById('p-kv1').textContent=ov.activeIncidents;document.getElementById('p-kt1').innerHTML=`<span style="color:var(--red)">${ov.criticalIncidents} critical</span>`;
    document.getElementById('p-kv2').innerHTML=ov.avgSpeed+'<sup> km/h</sup>';
    document.getElementById('p-kv3').textContent=ov.congestionIndex+'%';document.getElementById('p-kt3').textContent=ov.congestionIndex>70?'High':ov.congestionIndex>50?'Moderate':'Low';
    document.getElementById('p-kv4').innerHTML=ov.signalsOnline+'<sup>/'+ov.totalSignals+'</sup>';
    const pb=document.getElementById('pub-badge');if(pb)pb.textContent=ov.activeIncidents;
    const pc=document.getElementById('p-cong');if(pc)pc.innerHTML=Object.entries(ov.zones).map(([z,p])=>{const col=p>75?'var(--red)':p>55?'var(--amber)':'var(--green)';return `<div class="bar-row"><div class="bar-label">Zone ${z}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${col}"></div></div><div class="bar-pct">${p}%</div></div>`;}).join('');
  }catch(e){}
  try{const incs=await API.get('/incidents?status=active');const el=document.getElementById('p-inc-list');if(el)el.innerHTML=incs.slice(0,4).map(i=>`<div class="alert-card" style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><div><div style="font-weight:600">${i.type}</div><div style="font-size:11px;color:var(--text2);margin-top:2px">📍 ${i.location}</div></div><span class="bdg ${i.severity==='Critical'?'bdg-red':'bdg-amber'}">● ${i.severity}</span></div><div style="font-size:12px;color:var(--text2)">${i.notes||''}</div><div style="font-size:11px;color:var(--muted);margin-top:6px">${i.time}</div></div>`).join('');}catch(e){}
}
async function loadPubAlerts(){try{const incs=await API.get('/incidents?status=active');const el=document.getElementById('p-alerts-grid');if(!el)return;el.innerHTML=incs.map(i=>`<div class="alert-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><div><div style="font-size:14px;font-weight:600">${i.type}</div><div style="font-size:11px;color:var(--text2)">📍 ${i.location}</div></div><span class="bdg ${i.severity==='Critical'?'bdg-red':i.severity==='Moderate'?'bdg-amber':'bdg-green'}">● ${i.severity}</span></div><div style="font-size:12px;color:var(--text2);margin-bottom:8px">${i.notes||'No details.'}</div><div style="display:flex;justify-content:space-between"><span class="bdg bdg-blue">Zone ${i.zone}</span><span style="font-size:11px;color:var(--muted)">${i.time}</span></div></div>`).join('');}catch(e){}}
async function loadPubMap(){try{const sigs=await API.get('/signals');updateMapSigs(sigs);const sl=document.getElementById('p-sig-list');if(sl)sl.innerHTML=sigs.map(s=>`<div class="sig-mini"><div class="sig-lights-col"><div class="s-dot s-r ${s.phase==='red'?'on':''}"></div><div class="s-dot s-y ${s.phase==='yellow'?'on':''}"></div><div class="s-dot s-g ${s.phase==='green'?'on':''}"></div></div><div class="sig-mini-info"><div class="sig-mini-id">${s.id}</div><div class="sig-mini-name">${s.name}</div></div><span class="bdg ${s.phase==='green'?'bdg-green':s.phase==='yellow'?'bdg-amber':'bdg-red'}">${s.phase}</span></div>`).join('');const cov=await API.get('/analytics/congestion');const cm=document.getElementById('p-cong-map');if(cm)cm.innerHTML=Object.entries(cov).map(([z,p])=>{const col=p>75?'var(--red)':p>55?'var(--amber)':'var(--green)';return `<div class="bar-row"><div class="bar-label">Zone ${z}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${col}"></div></div><div class="bar-pct">${p}%</div></div>`;}).join('');}catch(e){}}
async function loadPubRules(){try{const rules=await API.get('/rules');const t=document.getElementById('p-rules-table');if(!t)return;t.innerHTML=`<thead><tr><th>Rule</th><th>Category</th><th>Penalty</th><th>Demerit Points</th><th>Section</th></tr></thead><tbody>`+rules.filter(r=>r.status==='Active').map(r=>`<tr><td style="font-weight:500">${r.title}</td><td><span class="bdg bdg-teal">${r.category}</span></td><td style="color:var(--amber);font-weight:600">${r.penalty}</td><td style="text-align:center;font-weight:600">${r.points}</td><td style="font-family:var(--mono);font-size:11px">${r.section}</td></tr>`).join('')+'</tbody>';}catch(e){}}
async function submitReport(){const loc=document.getElementById('p-r-loc').value.trim();const desc=document.getElementById('p-r-desc').value.trim();if(!loc||!desc){toast('Location and description required','warning');return;}try{await API.post('/public/report',{location:loc,description:desc,type:document.getElementById('p-r-type').value,severity:document.getElementById('p-r-urg').value});toast('✓ Report submitted. Officers notified.','success');document.getElementById('p-r-loc').value='';document.getElementById('p-r-desc').value='';loadMine();}catch(e){toast(e.message,'error');}}
async function loadMine(){try{const incs=await API.get('/incidents');const mine=incs.filter(i=>i.reportedBy===currentUser.id);const b=document.getElementById('pub-mine-badge');if(b)b.textContent=mine.length;const t=document.getElementById('p-mine-tbl');if(!t)return;t.innerHTML=`<thead><tr><th>ID</th><th>Location</th><th>Type</th><th>Severity</th><th>Time</th><th>Status</th></tr></thead><tbody>`+mine.map(i=>`<tr><td class="tbl-id">${i.id}</td><td>${i.location}</td><td>${i.type}</td><td><span class="bdg ${i.severity==='Critical'?'bdg-red':i.severity==='Moderate'?'bdg-amber':'bdg-green'}">${i.severity}</span></td><td style="font-family:var(--mono)">${i.time}</td><td><span class="bdg ${i.status==='Active'?'bdg-orange':'bdg-green'}">${i.status}</span></td></tr>`).join('')+'</tbody>';}catch(e){}}

// ════ MODAL / TOAST ════
function openModal(title,bodyHTML,buttons=[]){
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalBody').innerHTML=bodyHTML;
  document.getElementById('modalActions').innerHTML=buttons.map(b=>`<button class="${b.c}" onclick="${b.f}">${b.l}</button>`).join('');
  document.getElementById('modalBg').classList.add('open');
}
function closeModal(){document.getElementById('modalBg').classList.remove('open');}
document.getElementById('modalBg').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
function toast(msg,type='info'){
  const icons={success:'✅',warning:'⚠️',error:'❌',info:'ℹ️'};
  const el=document.createElement('div');el.className=`toast ${type}`;
  el.innerHTML=`<span style="font-size:16px">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  document.getElementById('toastWrap').appendChild(el);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),320);},3500);
}
