import { useState, useEffect } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
const G = {
  pending:   { bg:"rgba(249,115,22,0.15)",  border:"rgba(249,115,22,0.40)",  text:"#F97316" },
  preparing: { bg:"rgba(59,130,246,0.15)",  border:"rgba(59,130,246,0.40)",  text:"#3B82F6" },
  ready:     { bg:"rgba(16,185,129,0.15)",  border:"rgba(16,185,129,0.40)",  text:"#10B981" },
  delivered: { bg:"rgba(148,163,184,0.15)", border:"rgba(148,163,184,0.30)", text:"#94A3B8" },
};
const TAB_S = {
  OPEN:      { label:"Abierta",   color:"#10B981", bg:"rgba(16,185,129,.15)",  border:"rgba(16,185,129,.40)"  },
  PENDING:   { label:"Cuenta",    color:"#F97316", bg:"rgba(249,115,22,.15)",  border:"rgba(249,115,22,.40)"  },
  CLOSED:    { label:"Cerrada",   color:"#94A3B8", bg:"rgba(148,163,184,.15)", border:"rgba(148,163,184,.30)" },
  CANCELLED: { label:"Cancelada", color:"#EF4444", bg:"rgba(239,68,68,.15)",   border:"rgba(239,68,68,.40)"   },
};
const FONTS = { display:"'Syne',sans-serif", body:"'Outfit',sans-serif", mono:"'Fira Code',monospace" };
const TAX   = 0.18;

/* ─── MOCK DATA ─────────────────────────────────────────────────── */
const menuItems = [
  {id:"p1",  name:"Pollo a la Brasa",  price:12.5, dest:"Kitchen", category:"Platos",   emoji:"🍗"},
  {id:"p2",  name:"Pasta Carbonara",   price:11.0, dest:"Kitchen", category:"Platos",   emoji:"🍝"},
  {id:"p3",  name:"Pizza Margarita",   price:10.5, dest:"Kitchen", category:"Platos",   emoji:"🍕"},
  {id:"p4",  name:"Ensalada César",    price:8.0,  dest:"Kitchen", category:"Entradas", emoji:"🥗"},
  {id:"p5",  name:"Nachos",            price:7.5,  dest:"Kitchen", category:"Entradas", emoji:"🧀"},
  {id:"p6",  name:"Burger Clásica",    price:13.0, dest:"Kitchen", category:"Platos",   emoji:"🍔"},
  {id:"p7",  name:"Mojito",            price:9.0,  dest:"Bar",     category:"Bebidas",  emoji:"🍹"},
  {id:"p8",  name:"Negroni",           price:11.0, dest:"Bar",     category:"Bebidas",  emoji:"🍸"},
  {id:"p9",  name:"Vino Tinto",        price:8.5,  dest:"Bar",     category:"Bebidas",  emoji:"🍷"},
  {id:"p10", name:"Cerveza Artesanal", price:6.5,  dest:"Bar",     category:"Bebidas",  emoji:"🍺"},
  {id:"p11", name:"Coca-Cola",         price:3.0,  dest:"Bar",     category:"Bebidas",  emoji:"🥤"},
  {id:"p12", name:"Papas Fritas",      price:5.0,  dest:"Kitchen", category:"Entradas", emoji:"🍟"},
];

const INIT_TABLES = [
  {id:"t1",name:"Mesa 1", status:"free",     type:"table"},
  {id:"t2",name:"Mesa 2", status:"occupied", type:"table"},
  {id:"t3",name:"Mesa 3", status:"free",     type:"table"},
  {id:"t4",name:"Mesa 4", status:"occupied", type:"table"},
  {id:"t5",name:"Mesa 5", status:"free",     type:"table"},
  {id:"t6",name:"Mesa 6", status:"free",     type:"table"},
  {id:"t7",name:"Mesa 7", status:"free",     type:"table"},
  {id:"t8",name:"Mesa 8", status:"free",     type:"table"},
  {id:"b1",name:"Barra 1",status:"free",     type:"bar"},
  {id:"b2",name:"Barra 2",status:"occupied", type:"bar"},
];

const INIT_TABS = {
  t2:[
    { id:"TAB-001", location:"Mesa 2", customerName:"Carlos", waiterId:"w1", status:"OPEN", openedAt:"12:30",
      orders:[
        { id:"ORD-001", tabId:"TAB-001", createdAt:"12:30", items:[
          {id:1,name:"Cerveza Artesanal",qty:2,notes:"",        dest:"Bar",     status:"Preparing",price:6.5 },
          {id:2,name:"Pollo a la Brasa", qty:2,notes:"Sin cebolla",dest:"Kitchen",status:"Ready",   price:12.5},
        ]},
        { id:"ORD-002", tabId:"TAB-001", createdAt:"13:15", items:[
          {id:3,name:"Cerveza Artesanal",qty:2,notes:"",dest:"Bar",status:"Pending",price:6.5},
        ]},
      ]},
    { id:"TAB-002", location:"Mesa 2", customerName:"María", waiterId:"w1", status:"PENDING", openedAt:"12:45",
      orders:[
        { id:"ORD-003", tabId:"TAB-002", createdAt:"12:45", items:[
          {id:4,name:"Vino Tinto",       qty:1,notes:"",dest:"Bar",    status:"Delivered",price:8.5 },
          {id:5,name:"Pasta Carbonara",  qty:1,notes:"",dest:"Kitchen",status:"Delivered",price:11.0},
        ]},
      ]},
  ],
  t4:[
    { id:"TAB-003", location:"Mesa 4", customerName:"Pedro", waiterId:"w2", status:"OPEN", openedAt:"13:00",
      orders:[
        { id:"ORD-004", tabId:"TAB-003", createdAt:"13:00", items:[
          {id:6,name:"Pizza Margarita",qty:1,notes:"Masa delgada",dest:"Kitchen",status:"Preparing",price:10.5},
          {id:7,name:"Negroni",        qty:2,notes:"Hielo cubo",  dest:"Bar",    status:"Ready",    price:11.0},
        ]},
      ]},
  ],
  b2:[
    { id:"TAB-004", location:"Barra 2", customerName:"Luis", waiterId:"w1", status:"OPEN", openedAt:"12:38",
      orders:[
        { id:"ORD-005", tabId:"TAB-004", createdAt:"12:38", items:[
          {id:8,name:"Cerveza Artesanal",qty:2,notes:"",dest:"Bar",status:"Delivered",price:6.5},
        ]},
        { id:"ORD-006", tabId:"TAB-004", createdAt:"13:10", items:[
          {id:9,name:"Cerveza Artesanal",qty:2,notes:"",dest:"Bar",status:"Preparing",price:6.5},
        ]},
      ]},
    { id:"TAB-005", location:"Barra 2", customerName:"Ana", waiterId:"w1", status:"OPEN", openedAt:"13:05",
      orders:[
        { id:"ORD-007", tabId:"TAB-005", createdAt:"13:05", items:[
          {id:10,name:"Mojito",qty:2,notes:"Extra menta",dest:"Bar",status:"Preparing",price:9.0},
        ]},
      ]},
  ],
};

