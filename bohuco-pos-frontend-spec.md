# Bohuco POS — Especificación Frontend Completa
> **Para el agente de desarrollo:** Seguir este documento al pie de la letra. Cada color, tamaño, fuente, animación y comportamiento está definido aquí. No improvisar, no cambiar valores sin indicación explícita.

---

## 1. Identidad Visual

| Propiedad | Valor |
|---|---|
| **Nombre del producto** | Bohuco POS |
| **Módulo actual** | Sistema de Comandas |
| **Framework** | React + TypeScript (`.tsx`) |
| **Estilos** | CSS Modules (`.module.css`) — uno por componente |
| **Tipos** | TypeScript — todos los types e interfaces en `src/types/index.ts` |
| **Tema** | Dark — Glassmorphism premium |

---

## 2. Fuentes — Google Fonts

### Import obligatorio (cargar en `useEffect` al montar el App):
```
https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;600&display=swap
```

### Variables de fuente:
```js
const FONTS = {
  display: "'Syne', sans-serif",    // títulos, logo, headers de sección
  body:    "'Outfit', sans-serif",  // texto general, botones, labels, notas
  mono:    "'Fira Code', monospace" // precios, IDs, números, tiempos
}
```

### Tabla de uso por elemento:

| Elemento | Fuente | Tamaño | Peso |
|---|---|---|---|
| Logo "Bohuco" | Syne | 20px | 800 |
| "POS" junto al logo | Syne | 20px | 600 |
| Títulos de sección principal | Syne | 26–28px | 800 |
| Subtítulos de card | Syne | 17px | 800 |
| Título modal | Syne | 18px | 800 |
| Nombre de producto (menú) | Outfit | 15px | 600 |
| Nombre de producto (carrito) | Outfit | 15px | 600 |
| Nombre de producto (display) | Outfit | 15px | 600 |
| Nombre de mesa (card header) | Syne | 17px | 800 |
| Precio unitario | Fira Code | 16px | 600 |
| Precio total carrito | Fira Code | 21px | 700 |
| Tiempo transcurrido (display) | Fira Code | 23px | 700 |
| ID de orden | Fira Code | 12px | 600 |
| Nota del ítem | Outfit | 13px | 400 italic |
| Badge de estado | Outfit | 10px | 700 |
| Tag Cocina/Bar | Outfit | 10px | 700 |
| Labels muted | Outfit | 12–13px | 400–500 |
| Tab de navegación | Outfit | 13px | 500 |
| Botón primario | Outfit | 14px | 700 |
| Botón acción display | Outfit | 12px | 700 |

---

## 3. Colores — Design Tokens

### 3.1 Fondo base
```
linear-gradient(135deg, #0a0f1e 0%, #14082e 40%, #071a30 70%, #0a0f1e 100%)
```

### 3.2 Superficies glass
```
glass-card:    rgba(255,255,255, 0.09)
glass-card-hv: rgba(255,255,255, 0.13)   ← hover
glass-mid:     rgba(255,255,255, 0.15)
glass-strong:  rgba(255,255,255, 0.20)
nav-bg:        rgba(10,15,30,    0.70)
cart-sidebar:  rgba(255,255,255, 0.07)
modal-bg:      rgba(14,20,46,    0.95)
tab-container: rgba(0,0,0,       0.25)
```

### 3.3 Bordes
```
border-subtle:  rgba(255,255,255, 0.10)
border-default: rgba(255,255,255, 0.15)
border-mid:     rgba(255,255,255, 0.18)
border-strong:  rgba(255,255,255, 0.28)
border-active:  rgba(255,255,255, 0.32)
```

### 3.4 Texto
```
text-primary:  rgba(255,255,255, 0.90)
text-second:   rgba(255,255,255, 0.86)
text-mid:      rgba(255,255,255, 0.60)
text-muted:    rgba(255,255,255, 0.42)
text-dim:      rgba(255,255,255, 0.38)
text-disabled: rgba(255,255,255, 0.28)
```

### 3.5 Acentos
```
blue:   #3B82F6   ← acción primaria, hover mesas, estado Preparing
purple: #8B5CF6   ← Bar Display, gradientes secundarios
green:  #10B981   ← Kitchen Display, estado Ready, dot SignalR
orange: #F97316   ← estado Pending, alertas
red:    #EF4444   ← órdenes urgentes (>10 min), errores
slate:  #64748B   ← estado Delivered, botones desactivados

blue-text:   #60A5FA   ← precios en carrito, IDs
green-text:  #34D399   ← progreso cocina en tabla overview
purple-text: #A78BFA   ← progreso barra en tabla overview
```

### 3.6 Estados de ítem — colores exactos
```js
const STATUS_COLORS = {
  pending:   { bg:"rgba(249,115,22,0.15)",  border:"rgba(249,115,22,0.40)",  text:"#F97316" },
  preparing: { bg:"rgba(59,130,246,0.15)",  border:"rgba(59,130,246,0.40)",  text:"#3B82F6" },
  ready:     { bg:"rgba(16,185,129,0.15)",  border:"rgba(16,185,129,0.40)",  text:"#10B981" },
  delivered: { bg:"rgba(148,163,184,0.15)", border:"rgba(148,163,184,0.30)", text:"#94A3B8" },
}
```

### 3.7 Gradientes de botones de acción
```
btn-primary:   linear-gradient(135deg, #3B82F6, #8B5CF6)  ← Enviar Orden, Guardar nota
btn-kitchen:   linear-gradient(135deg, #10B981, #059669)   ← acción en Kitchen Display
btn-bar:       linear-gradient(135deg, #8B5CF6, #6366F1)   ← acción en Bar Display
btn-initiate:  linear-gradient(135deg, #3B82F6, #6366F1)   ← Iniciar preparación
btn-delivered: linear-gradient(135deg, #64748B, #475569)   ← Entregar
btn-disabled:  rgba(255,255,255, 0.10)                     ← sin items en carrito
```

---

