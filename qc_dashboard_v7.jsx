import { useState, useCallback, useMemo } from "react";
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─── QCER MASTER DATA ────────────────────────────────────────────────────────
const QCER_NAME = {
  "hassanibnhashim@gmail.com":"Amjad","ahsanullah996655@gmail.com":"Ahsan",
  "saudbaloch129@gmail.com":"Saud","pshahzaib420@gmail.com":"Shahzaib",
  "abubakarladla714@gmail.com":"Abubakar","mekailraza037@gmail.com":"Asad Ullah",
  "khalidnawab271900@gmail.com":"Khalid","rohan535389@gmail.com":"Rohan",
  "awaiskaimkhani2@gmail.com":"Awais","janwrihasnainhaider@gmail.com":"Hassnain",
  "khannnomi86@gmail.com":"Noman","Mobile User":"Mobile User",
  "ibadansari343@gmail.com":"Ibad","ameeniqra72@gmail.com":"Iqra",
  "adeelkhan586443@gmail.com":"Adeel","khanzadizadi48@gmail.com":"Khanzadi",
  "alishkhanalishkhan271@gmail.com":"Alishba","shiblyjunaid1707@gmail.com":"Junaid",
  "sellyraiz72@gmail.com":"Selly","kamilgujjar68@gmail.com":"Kamil",
  "Noman":"Noman","alibabagsc625@gmail.com":"Ali","mubashirh346@gmail.com":"Mubashir",
  "malikasad124578@gmail.com":"Asad Malik","saleemrehman2008@gmail.com":"Shahzaib",
  "sarfrazbabber@gmail.com":"Sarfaraz","saud":"Saud","Ahsan":"Ahsan",
  "hinajaved2828@gmail.com":"Hina","ishaqsaqi934@gmail.com":"Ishaq",
  "sumaiyakamalk@gmail.com":"Sumaiya","ali":"Ali","fnomi604@gmail.com":"Noman",
  "faisalsageer123@gmail.com":"Faisal","Naeem Ashraf":"Naeem","shahzaib":"Shahzaib",
  "fahadabbas.home@gmail.com":"Fahad","matalabdul227@gmail.com":"Matal",
  "Awais":"Awais","Sherdar":"Sherdar","abdul wahab khaskheli":"Shahzaib",
  "khaskheli.1998@gmail.com":"Shahzaib","muhammadalihdhssh@gmail.com":"M.Ali",
  "Sumiya":"Sumaiya","vinitgiri460@gmail.com":"Vinit","mukulanand1998@gmail.com":"Mukul",
  "yashraj200307@gmail.com":"Yashraj","ac13315686@gmail.com":"AC",
  "naemashraf":"Naeem","naeemashraf":"Naeem","vivek@joinfleek.com":"Vivek",
  "wali.rocks27@gmail.com":"wali","Alishba ":"Alishba","Ali":"Ali",
};
const QCER_REGION = {
  "hassanibnhashim@gmail.com":"Zone","ahsanullah996655@gmail.com":"Zone",
  "saudbaloch129@gmail.com":"Zone","pshahzaib420@gmail.com":"Zone",
  "abubakarladla714@gmail.com":"Zone","mekailraza037@gmail.com":"Zone",
  "khalidnawab271900@gmail.com":"Zone","rohan535389@gmail.com":"Zone",
  "awaiskaimkhani2@gmail.com":"Zone","janwrihasnainhaider@gmail.com":"QC Center",
  "khannnomi86@gmail.com":"Zone","Mobile User":"Testing",
  "ibadansari343@gmail.com":"QC Center","ameeniqra72@gmail.com":"QC Center",
  "adeelkhan586443@gmail.com":"QC Center","khanzadizadi48@gmail.com":"QC Center",
  "alishkhanalishkhan271@gmail.com":"QC Center","shiblyjunaid1707@gmail.com":"QC Center",
  "sellyraiz72@gmail.com":"QC Center","kamilgujjar68@gmail.com":"QC Center",
  "Noman":"QC Center","alibabagsc625@gmail.com":"QC Center","mubashirh346@gmail.com":"QC Center",
  "malikasad124578@gmail.com":"Zone","saleemrehman2008@gmail.com":"Zone",
  "sarfrazbabber@gmail.com":"QC Center","saud":"Zone","Ahsan":"Zone",
  "hinajaved2828@gmail.com":"QC Center","ishaqsaqi934@gmail.com":"QC Center",
  "sumaiyakamalk@gmail.com":"QC Center","ali":"QC Center","fnomi604@gmail.com":"Zone",
  "faisalsageer123@gmail.com":"QC Center","Naeem Ashraf":"QC Center","shahzaib":"Zone",
  "fahadabbas.home@gmail.com":"Zone","matalabdul227@gmail.com":"QC Center",
  "Awais":"Zone","Sherdar":"Zone","abdul wahab khaskheli":"Zone",
  "khaskheli.1998@gmail.com":"Zone","muhammadalihdhssh@gmail.com":"QC Center",
  "Sumiya":"QC Center","vinitgiri460@gmail.com":"India","mukulanand1998@gmail.com":"India",
  "yashraj200307@gmail.com":"India","ac13315686@gmail.com":"India",
  "naemashraf":"QC Center","naeemashraf":"QC Center","vivek@joinfleek.com":"Testing",
  "wali.rocks27@gmail.com":"Testing","Alishba ":"QC Center","Ali":"QC Center",
};

const AUTO_APPROVE = new Set([
  "vintage-storm","thevintagelux","vintage-storm-reworks","the-vintage-wholesale-collective",
  "y2kvault","vintage-theory","vintage-library","thrift-theory-2","hierloom",
  "pjp2-thrifted-treasure","victorias-closet","pre-loved-clothing","casa-moda-vintage"
]);