const mockOrders = [
  {id:"ORD-001",table:"Mesa 2",waiter:"Carlos",type:"Table",createdAt:"12:34",status:"InProgress",elapsed:8,
   items:[{id:1,name:"Pollo a la Brasa",qty:2,notes:"Sin cebolla",dest:"Kitchen",status:"Preparing"},{id:2,name:"Ensalada César",qty:1,notes:"",dest:"Kitchen",status:"Ready"},{id:3,name:"Mojito",qty:2,notes:"Extra menta",dest:"Bar",status:"Pending"},{id:4,name:"Cerveza Artesanal",qty:1,notes:"",dest:"Bar",status:"Preparing"}]},
  {id:"ORD-002",table:"Mesa 4",waiter:"María",type:"Table",createdAt:"12:41",status:"Pending",elapsed:2,
   items:[{id:5,name:"Pasta Carbonara",qty:1,notes:"",dest:"Kitchen",status:"Pending"},{id:6,name:"Pizza Margarita",qty:1,notes:"Masa delgada",dest:"Kitchen",status:"Pending"},{id:7,name:"Vino Tinto",qty:1,notes:"",dest:"Bar",status:"Pending"}]},
  {id:"ORD-003",table:"Barra 2",waiter:"Luis",type:"Bar",createdAt:"12:38",status:"InProgress",elapsed:5,
   items:[{id:8,name:"Negroni",qty:1,notes:"Hielo cubo",dest:"Bar",status:"Preparing"},{id:9,name:"Nachos",qty:1,notes:"",dest:"Kitchen",status:"Ready"}]},
];

/* ─── CSS ───────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:linear-gradient(135deg,#0a0f1e 0%,#14082e 40%,#071a30 70%,#0a0f1e 100%);min-height:100vh;font-family:'Outfit',sans-serif;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:99px;}
  @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.5);}}
  @keyframes float-in{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes success-pop{0%{transform:scale(.7);opacity:0;}60%{transform:scale(1.1);}100%{transform:scale(1);opacity:1;}}
  @keyframes modal-in{from{opacity:0;transform:translateY(20px) scale(.97);}to{opacity:1;transform:translateY(0) scale(1);}}
  @keyframes overlay-in{from{opacity:0;}to{opacity:1;}}
  @keyframes slide-up{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .gc{background:rgba(255,255,255,.09);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.18);border-radius:20px;transition:all .22s ease;}
  .gc:hover{background:rgba(255,255,255,.13);border-color:rgba(255,255,255,.28);transform:translateY(-2px);box-shadow:0 20px 40px rgba(0,0,0,.28);}
  .nav-glass{background:rgba(10,15,30,.70);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);border-bottom:1px solid rgba(255,255,255,.10);}
  .nb{background:transparent;border:none;cursor:pointer;border-radius:11px;padding:7px 17px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;color:rgba(255,255,255,.50);display:flex;align-items:center;gap:7px;transition:all .18s;}
  .nb:hover{background:rgba(255,255,255,.09);color:rgba(255,255,255,.85);}
  .nb.on{background:rgba(255,255,255,.15);color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.22);}
  .pill{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);border-radius:99px;padding:5px 15px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;color:rgba(255,255,255,.60);cursor:pointer;transition:all .18s;}
  .pill:hover,.pill.on{background:rgba(255,255,255,.20);color:#fff;border-color:rgba(255,255,255,.32);}
  .mi{background:rgba(255,255,255,.07);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:16px;cursor:pointer;transition:all .20s;animation:float-in .35s ease both;}
  .mi:hover{background:rgba(255,255,255,.13);border-color:rgba(255,255,255,.28);transform:translateY(-3px);box-shadow:0 16px 32px rgba(0,0,0,.28);}
  .mi.sel{border-color:rgba(59,130,246,.55);box-shadow:0 0 0 1px rgba(59,130,246,.22),0 8px 24px rgba(59,130,246,.16);}
  .oc{background:rgba(255,255,255,.08);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.15);border-radius:20px;overflow:hidden;transition:all .22s;animation:float-in .4s ease both;}
  .oc.urgent{border-color:rgba(239,68,68,.50);box-shadow:0 0 0 1px rgba(239,68,68,.14),0 8px 32px rgba(239,68,68,.12);}
  .oc.done{border-color:rgba(16,185,129,.42);box-shadow:0 0 0 1px rgba(16,185,129,.10),0 8px 24px rgba(16,185,129,.10);}
  .abtn{border:none;border-radius:10px;padding:8px 0;width:100%;font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s;letter-spacing:.3px;}
  input,textarea{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.18);border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;outline:none;transition:border .18s;}
  input:focus,textarea:focus{border-color:rgba(59,130,246,.58);background:rgba(255,255,255,.13);}
  input::placeholder,textarea::placeholder{color:rgba(255,255,255,.32);}
`;

/* ─── HELPERS ───────────────────────────────────────────────────── */
function calcTabTotal(tab) {
  return tab.orders.reduce((s,o)=>s+o.items.reduce((ss,i)=>ss+i.price*i.qty,0),0);
}
function getTableState(table, tabs=[]) {
  if (table.status==="free") return "free";
  if (tabs.every(t=>t.status==="PENDING")) return "pending";
  return "occupied";
}