## 4. Border Radius — Sistema completo
```
99px  → pills, badges de estado, tags, categorías
20px  → cards de orden, modales, tabla overview
16px  → cards de menú, cards de mesas, carrito items
14px  → ícono del logo, stat cards del overview
12px  → items de display, botones de acción
11px  → tabs de navegación
10px  → botones secundarios, inputs, textareas
6px   → tags Cocina/Bar
```

---

## 5. Animaciones CSS (obligatorias)

```css
@keyframes pulse-dot {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:.5; transform:scale(1.5); }
}

@keyframes float-in {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}

@keyframes success-pop {
  0%   { transform:scale(0.7); opacity:0; }
  60%  { transform:scale(1.1); }
  100% { transform:scale(1);   opacity:1; }
}
```

### Dónde se usan:
| Animación | Elemento | Configuración |
|---|---|---|
| `float-in` | Cards de mesas | `0.3s ease both`, delay `i * 0.05s` |
| `float-in` | Cards de menú | `0.35s ease both`, delay `i * 0.04s` |
| `float-in` | Cards de orden (display) | `0.4s ease both`, delay `i * 0.08s` |
| `float-in` | Stat cards (overview) | `0.4s ease both`, delay `i * 0.08s` |
| `pulse-dot` | Dot SignalR (topbar) | `2s infinite` |
| `pulse-dot` | Dot "en vivo" (overview) | `2s infinite` |
| `success-pop` | Círculo ✓ al enviar orden | `0.5s ease both` |

---

## 6. Fondo (Background) — OBLIGATORIO, nunca omitir

Componente `<Background/>` fijo debajo de todo el contenido (`position: fixed, inset: 0, zIndex: 0, pointerEvents: none`):

```
Capa 1 — Base gradient:
  linear-gradient(135deg, #0a0f1e 0%, #14082e 42%, #071a30 72%, #0a0f1e 100%)

Capa 2 — Orb azul:
  750×750px | top:-18%, left:-12%
  radial-gradient(circle, rgba(99,179,237,.24) 0%, transparent 65%)
  filter: blur(48px)

Capa 3 — Orb púrpura:
  650×650px | top:-12%, right:-8%
  radial-gradient(circle, rgba(139,92,246,.22) 0%, transparent 65%)
  filter: blur(44px)

Capa 4 — Orb verde:
  550×550px | bottom:2%, left:28%
  radial-gradient(circle, rgba(16,185,129,.18) 0%, transparent 65%)
  filter: blur(52px)

Capa 5 — Orb naranja:
  420×420px | bottom:-6%, right:8%
  radial-gradient(circle, rgba(249,115,22,.15) 0%, transparent 60%)
  filter: blur(42px)

Capa 6 — Grid pattern sutil:
  backgroundImage: linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)
  backgroundSize: 64px 64px
  opacity: 0.7
```

---

## 7. Clases CSS Globales (inyectar en `<style>` via `useEffect`)

```css
/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 99px; }

/* Glass card base */
.gc {
  background: rgba(255,255,255,0.09);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 20px;
  transition: all .22s ease;
}
.gc:hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,255,255,0.28);
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.28);
}

/* Nav glass */
.nav-glass {
  background: rgba(10,15,30,0.70);
  backdrop-filter: blur(32px);
  border-bottom: 1px solid rgba(255,255,255,0.10);
}

/* Nav button */
.nb {
  background: transparent; border: none; cursor: pointer;
  border-radius: 11px; padding: 7px 17px;
  font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,.50);
  display: flex; align-items: center; gap: 7px;
  transition: all .18s;
}
.nb:hover { background: rgba(255,255,255,.09); color: rgba(255,255,255,.85); }
.nb.on {
  background: rgba(255,255,255,.15); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.22);
}

/* Pill / category button */
.pill {
  background: rgba(255,255,255,.09);
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 99px; padding: 5px 15px;
  font-size: 12px; font-weight: 500;
  color: rgba(255,255,255,.60);
  cursor: pointer; transition: all .18s;
}
.pill:hover, .pill.on {
  background: rgba(255,255,255,.20); color: #fff;
  border-color: rgba(255,255,255,.32);
}

/* Menu item card */
.mi {
  background: rgba(255,255,255,.07);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 16px; padding: 16px;
  cursor: pointer; transition: all .20s;
  animation: float-in .35s ease both;
}
.mi:hover {
  background: rgba(255,255,255,.13);
  border-color: rgba(255,255,255,.28);
  transform: translateY(-3px);
  box-shadow: 0 16px 32px rgba(0,0,0,.28);
}
.mi.sel {
  border-color: rgba(59,130,246,.55);
  box-shadow: 0 0 0 1px rgba(59,130,246,.22), 0 8px 24px rgba(59,130,246,.16);
}

/* Order card (kitchen/bar display) */
.oc {
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 20px; overflow: hidden;
  transition: all .22s;
  animation: float-in .4s ease both;
}
.oc.urgent {
  border-color: rgba(239,68,68,.50);
  box-shadow: 0 0 0 1px rgba(239,68,68,.14), 0 8px 32px rgba(239,68,68,.12);
}
.oc.done {
  border-color: rgba(16,185,129,.42);
  box-shadow: 0 0 0 1px rgba(16,185,129,.10), 0 8px 24px rgba(16,185,129,.10);
}

/* Table button (mesa selector) */
.tb {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 16px; padding: 20px 12px;
  cursor: pointer; transition: all .20s;
  text-align: center;
  animation: float-in .3s ease both;
}
.tb.free:hover {
  background: rgba(59,130,246,.18);
  border-color: rgba(59,130,246,.48);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(59,130,246,.22);
}
.tb.occ { opacity: .40; cursor: not-allowed; }

/* Action button (display) */
.abtn {
  border: none; border-radius: 10px;
  padding: 8px 0; width: 100%;
  font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all .18s;
  letter-spacing: .3px;
}

/* Inputs & textareas */
input, textarea {
  background: rgba(255,255,255,.09);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 10px; color: #fff;
  font-size: 13px; outline: none;
  transition: border .18s;
}
input:focus, textarea:focus {
  border-color: rgba(59,130,246,.58);
  background: rgba(255,255,255,.13);
}
input::placeholder, textarea::placeholder {
  color: rgba(255,255,255,.32);
}
```

