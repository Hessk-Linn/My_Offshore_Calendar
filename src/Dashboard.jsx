import React,{useState}from'react';
import{useStore}from'./store';
import{getMonthStats,isWorkDay}from'./rotationUtils';
import{format,addDays,differenceInDays,addMonths,subMonths}from'date-fns';
import{TrendingUp,Wallet,Clock,ShieldCheck,ChevronLeft,ChevronRight}from'lucide-react';
import AnnualProjection from'./AnnualProjection';

export default function Dashboard(){
const{anchorDate,travelDays,normalRate,travelRate,allowances,currency,rotationOn,rotationOff}=useStore();
const[dm,setDm]=useState(new Date());
const r={normalRate,travelRate,allowances,currency};
const st=getMonthStats(dm,anchorDate,travelDays,r,rotationOn,rotationOff);
let ncc=new Date(),f=0,sf=0;
const co=isWorkDay(ncc,anchorDate,rotationOn,rotationOff);
while(!f&&sf<100){ncc=addDays(ncc,1);if(isWorkDay(ncc,anchorDate,rotationOn,rotationOff)!==co)f=1;sf++}
const dtc=differenceInDays(ncc,new Date());
const fc=v=>new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:0}).format(v);
return(
<div className="space-y-6">
<div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
<div className="relative z-10">
<p className="text-amber-200/70 text-sm font-medium mb-1">{co?'Next Crew Change (Off)':'Next Crew Change (On)'}</p>
<div className="flex items-baseline gap-2"><span className="text-4xl font-black text-white">{dtc}</span><span className="text-xl font-medium text-amber-200">Days</span></div>
<p className="text-amber-200/50 text-xs mt-2">Expected: {format(ncc,'EEEE, MMM do')}</p>
</div>
<Clock className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-500/10 -rotate-12" />
</div>
<div className="flex items-center justify-between">
<h3 className="text-sm font-semibold text-slate-300">Monthly Earnings</h3>
<div className="flex items-center gap-1">
<button onClick={()=>setDm(subMonths(dm,1))} className="p-1.5 hover:bg-slate-800 rounded-full"><ChevronLeft className="w-4 h-4 text-slate-400"/></button>
<span className="text-sm font-bold text-slate-200 min-w-[100px] text-center">{format(dm,'MMMM yyyy')}</span>
<button onClick={()=>setDm(addMonths(dm,1))} className="p-1.5 hover:bg-slate-800 rounded-full"><ChevronRight className="w-4 h-4 text-slate-400"/></button>
</div>
</div>
<div className="grid grid-cols-1 gap-4">
<div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><TrendingUp className="w-6 h-6"/></div>
<div><p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Monthly Gross</p><p className="text-xl font-bold text-slate-100">{fc(st.gross)}</p></div>
</div>
<div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400"><ShieldCheck className="w-6 h-6"/></div>
<div><p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Myanmar Tax (Est.)</p><p className="text-xl font-bold text-slate-100">{fc(st.tax)}</p></div>
</div>
<div className="bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-xl p-5 flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400"><Wallet className="w-6 h-6"/></div>
<div><p className="text-sky-200/70 text-xs uppercase tracking-wider font-bold">Estimated Net Pay</p><p className="text-2xl font-black text-white">{fc(st.net)}</p></div>
</div>
</div>
<div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
<h3 className="text-sm font-semibold text-slate-300 mb-3">Month Breakdown ({format(dm,'MMMM')})</h3>
<div className="grid grid-cols-2 gap-4">
<div className="p-3 bg-slate-800/50 rounded-lg"><p className="text-slate-500 text-[10px] uppercase font-bold">On-Shift Days</p><p className="text-lg font-bold text-amber-400">{st.workDaysCount}</p></div>
<div className="p-3 bg-slate-800/50 rounded-lg"><p className="text-slate-500 text-[10px] uppercase font-bold">Travel Days</p><p className="text-lg font-bold text-sky-400">{st.travelDaysCount}</p></div>
</div>
</div>
<AnnualProjection year={dm.getFullYear()}/>
</div>
);}