/* ─── BACKGROUND ────────────────────────────────────────────────── */
function Background() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#0a0f1e 0%,#14082e 42%,#071a30 72%,#0a0f1e 100%)"}}/>
      <div style={{position:"absolute",width:750,height:750,borderRadius:"50%",top:"-18%",left:"-12%",background:"radial-gradient(circle,rgba(99,179,237,.24) 0%,transparent 65%)",filter:"blur(48px)"}}/>
      <div style={{position:"absolute",width:650,height:650,borderRadius:"50%",top:"-12%",right:"-8%",background:"radial-gradient(circle,rgba(139,92,246,.22) 0%,transparent 65%)",filter:"blur(44px)"}}/>
      <div style={{position:"absolute",width:550,height:550,borderRadius:"50%",bottom:"2%",left:"28%",background:"radial-gradient(circle,rgba(16,185,129,.18) 0%,transparent 65%)",filter:"blur(52px)"}}/>
      <div style={{position:"absolute",width:420,height:420,borderRadius:"50%",bottom:"-6%",right:"8%",background:"radial-gradient(circle,rgba(249,115,22,.15) 0%,transparent 60%)",filter:"blur(42px)"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)",backgroundSize:"64px 64px",opacity:.7}}/>
    </div>
  );
}

/* ─── ATOMS ─────────────────────────────────────────────────────── */
function Badge({status}) {
  const key = status.toLowerCase();
  const s = G[key] || {bg:"rgba(255,255,255,.1)",border:"rgba(255,255,255,.2)",text:"#fff"};
  const lbl = {Pending:"Pendiente",Preparing:"Preparando",Ready:"Listo ✓",Delivered:"Entregado",InProgress:"En curso"};
  return <span style={{background:s.bg,border:`1px solid ${s.border}`,color:s.text,borderRadius:99,padding:"2px 10px",fontSize:10,fontWeight:700,fontFamily:FONTS.body,letterSpacing:.4,whiteSpace:"nowrap"}}>{lbl[status]||status}</span>;
}
function TabBadge({status}) {
  const s = TAB_S[status]||TAB_S.OPEN;
  return <span style={{background:s.bg,border:`1px solid ${s.border}`,color:s.color,borderRadius:99,padding:"2px 10px",fontSize:10,fontWeight:700,fontFamily:FONTS.body,letterSpacing:.4,whiteSpace:"nowrap"}}>{s.label}</span>;
}
function DestTag({dest}) {
  const isBar=dest==="Bar";
  return <span style={{background:isBar?"rgba(139,92,246,.20)":"rgba(16,185,129,.18)",color:isBar?"#A78BFA":"#34D399",border:`1px solid ${isBar?"rgba(139,92,246,.35)":"rgba(16,185,129,.35)"}`,borderRadius:6,padding:"1px 8px",fontSize:10,fontWeight:700,letterSpacing:.6,textTransform:"uppercase"}}>{isBar?"🍹 Bar":"🍳 Cocina"}</span>;
}

