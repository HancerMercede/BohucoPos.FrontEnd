# Bohuco POS — Guía de Implementación del Sistema de Cuentas (Tabs)
> **Para el agente:** Este documento explica exactamente qué agregar, qué modificar y qué NO tocar en el archivo `NexusPOS.jsx` existente para integrar el sistema de cuentas (Tabs).

---

## Resumen Ejecutivo

El archivo `NexusPOS.jsx` ya existe y funciona. El sistema de Tabs es una **capa adicional** que se integra únicamente dentro de `WaiterView`. Todo lo demás (Kitchen Display, Bar Display, Overview, TopBar, Background, Badge, DestTag) queda **100% intacto**.

```
LO QUE CAMBIA          LO QUE NO CAMBIA
──────────────────     ────────────────────────────
WaiterView             Background
  TableSelector        TopBar
  + OpenTabModal  NEW  Badge
  + TabsModal     NEW  DestTag
  + TabDetailModal NEW  DisplayView (Kitchen/Bar)
  + estado tabs        OverviewView
                       mockOrders / menuItems
                       todo el CSS global existente
```

---

## Paso 1 — Agregar nuevos datos mock

### 1.1 Agregar constante `TAX_RATE`

Agregar junto a los otros tokens al inicio del archivo, después de `const FONTS`:

```js
const TAX_RATE = 0.18;
```

### 1.2 Agregar `tabStatusConfig`

Agregar después de `const G` (los colores de estados de ítems):

```js
const TAB_STATUS = {
  OPEN:      { label:"Abierta",   color:"#10B981", bg:"rgba(16,185,129,.15)",  border:"rgba(16,185,129,.40)"  },
  PENDING:   { label:"Cuenta",    color:"#F97316", bg:"rgba(249,115,22,.15)",  border:"rgba(249,115,22,.40)"  },
  CLOSED:    { label:"Cerrada",   color:"#94A3B8", bg:"rgba(148,163,184,.15)", border:"rgba(148,163,184,.30)" },
  CANCELLED: { label:"Cancelada", color:"#EF4444", bg:"rgba(239,68,68,.15)",   border:"rgba(239,68,68,.40)"   },
};
```

### 1.3 Reemplazar `const tables` con versión extendida

La constante `tables` actual no tiene campo `type` en todos los registros. Reemplazarla con:

```js
const tables = [
  {id:"t1",name:"Mesa 1", status:"free",     type:"table"},
  {id:"t2",name:"Mesa 2", status:"occupied", type:"table"},
  {id:"t3",name:"Mesa 3", status:"occupied", type:"table"},
  {id:"t4",name:"Mesa 4", status:"occupied", type:"table"},
  {id:"t5",name:"Mesa 5", status:"free",     type:"table"},
  {id:"t6",name:"Mesa 6", status:"free",     type:"table"},
  {id:"t7",name:"Mesa 7", status:"occupied", type:"table"},
  {id:"t8",name:"Mesa 8", status:"free",     type:"table"},
  {id:"b1",name:"Barra 1",status:"free",     type:"bar"  },
  {id:"b2",name:"Barra 2",status:"occupied", type:"bar"  },
];
```

### 1.4 Agregar `mockTabs` (datos de cuentas de ejemplo)

Agregar después de `const tables`:

