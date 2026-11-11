const store={get(){try{return JSON.parse(localStorage.getItem("pl3v2")||"{}")}catch(e){return{}}},set(v){try{localStorage.setItem("pl3v2",JSON.stringify(v))}catch(e){}}};
let S=store.get();
const app=document.getElementById("app");
const live=()=>CH.filter(c=>!c.soon);
function pct(){const d=live().filter(c=>S[c.id]).length;return d/live().length}
const yt=q=>"https://www.youtube.com/results?search_query="+encodeURIComponent(q);

function fitTitle(){
  const h=document.querySelector(".hero h1"),em=h&&h.querySelector("em");
  if(!h||!em)return;
  h.style.fontSize="100px";
  const avail=h.parentElement.clientWidth,w=em.getBoundingClientRect().width;
  if(w>0)h.style.fontSize=Math.min(100*avail/w,innerHeight*.42)+"px";
}
window.addEventListener("resize",fitTitle);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitTitle);

function home(){
  const p=pct();
  app.innerHTML=`<section class="hero"><h1><em>ΑΕΠΠΑΡΑ</em></h1></section>
  <div class="grid">${CH.map(c=>`<button class="ch" data-id="${c.id}"><span class="num">${c.n}</span><h3>${c.t}</h3><span class="small">${c.s}</span>
   ${S[c.id]?`<span class="tag done">ολοκληρώθηκε</span>`:""}</button>`).join("")}</div>
`;
  app.querySelectorAll(".ch").forEach(b=>b.onclick=()=>{location.hash=b.dataset.id});
  fitTitle();
}