---

## 8. Componentes — Estructura y Especificación

### 8.1 TopBar

```
height: 58px
position: sticky, top:0, zIndex:100
layout: flex, space-between, align-center, padding: 0 28px

— Sección izquierda (Logo):
  · Ícono cuadrado: 33×33px, borderRadius:10
    background: linear-gradient(135deg, #3B82F6, #8B5CF6)
    boxShadow: "0 4px 14px rgba(59,130,246,.42)"
    contenido: símbolo SVG Bohuco o "✦" como placeholder
  · Texto "Bohuco" — Syne 20px 800 #fff letterSpacing:-0.5
  · Texto "POS" — Syne 20px 600 rgba(255,255,255,.38)
  · Separador: 1×18px rgba(255,255,255,.14) margin: 0 6px
  · Label "COMANDAS" — Outfit 11px 500 rgba(255,255,255,.32) letterSpacing:1.5 uppercase

— Sección central (Tabs):
  · Wrapper: background rgba(0,0,0,.25), borderRadius:14, padding:4
  · 4 tabs: 🧾 Mesero | 🍳 Cocina | 🍹 Barra | 📊 Resumen

— Sección derecha (SignalR):
  · Dot: 7×7px, borderRadius:50%, #10B981, animation pulse-dot 2s infinite
    boxShadow: "0 0 8px #10B981"
  · Label "SignalR live" — Outfit 12px rgba(255,255,255,.38)
```

---

### 8.2 Vista Mesero — Paso 1: Selección de Mesa

```
padding: 32px
Título: "Seleccionar Mesa" — Syne 28px 800 #fff
Subtítulo: Outfit 13px rgba(255,255,255,.42)

Grid de mesas:
  · gridTemplateColumns: repeat(5, 1fr)
  · gap: 14px, maxWidth: 720px
  · 8 mesas + 2 barras (10 total)

Card de mesa (.tb):
  · Emoji: 🍽️ (mesa) / 🪑 (barra) — 26px, marginBottom:7
  · Nombre: 14px 700 rgba(255,255,255,.88)
  · Estado: "● Libre" #10B981 / "● Ocupada" rgba(255,255,255,.28) — 12px 600
  · animationDelay: i * 0.05s

Mesas libres → clickeable → navega a vista Menú
Mesas ocupadas → opacity 0.40, cursor not-allowed, NO clickeable
```

---

### 8.3 Vista Mesero — Paso 2: Menú + Carrito

**Layout:** flex row, height: calc(100vh - 58px)

#### Panel Izquierdo — Menú (flex:1, overflowY:auto, padding:24px)

```
Header:
  · Botón "← Volver" — glass background, borde, 12px Outfit
  · Título "{Mesa} — Nueva Orden" — Syne 22px 800 #fff

Filtros de categoría (pills):
  · Todos | Platos | Entradas | Bebidas
  · gap:8, flexWrap:wrap, marginBottom:20

Grid de productos:
  · gridTemplateColumns: repeat(3, 1fr), gap:12

Card de producto (.mi):
  · Emoji del producto: 32px, marginBottom:10
  · Nombre: 15px 600 rgba(255,255,255,.90), marginBottom:6
  · Fila inferior: Precio (Fira Code 16px 600 #60A5FA) + Tag destino
  · Si está en carrito → borde azul + indicador "En orden ×N"
    background: rgba(59,130,246,.15)
    border: 1px solid rgba(59,130,246,.28)
    texto "En orden": 13px rgba(96,165,250,.78)
    cantidad: Fira Code 15px 700 #60A5FA
  · animationDelay: i * 0.04s
```

#### Panel Derecho — Carrito (width:295px)

```
background: rgba(255,255,255,.07)
backdropFilter: blur(24px)
borderLeft: 1px solid rgba(255,255,255,.10)

Header del carrito:
  · "Orden" — Syne 17px 800 #fff
  · nombre de mesa — Outfit 12px rgba(255,255,255,.38)
  · borderBottom: 1px solid rgba(255,255,255,.09)

Lista de items (flex:1, overflowY:auto, padding:13px 15px):

  Estado vacío:
    · Emoji 🛒 36px + texto "Agrega productos al menú"
    · Outfit 13px rgba(255,255,255,.28), textAlign:center, padding:52px 0

  Item del carrito:
    · background: rgba(255,255,255,.07)
    · border: 1px solid rgba(255,255,255,.11)
    · borderRadius: 12px, padding:12px, marginBottom:10
    · Nombre: 15px 600 rgba(255,255,255,.88)
    · Tag destino (Cocina/Bar)
    · Nota (si existe): 13px italic rgba(255,255,255,.38), prefijo 📝
    · Precio: Fira Code 15px 600 #60A5FA
    · Controles cantidad: botones −/+ circulares 26×26px glass
    · Cantidad: Fira Code 700 #fff minWidth:18 textAlign:center
    · Link "+ nota" — 11px rgba(255,255,255,.35)

Footer del carrito:
  · borderTop: 1px solid rgba(255,255,255,.09), padding:15px 19px
  · "Total" — Outfit 14px rgba(255,255,255,.42)
  · Monto — Fira Code 21px 700 #fff
  · Botón "Enviar Orden →":
    Con items: linear-gradient(135deg,#3B82F6,#8B5CF6)
               boxShadow: "0 8px 24px rgba(59,130,246,.38)"
    Sin items: rgba(255,255,255,.10), cursor:not-allowed
    borderRadius:12, padding:13px, Outfit 14px 700
```

#### Modal de Nota