```js
const mockTabs = {
  "t2": [
    { id:"TAB-001", location:"Mesa 2", customerName:"Carlos", waiterId:"w1",
      status:"OPEN", openedAt:"12:30",
      orders:[
        { id:"ORD-001", tabId:"TAB-001", createdAt:"12:30",
          items:[
            {id:1, name:"Cerveza Artesanal", qty:2, price:6.5,  dest:"Bar",     notes:""},
            {id:2, name:"Pollo a la Brasa",  qty:2, price:12.5, dest:"Kitchen", notes:"Sin cebolla"},
          ]},
        { id:"ORD-002", tabId:"TAB-001", createdAt:"13:15",
          items:[
            {id:3, name:"Cerveza Artesanal", qty:2, price:6.5, dest:"Bar", notes:""},
          ]},
      ]},
    { id:"TAB-002", location:"Mesa 2", customerName:"María", waiterId:"w1",
      status:"PENDING", openedAt:"12:45",
      orders:[
        { id:"ORD-003", tabId:"TAB-002", createdAt:"12:45",
          items:[
            {id:4, name:"Vino Tinto",       qty:1, price:8.5,  dest:"Bar",     notes:""},
            {id:5, name:"Pasta Carbonara",  qty:1, price:11.0, dest:"Kitchen", notes:""},
          ]},
      ]},
  ],
  "t3": [
    { id:"TAB-003", location:"Mesa 3", customerName:"Pedro", waiterId:"w2",
      status:"OPEN", openedAt:"13:00",
      orders:[
        { id:"ORD-004", tabId:"TAB-003", createdAt:"13:00",
          items:[
            {id:6, name:"Pizza Margarita", qty:1, price:10.5, dest:"Kitchen", notes:"Masa delgada"},
            {id:7, name:"Negroni",         qty:2, price:11.0, dest:"Bar",     notes:"Hielo cubo"},
          ]},
      ]},
  ],
  "t4": [
    { id:"TAB-004", location:"Mesa 4", customerName:"Ana", waiterId:"w1",
      status:"OPEN", openedAt:"13:10",
      orders:[
        { id:"ORD-005", tabId:"TAB-004", createdAt:"13:10",
          items:[
            {id:8, name:"Ensalada César",   qty:1, price:8.0,  dest:"Kitchen", notes:""},
            {id:9, name:"Mojito",           qty:2, price:9.0,  dest:"Bar",     notes:"Extra menta"},
          ]},
      ]},
  ],
  "b2": [
    { id:"TAB-005", location:"Barra 2", customerName:"Luis", waiterId:"w1",
      status:"OPEN", openedAt:"12:38",
      orders:[
        { id:"ORD-006", tabId:"TAB-005", createdAt:"12:38",
          items:[{id:10, name:"Cerveza Artesanal", qty:2, price:6.5, dest:"Bar", notes:""}]},
        { id:"ORD-007", tabId:"TAB-005", createdAt:"13:10",
          items:[{id:11, name:"Cerveza Artesanal", qty:2, price:6.5, dest:"Bar", notes:""}]},
      ]},
    { id:"TAB-006", location:"Barra 2", customerName:"Ana", waiterId:"w1",
      status:"OPEN", openedAt:"13:05",
      orders:[
        { id:"ORD-008", tabId:"TAB-006", createdAt:"13:05",
          items:[{id:12, name:"Mojito", qty:2, price:9.0, dest:"Bar", notes:"Extra menta"}]},
      ]},
  ],
};
```

---

## Paso 2 — Agregar nuevas clases CSS

Dentro del string `const css`, agregar estas clases al final (antes del cierre de backtick):

```css
/* Tab status dot */
.dot-free     { background:#10B981; box-shadow:0 0 6px #10B981; }
.dot-occupied { background:#3B82F6; box-shadow:0 0 6px #3B82F6; animation:pulse-dot 2s infinite; }
.dot-pending  { background:#F97316; box-shadow:0 0 6px #F97316; animation:pulse-dot 1.5s infinite; }

/* Table card con cuentas activas */
.tb.with-tabs {
  border-color:rgba(59,130,246,.35);
  background:rgba(59,130,246,.08);
  opacity:1;
  cursor:pointer;
}
.tb.with-tabs:hover {
  background:rgba(59,130,246,.15);
  border-color:rgba(59,130,246,.55);
  transform:translateY(-3px);
  box-shadow:0 12px 28px rgba(59,130,246,.20);
}
.tb.tab-pending {
  border-color:rgba(249,115,22,.40);
  background:rgba(249,115,22,.08);
  opacity:1;
  cursor:pointer;
}
.tb.tab-pending:hover {
  background:rgba(249,115,22,.15);
  border-color:rgba(249,115,22,.60);
  transform:translateY(-3px);
  box-shadow:0 12px 28px rgba(249,115,22,.20);
}

/* Modal animations */
@keyframes modal-in {
  from { opacity:0; transform:translateY(24px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes slide-up {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}
```

---

## Paso 3 — Agregar nuevos componentes

Agregar estos tres componentes **antes** de la función `WaiterView`. No modificar ninguno de los componentes existentes.

### 3.1 `OpenTabModal` — Modal para abrir una nueva cuenta