function chapter(c,tab){
  tab=tab||"th";
  const T=[["th","Θεωρία"],["ex","Ασκήσεις"],["fc","Flashcards"],["qz","Κουίζ"],["yt","Βίντεο"]];
  app.innerHTML=`<p class="small"><a href="#" id="back">← Όλα τα κεφάλαια</a></p><h1 class="title">${c.n}. ${c.t}</h1><p class="small">${c.s}</p>
  <div class="tabs" role="tablist">${T.map(t=>`<button class="tab" role="tab" aria-selected="${t[0]===tab}" data-t="${t[0]}">${t[1]}</button>`).join("")}</div><div id="pane"></div>`;
  document.getElementById("back").onclick=e=>{e.preventDefault();location.hash=""};
  app.querySelectorAll(".tab").forEach(b=>b.onclick=()=>chapter(c,b.dataset.t));
  const pane=document.getElementById("pane");
  if(tab==="th"){
    pane.innerHTML=`<div class="read">${c.theory.map(t=>`<h2>${t[0]}</h2>${t[1]}`).join("")}</div>${c.viz?`<div class="viz" id="viz"></div>`:""}
    <p class="ref">Πηγή για μελέτη: ${c.refs}</p>`;
    if(c.viz)vizInit(c.viz);
  }else if(tab==="ex"){
    pane.innerHTML=c.ex.map((e,i)=>`<div class="card"><span class="lvl">${e.l}</span><h3>Άσκηση ${i+1}</h3><div>${e.q}</div><div id="tips${i}"></div>
     <div class="row"><button class="btn" data-tip="${i}">Υπόδειξη</button><button class="btn pri" data-sol="${i}">Δείξε λύση</button></div><div id="sol${i}"></div></div>`).join("")
     +`<p class="ref">Περισσότερες ασκήσεις και επίσημες λύσεις: ${c.refs}</p>`;
    const used={};
    pane.querySelectorAll("[data-tip]").forEach(b=>b.onclick=()=>{const i=+b.dataset.tip,t=c.ex[i].tips;used[i]=used[i]||0;
      if(used[i]<t.length){document.getElementById("tips"+i).insertAdjacentHTML("beforeend",`<div class="tip">${t[used[i]]}</div>`);used[i]++}
      if(used[i]>=t.length){b.disabled=true;b.textContent="Καμία άλλη υπόδειξη"}});
    pane.querySelectorAll("[data-sol]").forEach(b=>b.onclick=()=>{const i=+b.dataset.sol,el=document.getElementById("sol"+i);
      if(el.innerHTML){el.innerHTML="";b.textContent="Δείξε λύση"}else{el.innerHTML=`<div class="sol">${c.ex[i].sol}</div>`;b.textContent="Κρύψε λύση"}});
  }else if(tab==="fc"){
    let i=0,flip=false,order=c.cards.map((_,k)=>k);
    const draw=()=>{const [f,b]=c.cards[order[i]];
      pane.innerHTML=`<p class="small" style="text-align:center">Κάρτα ${i+1} / ${order.length}. Πάτα την κάρτα για να τη γυρίσεις.</p>
      <div class="fc"><button class="fcard ${flip?"back":""}" id="card">${flip?b:f}</button></div>
      <div class="fnav"><button class="btn" id="pv">Προηγούμενη</button><button class="btn" id="sh">Ανακάτεμα</button><button class="btn pri" id="nx">Επόμενη</button></div>`;
      document.getElementById("card").onclick=()=>{flip=!flip;draw()};
      document.getElementById("nx").onclick=()=>{i=(i+1)%order.length;flip=false;draw()};
      document.getElementById("pv").onclick=()=>{i=(i-1+order.length)%order.length;flip=false;draw()};
      document.getElementById("sh").onclick=()=>{for(let k=order.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[order[k],order[j]]=[order[j],order[k]]}i=0;flip=false;draw()};};
    draw();
  }else if(tab==="qz"){
    let score=0,done=0;
    pane.innerHTML=c.quiz.map((q,i)=>`<div class="card"><h3>${q.q}</h3>${q.o.map((o,j)=>`<button class="opt" data-q="${i}" data-o="${j}">${o}</button>`).join("")}<div class="small" id="why${i}"></div></div>`).join("")+`<div class="card" id="res">Απάντησε όλες τις ερωτήσεις.</div>`;
    pane.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
      const qi=+b.dataset.q,oi=+b.dataset.o,q=c.quiz[qi],sib=pane.querySelectorAll(`[data-q="${qi}"]`);
      if(sib[0].disabled)return;sib.forEach(x=>x.disabled=true);sib[q.a].classList.add("good");
      if(oi!==q.a)b.classList.add("bad");else score++;
      if(q.w)document.getElementById("why"+qi).textContent=q.w;
      done++;if(done===c.quiz.length){document.getElementById("res").textContent=`Σκορ ${score}/${c.quiz.length}. `+(score===c.quiz.length?"Καθαρό. Επόμενο κεφάλαιο.":"Γύρνα στη θεωρία και ξαναδοκίμασε.");
        if(score===c.quiz.length){S[c.id]=1;store.set(S);pct()}}});
  }else{
    pane.innerHTML=`<p class="small">Αυτά τα κουμπιά ανοίγουν αναζήτηση στο YouTube με έτοιμη φράση. Διάλεξε το βίντεο που σου ταιριάζει.</p><div class="vid">`+c.yt.map(y=>`<a href="${yt(y[1])}" target="_blank" rel="noopener"><span>YOUTUBE</span>${y[0]}</a>`).join("")+`</div>`;
  }
}