```
Overlay: position fixed, inset:0
  background: rgba(0,0,0,.65)
  backdropFilter: blur(10px)
  zIndex: 300

Modal box:
  background: rgba(14,20,46,.95)
  border: 1px solid rgba(255,255,255,.20)
  borderRadius: 22px, padding:28px, width:305px
  boxShadow: "0 36px 80px rgba(0,0,0,.55)"

  Título "Agregar nota" — Syne 18px 800 #fff
  Textarea: width:100%, height:86px, padding:"10px 13px"
  placeholder: "ej: sin cebolla, extra picante..."

  Botones (flex, gap:10):
    Cancelar: glass background, border, borderRadius:10, Outfit 13px
    Guardar: linear-gradient(135deg,#3B82F6,#8B5CF6), blanco, 700
```

#### Pantalla de Confirmación (orden enviada)

```
Pantalla completa centrada (height:80vh):
  · Círculo ✓: 96×96px, borderRadius:50%
    background: rgba(16,185,129,.20)
    border: 2px solid rgba(16,185,129,.50)
    fontSize:44, animation: success-pop .5s ease both
    boxShadow: "0 0 48px rgba(16,185,129,.32)"
  · Texto "¡Orden Enviada!" — Syne 32px 800 #fff
  · Subtexto — Outfit 14px rgba(255,255,255,.45)
  · Duración: 2.3 segundos → regresa a selección de mesas
```

---

### 8.4 Kitchen Display (Vista Cocina)

```
padding: 28px

Header de la vista:
  · Ícono 🍳: 46×46px, borderRadius:15
    background: linear-gradient(135deg, #10B981, #059669)
    boxShadow: "0 8px 22px rgba(16,185,129,.35)"
  · Título "Kitchen Display" — Syne 26px 800 #fff
  · Subtítulo "Actualización en tiempo real · SignalR" — 12px rgba(255,255,255,.38)
  · Contador de órdenes activas (derecha):
    background: rgba(255,255,255,.08), border rgba(255,255,255,.13)
    número: Fira Code 20px 700 #34D399
    label: Outfit 12px rgba(255,255,255,.42)

Grid de cards:
  · gridTemplateColumns: repeat(auto-fill, minmax(290px, 1fr))
  · gap: 16px

Card de orden (.oc):
  Clases especiales:
    · Normal: border rgba(255,255,255,.15)
    · .urgent (elapsed > 10min): border rgba(239,68,68,.50) + glow rojo
    · .done (todos listos): border rgba(16,185,129,.42) + glow verde

  Header de la card:
    · padding: 14px 18px
    · background normal:  rgba(255,255,255,.04)
    · background urgent:  rgba(239,68,68,.10)
    · background done:    rgba(16,185,129,.10)
    · borderBottom: 1px solid rgba(255,255,255,.09)

    Lado izquierdo:
      · Nombre de mesa: Syne 17px 800 #fff
      · ID + mesero: Outfit 11px rgba(255,255,255,.38), marginTop:2
        formato: "#ORD-001 · Carlos"

    Lado derecho:
      · Tiempo: Fira Code 23px 700
        normal → color acento verde (#34D399)
        urgent → #EF4444
      · Hora de creación: 10px rgba(255,255,255,.32)

  Lista de ítems (padding:14px):
    Card de ítem:
      · background: rgba(255,255,255,.05)
      · border: 1px solid [color del estado del ítem]
      · borderRadius:12, padding:"10px 13px", marginBottom:9

      Fila superior:
        · "×{qty} {nombre}" — Outfit 15px 600 rgba(255,255,255,.86)
        · Badge de estado (derecha)

      Nota (si existe):
        · 📝 {nota} — Outfit 13px italic rgba(255,255,255,.36)
        · marginBottom:8

      Botón de acción (.abtn):
        Pending   → "▶ Iniciar"    — gradient azul-índigo
        Preparing → "✓ Listo"      — gradient verde Kitchen
        Ready     → "↗ Entregar"   — gradient slate
        Delivered → NO mostrar botón
        boxShadow: "0 4px 14px rgba(16,185,129,.35)"

IMPORTANTE: Kitchen Display solo muestra ítems con dest="Kitchen"
```

---

### 8.5 Bar Display (Vista Barra)

```
Idéntico a Kitchen Display con las siguientes diferencias:

  · Solo muestra ítems con dest="Bar"
  · Ícono: 🍹
  · Gradiente del ícono: linear-gradient(135deg, #8B5CF6, #6366F1)
  · boxShadow del ícono: "0 8px 22px rgba(139,92,246,.35)"
  · Color acento: #A78BFA (púrpura claro)
  · Gradiente botón "✓ Listo": linear-gradient(135deg, #8B5CF6, #6366F1)
  · boxShadow botón: "0 4px 14px rgba(139,92,246,.35)"
  · Título: "Bar Display"
```

---

### 8.6 Vista Resumen (Overview)