const MN = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── UTILS ───────────────────────────────────────────────────────────────────
const pd  = s => { if (!s) return null; try { const d=new Date(s.trim()); return isNaN(d)?null:d; } catch{return null;} };
const pi  = s => { try{return parseInt(String(s||0).replace(/,/g,""),10)||0;}catch{return 0;} };
const gn  = r => { if (!r?.trim()) return null; return QCER_NAME[r.trim()]||r.trim(); };
const gr  = r => { if (!r?.trim()) return null; return QCER_REGION[r.trim()]||null; };
const toISO = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmtD  = iso => { if (!iso) return ""; const d=new Date(iso+"T12:00:00"); return d.toLocaleDateString("en-US",{day:"2-digit",month:"short",year:"numeric"}); };
const same  = (dt,d) => dt&&dt.getFullYear()===d.getFullYear()&&dt.getMonth()===d.getMonth()&&dt.getDate()===d.getDate();

// ─── FILTERS ─────────────────────────────────────────────────────────────────
const isVZ  = r => r.is_zone_vendor==="true";
const isIND = r => r.vendor_country==="IN";
const isBB  = r => r.bargain_bin_flag?.toLowerCase()==="true";
const qReg  = r => gr(r.qcer_name);

function filterMain(rows,tab){
  const base=rows.filter(r=>!isBB(r));
  if(tab==="India") return base.filter(isIND);
  if(tab==="Zone") return base.filter(r=>{
    if(isIND(r)) return false;
    const reg=qReg(r);
    if(reg==="Zone") return true;
    if(reg==="QC Center"||reg==="India") return false;
    return isVZ(r);
  });
  if(tab==="QC Center") return base.filter(r=>{
    if(isIND(r)) return false;
    const reg=qReg(r);
    if(reg==="QC Center") return true;
    if(reg==="Zone"||reg==="India") return false;
    return !isVZ(r);
  });
  return base;
}
function filterBB(rows,which){
  const base=rows.filter(isBB);
  if(which==="Zone") return base.filter(r=>{const reg=qReg(r);if(reg==="Zone")return true;if(reg==="QC Center"||reg==="India")return false;return isVZ(r);});
  if(which==="QC")   return base.filter(r=>{const reg=qReg(r);if(reg==="QC Center")return true;if(reg==="Zone"||reg==="India")return false;return !isVZ(r)&&!isIND(r);});
  return base;
}

// ─── BUILDERS ────────────────────────────────────────────────────────────────
function buildDaily(rows,iso){
  const d=new Date(iso+"T12:00:00");
  const app =rows.filter(r=>same(pd(r.qc_approved_at),d));
  const hld =rows.filter(r=>same(pd(r.qc_hold_at),d));
  const auto=rows.filter(r=>r.latest_status==="QC_PENDING"&&AUTO_APPROVE.has(r.vendor)&&same(pd(r.qc_pending_at),d));
  const pend=rows.filter(r=>r.latest_status==="QC_PENDING"&&!AUTO_APPROVE.has(r.vendor));
  const qm={};
  const add=(r,t)=>{
    const n=gn(r.qcer_name)||"W/O QC";
    if(!qm[n])qm[n]={a:0,au:0,h:0,hu:0,v:new Set(),f:[],aa:0};
    const q=pi(r.quantity_sold);
    if(t==="a"||t==="aa"){qm[n].a++;qm[n].au+=q;if(t==="aa")qm[n].aa++;}
    if(t==="h"){qm[n].h++;qm[n].hu+=q;}
    if(r.vendor)qm[n].v.add(r.vendor);
    if(r.fleek_id)qm[n].f.push(r.fleek_id);
  };
  app.forEach(r=>add(r,"a")); hld.forEach(r=>add(r,"h")); auto.forEach(r=>add(r,"aa"));
  return{
    app:app.length,appU:app.reduce((s,r)=>s+pi(r.quantity_sold),0),
    hld:hld.length,hldU:hld.reduce((s,r)=>s+pi(r.quantity_sold),0),
    pend:pend.length,auto:auto.length,
    qcers:Object.entries(qm).sort(([,a],[,b])=>(b.a+b.h)-(a.a+a.h))
      .map(([n,v])=>({n,a:v.a,au:v.au,h:v.h,hu:v.hu,v:v.v.size,f:v.f.slice(0,20),aa:v.aa}))
  };
}
function buildMonthly(rows,m,y){
  const app=rows.filter(r=>{const d=pd(r.qc_approved_at);return d&&d.getMonth()+1===m&&d.getFullYear()===y;});
  const hld=rows.filter(r=>{const d=pd(r.qc_hold_at);return d&&d.getMonth()+1===m&&d.getFullYear()===y;});
  const qm={};
  app.forEach(r=>{const n=gn(r.qcer_name)||"W/O QC";if(!qm[n])qm[n]={o:0,q:0,h:0};qm[n].o++;qm[n].q+=pi(r.quantity_sold);});
  hld.forEach(r=>{const n=gn(r.qcer_name)||"W/O QC";if(!qm[n])qm[n]={o:0,q:0,h:0};qm[n].h++;});
  return Object.entries(qm).sort(([,a],[,b])=>b.o-a.o).map(([n,v])=>({n,o:v.o,q:v.q,h:v.h,avg:v.o?Math.round(v.q/v.o):0}));
}
function buildCharts(rows){
  const co={},po={},cq={},pq={};
  rows.forEach(r=>{
    let d=pd(r.qc_approved_at);
    if(!d&&r.latest_status==="QC_PENDING"&&AUTO_APPROVE.has(r.vendor))d=pd(r.qc_pending_at);
    if(!d)return;
    const day=d.getDate(),qty=pi(r.quantity_sold);
    if(d.getMonth()===2&&d.getFullYear()===2026){co[day]=(co[day]||0)+1;cq[day]=(cq[day]||0)+qty;}
    if(d.getMonth()===1&&d.getFullYear()===2026){po[day]=(po[day]||0)+1;pq[day]=(pq[day]||0)+qty;}
  });
  const dO=[...new Set([...Object.keys(co),...Object.keys(po)].map(Number))].sort((a,b)=>a-b);
  const dQ=[...new Set([...Object.keys(cq),...Object.keys(pq)].map(Number))].sort((a,b)=>a-b);
  return{
    ord:dO.map(d=>({day:d,curr:co[d]??null,prev:po[d]??null})),
    qty:dQ.map(d=>({day:d,curr:cq[d]??null,prev:pq[d]??null}))
  };
}