```jsx
function OpenTabModal({ table, onConfirm, onClose }) {
  const [name, setName] = React.useState("");
  const isBar = table.type === "bar";
  const canSubmit = isBar ? name.trim().length > 0 : true;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,animation:"overlay-in .2s ease"}}
      onClick={onClose}>
      <div style={{background:"rgba(14,20,46,.97)",border:"1px solid rgba(255,255,255,.20)",
        borderRadius:24,padding:32,width:360,boxShadow:"0 40px 80px rgba(0,0,0,.60)",
        animation:"modal-in .25s ease both"}}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(59,130,246,.15)",
            border:"1px solid rgba(59,130,246,.30)",display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:22,flexShrink:0}}>
            {isBar ? "🪑" : "🍽️"}
          </div>
          <div>
            <div style={{fontFamily:FONTS.display,fontSize:20,fontWeight:800,color:"#fff",marginBottom:2}}>
              {table.name}
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.42)"}}>Abrir nueva cuenta</div>
          </div>
        </div>

        {/* Input */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.60)",
            textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>
            Nombre del cliente
            {isBar && <span style={{color:"#F97316",fontWeight:400,textTransform:"none",letterSpacing:0}}>
              {" "}*requerido
            </span>}
          </div>
          <input
            type="text"
            placeholder={isBar ? "ej: Luis, Ana, Pedro..." : "ej: Juan (opcional)"}
            value={name}
            onChange={e=>setName(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&canSubmit)onConfirm(name.trim()||"Cliente");if(e.key==="Escape")onClose();}}
            autoFocus
            maxLength={40}
            style={{width:"100%",padding:"13px 16px",fontSize:15}}
          />
          {isBar && !name.trim() && (
            <div style={{marginTop:8,fontSize:12,color:"rgba(249,115,22,.70)",lineHeight:1.5}}>
              En barra es obligatorio identificar al cliente para separar cuentas.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose}
            style={{flex:1,padding:12,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",
              borderRadius:10,cursor:"pointer",color:"rgba(255,255,255,.68)",fontFamily:FONTS.body,fontSize:14,
              transition:"all .18s"}}>
            Cancelar
          </button>
          <button
            onClick={()=>canSubmit&&onConfirm(name.trim()||"Cliente")}
            style={{flex:1.4,padding:12,border:"none",borderRadius:10,color:"#fff",fontFamily:FONTS.body,
              fontSize:14,fontWeight:700,transition:"all .18s",
              background:canSubmit?"linear-gradient(135deg,#3B82F6,#8B5CF6)":"rgba(255,255,255,.08)",
              cursor:canSubmit?"pointer":"not-allowed",opacity:canSubmit?1:0.5,
              boxShadow:canSubmit?"0 8px 24px rgba(59,130,246,.35)":"none"}}>
            Abrir Cuenta →
          </button>
        </div>

      </div>
    </div>
  );
}
```

---

### 3.2 `TabsModal` — Modal con lista de cuentas activas de una mesa