```
padding: 32px

Título: "Resumen en Tiempo Real" — Syne 28px 800 #fff
Subtítulo: "Actualizado vía SignalR WebSocket" — Outfit 13px rgba(255,255,255,.40)

--- STAT CARDS (grid 4 columnas, gap:16, marginBottom:28) ---

Cada card (.gc con animación float-in):
  padding: 24px
  · Ícono en cuadrado: 46×46px, borderRadius:14, gradient de color, fontSize:20
    boxShadow: glow de color correspondiente
  · Número: Fira Code 36px 700 #fff lineHeight:1
  · Label: Outfit 12px rgba(255,255,255,.42) marginTop:7

4 stat cards:
  1. "Órdenes Activas"    📋 gradient azul-índigo   glow rgba(59,130,246,.35)
  2. "Ítems en Cocina"    🍳 gradient verde          glow rgba(16,185,129,.35)
  3. "Ítems en Barra"     🍹 gradient púrpura-índigo glow rgba(139,92,246,.35)
  4. "Listos p/ entregar" ✅ gradient naranja-rojo   glow rgba(249,115,22,.35)

--- TABLA DE ÓRDENES ---

Contenedor:
  background: rgba(255,255,255,.07)
  backdropFilter: blur(22px)
  border: 1px solid rgba(255,255,255,.13)
  borderRadius: 20px, overflow:hidden

Header de tabla:
  padding: 16px 22px
  borderBottom: 1px solid rgba(255,255,255,.09)
  "Órdenes Activas" — Syne 17px 800 #fff
  Dot verde pulsante + "en vivo" (derecha)

Columnas (headers): Orden | Mesa | Mesero | Items | Cocina | Barra | Tiempo | Estado
  th: padding "10px 18px", fontSize:10, fontWeight:700
      color rgba(255,255,255,.35), letterSpacing:.8, uppercase
      borderBottom: 1px solid rgba(255,255,255,.07)
  tr header: background rgba(0,0,0,.22)

Filas:
  · Alternadas: par→transparent, impar→rgba(255,255,255,.025)
  · borderBottom: 1px solid rgba(255,255,255,.05)
  · padding de celdas: "13px 18px"

  Columnas específicas:
    Orden:   Fira Code 12px 600 #60A5FA
    Mesa:    Outfit 13px 600 rgba(255,255,255,.86)
    Mesero:  Outfit 13px rgba(255,255,255,.46)
    Items:   Fira Code 14px 700 #fff
    Cocina:  Outfit 12px #34D399   — formato: "X/Y listos"
    Barra:   Outfit 12px #A78BFA   — formato: "X/Y listos"
    Tiempo:  Fira Code 13px 700 — normal:#fff | >10min:#EF4444
    Estado:  <Badge status={order.status}/>
```

---

## 9. Modelo de Datos (Mock)

### Estructura de Order:
```js
{
  id:        "ORD-001",          // string
  table:     "Mesa 4",           // string
  waiter:    "Carlos",           // string
  type:      "Table",            // Table | Bar | TakeAway | Delivery
  createdAt: "12:34",            // string HH:MM
  status:    "InProgress",       // Pending | InProgress | Ready | Delivered | Cancelled
  elapsed:   8,                  // minutos transcurridos (number)
  items:     [ OrderItem ]
}
```

### Estructura de OrderItem:
```js
{
  id:     1,
  name:   "Pollo a la Brasa",
  qty:    2,
  notes:  "Sin cebolla",         // string vacío si no hay nota
  dest:   "Kitchen",             // Kitchen | Bar  ← separación automática
  status: "Preparing"            // Pending | Preparing | Ready | Delivered
}
```

### Estructura de MenuItem:
```js
{
  id:       "p1",
  name:     "Pollo a la Brasa",
  price:    12.5,
  dest:     "Kitchen",           // Kitchen | Bar  ← se hereda al OrderItem
  category: "Platos",            // Platos | Entradas | Bebidas
  emoji:    "🍗"
}
```

### Estructura de Table:
```js
{
  id:     "t1",
  name:   "Mesa 1",
  status: "free",                // free | occupied
  type:   "bar"                  // opcional — solo para barras
}
```

---

## 10. Lógica de Negocio (Frontend)

### 10.1 Separación automática Kitchen / Bar
- Cada `MenuItem` tiene `dest: "Kitchen" | "Bar"`
- Al agregar al carrito, el `dest` se copia al `CartItem`
- Kitchen Display filtra: `items.filter(i => i.dest === "Kitchen")`
- Bar Display filtra: `items.filter(i => i.dest === "Bar")`

### 10.2 Flujo de estados del ítem
```
Pending → Preparing → Ready → Delivered

Botón "▶ Iniciar"   → Pending   a Preparing
Botón "✓ Listo"     → Preparing a Ready
Botón "↗ Entregar"  → Ready     a Delivered
Estado Delivered    → NO mostrar botón
```

### 10.3 Alerta de urgencia
```
order.elapsed > 10 minutos
→ card recibe clase ".urgent"
→ borde rojo, glow rojo
→ tiempo en color #EF4444
```

### 10.4 Card completada
```
Todos los ítems con status "Ready" o "Delivered"
→ card recibe clase ".done"
→ borde verde, glow verde
```

### 10.5 Envío de orden
```
1. Click "Enviar Orden →"
2. Mostrar pantalla de éxito (success-pop animation)
3. Esperar 2.3 segundos
4. Resetear: carrito vacío, volver a selección de mesas
```

---

## 11. Estructura del Componente React

```
App
├── Background          ← orbs fijos, zIndex:0
├── TopBar              ← navegación sticky, zIndex:100
├── WaiterView          ← vista mesero
│   ├── Paso "tables"   ← selección de mesa
│   └── Paso "menu"     ← menú + carrito
│       └── NoteModal   ← modal de notas (condicional)
├── DisplayView         ← Kitchen o Bar (mismo componente, prop dest)
└── OverviewView        ← resumen ejecutivo

Componentes compartidos:
├── Badge({status})     ← badge de estado del ítem
└── DestTag({dest})     ← tag Cocina/Bar
```

---

## 12. Reglas Absolutas (nunca violar)

1. **Nunca usar fondo sólido** — siempre los orbs + gradiente oscuro
2. **Nunca usar Arial, Roboto, Inter o System fonts** — solo Syne + Outfit + Fira Code
3. **Nunca usar colores planos en botones de acción** — siempre gradientes
4. **Nunca mostrar botón de acción en ítems con status "Delivered"**
5. **Kitchen Display solo muestra ítems Kitchen. Bar Display solo muestra ítems Bar**
6. **Animaciones float-in siempre con delay escalonado** en grids
7. **Glassmorphism obligatorio** — `backdrop-filter: blur()` en todas las cards
8. **Fuentes monospace (Fira Code) para precios, tiempos y IDs exclusivamente**
9. **Dot SignalR siempre visible y animado** — indica conexión activa
10. **Tamaños de fuente de la tabla de la sección 2** — no reducir por debajo de lo especificado

---