// ─── CSV PARSER ──────────────────────────────────────────────────────────────
function parseCSV(text){
  const lines=text.split(/\r?\n/);
  const hdr=[]; let cur="",inQ=false;
  for(const ch of lines[0]){if(ch==='"')inQ=!inQ;else if(ch===','&&!inQ){hdr.push(cur.trim());cur="";}else cur+=ch;}
  hdr.push(cur.trim());
  return lines.slice(1).map(line=>{
    const vals=[]; cur=""; inQ=false;
    for(const ch of line){if(ch==='"')inQ=!inQ;else if(ch===','&&!inQ){vals.push(cur);cur="";}else cur+=ch;}
    vals.push(cur);
    if(vals.length<5)return null;
    const row={};
    hdr.forEach((h,i)=>{row[h]=(vals[i]||"").replace(/^"|"$/g,"").trim();});
    return row;
  }).filter(Boolean);
}

// ─── CANVAS CHART DRAWING (for screenshot — bypasses SVG issues) ──────────────
function drawLineChartToCanvas(data, width, height, prevKey, currKey, prevLabel, currLabel) {
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");

  const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;

  // Background
  ctx.fillStyle = "#0b1120";
  ctx.fillRect(0, 0, width, height);

  // Grid lines
  const gridLines = 5;
  const allVals = data.flatMap(d => [d[prevKey], d[currKey]]).filter(v => v != null);
  const maxVal = allVals.length ? Math.max(...allVals) : 1;
  const minVal = 0;
  const range = maxVal - minVal || 1;

  ctx.strokeStyle = "#0f2040";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridLines; i++) {
    const y = PAD.top + H - (H * i / gridLines);
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + W, y); ctx.stroke();
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Courier New";
    ctx.textAlign = "right";
    const label = Math.round(minVal + (range * i / gridLines));
    ctx.fillText(label, PAD.left - 4, y + 3);
  }

  // X-axis labels
  const days = data.map(d => d.day);
  const step = Math.ceil(days.length / 10);
  ctx.fillStyle = "#64748b";
  ctx.font = "9px Courier New";
  ctx.textAlign = "center";
  days.forEach((day, i) => {
    if (i % step === 0 || i === days.length - 1) {
      const x = PAD.left + (W * i / Math.max(days.length - 1, 1));
      ctx.fillText(day, x, height - PAD.bottom + 14);
    }
  });

  // Draw line function
  const drawLine = (key, color, dashed) => {
    const pts = data.map((d, i) => ({
      x: PAD.left + (W * i / Math.max(data.length - 1, 1)),
      y: d[key] != null ? PAD.top + H - (H * (d[key] - minVal) / range) : null
    }));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    if (dashed) ctx.setLineDash([6, 3]); else ctx.setLineDash([]);
    ctx.beginPath();
    let started = false;
    pts.forEach(p => {
      if (p.y == null) return;
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    // Dots
    pts.forEach(p => {
      if (p.y == null) return;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    });
  };

  drawLine(prevKey, "#3b82f6", true);
  drawLine(currKey, "#f59e0b", false);

  // Legend
  const legY = height - 10;
  const legItems = [[prevLabel, "#3b82f6", true], [currLabel, "#f59e0b", false]];
  let legX = PAD.left;
  legItems.forEach(([label, color, dashed]) => {
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    if (dashed) ctx.setLineDash([4, 2]); else ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(legX, legY); ctx.lineTo(legX + 24, legY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#94a3b8"; ctx.font = "10px Courier New"; ctx.textAlign = "left";
    ctx.fillText(label, legX + 28, legY + 4);
    legX += ctx.measureText(label).width + 52;
  });

  return canvas;
}

// ─── JPG DOWNLOAD ─────────────────────────────────────────────────────────────
async function downloadJPG(filename, chartsData, curM, prevM, tabName, dateLabel) {
  const el = document.getElementById("capture-root");
  if (!el) { alert("Nothing to capture."); return; }

  if (!window.html2canvas) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = res; s.onerror = () => rej(new Error("Failed to load html2canvas"));
      document.head.appendChild(s);
    });
  }

  const MN2 = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const prevLabel = `${MN2[prevM]} (Prev)`;
  const currLabel = `${MN2[curM]} (Curr)`;

  // 1. Replace recharts SVG wrappers with native canvas drawings
  const svgRestores = [];
  const rechartsWrappers = Array.from(el.querySelectorAll(".recharts-wrapper"));
  for (const wrapper of rechartsWrappers) {
    const rect = wrapper.getBoundingClientRect();
    const w = Math.round(rect.width) || 400;
    const h = Math.round(rect.height) || 200;
    const container = wrapper.closest("[data-charttype]");
    const chartType = container ? container.getAttribute("data-charttype") : "ord";
    const dataSet   = container ? (container.getAttribute("data-chartset") || "main") : "main";
    let cData = dataSet==="bbz" ? chartsData.bbz : dataSet==="bbq" ? chartsData.bbq : chartsData.main;
    const chartCanvas = drawLineChartToCanvas(cData[chartType], w, h, "prev", "curr", prevLabel, currLabel);
    chartCanvas.style.cssText = `display:block;width:${w}px;height:${h}px;`;
    wrapper.parentNode.insertBefore(chartCanvas, wrapper);
    wrapper.style.display = "none";
    svgRestores.push(() => { wrapper.style.display = ""; chartCanvas.remove(); });
  }

  // 2. Hide DOM header — we'll draw it directly on the final canvas instead
  const headerEl = document.getElementById("capture-header");
  if (headerEl) headerEl.style.visibility = "hidden";

  await new Promise(r => setTimeout(r, 250));

  try {
    const bodyCanvas = await window.html2canvas(el, {
      backgroundColor: "#05090f", scale: 2,
      useCORS: true, logging: false, allowTaint: true,
      foreignObjectRendering: false,
      width: el.scrollWidth, height: el.scrollHeight,
      windowWidth: el.scrollWidth, windowHeight: el.scrollHeight,
      scrollX: 0, scrollY: 0,
    });

    svgRestores.forEach(r => r());
    if (headerEl) headerEl.style.visibility = "";

    // 3. Draw header banner at the top of the already-scaled canvas
    // bodyCanvas.width is already at scale:2, so draw directly in canvas pixels
    const cw = bodyCanvas.width;   // e.g. ~2800px for a 1400px-wide screen
    const ctx = bodyCanvas.getContext("2d");

    // How tall is the header DOM element? Use that to know where to paint
    const headerH = headerEl ? headerEl.offsetHeight * 2 : 100; // *2 for scale

    // Repaint background strip
    ctx.fillStyle = "#05090f";
    ctx.fillRect(0, 0, cw, headerH);

    // Box dimensions in canvas pixels (scale already applied)
    const boxW = Math.min(520, cw - 80);  // max 520px logical → already in canvas px
    const boxH = 70;
    const boxX = (cw - boxW) / 2;
    const boxY = (headerH - boxH) / 2;

    ctx.fillStyle = "#0b1120";
    ctx.strokeStyle = "#1a3060";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 12);
    ctx.fill(); ctx.stroke();

    // Title — font size in canvas pixels
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 28px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("FLEEK DAILY QC DASHBOARD", cw / 2, boxY + 28);

    // Subtitle
    ctx.fillStyle = "#64748b";
    ctx.font = "18px 'Courier New'";
    ctx.fillText(`Date: ${dateLabel}   |   ${tabName}`, cw / 2, boxY + 54);

    // Save final image
    const a = document.createElement("a");
    a.download = filename;
    a.href = bodyCanvas.toDataURL("image/jpeg", 0.95);
    document.body.appendChild(a); a.click(); document.body.removeChild(a);

  } catch(err) {
    svgRestores.forEach(r => r());
    if (headerEl) headerEl.style.visibility = "";
    alert("Capture error: " + err.message);
  }
}

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C={
  bg:"#05090f",panel:"#0b1120",row1:"#0d1526",row2:"#0a1020",
  border:"#1a3060",headBg:"#0f1e40",
  green:"#22c55e",yellow:"#f59e0b",blue:"#3b82f6",
  purple:"#a855f7",red:"#ef4444",teal:"#2dd4bf",
  text:"#e2e8f0",dim:"#64748b",mid:"#94a3b8",
};