```jsx
function TabsModal({ table, tabs, onViewTab, onNewTab, onClose }) {
  const calcTotal = tab => tab.orders.reduce(
    (sum,o) => sum + o.items.reduce((s,i) => s + i.price * i.qty, 0), 0
  );
  const totalAll = tabs.reduce((s,t) => s + calcTotal(t), 0);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}}
      onClick={onClose}>
      <div style={{background:"rgba(14,20,46,.97)",border:"1px solid rgba(255,255,255,.20)",
        borderRadius:24,width:460,maxHeight:"80vh",display:"flex",flexDirection:"column",
        boxShadow:"0 40px 80px rgba(0,0,0,.60)",animation:"modal-in .25s ease both",overflow:"hidden"}}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",
          padding:"24px 28px 18px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{fontFamily:FONTS.display,fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>
              {table.type==="bar"?"🪑":"🍽️"} {table.name}
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.42)"}}>
              {tabs.length} cuenta{tabs.length!==1?"s":""} activa{tabs.length!==1?"s":""}
            </div>
          </div>
          <button onClick={onClose}
            style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",
              borderRadius:8,width:30,height:30,cursor:"pointer",color:"rgba(255,255,255,.60)",
              fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {/* Tab list */}
        <div style={{flex:1,overflowY:"auto",padding:"14px 24px",display:"flex",flexDirection:"column",gap:10}}>
          {tabs.map((tab,i) => {
            const s = TAB_STATUS[tab.status];
            const total = calcTotal(tab);
            const itemCount = tab.orders.reduce((s,o)=>s+o.items.length,0);
            return (
              <div key={tab.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.13)",
                borderRadius:16,padding:"13px 16px",gap:12,animation:`slide-up .3s ease both`,
                animationDelay:`${i*.06}s`,transition:"all .18s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.11)";e.currentTarget.style.borderColor="rgba(255,255,255,.24)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.07)";e.currentTarget.style.borderColor="rgba(255,255,255,.13)"}}>

                {/* Avatar + info */}
                <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                  <div style={{width:38,height:38,borderRadius:"50%",
                    background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:FONTS.display,fontSize:15,fontWeight:800,color:"#fff",flexShrink:0,
                    boxShadow:"0 4px 12px rgba(59,130,246,.35)"}}>
                    {tab.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontFamily:FONTS.body,fontSize:15,fontWeight:600,
                      color:"rgba(255,255,255,.90)",marginBottom:2}}>{tab.customerName}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.38)"}}>
                      Abierta {tab.openedAt} · {itemCount} ítem{itemCount!==1?"s":""}
                    </div>
                  </div>
                </div>

                {/* Status + total + button */}
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <span style={{background:s.bg,border:`1px solid ${s.border}`,color:s.color,
                    borderRadius:99,padding:"2px 10px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
                    {s.label}
                  </span>
                  <span style={{fontFamily:FONTS.mono,fontSize:15,fontWeight:700,color:"#fff",minWidth:64,textAlign:"right"}}>
                    ${total.toFixed(2)}
                  </span>
                  <button onClick={()=>onViewTab(tab)}
                    style={{background:"rgba(59,130,246,.15)",border:"1px solid rgba(59,130,246,.35)",
                      borderRadius:10,padding:"6px 14px",cursor:"pointer",color:"#60A5FA",
                      fontFamily:FONTS.body,fontSize:12,fontWeight:600,transition:"all .18s",whiteSpace:"nowrap"}}>
                    Ver →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{padding:"16px 28px",borderTop:"1px solid rgba(255,255,255,.08)",
          display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.38)",textTransform:"uppercase",
              letterSpacing:.8,marginBottom:2}}>Total acumulado</div>
            <div style={{fontFamily:FONTS.mono,fontSize:22,fontWeight:700,color:"#fff"}}>
              ${totalAll.toFixed(2)}
            </div>
          </div>
          <button onClick={onNewTab}
            style={{background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",border:"none",
              borderRadius:12,padding:"11px 20px",cursor:"pointer",color:"#fff",
              fontFamily:FONTS.body,fontSize:14,fontWeight:700,transition:"all .18s",
              boxShadow:"0 8px 24px rgba(59,130,246,.35)",whiteSpace:"nowrap"}}>
            + Nueva cuenta
          </button>
        </div>

      </div>
    </div>
  );
}
```

---

### 3.3 `TabDetailModal` — Detalle completo de una cuenta