## 13. Scrollbar personalizado (global)

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.18);
  border-radius: 99px;
}
```

---

*Versión 1.0 — Bohuco POS Frontend Spec — 2026*

---

## 14. Arquitectura de Archivos — Reglas Obligatorias

### 14.1 Regla General

> **Cada componente vive en su propia carpeta** con su archivo `.tsx`, su CSS Module `.module.css` y su barrel `index.ts`.
> **Todos los types e interfaces** se definen en `src/types/index.ts` — nunca inline en los componentes.
> **Nunca mezclar estilos** — no usar `style={{}}` inline si el valor puede ir en el CSS Module. Solo se permite inline para valores dinámicos (colores calculados en runtime, delays de animación, etc).

---

### 14.2 Estructura de Carpetas

```
src/
├── types/
│   └── index.ts                    ← TODOS los tipos e interfaces del proyecto
│
├── constants/
│   └── design.ts                   ← tokens de diseño: colores, fuentes, gradientes
│
├── components/
│   ├── Background/
│   │   ├── Background.tsx
│   │   ├── Background.module.css
│   │   └── index.ts
│   │
│   ├── TopBar/
│   │   ├── TopBar.tsx
│   │   ├── TopBar.module.css
│   │   └── index.ts
│   │
│   ├── Badge/
│   │   ├── Badge.tsx
│   │   ├── Badge.module.css
│   │   └── index.ts
│   │
│   ├── DestTag/
│   │   ├── DestTag.tsx
│   │   ├── DestTag.module.css
│   │   └── index.ts
│   │
│   ├── NoteModal/
│   │   ├── NoteModal.tsx
│   │   ├── NoteModal.module.css
│   │   └── index.ts
│   │
│   └── SuccessScreen/
│       ├── SuccessScreen.tsx
│       ├── SuccessScreen.module.css
│       └── index.ts
│
├── views/
│   ├── WaiterView/
│   │   ├── WaiterView.tsx
│   │   ├── WaiterView.module.css
│   │   ├── TableSelector/
│   │   │   ├── TableSelector.tsx
│   │   │   ├── TableSelector.module.css
│   │   │   └── index.ts
│   │   ├── MenuPanel/
│   │   │   ├── MenuPanel.tsx
│   │   │   ├── MenuPanel.module.css
│   │   │   └── index.ts
│   │   ├── CartSidebar/
│   │   │   ├── CartSidebar.tsx
│   │   │   ├── CartSidebar.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── DisplayView/
│   │   ├── DisplayView.tsx
│   │   ├── DisplayView.module.css
│   │   ├── OrderCard/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderCard.module.css
│   │   │   └── index.ts
│   │   ├── ItemRow/
│   │   │   ├── ItemRow.tsx
│   │   │   ├── ItemRow.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── OverviewView/
│       ├── OverviewView.tsx
│       ├── OverviewView.module.css
│       ├── StatCard/
│       │   ├── StatCard.tsx
│       │   ├── StatCard.module.css
│       │   └── index.ts
│       ├── OrdersTable/
│       │   ├── OrdersTable.tsx
│       │   ├── OrdersTable.module.css
│       │   └── index.ts
│       └── index.ts
│
├── styles/
│   ├── globals.css                 ← reset, body, scrollbar, animaciones, fuentes
│   └── variables.css               ← CSS custom properties (--color-glass, etc.)
│
└── App.tsx
```

---

### 14.3 `src/types/index.ts` — Todos los Types

```ts
// ─── ENUMS ───────────────────────────────────────────────────────

export type OrderType = 'Table' | 'Bar' | 'TakeAway' | 'Delivery'

export type OrderStatus =
  | 'Pending'
  | 'InProgress'
  | 'Ready'
  | 'Delivered'
  | 'Cancelled'

export type ItemStatus =
  | 'Pending'
  | 'Preparing'
  | 'Ready'
  | 'Delivered'

export type ItemDestination = 'Kitchen' | 'Bar'

export type TableStatus = 'free' | 'occupied'

export type ViewId = 'waiter' | 'kitchen' | 'bar' | 'overview' | 'products' | 'manager'

export type WaiterStep = 'tables' | 'menu'

export type MenuCategory = 'Todos' | 'Platos' | 'Entradas' | 'Bebidas'

// ─── ENTITIES ────────────────────────────────────────────────────

export interface OrderItem {
  id: number
  name: string
  qty: number
  notes: string
  dest: ItemDestination
  status: ItemStatus
}

export interface Order {
  id: string
  table: string
  waiter: string
  type: OrderType
  createdAt: string         // formato "HH:MM"
  status: OrderStatus
  elapsed: number           // minutos transcurridos
  items: OrderItem[]
}

export interface MenuItem {
  id: string
  name: string
  price: number
  dest: ItemDestination
  category: Exclude<MenuCategory, 'Todos'>
  emoji: string
}

export interface TableItem {
  id: string
  name: string
  status: TableStatus
  type?: 'bar'              // solo para barras
}

// ─── CART ────────────────────────────────────────────────────────

export interface CartItem extends MenuItem {
  qty: number
  notes: string
}

// ─── DESIGN SYSTEM ───────────────────────────────────────────────

export interface StatusStyle {
  bg: string
  border: string
  text: string
}

export interface StatCardData {
  label: string
  value: number
  icon: string
  grad: string
  glow: string
}

// ─── COMPONENT PROPS ─────────────────────────────────────────────

export interface BadgeProps {
  status: ItemStatus | OrderStatus
}

export interface DestTagProps {
  dest: ItemDestination
}

export interface TopBarProps {
  view: ViewId
  setView: (view: ViewId) => void
}

export interface DisplayViewProps {
  dest: ItemDestination
}

export interface OrderCardProps {
  order: Order
  dest: ItemDestination
  onUpdateStatus: (orderId: string, itemId: number, newStatus: ItemStatus) => void
}

export interface ItemRowProps {
  item: OrderItem
  accentGrad: string
  accentGlow: string
  onUpdateStatus: (itemId: number, newStatus: ItemStatus) => void
}

