(() => {
  const projects = [
    {client:'Northstar Café',project:'Business Website Refresh',type:'Website',status:'in_progress',progress:72,budget:42000,due:'2026-08-15'},
    {client:'Pixel Harbor Studio',project:'Discord Community Dashboard',type:'Discord System',status:'review',progress:90,budget:58000,due:'2026-07-30'},
    {client:'Greenline Services',project:'Service Booking Landing Page',type:'Website',status:'planning',progress:18,budget:25000,due:'2026-09-01'},
    {client:'Orbit Commerce',project:'Product Catalog Interface',type:'E-commerce',status:'completed',progress:100,budget:65000,due:'2026-06-12'},
    {client:'Blue Ridge Fitness',project:'PC Maintenance Tracker',type:'Reporting',status:'on_hold',progress:46,budget:18000,due:'2026-08-28'}
  ];
  const money = new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0});
  const search=document.querySelector('#search'); const status=document.querySelector('#status');
  function render(){
    const term=search.value.trim().toLowerCase();
    const filtered=projects.filter(item=>(status.value==='all'||item.status===status.value)&&(`${item.client} ${item.project}`.toLowerCase().includes(term)));
    document.querySelector('#rows').innerHTML=filtered.map(item=>`<tr><td>${item.client}</td><td>${item.project}</td><td>${item.type}</td><td><span class="badge">${item.status.replace('_',' ')}</span></td><td><div class="progress" title="${item.progress}%"><span style="width:${item.progress}%"></span></div></td><td>${money.format(item.budget)}</td><td>${item.due}</td></tr>`).join('');
    document.querySelector('#empty').hidden=filtered.length>0;
    const total=projects.reduce((sum,item)=>sum+item.budget,0);
    document.querySelector('#stats').innerHTML=[['Projects',projects.length],['Active',projects.filter(p=>['in_progress','review'].includes(p.status)).length],['Completed',projects.filter(p=>p.status==='completed').length],['Portfolio value',money.format(total)]].map(([label,value])=>`<article class="stat"><strong>${value}</strong><span>${label}</span></article>`).join('');
  }
  search.addEventListener('input',render);status.addEventListener('change',render);render();
})();