/* ─── TOP BAR ───────────────────────────────────────────────────── */
function TopBar({view,setView}) {
  const tabs=[{id:"waiter",icon:"🧾",label:"Mesero"},{id:"kitchen",icon:"🍳",label:"Cocina"},{id:"bar",icon:"🍹",label:"Barra"},{id:"overview",icon:"📊",label:"Resumen"}];
  return (
    <div className="nav-glass" style={{position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 28px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:33,height:33,borderRadius:10,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(59,130,246,.42)"}}>
            <svg width="16" height="16" viewBox="0 0 200 200" fill="none">
              <path d="M88 165 C75 145,65 125,80 108 C95 91,115 88,112 70 C109 52,92 44,100 30" stroke="#fff" strokeWidth="14" strokeLinecap="round"/>
              <path d="M85 120 C70 112,58 105,52 92 C46 79,55 68,50 58" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity=".85"/>
              <path d="M105 90 C118 80,130 75,138 62" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity=".75"/>
              <circle cx="100" cy="30" r="9" fill="#fff"/>
              <circle cx="80"  cy="108" r="7" fill="#fff" opacity=".9"/>
            </svg>
          </div>
          <span style={{fontFamily:FONTS.display,fontSize:20,fontWeight:800,color:"#fff",letterSpacing:-.5}}>Bohuco<span style={{color:"rgba(255,255,255,.38)",fontWeight:600}}>POS</span></span>
          <span style={{width:1,height:18,background:"rgba(255,255,255,.14)",margin:"0 6px"}}/>
          <span style={{fontSize:11,color:"rgba(255,255,255,.32)",letterSpacing:1.5,textTransform:"uppercase",fontWeight:500}}>Comandas</span>
        </div>
        <div style={{display:"flex",gap:4,background:"rgba(0,0,0,.25)",borderRadius:14,padding:4}}>
          {tabs.map(t=><button key={t.id} className={`nb${view===t.id?" on":""}`} onClick={()=>setView(t.id)}><span>{t.icon}</span>{t.label}</button>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#10B981",animation:"pulse-dot 2s infinite",boxShadow:"0 0 8px #10B981"}}/>
          <span style={{fontSize:12,color:"rgba(255,255,255,.38)",fontWeight:500}}>SignalR live</span>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL: ABRIR CUENTA ───────────────────────────────────────── */
function OpenTabModal({table, onConfirm, onClose}) {
  const [name, setName] = useState("");
  const isBar = table.type==="bar";
  const ok = isBar ? name.trim().length>0 : true;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",animation:"overlay-in .2s ease both"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"rgba(14,20,46,.97)",border:"1px solid rgba(255,255,255,.18)",borderRadius:24,padding:32,width:360,boxShadow:"0 40px 80px rgba(0,0,0,.60)",animation:"modal-in .25s ease both"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(59,130,246,.15)",border:"1px solid rgba(59,130,246,.30)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
            {isBar?"🪑":"🍽️"}
          </div>
          <div>
            <div style={{fontFamily:FONTS.display,fontSize:20,fontWeight:800,color:"#fff",marginBottom:2}}>{table.name}</div>
            <div style={{fontFamily:FONTS.body,fontSize:13,color:"rgba(255,255,255,.42)"}}>Abrir nueva cuenta</div>
          </div>
        </div>
        {/* Input */}
        <div style={{marginBottom:24}}>
          <label style={{display:"block",fontFamily:FONTS.body,fontSize:12,fontWeight:600,color:"rgba(255,255,255,.55)",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>
            Nombre del cliente {isBar&&<span style={{color:"#F97316",textTransform:"none",letterSpacing:0,fontWeight:400}}> *requerido</span>}
          </label>
          <input autoFocus value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&ok)onConfirm(name.trim()||"Cliente");if(e.key==="Escape")onClose();}}
            placeholder={isBar?"ej: Luis, Ana...":"ej: Juan (opcional)"}
            style={{width:"100%",padding:"13px 16px",fontSize:15}}/>
          {isBar&&!name.trim()&&<p style={{marginTop:8,fontFamily:FONTS.body,fontSize:12,color:"rgba(249,115,22,.70)",lineHeight:1.5}}>En barra es obligatorio para separar cuentas.</p>}
        </div>
        {/* Buttons */}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:12,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,cursor:"pointer",color:"rgba(255,255,255,.60)",fontFamily:FONTS.body,fontSize:14,fontWeight:500,transition:"all .18s"}}>
            Cancelar
          </button>
          <button onClick={()=>ok&&onConfirm(name.trim()||"Cliente")} disabled={!ok}
            style={{flex:1.4,padding:12,border:"none",borderRadius:10,cursor:ok?"pointer":"not-allowed",color:"#fff",fontFamily:FONTS.body,fontSize:14,fontWeight:700,background:ok?"linear-gradient(135deg,#3B82F6,#8B5CF6)":"rgba(255,255,255,.08)",opacity:ok?1:.5,boxShadow:ok?"0 8px 24px rgba(59,130,246,.35)":"none",transition:"all .18s"}}>
            Abrir Cuenta →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL: LISTA DE TABS ──────────────────────────────────────── */
function TabsModal({table, tabs, onViewTab, onNewTab, onClose}) {
  const totalAll = tabs.reduce((s,t)=>s+calcTabTotal(t),0);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",animation:"overlay-in .2s ease both"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"rgba(14,20,46,.97)",border:"1px solid rgba(255,255,255,.18)",borderRadius:24,width:460,maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 40px 80px rgba(0,0,0,.60)",animation:"modal-in .25s ease both",overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"26px 28px 18px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{fontFamily:FONTS.display,fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>{table.type==="bar"?"🪑":"🍽️"} {table.name}</div>
            <div style={{fontFamily:FONTS.body,fontSize:13,color:"rgba(255,255,255,.42)"}}>{tabs.length} cuenta{tabs.length!==1?"s":""} activa{tabs.length!==1?"s":""}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:8,width:30,height:30,cursor:"pointer",color:"rgba(255,255,255,.55)",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* Tabs list */}
        <div style={{flex:1,overflowY:"auto",padding:"14px 28px",display:"flex",flexDirection:"column",gap:10}}>
          {tabs.map((tab,i)=>{
            const s = TAB_S[tab.status]||TAB_S.OPEN;
            const total = calcTabTotal(tab);
            const itemCount = tab.orders.reduce((s,o)=>s+o.items.length,0);
            return (
              <div key={tab.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:16,padding:"13px 16px",gap:12,animation:`slide-up .3s ease ${i*.06}s both`,transition:"all .18s",cursor:"default"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONTS.display,fontSize:15,fontWeight:800,color:"#fff",flexShrink:0,boxShadow:"0 4px 12px rgba(59,130,246,.35)"}}>
                    {tab.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontFamily:FONTS.body,fontSize:15,fontWeight:600,color:"rgba(255,255,255,.90)",marginBottom:2}}>{tab.customerName}</div>
                    <div style={{fontFamily:FONTS.body,fontSize:11,color:"rgba(255,255,255,.38)"}}>Abierta {tab.openedAt} · {itemCount} ítem{itemCount!==1?"s":""}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <TabBadge status={tab.status}/>
                  <span style={{fontFamily:FONTS.mono,fontSize:15,fontWeight:700,color:"#fff",minWidth:64,textAlign:"right"}}>${total.toFixed(2)}</span>
                  <button onClick={()=>onViewTab(tab)} style={{background:"rgba(59,130,246,.15)",border:"1px solid rgba(59,130,246,.35)",borderRadius:10,padding:"6px 14px",cursor:"pointer",color:"#60A5FA",fontFamily:FONTS.body,fontSize:12,fontWeight:600,transition:"all .18s",whiteSpace:"nowrap"}}>
                    Ver →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Footer */}
        <div style={{padding:"16px 28px",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div>
            <div style={{fontFamily:FONTS.body,fontSize:11,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>Total acumulado</div>
            <div style={{fontFamily:FONTS.mono,fontSize:22,fontWeight:700,color:"#fff"}}>${totalAll.toFixed(2)}</div>
          </div>
          <button onClick={onNewTab} style={{background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",border:"none",borderRadius:12,padding:"11px 20px",cursor:"pointer",color:"#fff",fontFamily:FONTS.body,fontSize:14,fontWeight:700,boxShadow:"0 8px 24px rgba(59,130,246,.35)",whiteSpace:"nowrap",transition:"all .18s"}}>
            + Nueva cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL: DETALLE DE TAB ─────────────────────────────────────── */
function TabDetailModal({tab, table, onClose, onBack, onAddOrder}) {
  const s = TAB_S[tab.status]||TAB_S.OPEN;
  const subtotal = calcTabTotal(tab);
  const tax = subtotal * TAX;
  const total = subtotal + tax;
  const isOpen = tab.status==="OPEN";
  const isPending = tab.status==="PENDING";

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.70)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",animation:"overlay-in .2s ease both"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"rgba(14,20,46,.97)",border:"1px solid rgba(255,255,255,.18)",borderRadius:24,width:520,maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 40px 80px rgba(0,0,0,.65)",animation:"modal-in .25s ease both",overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,.08)",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14,minWidth:0}}>
            <button onClick={onBack} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:8,width:30,height:30,cursor:"pointer",color:"rgba(255,255,255,.55)",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
            <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONTS.display,fontSize:18,fontWeight:800,color:"#fff",flexShrink:0,boxShadow:"0 4px 14px rgba(59,130,246,.40)"}}>
              {tab.customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{fontFamily:FONTS.display,fontSize:19,fontWeight:800,color:"#fff",marginBottom:3}}>{tab.customerName}</div>
              <div style={{fontFamily:FONTS.body,fontSize:12,color:"rgba(255,255,255,.38)"}}>{table.name} · Abierta {tab.openedAt}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <TabBadge status={tab.status}/>
            <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:8,width:30,height:30,cursor:"pointer",color:"rgba(255,255,255,.55)",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
        </div>

        {/* Orders */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 28px",display:"flex",flexDirection:"column",gap:12}}>
          {tab.orders.length===0?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"40px 0",color:"rgba(255,255,255,.28)",fontFamily:FONTS.body,fontSize:13}}>
              <span style={{fontSize:32}}>🧾</span>Sin órdenes aún
            </div>
          ):tab.orders.map((order,i)=>{
            const oTotal = order.items.reduce((s,it)=>s+it.price*it.qty,0);
            return (
              <div key={order.id} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,overflow:"hidden",animation:`slide-up .3s ease ${i*.06}s both`}}>
                {/* Order header */}
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(255,255,255,.04)",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                  <span style={{fontFamily:FONTS.mono,fontSize:11,fontWeight:600,color:"#60A5FA",flex:1}}>{order.id}</span>
                  <span style={{fontFamily:FONTS.body,fontSize:11,color:"rgba(255,255,255,.38)"}}>{order.createdAt}</span>
                  <span style={{fontFamily:FONTS.mono,fontSize:12,fontWeight:700,color:"rgba(255,255,255,.65)"}}>${oTotal.toFixed(2)}</span>
                </div>
                {/* Items */}
                <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:8}}>
                  {order.items.map(item=>(
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:600,color:"rgba(255,255,255,.55)",minWidth:24}}>×{item.qty}</span>
                      <span style={{fontFamily:FONTS.body,fontSize:14,fontWeight:500,color:"rgba(255,255,255,.90)",flex:1,minWidth:120}}>{item.name}</span>
                      <DestTag dest={item.dest}/>
                      <span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:600,color:"#60A5FA",marginLeft:"auto"}}>${(item.price*item.qty).toFixed(2)}</span>
                      {item.notes&&<div style={{fontFamily:FONTS.body,fontSize:11,color:"rgba(255,255,255,.38)",fontStyle:"italic",flexBasis:"100%",paddingLeft:32}}>📝 {item.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div style={{padding:"14px 28px",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",flexDirection:"column",gap:7}}>
          {[["Subtotal",subtotal],["ITBIS (18%)",tax]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:FONTS.body,fontSize:13,color:"rgba(255,255,255,.45)"}}>{l}</span>
              <span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:600,color:"rgba(255,255,255,.65)"}}>${v.toFixed(2)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.08)"}}>
            <span style={{fontFamily:FONTS.display,fontSize:16,fontWeight:800,color:"#fff",letterSpacing:1}}>TOTAL</span>
            <span style={{fontFamily:FONTS.mono,fontSize:26,fontWeight:700,color:"#fff"}}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{padding:"14px 28px",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",gap:10}}>
          {isOpen&&<>
            <button onClick={onAddOrder} style={{flex:1,padding:12,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,cursor:"pointer",color:"rgba(255,255,255,.65)",fontFamily:FONTS.body,fontSize:13,fontWeight:600,transition:"all .18s"}}>+ Agregar Orden</button>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",fontFamily:FONTS.body,fontSize:13,fontWeight:700,background:"linear-gradient(135deg,#F97316,#EA580C)",transition:"all .18s"}}>Pedir Cuenta</button>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",fontFamily:FONTS.body,fontSize:13,fontWeight:700,background:"linear-gradient(135deg,#10B981,#059669)",transition:"all .18s"}}>Cerrar y Cobrar</button>
          </>}
          {isPending&&<>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",fontFamily:FONTS.body,fontSize:13,fontWeight:700,background:"linear-gradient(135deg,#10B981,#059669)"}}>💳 Cobrar Tarjeta</button>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",fontFamily:FONTS.body,fontSize:13,fontWeight:700,background:"linear-gradient(135deg,#64748B,#475569)"}}>💵 Cobrar Efectivo</button>
          </>}
        </div>
      </div>
    </div>
  );
}

/* ─── WAITER VIEW ───────────────────────────────────────────────── */
function WaiterView() {
  const [tables,    setTables]    = useState(INIT_TABLES);
  const [tabsByTbl, setTabsByTbl] = useState(INIT_TABS);
  const [modal,     setModal]     = useState({type:"none"});
  const [step,      setStep]      = useState("tables");
  const [activeTbl, setActiveTbl] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [cart,      setCart]      = useState([]);
  const [cat,       setCat]       = useState("Todos");
  const [noteModal, setNoteModal] = useState(null);
  const [note,      setNote]      = useState("");
  const [sent,      setSent]      = useState(false);

  const cats  = ["Todos",...new Set(menuItems.map(m=>m.category))];
  const items = cat==="Todos"?menuItems:menuItems.filter(m=>m.category===cat);
  const add   = item=>setCart(p=>{const e=p.find(c=>c.id===item.id);return e?p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1,notes:""}];});
  const rem   = id  =>setCart(p=>{const e=p.find(c=>c.id===id);return e?.qty===1?p.filter(c=>c.id!==id):p.map(c=>c.id===id?{...c,qty:c.qty-1}:c);});
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);

  const openTab = (table, customerName) => {
    const newTab = {id:`TAB-${Date.now()}`,location:table.name,customerName,waiterId:"w1",status:"OPEN",openedAt:new Date().toLocaleTimeString("es-DO",{hour:"2-digit",minute:"2-digit"}),orders:[]};
    setTabsByTbl(p=>({...p,[table.id]:[...(p[table.id]||[]),newTab]}));
    setTables(p=>p.map(t=>t.id===table.id?{...t,status:"occupied"}:t));
    setModal({type:"none"});
    setActiveTbl(table);
    setActiveTab(newTab);
    setStep("menu");
  };

  const handleSelectTable = (table) => {
    const tabs = tabsByTbl[table.id]||[];
    if(table.status==="free") { setModal({type:"openTab",table}); }
    else                      { setModal({type:"tabsList",table}); }
  };

  const handleSendOrder = () => {
    if(cart.length===0) return;
    setSent(true);
    setTimeout(()=>{setSent(false);setStep("tables");setCart([]);setActiveTbl(null);setActiveTab(null);},2300);
  };

  // Success screen
  if(sent) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"80vh",gap:20,position:"relative",zIndex:1}}>
      <div style={{width:96,height:96,borderRadius:"50%",background:"rgba(16,185,129,.20)",border:"2px solid rgba(16,185,129,.50)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,animation:"success-pop .5s ease both",boxShadow:"0 0 48px rgba(16,185,129,.32)"}}>✓</div>
      <div style={{fontFamily:FONTS.display,fontSize:32,fontWeight:800,color:"#fff"}}>¡Orden Enviada!</div>
      <div style={{fontFamily:FONTS.body,fontSize:14,color:"rgba(255,255,255,.45)"}}>Notificando cocina y barra en tiempo real...</div>
    </div>
  );

  // Menu + Cart step
  if(step==="menu") return (
    <>
      <div style={{display:"flex",height:"calc(100vh - 58px)",position:"relative",zIndex:1}}>
        {/* Menu panel */}
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <button onClick={()=>setStep("tables")} style={{background:"rgba(255,255,255,.10)",border:"1px solid rgba(255,255,255,.16)",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontSize:12,color:"rgba(255,255,255,.65)",fontFamily:FONTS.body}}>← Volver</button>
            <h2 style={{fontFamily:FONTS.display,fontSize:22,fontWeight:800,color:"#fff"}}>
              {activeTbl?.name}
              {activeTab&&<span style={{fontFamily:FONTS.body,fontSize:14,fontWeight:500,color:"rgba(255,255,255,.45)",marginLeft:10}}>— {activeTab.customerName}</span>}
            </h2>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            {cats.map(c=><button key={c} className={`pill${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {items.map((item,i)=>{
              const ic=cart.find(c=>c.id===item.id);
              return (
                <div key={item.id} className={`mi${ic?" sel":""}`} style={{animationDelay:`${i*.04}s`}} onClick={()=>add(item)}>
                  <div style={{fontSize:32,marginBottom:10}}>{item.emoji}</div>
                  <div style={{fontSize:15,fontWeight:600,color:"rgba(255,255,255,.90)",marginBottom:6}}>{item.name}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:ic?8:0}}>
                    <span style={{fontFamily:FONTS.mono,fontSize:16,fontWeight:600,color:"#60A5FA"}}>${item.price.toFixed(2)}</span>
                    <DestTag dest={item.dest}/>
                  </div>
                  {ic&&<div style={{background:"rgba(59,130,246,.15)",border:"1px solid rgba(59,130,246,.28)",borderRadius:8,padding:"4px 10px",display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:13,color:"rgba(96,165,250,.78)"}}>En orden</span>
                    <span style={{fontFamily:FONTS.mono,fontSize:15,fontWeight:700,color:"#60A5FA"}}>×{ic.qty}</span>
                  </div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart sidebar */}
        <div style={{width:295,background:"rgba(255,255,255,.07)",backdropFilter:"blur(24px)",borderLeft:"1px solid rgba(255,255,255,.10)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,.09)"}}>
            <div style={{fontFamily:FONTS.display,fontSize:17,fontWeight:800,color:"#fff"}}>Orden</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.38)",marginTop:2}}>
              {activeTbl?.name}{activeTab&&` · ${activeTab.customerName}`}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"13px 15px"}}>
            {cart.length===0?(
              <div style={{textAlign:"center",padding:"52px 0",color:"rgba(255,255,255,.28)",fontSize:13}}>
                <div style={{fontSize:36,marginBottom:10}}>🛒</div>Agrega productos al menú
              </div>
            ):cart.map(item=>(
              <div key={item.id} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.11)",borderRadius:12,padding:12,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:6}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:600,color:"rgba(255,255,255,.88)",marginBottom:4}}>{item.name}</div>
                    <DestTag dest={item.dest}/>
                    {item.notes&&<div style={{fontSize:13,color:"rgba(255,255,255,.38)",marginTop:4,fontStyle:"italic"}}>📝 {item.notes}</div>}
                  </div>
                  <span style={{fontFamily:FONTS.mono,fontSize:15,fontWeight:600,color:"#60A5FA",marginLeft:8}}>${(item.price*item.qty).toFixed(2)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <button onClick={()=>rem(item.id)} style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,.10)",border:"1px solid rgba(255,255,255,.17)",cursor:"pointer",color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{fontFamily:FONTS.mono,fontWeight:700,color:"#fff",minWidth:18,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>add(item)} style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,.10)",border:"1px solid rgba(255,255,255,.17)",cursor:"pointer",color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <button onClick={()=>{setNoteModal(item.id);setNote(item.notes||"");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"rgba(255,255,255,.35)",fontFamily:FONTS.body}}>+ nota</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:"15px 19px",borderTop:"1px solid rgba(255,255,255,.09)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:13}}>
              <span style={{fontSize:14,color:"rgba(255,255,255,.42)"}}>Total</span>
              <span style={{fontFamily:FONTS.mono,fontSize:21,fontWeight:700,color:"#fff"}}>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleSendOrder} style={{width:"100%",padding:13,borderRadius:12,border:"none",background:cart.length>0?"linear-gradient(135deg,#3B82F6,#8B5CF6)":"rgba(255,255,255,.10)",color:"#fff",fontFamily:FONTS.body,fontSize:14,fontWeight:700,cursor:cart.length>0?"pointer":"not-allowed",boxShadow:cart.length>0?"0 8px 24px rgba(59,130,246,.38)":"none",transition:"all .2s"}}>
              Enviar Orden →
            </button>
          </div>
        </div>
      </div>

      {/* Note modal */}
      {noteModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400}}>
          <div style={{background:"rgba(14,20,46,.95)",border:"1px solid rgba(255,255,255,.20)",borderRadius:22,padding:28,width:305,boxShadow:"0 36px 80px rgba(0,0,0,.55)"}}>
            <div style={{fontFamily:FONTS.display,fontSize:18,fontWeight:800,color:"#fff",marginBottom:14}}>Agregar nota</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="ej: sin cebolla, extra picante..." style={{width:"100%",height:86,padding:"10px 13px",resize:"none"}}/>
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button onClick={()=>setNoteModal(null)} style={{flex:1,padding:9,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,cursor:"pointer",color:"rgba(255,255,255,.68)",fontFamily:FONTS.body,fontSize:13}}>Cancelar</button>
              <button onClick={()=>{setCart(p=>p.map(c=>c.id===noteModal?{...c,notes:note}:c));setNoteModal(null);}} style={{flex:1,padding:9,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",border:"none",borderRadius:10,cursor:"pointer",color:"#fff",fontFamily:FONTS.body,fontSize:13,fontWeight:700}}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Table selector step
  return (
    <>
      <div style={{padding:32,position:"relative",zIndex:1,maxWidth:1280,margin:"0 auto"}}>
        {/* Header */}
        <div style={{marginBottom:20}}>
          <h2 style={{fontFamily:FONTS.display,fontSize:28,fontWeight:800,color:"#fff",marginBottom:4}}>Seleccionar Mesa</h2>
          <p style={{fontFamily:FONTS.body,fontSize:13,color:"rgba(255,255,255,.42)"}}>Toca una mesa libre para abrir cuenta, o una ocupada para ver sus cuentas</p>
        </div>

        {/* Legend */}
        <div style={{display:"flex",gap:20,marginBottom:24}}>
          {[["#10B981","Libre"],["#3B82F6","Con cuentas"],["#F97316","Esperando pago"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontFamily:FONTS.body,fontSize:12,color:"rgba(255,255,255,.55)"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"block",boxShadow:`0 0 5px ${c}`}}/>
              {l}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,maxWidth:720}}>
          {tables.map((t,i)=>{
            const tabs   = tabsByTbl[t.id]||[];
            const state  = getTableState(t,tabs);
            const colors = {free:{border:"rgba(255,255,255,.15)",bg:"rgba(255,255,255,.08)",dot:"#10B981",label:"rgba(16,185,129,.90)",lbl:"● Libre"},occupied:{border:"rgba(59,130,246,.35)",bg:"rgba(59,130,246,.08)",dot:"#3B82F6",label:"rgba(96,165,250,.90)",lbl:`● ${tabs.length} cuenta${tabs.length!==1?"s":""}`},pending:{border:"rgba(249,115,22,.40)",bg:"rgba(249,115,22,.08)",dot:"#F97316",label:"rgba(249,115,22,.90)",lbl:"● Esperando pago"}};
            const col = colors[state]||colors.free;
            return (
              <button key={t.id} onClick={()=>handleSelectTable(t)}
                style={{position:"relative",background:col.bg,backdropFilter:"blur(14px)",border:`1px solid ${col.border}`,borderRadius:16,padding:"20px 12px",cursor:"pointer",fontFamily:FONTS.body,textAlign:"center",animation:`float-in .3s ease ${i*.05}s both`,transition:"all .20s",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                {/* dot */}
                <span style={{position:"absolute",top:9,right:9,width:7,height:7,borderRadius:"50%",background:col.dot,boxShadow:`0 0 6px ${col.dot}`,animation:state!=="free"?"pulse-dot 2s infinite":"none",display:"block"}}/>
                {/* tab count badge */}
                {tabs.length>0&&<span style={{position:"absolute",top:7,left:9,width:18,height:18,borderRadius:"50%",background:"rgba(59,130,246,.90)",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONTS.mono}}>{tabs.length}</span>}
                <div style={{fontSize:26,marginBottom:4}}>{t.type==="bar"?"🪑":"🍽️"}</div>
                <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,.88)"}}>{t.name}</div>
                <div style={{fontSize:11,fontWeight:600,color:col.label}}>{col.lbl}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {modal.type==="openTab"&&(
        <OpenTabModal table={modal.table} onConfirm={(name)=>openTab(modal.table,name)} onClose={()=>setModal({type:"none"})}/>
      )}
      {modal.type==="tabsList"&&(
        <TabsModal
          table={modal.table}
          tabs={tabsByTbl[modal.table.id]||[]}
          onViewTab={(tab)=>setModal({type:"tabDetail",table:modal.table,tab})}
          onNewTab={()=>setModal({type:"openTab",table:modal.table})}
          onClose={()=>setModal({type:"none"})}
        />
      )}
      {modal.type==="tabDetail"&&(
        <TabDetailModal
          tab={modal.tab}
          table={modal.table}
          onBack={()=>setModal({type:"tabsList",table:modal.table})}
          onClose={()=>setModal({type:"none"})}
          onAddOrder={()=>{setActiveTbl(modal.table);setActiveTab(modal.tab);setModal({type:"none"});setStep("menu");}}
        />
      )}
    </>
  );
}

/* ─── DISPLAY VIEW (Kitchen / Bar) ─────────────────────────────── */
function DisplayView({dest}) {
  const [orders,setOrders]=useState(mockOrders);
  const isBar=dest==="Bar";
  const ac=isBar?"#A78BFA":"#34D399";
  const grad=isBar?"linear-gradient(135deg,#8B5CF6,#6366F1)":"linear-gradient(135deg,#10B981,#059669)";
  const glow=isBar?"rgba(139,92,246,.35)":"rgba(16,185,129,.35)";
  const ns={Pending:"Preparing",Preparing:"Ready",Ready:"Delivered"};
  const nl={Pending:"▶ Iniciar",Preparing:"✓ Listo",Ready:"↗ Entregar"};
  const ng={Pending:"linear-gradient(135deg,#3B82F6,#6366F1)",Preparing:grad,Ready:"linear-gradient(135deg,#64748B,#475569)"};
  const upd=(oid,iid,ns_)=>setOrders(p=>p.map(o=>o.id!==oid?o:{...o,items:o.items.map(i=>i.id!==iid?i:{...i,status:ns_})}));
  const filtered=orders.map(o=>({...o,items:o.items.filter(i=>i.dest===dest)})).filter(o=>o.items.length>0);
  return (
    <div style={{padding:28,position:"relative",zIndex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <div style={{width:46,height:46,borderRadius:15,background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:`0 8px 22px ${glow}`}}>{isBar?"🍹":"🍳"}</div>
        <div>
          <h2 style={{fontFamily:FONTS.display,fontSize:26,fontWeight:800,color:"#fff",margin:0}}>{isBar?"Bar Display":"Kitchen Display"}</h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,.38)",margin:0}}>Actualización en tiempo real · SignalR</p>
        </div>
        <div style={{marginLeft:"auto",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.13)",borderRadius:12,padding:"8px 16px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:FONTS.mono,fontSize:20,fontWeight:700,color:ac}}>{filtered.length}</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,.42)"}}>órdenes activas</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
        {filtered.map((o,i)=>{
          const urgent=o.elapsed>10;
          const done=o.items.every(it=>it.status==="Ready"||it.status==="Delivered");
          return (
            <div key={o.id} className={`oc${urgent?" urgent":done?" done":""}`} style={{animationDelay:`${i*.08}s`}}>
              <div style={{padding:"14px 18px",background:urgent?"rgba(239,68,68,.10)":done?"rgba(16,185,129,.10)":"rgba(255,255,255,.04)",borderBottom:"1px solid rgba(255,255,255,.09)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:FONTS.display,fontSize:17,fontWeight:800,color:"#fff"}}>{o.table}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,.38)",marginTop:2}}>#{o.id} · {o.waiter}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:FONTS.mono,fontSize:23,fontWeight:700,color:urgent?"#EF4444":ac}}>{o.elapsed}m</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.32)"}}>{o.createdAt}</div>
                </div>
              </div>
              <div style={{padding:14}}>
                {o.items.map(item=>(
                  <div key={item.id} style={{background:"rgba(255,255,255,.05)",border:`1px solid ${G[item.status.toLowerCase()]?.border||"rgba(255,255,255,.10)"}`,borderRadius:12,padding:"10px 13px",marginBottom:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:item.notes?4:8}}>
                      <span style={{fontSize:15,fontWeight:600,color:"rgba(255,255,255,.86)"}}>×{item.qty} {item.name}</span>
                      <Badge status={item.status}/>
                    </div>
                    {item.notes&&<div style={{fontSize:13,color:"rgba(255,255,255,.36)",fontStyle:"italic",marginBottom:8}}>📝 {item.notes}</div>}
                    {item.status!=="Delivered"&&<button className="abtn" onClick={()=>upd(o.id,item.id,ns[item.status])} style={{background:ng[item.status],color:"#fff",boxShadow:`0 4px 14px ${glow}`}}>{nl[item.status]}</button>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── OVERVIEW ──────────────────────────────────────────────────── */
function OverviewView() {
  const stats=[
    {label:"Órdenes Activas",   value:4,icon:"📋",grad:"linear-gradient(135deg,#3B82F6,#6366F1)",glow:"rgba(59,130,246,.35)"},
    {label:"Ítems en Cocina",   value:8,icon:"🍳",grad:"linear-gradient(135deg,#10B981,#059669)",glow:"rgba(16,185,129,.35)"},
    {label:"Ítems en Barra",    value:6,icon:"🍹",grad:"linear-gradient(135deg,#8B5CF6,#6366F1)",glow:"rgba(139,92,246,.35)"},
    {label:"Listos p/ entregar",value:3,icon:"✅",grad:"linear-gradient(135deg,#F97316,#EF4444)",glow:"rgba(249,115,22,.35)"},
  ];
  const headers=["Orden","Mesa","Mesero","Items","Cocina","Barra","Tiempo","Estado"];
  return (
    <div style={{padding:32,position:"relative",zIndex:1,maxWidth:1280,margin:"0 auto"}}>
      <div style={{marginBottom:28}}>
        <h2 style={{fontFamily:FONTS.display,fontSize:28,fontWeight:800,color:"#fff",margin:0}}>Resumen en Tiempo Real</h2>
        <p style={{fontSize:13,color:"rgba(255,255,255,.40)",marginTop:4}}>Actualizado vía SignalR WebSocket</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
        {stats.map((s,i)=>(
          <div key={s.label} className="gc" style={{padding:24,animationDelay:`${i*.08}s`,animation:"float-in .4s ease both"}}>
            <div style={{width:46,height:46,borderRadius:14,background:s.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:14,boxShadow:`0 8px 22px ${s.glow}`}}>{s.icon}</div>
            <div style={{fontFamily:FONTS.mono,fontSize:36,fontWeight:700,color:"#fff",lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.42)",marginTop:7}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,.07)",backdropFilter:"blur(22px)",border:"1px solid rgba(255,255,255,.13)",borderRadius:20,overflow:"hidden"}}>
        <div style={{padding:"16px 22px",borderBottom:"1px solid rgba(255,255,255,.09)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:FONTS.display,fontSize:17,fontWeight:800,color:"#fff"}}>Órdenes Activas</span>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#10B981",animation:"pulse-dot 2s infinite"}}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,.38)"}}>en vivo</span>
          </div>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"rgba(0,0,0,.22)"}}>{headers.map(h=><th key={h} style={{padding:"10px 18px",textAlign:"left",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:.8,textTransform:"uppercase",borderBottom:"1px solid rgba(255,255,255,.07)"}}>{h}</th>)}</tr></thead>
          <tbody>
            {mockOrders.map((o,i)=>{
              const ki=o.items.filter(x=>x.dest==="Kitchen");
              const bi=o.items.filter(x=>x.dest==="Bar");
              return(
                <tr key={o.id} style={{borderBottom:"1px solid rgba(255,255,255,.05)",background:i%2===0?"transparent":"rgba(255,255,255,.025)"}}>
                  <td style={{padding:"13px 18px",fontFamily:FONTS.mono,fontSize:12,fontWeight:600,color:"#60A5FA"}}>{o.id}</td>
                  <td style={{padding:"13px 18px",fontSize:13,fontWeight:600,color:"rgba(255,255,255,.86)"}}>{o.table}</td>
                  <td style={{padding:"13px 18px",fontSize:13,color:"rgba(255,255,255,.46)"}}>{o.waiter}</td>
                  <td style={{padding:"13px 18px",fontFamily:FONTS.mono,fontSize:14,fontWeight:700,color:"#fff"}}>{o.items.length}</td>
                  <td style={{padding:"13px 18px",fontSize:12,color:"#34D399"}}>{ki.filter(x=>x.status==="Ready").length}/{ki.length} listos</td>
                  <td style={{padding:"13px 18px",fontSize:12,color:"#A78BFA"}}>{bi.filter(x=>x.status==="Ready").length}/{bi.length} listos</td>
                  <td style={{padding:"13px 18px"}}><span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:700,color:o.elapsed>10?"#EF4444":"#fff"}}>{o.elapsed}m</span></td>
                  <td style={{padding:"13px 18px"}}><Badge status={o.status}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────────── */
export default function App() {
  const [view,setView]=useState("waiter");
  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=css;
    document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);
  return (
    <>
      <Background/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh"}}>
        <TopBar view={view} setView={setView}/>
        {view==="waiter"   && <WaiterView/>}
        {view==="kitchen"  && <DisplayView dest="Kitchen"/>}
        {view==="bar"      && <DisplayView dest="Bar"/>}
        {view==="overview" && <OverviewView/>}
      </div>
    </>
  );
}