export interface StatCardProps {
  data: StatCardData
  animationDelay: number
}

export interface NoteModalProps {
  itemId: string
  initialNote: string
  onSave: (itemId: string, note: string) => void
  onClose: () => void
}

export interface TableSelectorProps {
  tables: TableItem[]
  onSelect: (table: TableItem) => void
}

export interface MenuPanelProps {
  selectedTable: TableItem
  items: MenuItem[]
  cart: CartItem[]
  onAdd: (item: MenuItem) => void
  onBack: () => void
  activeCategory: MenuCategory
  onCategoryChange: (cat: MenuCategory) => void
}

export interface CartSidebarProps {
  cart: CartItem[]
  selectedTable: TableItem
  onAdd: (item: MenuItem) => void
  onRemove: (itemId: string) => void
  onAddNote: (itemId: string, note: string) => void
  onSend: () => void
}
```

---

### 14.4 `src/constants/design.ts` — Tokens de Diseño

```ts
import type { StatusStyle } from '../types'

export const FONTS = {
  display: "'Syne', sans-serif",
  body:    "'Outfit', sans-serif",
  mono:    "'Fira Code', monospace",
} as const

export const STATUS_COLORS: Record<string, StatusStyle> = {
  pending:   { bg:'rgba(249,115,22,0.15)',  border:'rgba(249,115,22,0.40)',  text:'#F97316' },
  preparing: { bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.40)',  text:'#3B82F6' },
  ready:     { bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.40)',  text:'#10B981' },
  delivered: { bg:'rgba(148,163,184,0.15)', border:'rgba(148,163,184,0.30)', text:'#94A3B8' },
}

export const STATUS_LABELS: Record<string, string> = {
  Pending:   'Pendiente',
  Preparing: 'Preparando',
  Ready:     'Listo ✓',
  Delivered: 'Entregado',
}

export const ACTION_LABELS: Record<string, string> = {
  Pending:   '▶ Iniciar',
  Preparing: '✓ Listo',
  Ready:     '↗ Entregar',
}

export const ACTION_GRADIENTS: Record<string, string> = {
  Pending:   'linear-gradient(135deg,#3B82F6,#6366F1)',
  Preparing_Kitchen: 'linear-gradient(135deg,#10B981,#059669)',
  Preparing_Bar:     'linear-gradient(135deg,#8B5CF6,#6366F1)',
  Ready:     'linear-gradient(135deg,#64748B,#475569)',
}

export const NEXT_STATUS: Partial<Record<string, string>> = {
  Pending:   'Preparing',
  Preparing: 'Ready',
  Ready:     'Delivered',
}

export const DISPLAY_CONFIG = {
  Kitchen: {
    icon:       '🍳',
    title:      'Kitchen Display',
    accentColor:'#34D399',
    accentGrad: 'linear-gradient(135deg,#10B981,#059669)',
    accentGlow: 'rgba(16,185,129,.35)',
  },
  Bar: {
    icon:       '🍹',
    title:      'Bar Display',
    accentColor:'#A78BFA',
    accentGrad: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
    accentGlow: 'rgba(139,92,246,.35)',
  },
} as const

export const NAV_TABS = [
  { id: 'waiter',   icon: '🧾', label: 'Mesero'  },
  { id: 'kitchen',  icon: '🍳', label: 'Cocina'  },
  { id: 'bar',      icon: '🍹', label: 'Barra'   },
  { id: 'overview', icon: '📊', label: 'Resumen' },
] as const
```

---

### 14.5 `src/styles/globals.css` — Estilos Globales

```css
/* ── Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;600&display=swap');

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Outfit', sans-serif;
  background: linear-gradient(135deg,#0a0f1e 0%,#14082e 40%,#071a30 70%,#0a0f1e 100%);
  min-height: 100vh;
  color: rgba(255,255,255,0.90);
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 99px; }

/* ── Animations ── */
@keyframes pulse-dot {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:.5; transform:scale(1.5); }
}

@keyframes float-in {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}

@keyframes success-pop {
  0%   { transform:scale(0.7); opacity:0; }
  60%  { transform:scale(1.1); }
  100% { transform:scale(1);   opacity:1; }
}
```

---

### 14.6 `src/styles/variables.css` — CSS Custom Properties

```css
:root {
  /* Glass surfaces */
  --glass-card:    rgba(255,255,255,0.09);
  --glass-hover:   rgba(255,255,255,0.13);
  --glass-mid:     rgba(255,255,255,0.15);
  --glass-strong:  rgba(255,255,255,0.20);
  --nav-bg:        rgba(10,15,30,0.70);
  --cart-bg:       rgba(255,255,255,0.07);
  --modal-bg:      rgba(14,20,46,0.95);
  --tab-container: rgba(0,0,0,0.25);

  /* Borders */
  --border-subtle:  rgba(255,255,255,0.10);
  --border-default: rgba(255,255,255,0.15);
  --border-mid:     rgba(255,255,255,0.18);
  --border-strong:  rgba(255,255,255,0.28);
  --border-active:  rgba(255,255,255,0.32);

  /* Text */
  --text-primary:  rgba(255,255,255,0.90);
  --text-second:   rgba(255,255,255,0.86);
  --text-mid:      rgba(255,255,255,0.60);
  --text-muted:    rgba(255,255,255,0.42);
  --text-dim:      rgba(255,255,255,0.38);
  --text-disabled: rgba(255,255,255,0.28);

  /* Accents */
  --blue:   #3B82F6;
  --purple: #8B5CF6;
  --green:  #10B981;
  --orange: #F97316;
  --red:    #EF4444;
  --slate:  #64748B;

  /* Border radius */
  --radius-pill:   99px;
  --radius-card:   20px;
  --radius-menu:   16px;
  --radius-btn:    12px;
  --radius-action: 10px;
  --radius-tag:    6px;
}
```

---

### 14.7 Reglas de CSS Modules

1. **Un `.module.css` por componente** — nunca compartir archivos de estilos entre componentes
2. **Usar `var(--token)` de `variables.css`** para colores y radios — nunca hardcodear valores repetidos
3. **Estilos dinámicos en runtime** (colores de estado, delays de animación, gradientes calculados) → seguir usando `style={{}}` inline en el `.tsx`
4. **Nunca usar `!important`**
5. **Nombres de clases en camelCase** — ej: `.orderCard`, `.urgentCard`, `.statusBadge`
6. **Pseudo-clases y animaciones** van en el `.module.css` — ej: `:hover`, `:focus`, `@keyframes` locales si son únicas del componente
7. **Animaciones globales** (`float-in`, `pulse-dot`, `success-pop`) van en `globals.css` y se referencian desde los modules

### Ejemplo de estructura de un componente:

```tsx
// Badge/Badge.tsx
import styles from './Badge.module.css'
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/design'
import type { BadgeProps } from '../../types'