// ─── ATOMS ───────────────────────────────────────────────────────────────────
const TH=({children,left})=>(
  <th style={{background:C.headBg,color:C.mid,fontSize:11,fontWeight:700,padding:"6px 8px",
    textAlign:left?"left":"center",borderBottom:`2px solid ${C.border}`,whiteSpace:"nowrap",fontFamily:"monospace"}}>
    {children}
  </th>
);
const TD=({children,color,bold,left})=>(
  <td style={{padding:"5px 8px",textAlign:left?"left":"center",color:color||C.text,
    fontWeight:bold?700:400,fontSize:12,borderBottom:`1px solid #1a306033`,fontFamily:"monospace"}}>
    {children}
  </td>
);
const SecHead=({title,color="#1d4ed8"})=>(
  <div style={{background:`linear-gradient(90deg,${color}ee,${color}66)`,padding:"7px 14px",
    color:"#fff",fontWeight:800,fontSize:12,letterSpacing:0.5,fontFamily:"monospace",
    borderRadius:"6px 6px 0 0"}}>{title}</div>
);
const StatCard=({icon,label,value,sub,color})=>(
  <div style={{background:C.panel,border:`1px solid ${color}44`,borderLeft:`4px solid ${color}`,
    borderRadius:8,padding:"12px 16px",flex:1,minWidth:130}}>
    <div style={{color:C.dim,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontFamily:"monospace"}}>{icon} {label}</div>
    <div style={{color,fontSize:32,fontWeight:900,lineHeight:1,fontFamily:"monospace"}}>{value}</div>
    <div style={{color:C.dim,fontSize:11,marginTop:3,fontFamily:"monospace"}}>{sub}</div>
  </div>
);