function vizInit(kind){
  const el=document.getElementById("viz");
  const log=m=>document.getElementById("log").textContent=m;
  if(kind==="stack"||kind==="queue"){
    let items=[],isS=kind==="stack";
    el.innerHTML=`<h3>${isS?"Στοίβα (LIFO)":"Ουρά (FIFO)"}</h3><div class="row"><label for="v" class="small">Τιμή</label><input id="v" value="7" maxlength="5"><button class="btn pri" id="add">${isS?"Ώθηση":"Εισαγωγή"}</button><button class="btn" id="rm">${isS?"Απώθηση":"Εξαγωγή"}</button><button class="btn" id="clr">Καθάρισμα</button></div>
    <div id="box" class="${isS?"stackbox":"qbox"}"></div><div class="log" id="log" aria-live="polite">Άδεια.</div>`;
    const draw=()=>{document.getElementById("box").innerHTML=items.map(x=>`<div class="cell">${x}</div>`).join("")};
    document.getElementById("add").onclick=()=>{const v=document.getElementById("v").value.trim();if(!v)return;if(items.length>=8){log("Γεμάτη: υπερχείλιση.");return}items.push(v);draw();log((isS?"Ώθηση ":"Εισαγωγή ")+v)};
    document.getElementById("rm").onclick=()=>{if(!items.length){log("Άδεια: υποχείλιση.");return}const x=isS?items.pop():items.shift();draw();log("Βγήκε "+x)};
    document.getElementById("clr").onclick=()=>{items=[];draw();log("Άδεια.")};
  }
  if(kind==="bubble"){
    let a,i,j;const init=()=>{a=[5,2,4,1,3];i=0;j=0;draw("Πάτα Επόμενο βήμα.")};
    el.innerHTML=`<h3>Φυσαλίδα βήμα-βήμα</h3><div class="qbox" id="arr" style="border:none"></div><div class="row"><button class="btn pri" id="nx">Επόμενο βήμα</button><button class="btn" id="rs">Από την αρχή</button></div><div class="log" id="log" aria-live="polite"></div>`;
    const draw=m=>{document.getElementById("arr").innerHTML=a.map((x,k)=>`<div class="cell ${k===j||k===j+1?"hl":""}">${x}</div>`).join("");log(m)};
    document.getElementById("nx").onclick=()=>{const n=a.length;if(i>=n-1){draw("Τελείωσε: "+a.join(", "));return}
      if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];draw(`Θέσεις ${j+1} και ${j+2}: ανταλλαγή.`)}else draw(`Θέσεις ${j+1} και ${j+2}: σωστή σειρά.`);
      j++;if(j>=n-1-i){j=0;i++}};
    document.getElementById("rs").onclick=init;init();
  }
  if(kind==="binary"){
    const arr=[3,8,12,17,21,25,30,34,41,47,52,58,63,70,77];let lo,hi,steps,fin;
    el.innerHTML=`<h3>Δυαδική αναζήτηση βήμα-βήμα</h3><div class="row"><label for="t" class="small">Στόχος</label><input id="t" value="47"><button class="btn pri" id="go">Επόμενο βήμα</button><button class="btn" id="rs">Από την αρχή</button></div><div class="qbox" id="arr" style="border:none;flex-wrap:wrap"></div><div class="log" id="log" aria-live="polite"></div>`;
    const draw=(mid,m)=>{document.getElementById("arr").innerHTML=arr.map((x,k)=>`<div class="cell ${k===mid?"hl":(k<lo||k>hi)?"dim":""}">${x}</div>`).join("");log(m)};
    const init=()=>{lo=0;hi=arr.length-1;steps=0;fin=false;draw(-1,"Ο στόχος πρέπει να υπάρχει στη λίστα ή όχι. Πάτα Επόμενο βήμα.")};
    document.getElementById("go").onclick=()=>{const t=+document.getElementById("t").value;
      if(fin)return;if(lo>hi){fin=true;draw(-1,"Δεν βρέθηκε.");return}
      const mid=Math.floor((lo+hi)/2);steps++;
      if(arr[mid]===t){draw(mid,`Βήμα ${steps}: βρέθηκε το ${t} στη θέση ${mid+1}.`);fin=true;return}
      if(arr[mid]<t){draw(mid,`Βήμα ${steps}: μέσο ${arr[mid]} < ${t}, κόβω το αριστερό μισό.`);lo=mid+1}else{draw(mid,`Βήμα ${steps}: μέσο ${arr[mid]} > ${t}, κόβω το δεξί μισό.`);hi=mid-1}};
    document.getElementById("rs").onclick=init;init();
  }
}
function route(){const c=CH.find(x=>x.id===location.hash.slice(1));c?chapter(c):home();window.scrollTo(0,0)}
window.addEventListener("hashchange",route);
document.getElementById("home").onclick=()=>{location.hash=""};
document.getElementById("theme").onclick=()=>{const r=document.documentElement;const dark=r.dataset.theme==="dark"||(!r.dataset.theme&&!matchMedia("(prefers-color-scheme: light)").matches);r.dataset.theme=dark?"light":"dark"};
route();