export function Badge({ status }: BadgeProps) {
  const s = STATUS_COLORS[status.toLowerCase()]
  return (
    <span
      className={styles.badge}
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
```

```css
/* Badge/Badge.module.css */
.badge {
  border-radius: var(--radius-pill);
  padding: 2px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
}
```

```ts
// Badge/index.ts
export { Badge } from './Badge'
```

---

### 14.8 Reglas de TypeScript

1. **Nunca usar `any`** — tipar todo explícitamente
2. **Props siempre con interface** definida en `src/types/index.ts`
3. **Eventos tipados** — usar `React.MouseEvent`, `React.ChangeEvent<HTMLInputElement>`, etc.
4. **`useState` siempre con tipo explícito** — ej: `useState<CartItem[]>([])`
5. **Funciones con tipo de retorno explícito** cuando no es obvio
6. **`as const`** en objetos de constantes que no deben mutar
7. **No usar enums de TypeScript** — preferir `type` union strings (ya definidos en `index.ts`)

---

### 14.9 Regla de Barrel Exports (`index.ts`)

Cada carpeta de componente debe tener un `index.ts` que reexporte:

```ts
// TopBar/index.ts
export { TopBar } from './TopBar'
export type { TopBarProps } from '../../types'   // opcional, solo si el consumidor lo necesita
```

Esto permite importar limpio desde cualquier lugar:
```ts
import { TopBar } from '@/components/TopBar'
import { WaiterView } from '@/views/WaiterView'
```

---

## 15. Authentication & User Management

### User Type (src/types/index.ts)
```ts
export type UserRole = 'Waiter' | 'Kitchen' | 'Bar' | 'Admin'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
}
```

### Auth Store (src/stores/authStore.ts)
- JWT token management with localStorage persistence
- User info storage with role-based access
- Login/Logout actions
- Protected route checks

### Login/Register Flow
- Login page with email/password
- Register page with role selection
- JWT token returned on successful auth
- Automatic redirect to role-appropriate view

---

## 16. Products View (Admin Only)

### Route: `/productos`
- Accessible only to Admin role
- Full CRUD operations for menu products
- Product fields: name, price, category, destination (Kitchen/Bar), emoji
- Features:
  - Search functionality
  - Pagination (5 items per page)
  - Add product modal
  - Edit product modal
  - Delete confirmation modal

### Components
- ProductSearch - Search input with filtering
- ProductList - Grid display with edit/delete actions
- ProductModal - Form for add/edit operations
- ConfirmModal - Delete confirmation dialog

---

## 17. Manager Dashboard (Admin Only)

### Route: `/gerente`
- Accessible only to Admin role
- Sales analytics dashboard
- Features:
  - Date range filter for sales
  - Low inventory alerts
  - Sales statistics cards
  - Pagination (5 items per page)

### API Integration
- `GET /api/dashboard/sales?startDate=&endDate=` - Sales data
- `GET /api/dashboard/low-inventory` - Products with low stock

---

## 18. Role-Based Navigation

### NAV_TABS (src/constants/design.ts)
```ts
export const NAV_TABS = [
  { id: 'waiter',   icon: '🧾', label: 'Mesero'    },
  { id: 'kitchen',  icon: '🍳', label: 'Cocina'    },
  { id: 'bar',      icon: '🍹', label: 'Barra'     },
  { id: 'overview', icon: '📊', label: 'Resumen'   },
  { id: 'products', icon: '📦', label: 'Productos' }, // Admin only
  { id: 'manager',  icon: '📈', label: 'Gerente'  }, // Admin only
] as const
```

### Visibility Rules
| Role | Visible Tabs |
|------|--------------|
| Admin | All 6 tabs |
| Waiter | Mesero, Cocina, Barra, Resumen |
| Kitchen | Cocina |
| Bar | Barra |

### Default View by Role
- Admin → 'manager' (Gerente)
- Waiter → 'waiter' (Mesero)
- Kitchen → 'kitchen'
- Bar → 'bar'

---

## 19. SignalR Integration with JWT

### Connection
```
/hubs/orders?token=<jwt_token>
```

### Waiter Group Join
```ts
// On login, waiter joins their personal group
hubConnection.invoke('JoinWaiterGroup', user.firstName)
```

### Notifications
- Kitchen/Bar updates item status → broadcasts to waiter's group
- Waiter receives toast notification with item details
- Notification includes: item name, new status, order info

---

## 20. PDF Bill Generation

### Endpoint
- `GET /api/pdf/bill/{tabId}` - Returns PDF document

### Frontend Implementation
- TabDetailModal shows PDF in iframe when bill is requested
- Uses getAuthHeaders() for authenticated requests
- Professional thermal ticket format (80mm width)

---

## 21. Pagination Component

### Component: src/components/Pagination/
- Pagination.tsx - Main component
- Pagination.module.css - Styles

### Props
```ts
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
```

### Features
- First/Previous/Next/Last buttons
- Page number display
- Disabled states for boundary pages

---

*Versión 1.2 — Bohuco POS Frontend Spec — 2026*