```jsx
function TabDetailModal({ tab, table, onClose, onAddOrder }) {
  const s = TAB_STATUS[tab.status];
  const subtotal = tab.orders.reduce(
    (sum,o) => sum + o.items.reduce((s,i) => s + i.price * i.qty, 0), 0
  );
  const tax   = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const isOpen    = tab.status === "OPEN";
  const isPending = tab.status === "PENDING";

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.70)",backdropFilter:"blur(12px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}}
      onClick={onClose}>
      <div style={{background:"rgba(14,20,46,.97)",border:"1px solid rgba(255,255,255,.20)",
        borderRadius:24,width:520,maxHeight:"88vh",display:"flex",flexDirection:"column",
        boxShadow:"0 40px 80px rgba(0,0,0,.60)",animation:"modal-in .25s ease both",overflow:"hidden"}}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,.08)",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14,minWidth:0}}>
            <div style={{width:44,height:44,borderRadius:"50%",
              background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:FONTS.display,fontSize:18,fontWeight:800,color:"#fff",flexShrink:0,
              boxShadow:"0 4px 14px rgba(59,130,246,.40)"}}>
              {tab.customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{fontFamily:FONTS.display,fontSize:20,fontWeight:800,color:"#fff",marginBottom:3}}>
                {tab.customerName}
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.38)"}}>
                {table.name} · Abierta {tab.openedAt}
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{background:s.bg,border:`1px solid ${s.border}`,color:s.color,
              borderRadius:99,padding:"3px 12px",fontSize:10,fontWeight:700}}>
              {s.label}
            </span>
            <button onClick={onClose}
              style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",
                borderRadius:8,width:30,height:30,cursor:"pointer",color:"rgba(255,255,255,.60)",
                fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
        </div>

        {/* Orders */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 28px",display:"flex",flexDirection:"column",gap:12}}>
          {tab.orders.length === 0 ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,
              padding:"40px 0",color:"rgba(255,255,255,.28)",fontFamily:FONTS.body,fontSize:13}}>
              <span style={{fontSize:32}}>🧾</span>
              Sin órdenes aún
            </div>
          ) : tab.orders.map((order,i) => {
            const orderTotal = order.items.reduce((s,item)=>s+item.price*item.qty,0);
            return (
              <div key={order.id} style={{background:"rgba(255,255,255,.04)",
                border:"1px solid rgba(255,255,255,.08)",borderRadius:16,overflow:"hidden",
                animation:"slide-up .3s ease both",animationDelay:`${i*.06}s`}}>

                {/* Order header */}
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",
                  background:"rgba(255,255,255,.04)",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                  <span style={{fontFamily:FONTS.mono,fontSize:11,fontWeight:600,color:"#60A5FA",flex:1}}>
                    {order.id}
                  </span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,.38)"}}>{order.createdAt}</span>
                  <span style={{fontFamily:FONTS.mono,fontSize:12,fontWeight:700,color:"rgba(255,255,255,.70)"}}>
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>

                {/* Items */}
                <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:8}}>
                  {order.items.map(item => (
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:600,
                        color:"rgba(255,255,255,.60)",minWidth:24}}>×{item.qty}</span>
                      <span style={{fontFamily:FONTS.body,fontSize:14,fontWeight:500,
                        color:"rgba(255,255,255,.90)",flex:1,minWidth:120}}>{item.name}</span>
                      <DestTag dest={item.dest}/>
                      {item.notes && (
                        <span style={{fontSize:11,color:"rgba(255,255,255,.38)",fontStyle:"italic",
                          flexBasis:"100%",paddingLeft:32}}>📝 {item.notes}</span>
                      )}
                      <span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:600,color:"#60A5FA",marginLeft:"auto"}}>
                        ${(item.price*item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div style={{padding:"14px 28px",borderTop:"1px solid rgba(255,255,255,.08)",
          display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontFamily:FONTS.body,fontSize:13,color:"rgba(255,255,255,.42)"}}>Subtotal</span>
            <span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:600,color:"rgba(255,255,255,.60)"}}>
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontFamily:FONTS.body,fontSize:13,color:"rgba(255,255,255,.42)"}}>ITBIS (18%)</span>
            <span style={{fontFamily:FONTS.mono,fontSize:13,fontWeight:600,color:"rgba(255,255,255,.60)"}}>
              ${tax.toFixed(2)}
            </span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",
            borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:12,marginTop:4}}>
            <span style={{fontFamily:FONTS.display,fontSize:16,fontWeight:800,color:"#fff",letterSpacing:1}}>
              TOTAL
            </span>
            <span style={{fontFamily:FONTS.mono,fontSize:26,fontWeight:700,color:"#fff"}}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{padding:"14px 28px",borderTop:"1px solid rgba(255,255,255,.08)",
          display:"flex",gap:10}}>
          {isOpen && <>
            <button onClick={onAddOrder}
              style={{flex:1,padding:12,background:"rgba(255,255,255,.08)",
                border:"1px solid rgba(255,255,255,.15)",borderRadius:10,cursor:"pointer",
                color:"rgba(255,255,255,.68)",fontFamily:FONTS.body,fontSize:13,fontWeight:600,
                transition:"all .18s"}}>
              + Agregar Orden
            </button>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",
              fontFamily:FONTS.body,fontSize:13,fontWeight:700,transition:"all .18s",
              background:"linear-gradient(135deg,#F97316,#EA580C)"}}>
              Pedir Cuenta
            </button>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",
              fontFamily:FONTS.body,fontSize:13,fontWeight:700,transition:"all .18s",
              background:"linear-gradient(135deg,#10B981,#059669)"}}>
              Cerrar y Cobrar
            </button>
          </>}
          {isPending && <>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",
              fontFamily:FONTS.body,fontSize:14,fontWeight:700,
              background:"linear-gradient(135deg,#10B981,#059669)"}}>
              💳 Cobrar con Tarjeta
            </button>
            <button style={{flex:1,padding:12,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",
              fontFamily:FONTS.body,fontSize:14,fontWeight:700,
              background:"linear-gradient(135deg,#64748B,#475569)"}}>
              💵 Cobrar Efectivo
            </button>
          </>}
        </div>

      </div>
    </div>
  );
}
```