// ─── DAILY TABLE ─────────────────────────────────────────────────────────────
function DailyTable({data,title,expanded,setExpanded}){
  if(!data)return null;
  const tA=data.qcers.reduce((s,q)=>s+q.a,0),tAU=data.qcers.reduce((s,q)=>s+q.au,0);
  const tH=data.qcers.reduce((s,q)=>s+q.h,0),tHU=data.qcers.reduce((s,q)=>s+q.hu,0);
  return(
    <div>
      <SecHead title={title} color="#1a4080"/>
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderTop:"none"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <TH left>QC By</TH><TH>App Orders</TH><TH>App Units</TH>
            <TH>Hold Orders</TH><TH>Hold Units</TH><TH>Vendors</TH>
          </tr></thead>
          <tbody>
            {data.qcers.map((q,i)=>{
              const wo=q.n==="W/O QC",hh=q.h>0,exp=expanded===q.n;
              return(
                <React.Fragment key={q.n}>
                  <tr onClick={()=>setExpanded(exp?null:q.n)} style={{
                    background:wo?"#1a0808":hh?"#1a1400":i%2===0?C.row1:C.row2,
                    cursor:"pointer",borderLeft:`3px solid ${wo?C.red:hh?C.yellow:"transparent"}`}}>
                    <TD left bold color={wo?C.red:hh?C.yellow:C.text}>
                      <span style={{paddingLeft:4}}>{q.n}</span>
                      <span style={{color:C.border,fontSize:9,marginLeft:4}}>{exp?"▲":"▼"}</span>
                    </TD>
                    <TD bold color={C.green}>{q.a-(q.aa||0)}</TD>
                    <TD color="#86efac">{q.au}</TD>
                    <TD bold={hh} color={hh?C.yellow:C.dim}>{q.h}</TD>
                    <TD color={q.hu>0?"#fbbf24":C.dim}>{q.hu}</TD>
                    <TD color={C.blue}>{q.v}</TD>
                  </tr>
                  {exp&&(
                    <tr><td colSpan={6} style={{background:"#060c1a",padding:"8px 14px"}}>
                      <div style={{color:C.dim,fontSize:10,marginBottom:4}}>
                        FLEEK IDs ({q.f.length}){q.aa>0&&<span style={{color:C.purple,marginLeft:8}}>· {q.aa} auto-approved</span>}
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {q.f.map(id=><span key={id} style={{background:"#0f2040",color:"#93c5fd",
                          padding:"2px 6px",borderRadius:3,fontSize:10,fontFamily:"monospace"}}>{id}</span>)}
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              );
            })}
            <tr style={{background:C.headBg,borderTop:`2px solid ${C.border}`}}>
              <TD left bold color="#f8fafc"><span style={{paddingLeft:4}}>TOTAL</span></TD>
              <TD bold color={C.green}>{tA}</TD><TD bold color="#86efac">{tAU}</TD>
              <TD bold color={C.yellow}>{tH}</TD><TD bold color="#fbbf24">{tHU}</TD>
              <TD color={C.dim}>—</TD>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MONTHLY TABLE ────────────────────────────────────────────────────────────
function MonthlyTable({data,title}){
  const tO=data.reduce((s,q)=>s+q.o,0),tQ=data.reduce((s,q)=>s+q.q,0);
  return(
    <div>
      <SecHead title={title} color="#1a4f1a"/>
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderTop:"none"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <TH left>QCer Name</TH><TH>QCed Orders</TH>
            <TH>Total Recv Qty</TH><TH>Monthly Avg</TH><TH>Positive PQ</TH>
          </tr></thead>
          <tbody>
            {data.map((q,i)=>{
              const wo=q.n==="W/O QC",top=i===0&&!wo;
              return(
                <tr key={q.n} style={{background:wo?"#1a0808":i%2===0?C.row1:C.row2,
                  borderLeft:`3px solid ${wo?C.red:top?C.green:"transparent"}`}}>
                  <TD left bold={top||wo} color={wo?C.red:top?"#4ade80":C.text}>
                    <span style={{paddingLeft:4}}>{top?"🏆 ":""}{q.n}</span>
                  </TD>
                  <TD bold color={C.green}>{q.o}</TD>
                  <TD color="#86efac">{q.q.toLocaleString()}</TD>
                  <TD color={C.blue}>{q.avg}</TD>
                  <TD color={C.dim}>0</TD>
                </tr>
              );
            })}
            <tr style={{background:C.headBg,borderTop:`2px solid ${C.border}`}}>
              <TD left bold color="#f8fafc"><span style={{paddingLeft:4}}>TOTAL</span></TD>
              <TD bold color={C.green}>{tO}</TD>
              <TD bold color="#86efac">{tQ.toLocaleString()}</TD>
              <TD bold color={C.blue}>{tO?Math.round(tQ/tO):0}</TD>
              <TD color={C.dim}>0</TD>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CHART PAIR ───────────────────────────────────────────────────────────────
function ChartPair({charts,curM,prevM,singleChart,chartSet="main"}){
  const tt={contentStyle:{background:"#1e293b",border:`1px solid ${C.border}`,fontSize:11,color:C.text}};
  const OrdChart=()=>(
    <div data-charttype="ord" data-chartset={chartSet}
      style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px"}}>
      <div style={{fontSize:11,fontWeight:800,color:C.text,marginBottom:6,fontFamily:"monospace"}}>
        Current vs Previous Month — Orders
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={charts.ord} margin={{top:4,right:8,left:-18,bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0f2040"/>
          <XAxis dataKey="day" tick={{fill:C.dim,fontSize:9}}/>
          <YAxis tick={{fill:C.dim,fontSize:9}}/>
          <Tooltip {...tt}/>
          <Legend wrapperStyle={{fontSize:10}}/>
          <Line type="monotone" dataKey="prev" name={`${MN[prevM]} (Prev)`}
            stroke={C.blue} strokeWidth={2} dot={false} strokeDasharray="4 2" connectNulls/>
          <Line type="monotone" dataKey="curr" name={`${MN[curM]} (Curr)`}
            stroke={C.yellow} strokeWidth={2} dot={{r:2,fill:C.yellow}} connectNulls/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
  const QtyChart=()=>(
    <div data-charttype="qty" data-chartset={chartSet}
      style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px"}}>
      <div style={{fontSize:11,fontWeight:800,color:C.text,marginBottom:6,fontFamily:"monospace"}}>
        Current vs Previous Month — Received Qty
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={charts.qty} margin={{top:4,right:8,left:-18,bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0f2040"/>
          <XAxis dataKey="day" tick={{fill:C.dim,fontSize:9}}/>
          <YAxis tick={{fill:C.dim,fontSize:9}}/>
          <Tooltip {...tt}/>
          <Legend wrapperStyle={{fontSize:10}}/>
          <Line type="monotone" dataKey="prev" name={`${MN[prevM]} (Prev)`}
            stroke={C.blue} strokeWidth={2} dot={false} strokeDasharray="4 2" connectNulls/>
          <Line type="monotone" dataKey="curr" name={`${MN[curM]} (Curr)`}
            stroke={C.yellow} strokeWidth={2} dot={{r:2,fill:C.yellow}} connectNulls/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
  if(singleChart==="ord") return <OrdChart/>;
  if(singleChart==="qty") return <QtyChart/>;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <OrdChart/><QtyChart/>
    </div>
  );
}

// ─── UPLOAD SCREEN ────────────────────────────────────────────────────────────
function UploadScreen({onFile}){
  return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",
      justifyContent:"center",fontFamily:"monospace"}}>
      <div style={{textAlign:"center",background:C.panel,borderRadius:16,padding:48,
        border:`1px solid ${C.border}`,maxWidth:420}}>
        <div style={{fontSize:48,marginBottom:12}}>📦</div>
        <div style={{fontSize:22,fontWeight:900,color:"#f8fafc",marginBottom:6,letterSpacing:2}}>FLEEK DAILY DASHBOARD</div>
        <div style={{color:C.dim,fontSize:13,marginBottom:28}}>Upload your Fleek QC export CSV to get started</div>
        <label style={{display:"inline-block",background:C.blue,color:"#fff",
          padding:"12px 32px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14}}>
          📁 Upload CSV
          <input type="file" accept=".csv" style={{display:"none"}} onChange={e=>e.target.files[0]&&onFile(e.target.files[0])}/>
        </label>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Dashboard(){
  const [rows,   setRows]   = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selDate,setSelDate]= useState("");
  const [tab,    setTab]    = useState("Zone");
  const [expMain,setExpMain]= useState(null);
  const [expBBZ, setExpBBZ] = useState(null);
  const [expBBQ, setExpBBQ] = useState(null);
  const [capturing,setCapturing]=useState(false);

  const handleFile=useCallback(file=>{
    const r=new FileReader();
    r.onload=e=>{
      const parsed=parseCSV(e.target.result);
      setRows(parsed);
      const ds=[...new Set(parsed.map(r=>{const d=pd(r.created_at);return d?toISO(d):null;}).filter(Boolean))].sort();
      setSelDate(ds[ds.length-1]||"");
      setLoaded(true);
    };
    r.readAsText(file);
  },[]);

  const dates=useMemo(()=>
    [...new Set(rows.map(r=>{const d=pd(r.created_at);return d?toISO(d):null;}).filter(Boolean))].sort().reverse(),
  [rows]);

  const selD =selDate?new Date(selDate+"T12:00:00"):new Date();
  const curM =selD.getMonth()+1, curY=selD.getFullYear();
  const prevM=curM===1?12:curM-1;

  const rZone =useMemo(()=>filterMain(rows,"Zone"),[rows]);
  const rNZ   =useMemo(()=>filterMain(rows,"QC Center"),[rows]);
  const rIndia=useMemo(()=>filterMain(rows,"India"),[rows]);
  const rBBZ  =useMemo(()=>filterBB(rows,"Zone"),[rows]);
  const rBBQ  =useMemo(()=>filterBB(rows,"QC"),[rows]);

  const activeRows=useMemo(()=>{
    if(tab==="Zone")return rZone;
    if(tab==="QC Center")return rNZ;
    if(tab==="India")return rIndia;
    return [...rBBZ,...rBBQ];
  },[tab,rZone,rNZ,rIndia,rBBZ,rBBQ]);

  const daily   =useMemo(()=>selDate?buildDaily(activeRows,selDate):null,[activeRows,selDate]);
  const dailyBBZ=useMemo(()=>selDate?buildDaily(rBBZ,selDate):null,[rBBZ,selDate]);
  const dailyBBQ=useMemo(()=>selDate?buildDaily(rBBQ,selDate):null,[rBBQ,selDate]);
  const monthly   =useMemo(()=>buildMonthly(activeRows,curM,curY),[activeRows,curM,curY]);
  const monthlyBBZ=useMemo(()=>buildMonthly(rBBZ,curM,curY),[rBBZ,curM,curY]);
  const monthlyBBQ=useMemo(()=>buildMonthly(rBBQ,curM,curY),[rBBQ,curM,curY]);
  const charts   =useMemo(()=>buildCharts(activeRows),[activeRows]);
  const chartsBBZ=useMemo(()=>buildCharts(rBBZ),[rBBZ]);
  const chartsBBQ=useMemo(()=>buildCharts(rBBQ),[rBBQ]);

  if(!loaded)return <UploadScreen onFile={handleFile}/>;

  const isBBTab =tab==="Bargain Bin";
  const dateLabel=fmtD(selDate);
  const totApp =daily?.qcers.reduce((s,q)=>s+q.a,0)||0;
  const totHld =daily?.qcers.reduce((s,q)=>s+q.h,0)||0;
  const totAppU=daily?.qcers.reduce((s,q)=>s+q.au,0)||0;
  const totHldU=daily?.qcers.reduce((s,q)=>s+q.hu,0)||0;
  const bbApp =(dailyBBZ?.app||0)+(dailyBBQ?.app||0);
  const bbHld =(dailyBBZ?.hld||0)+(dailyBBQ?.hld||0);
  const bbPend=(dailyBBZ?.pend||0)+(dailyBBQ?.pend||0);
  const bbAppU=(dailyBBZ?.appU||0)+(dailyBBQ?.appU||0);
  const bbHldU=(dailyBBZ?.hldU||0)+(dailyBBQ?.hldU||0);
  const captureFile=`Fleek_QC_${selDate}_${tab.replace(/\s/g,"_")}.jpg`;

  const TABS=[
    {key:"Zone",       label:"📦 Zone",       color:C.green},
    {key:"QC Center",  label:"🏢 QC Center",  color:C.blue},
    {key:"India",      label:"🌏 India",      color:C.teal},
    {key:"Bargain Bin",label:"🗑️ Bargain Bin",color:C.purple},
  ];

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"monospace"}}>

      {/* ══════════════════════════════════════════════════════
          SINGLE TOP BAR — no title text, just controls
          ══════════════════════════════════════════════════════ */}
      {/* ── ROW 1: Title bar ── */}
      <div style={{
        background:"#060c1a",borderBottom:`1px solid ${C.border}33`,
        padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"center",
        height:38,
      }}>
        <span style={{fontSize:17}}>🔍</span>
        <span style={{fontWeight:900,fontSize:15,color:"#60a5fa",letterSpacing:2.5,fontFamily:"monospace",marginLeft:8}}>
          FLEEK DAILY QC DASHBOARD
        </span>
      </div>

      {/* ── ROW 2: Controls bar ── */}
      <div style={{
        background:"#07101f",borderBottom:`2px solid ${C.border}`,
        padding:"0 14px",display:"flex",alignItems:"center",
        gap:10,height:40,position:"sticky",top:0,zIndex:100,
      }}>
        {/* Date */}
        <span style={{color:C.dim,fontSize:10,whiteSpace:"nowrap"}}>SELECT DATE</span>
        <select value={selDate} onChange={e=>setSelDate(e.target.value)} style={{
          background:C.panel,color:C.text,border:`1px solid ${C.blue}`,
          borderRadius:4,padding:"3px 8px",fontSize:11,cursor:"pointer",fontFamily:"monospace"}}>
          {dates.map(d=><option key={d} value={d}>{fmtD(d)}</option>)}
        </select>

        <div style={{width:1,height:22,background:C.border}}/>

        {/* Tab buttons */}
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{
            background:tab===t.key?t.color+"2a":"transparent",
            color:tab===t.key?t.color:C.mid,
            border:`1px solid ${tab===t.key?t.color:C.border}`,
            borderRadius:5,padding:"3px 13px",cursor:"pointer",
            fontWeight:tab===t.key?800:400,fontSize:12,fontFamily:"monospace",whiteSpace:"nowrap",
          }}>{t.label}</button>
        ))}

        {/* Right: Upload + Download */}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <label style={{
            background:C.panel,color:"#93c5fd",border:`1px solid ${C.blue}55`,
            padding:"3px 12px",borderRadius:5,cursor:"pointer",fontSize:11,
            display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",
          }}>
            📁 Upload CSV
            <input type="file" accept=".csv" style={{display:"none"}}
              onChange={e=>e.target.files[0]&&handleFile(e.target.files[0])}/>
          </label>
          <button
            disabled={capturing}
            onClick={async ()=>{
              setCapturing(true);
              await new Promise(r=>setTimeout(r,300));
              const chartsData = { main: charts, bbz: chartsBBZ, bbq: chartsBBQ };
              await downloadJPG(captureFile, chartsData, curM, prevM, tab, dateLabel);
              setTimeout(()=>setCapturing(false),500);
            }}
            style={{
              background:capturing?"#0f2010":"#0f3020",
              color:capturing?"#64748b":"#4ade80",
              border:`1px solid ${capturing?"#334155":C.green}`,
              padding:"3px 14px",borderRadius:5,cursor:capturing?"not-allowed":"pointer",
              fontSize:11,fontWeight:700,whiteSpace:"nowrap",
            }}>
            {capturing?"⏳ Capturing...":"📸 Download Summary"}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CAPTURE ROOT — everything here is screenshot-able
          ══════════════════════════════════════════════════════ */}
      <div id="capture-root" style={{background:C.bg,padding:"12px 14px"}}>

        {/* ── HEADER BAND — rendered as plain divs, also drawn manually in screenshot ── */}
        <div id="capture-header" style={{
          textAlign:"center",marginBottom:14,
          background:"#060c1a",padding:"14px 0",
          borderBottom:`1px solid ${C.border}`,
        }}>
          <div style={{
            display:"inline-block",
            background:"#0b1120",border:`1px solid ${C.border}`,
            borderRadius:12,padding:"12px 36px",
          }}>
            <div style={{
              fontSize:20,fontWeight:900,color:"#f8fafc",
              letterSpacing:3,fontFamily:"monospace",textAlign:"center",
            }}>
              FLEEK DAILY QC DASHBOARD
            </div>
            <div style={{
              fontSize:12,color:"#64748b",marginTop:4,
              fontFamily:"monospace",textAlign:"center",
            }}>
              Date: {dateLabel}&nbsp;&nbsp;|&nbsp;&nbsp;{tab}
            </div>
          </div>
        </div>

        {/* ══ MAIN TABS ══ */}
        {!isBBTab&&(
          <>
            {/* Summary cards */}
            <div style={{marginBottom:12}}>
              <div style={{color:C.blue,fontSize:10,fontWeight:700,letterSpacing:2,
                marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                ▶ TODAY'S OVERALL SUMMARY
              </div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <StatCard icon="✅" label="QC Approved Orders" value={totApp}
                  sub={`${totAppU.toLocaleString()} units received`} color={C.green}/>
                <StatCard icon="⚠️" label="QC Hold Orders" value={totHld}
                  sub={`${totHldU.toLocaleString()} units held`} color={C.yellow}/>
                <StatCard icon="⏳" label="QC Pending Orders" value={daily?.pend||0}
                  sub="Awaiting QC processing" color={C.blue}/>
                <StatCard icon="📦" label="Total Processed" value={totApp+totHld}
                  sub={`${totApp+totHld+(daily?.pend||0)} total in pipeline`} color={C.purple}/>
              </div>
            </div>

            {/* ── 2-COLUMN GRID: Daily left | Monthly right ── */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,alignItems:"start",marginBottom:12}}>

              {/* Col 1: Daily QC */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <DailyTable data={daily}
                  title={`📋 DAILY QC REPORT — ${tab.toUpperCase()} (${dateLabel})`}
                  expanded={expMain} setExpanded={setExpMain}/>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1,background:C.panel,border:`1px solid ${C.blue}33`,
                    borderLeft:`3px solid ${C.blue}`,borderRadius:5,padding:"6px 10px",fontSize:11}}>
                    ⏳ <span style={{color:C.blue,fontWeight:700}}>{daily?.pend||0}</span>
                    <span style={{color:C.dim}}> QC Pending</span>
                  </div>
                  <div style={{flex:1,background:C.panel,border:`1px solid ${C.purple}33`,
                    borderLeft:`3px solid ${C.purple}`,borderRadius:5,padding:"6px 10px",fontSize:11}}>
                    <span style={{color:C.dim}}>📦 Pipeline: </span>
                    <span style={{color:C.purple,fontWeight:700}}>{totApp+totHld+(daily?.pend||0)}</span>
                  </div>
                </div>
                {(daily?.auto||0)>0&&(
                  <div style={{background:C.panel,border:`1px solid ${C.purple}22`,
                    borderLeft:`3px solid ${C.purple}`,borderRadius:5,padding:"6px 10px",fontSize:11,color:C.dim}}>
                    🤖 <span style={{color:C.purple,fontWeight:700}}>{daily.auto}</span> auto-approved
                  </div>
                )}
              </div>

              {/* Col 2: Monthly table */}
              <MonthlyTable data={monthly}
                title={`📊 MONTHLY QC DATA — ${MN[curM].toUpperCase()} ${curY}`}/>

            </div>

            {/* ── CHARTS AT BOTTOM — full width side by side ── */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <ChartPair charts={charts} curM={curM} prevM={prevM} singleChart="ord"/>
              <ChartPair charts={charts} curM={curM} prevM={prevM} singleChart="qty"/>
            </div>
          </>
        )}

        {/* ══ BARGAIN BIN TAB ══ */}
        {isBBTab&&(
          <>
            <div style={{marginBottom:12}}>
              <div style={{color:C.purple,fontSize:10,fontWeight:700,letterSpacing:2,
                marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                ▶ TODAY'S OVERALL SUMMARY — BARGAIN BIN
              </div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <StatCard icon="✅" label="QC Approved Orders" value={bbApp}
                  sub={`${bbAppU} units received`} color={C.green}/>
                <StatCard icon="⚠️" label="QC Hold Orders" value={bbHld}
                  sub={`${bbHldU} units held`} color={C.yellow}/>
                <StatCard icon="⏳" label="QC Pending Orders" value={bbPend}
                  sub="Awaiting QC processing" color={C.blue}/>
                <StatCard icon="📦" label="Total Processed" value={bbApp+bbHld}
                  sub={`${bbApp+bbHld+bbPend} total in pipeline`} color={C.purple}/>
              </div>
            </div>

            {/* Daily side by side */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <DailyTable data={dailyBBZ} title="📋 BB ZONE — DAILY QC REPORT"
                expanded={expBBZ} setExpanded={setExpBBZ}/>
              <DailyTable data={dailyBBQ} title="📋 BB QC CENTER — DAILY QC REPORT"
                expanded={expBBQ} setExpanded={setExpBBQ}/>
            </div>

            {/* Monthly side by side */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <MonthlyTable data={monthlyBBZ} title={`📊 BB ZONE — MONTHLY (${MN[curM]} ${curY})`}/>
              <MonthlyTable data={monthlyBBQ} title={`📊 BB QC CENTER — MONTHLY (${MN[curM]} ${curY})`}/>
            </div>

            {/* Charts side by side */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{color:C.dim,fontSize:11,fontWeight:700,marginBottom:6}}>BB ZONE — Month Comparison</div>
                <ChartPair charts={chartsBBZ} curM={curM} prevM={prevM} chartSet="bbz"/>
              </div>
              <div>
                <div style={{color:C.dim,fontSize:11,fontWeight:700,marginBottom:6}}>BB QC CENTER — Month Comparison</div>
                <ChartPair charts={chartsBBQ} curM={curM} prevM={prevM} chartSet="bbq"/>
              </div>
            </div>
          </>
        )}

        <div style={{textAlign:"center",color:C.border,fontSize:10,marginTop:12,fontFamily:"monospace"}}>
          Fleek Daily Dashboard · {rows.length.toLocaleString()} rows · {dateLabel} · {tab}
        </div>
      </div>
    </div>
  );
}