---

## Paso 4 — Modificar `WaiterView`

Esta es la única función existente que se modifica. Se reemplaza **únicamente la sección del paso `"tables"`** dentro de `WaiterView`.

### 4.1 Agregar nuevo estado al inicio de `WaiterView`

Buscar el bloque de `useState` al inicio de `WaiterView` y agregar estas dos líneas:

```js
// Agregar DESPUÉS de los useState existentes
const [tabsByTable, setTabsByTable] = useState(mockTabs);
const [activeModal, setActiveModal]  = useState(null);
// null | { type:"openTab", table }
//       | { type:"tabsList", table }
//       | { type:"tabDetail", table, tab }
```

### 4.2 Agregar función helper dentro de `WaiterView`

Agregar después de los estados, antes del `return`:

```js
const getTableState = (table) => {
  const tabs = tabsByTable[table.id] ?? [];
  if (table.status === "free") return "free";
  const allPending = tabs.length > 0 && tabs.every(t => t.status === "PENDING");
  if (allPending) return "tab-pending";
  return "with-tabs";
};

const handleOpenTab = (table, customerName) => {
  const newTab = {
    id: `TAB-${Date.now()}`,
    location: table.name,
    customerName: customerName || "Cliente",
    waiterId: "w1",
    status: "OPEN",
    openedAt: new Date().toLocaleTimeString("es-DO", {hour:"2-digit", minute:"2-digit"}),
    orders: [],
  };
  setTabsByTable(prev => ({
    ...prev,
    [table.id]: [...(prev[table.id] ?? []), newTab],
  }));
  setActiveModal(null);
  // Aquí también se puede navegar al menú automáticamente:
  // setTbl(table); setStep("menu");
};
```

### 4.3 Reemplazar el bloque `if(step==="tables")`

Localizar este bloque en el código actual:

```jsx
// ELIMINAR ESTO (líneas 176–195 aprox.):
if(step==="tables") return (
  <div style={{padding:32,position:"relative",zIndex:1}}>
    ...
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,maxWidth:720}}>
      {tables.map((t,i)=>(
        <button key={t.id} className={`tb ${t.status==="free"?"free":"occ"}`} ...>
          ...
          <div style={{fontSize:12,...}}>
            {t.status==="free"?"● Libre":"● Ocupada"}
          </div>
        </button>
      ))}
    </div>
  </div>
);
```

Reemplazarlo con:

```jsx
if(step==="tables") return (
  <>
    <div style={{padding:"32px 28px",position:"relative",zIndex:1,maxWidth:1280,margin:"0 auto"}}>

      {/* Header */}
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:FONTS.display,fontSize:28,fontWeight:800,color:"#fff",marginBottom:6}}>
          Seleccionar Mesa
        </h2>
        <p style={{fontSize:13,color:"rgba(255,255,255,.42)"}}>
          Toca una mesa libre para abrir una cuenta, o una ocupada para ver las cuentas activas
        </p>
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:20,marginBottom:24}}>
        {[
          {dot:"#10B981", label:"Libre"},
          {dot:"#3B82F6", label:"Con cuentas"},
          {dot:"#F97316", label:"Esperando pago"},
        ].map(({dot,label}) => (
          <span key={label} style={{display:"flex",alignItems:"center",gap:6,
            fontFamily:FONTS.body,fontSize:12,color:"rgba(255,255,255,.60)"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:dot,display:"block"}}/>
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,maxWidth:720}}>
        {tables.map((t,i) => {
          const state = getTableState(t);
          const tabs  = tabsByTable[t.id] ?? [];
          return (
            <button key={t.id}
              className={`tb ${state}`}
              style={{animationDelay:`${i*.05}s`, position:"relative"}}
              onClick={() => {
                if (state === "free") {
                  setActiveModal({ type:"openTab", table:t });
                } else {
                  setActiveModal({ type:"tabsList", table:t });
                }
              }}>

              {/* Status dot */}
              <span style={{
                position:"absolute",top:10,right:10,width:7,height:7,borderRadius:"50%",display:"block",
                background: state==="free" ? "#10B981" : state==="tab-pending" ? "#F97316" : "#3B82F6",
                boxShadow: state==="free" ? "0 0 6px #10B981" : state==="tab-pending" ? "0 0 6px #F97316" : "0 0 6px #3B82F6",
              }}/>

              {/* Tab count badge */}
              {tabs.length > 0 && (
                <span style={{position:"absolute",top:8,left:10,width:18,height:18,borderRadius:"50%",
                  background:"rgba(59,130,246,.90)",color:"#fff",fontSize:10,fontWeight:700,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:FONTS.mono}}>
                  {tabs.length}
                </span>
              )}

              <div style={{fontSize:26,marginBottom:7}}>{t.type==="bar"?"🪑":"🍽️"}</div>
              <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,.88)",marginBottom:3}}>
                {t.name}
              </div>
              <div style={{fontSize:11,fontWeight:600,
                color: state==="free" ? "rgba(16,185,129,.90)"
                     : state==="tab-pending" ? "rgba(249,115,22,.90)"
                     : "rgba(96,165,250,.90)"}}>
                {state==="free"     && "● Libre"}
                {state==="with-tabs"  && `● ${tabs.length} cuenta${tabs.length>1?"s":""}`}
                {state==="tab-pending" && "● Esperando pago"}
              </div>
            </button>
          );
        })}
      </div>
    </div>

    {/* Modals */}
    {activeModal?.type === "openTab" && (
      <OpenTabModal
        table={activeModal.table}
        onConfirm={(name) => handleOpenTab(activeModal.table, name)}
        onClose={() => setActiveModal(null)}
      />
    )}

    {activeModal?.type === "tabsList" && (
      <TabsModal
        table={activeModal.table}
        tabs={tabsByTable[activeModal.table.id] ?? []}
        onViewTab={(tab) => setActiveModal({ type:"tabDetail", table:activeModal.table, tab })}
        onNewTab={() => setActiveModal({ type:"openTab", table:activeModal.table })}
        onClose={() => setActiveModal(null)}
      />
    )}

    {activeModal?.type === "tabDetail" && (
      <TabDetailModal
        tab={activeModal.tab}
        table={activeModal.table}
        onClose={() => setActiveModal({ type:"tabsList", table:activeModal.table })}
        onAddOrder={() => {
          setTbl(activeModal.table);
          setStep("menu");
          setActiveModal(null);
        }}
      />
    )}
  </>
);
```

---

## Paso 5 — Verificación final

Después de aplicar los cambios, verificar que:

- [ ] Las mesas libres abren `OpenTabModal` al hacer click
- [ ] Las mesas ocupadas abren `TabsModal` con la lista de cuentas
- [ ] El botón "Ver →" en `TabsModal` abre `TabDetailModal`
- [ ] El botón "← Volver" en `TabDetailModal` regresa a `TabsModal`
- [ ] El botón "+ Nueva cuenta" en `TabsModal` abre `OpenTabModal`
- [ ] Al confirmar en `OpenTabModal`, la mesa pasa a estado `with-tabs`
- [ ] En barra, el campo nombre es obligatorio (botón desactivado si está vacío)
- [ ] El botón "+ Agregar Orden" navega al menú con la mesa seleccionada
- [ ] Kitchen Display, Bar Display y Overview siguen funcionando sin cambios
- [ ] El ITBIS (18%) se calcula y muestra correctamente en `TabDetailModal`

---

## Resumen de cambios por sección

| Sección | Acción | Detalle |
|---|---|---|
| `const TAX_RATE` | **AGREGAR** | Constante nueva |
| `const TAB_STATUS` | **AGREGAR** | Config de colores por estado |
| `const tables` | **REEMPLAZAR** | Agregar campo `type` en todos |
| `const mockTabs` | **AGREGAR** | Datos de ejemplo de cuentas |
| CSS string `css` | **AGREGAR** | 4 nuevas clases + 2 keyframes |
| `OpenTabModal` | **AGREGAR** | Componente nuevo |
| `TabsModal` | **AGREGAR** | Componente nuevo |
| `TabDetailModal` | **AGREGAR** | Componente nuevo |
| `WaiterView` — estados | **MODIFICAR** | +2 `useState` |
| `WaiterView` — helpers | **AGREGAR** | `getTableState`, `handleOpenTab` |
| `WaiterView` — step tables | **REEMPLAZAR** | Grid + 3 modales |
| Todo lo demás | **NO TOCAR** | ✅ |

---

*Versión 1.0 — Bohuco POS — Implementación Tab System — 2026*
