const questions = [
 {cat:'일상 사물', image:'Apple_6683.svg', answer:'사과', choices:['사과','공','모자','의자']},
 {cat:'일상 사물', image:'Chair_7030.svg', answer:'의자', choices:['책','의자','문','우산']},
 {cat:'일상 사물', image:'Book_7170.svg', answer:'책', choices:['가방','책','컵','신발']},
 {cat:'일상 사물', image:'Water bottle_7009.svg', answer:'물병', choices:['물병','자동차','침대','숟가락']},
 {cat:'일상 사물', image:'hat_6457.svg', answer:'모자', choices:['양말','모자','안경','장갑']},
 {cat:'동물과 자연', image:'Cat_6862.svg', answer:'고양이', choices:['강아지','토끼','고양이','곰']},
 {cat:'동물과 자연', image:'Bee_6891.svg', answer:'벌', choices:['나비','벌','새','개미']},
 {cat:'동물과 자연', image:'Zebra_6885.svg', answer:'얼룩말', choices:['기린','말','얼룩말','코끼리']},
 {cat:'동물과 자연', image:'Fish_6573.svg', answer:'물고기', choices:['물고기','오리','거북이','사자']},
 {cat:'동물과 자연', image:'Cloudy_7216.svg', answer:'구름', choices:['비','구름','해','눈']},
 {cat:'행동과 상태', image:'Back_6935.svg', answer:'뒤로 가다', choices:['뛰다','뒤로 가다','먹다','자다']},
 {cat:'행동과 상태', image:'Afraid_6377.svg', answer:'무섭다', choices:['기쁘다','졸리다','무섭다','화나다']},
 {cat:'행동과 상태', image:'Bathing_6248.svg', answer:'목욕하다', choices:['목욕하다','요리하다','그리다','읽다']},
 {cat:'행동과 상태', image:'Angry_6376.svg', answer:'화나다', choices:['슬프다','화나다','놀라다','웃다']},
 {cat:'행동과 상태', image:'Catch-catch_6802.svg', answer:'잡다', choices:['잡다','밀다','던지다','자르다']},
 {cat:'개념과 장소', image:'Red_6965.svg', answer:'빨간색', choices:['파란색','노란색','초록색','빨간색']},
 {cat:'개념과 장소', image:'Afternoon_7186.svg', answer:'오후', choices:['아침','오후','밤','새벽']},
 {cat:'개념과 장소', image:'Bedroom_7034.svg', answer:'침실', choices:['부엌','학교','침실','공원']},
 {cat:'개념과 장소', image:'Umbrella_future.svg', answer:'우산', choices:['우산','장화','모자','비옷']},
 {cat:'개념과 장소', image:'Rainy_7215.svg', answer:'비 오는 날', choices:['맑은 날','눈 오는 날','비 오는 날','바람 부는 날']}
];
let current=0, answers=[], startedAt=0, qStarted=0, timerId;
const $=id=>document.getElementById(id);
function show(id){['introView','testView','resultView'].forEach(x=>$(x).classList.toggle('hidden',x!==id));}
function fmt(sec){const m=Math.floor(sec/60).toString().padStart(2,'0'),s=Math.floor(sec%60).toString().padStart(2,'0');return `${m}:${s}`}
function render(){const q=questions[current];$('categoryName').textContent=q.cat;$('categoryIndex').textContent=String(Math.floor(current/5)+1).padStart(2,'0');$('questionNo').textContent=`QUESTION ${String(current+1).padStart(2,'0')}`;$('progressLabel').textContent=`${current+1} / ${questions.length}`;$('progressBar').style.width=`${(current+1)/questions.length*100}%`;$('assetStatus').textContent=`파일: img/${q.image}`;$('prompt').textContent='이것은 무엇일까요?';const stage=$('imageStage');stage.innerHTML='';const img=document.createElement('img');img.src=`img/${q.image}`;img.alt=q.answer;img.onerror=()=>{if(!img.dataset.rootTried){img.dataset.rootTried='1';img.src=q.image;return}stage.innerHTML=`<div class="fallback"><div>그림 준비 중<br><small>img/${q.image}</small></div></div>`;$('assetStatus').textContent=`그림 없음 · 파일명 유지: img/${q.image}`};stage.appendChild(img);$('choices').innerHTML=q.choices.map((c,i)=>`<button class="choice" data-value="${c}">${i+1}. ${c}</button>`).join('');document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>select(b));$('nextBtn').disabled=true;$('answeredLabel').textContent='선택하면 다음 문항으로 이동합니다';qStarted=performance.now();}
function select(btn){if(answers[current])return;const q=questions[current];const elapsed=Math.max(.1,(performance.now()-qStarted)/1000);answers[current]={question:current+1,category:q.cat,answer:q.answer,selected:btn.dataset.value,correct:btn.dataset.value===q.answer,time:elapsed,image:`img/${q.image}`};document.querySelectorAll('.choice').forEach(b=>{b.disabled=true;if(b.dataset.value===q.answer)b.classList.add('correct');if(b===btn)b.classList.add('selected');if(b===btn&&b.dataset.value!==q.answer)b.classList.add('incorrect')});$('nextBtn').disabled=false;$('answeredLabel').textContent=answers[current].correct?'정답이에요':'다음에는 다시 살펴봐요';}
function finish(){clearInterval(timerId);show('resultView');const score=answers.filter(a=>a.correct).length,total=answers.reduce((a,b)=>a+b.time,0);$('totalScore').textContent=score;$('totalTime').textContent=fmt(total);$('avgTime').textContent=`${(total/20).toFixed(1)}초`;$('scoreMessage').textContent=score>=16?'아주 잘했어요':score>=10?'잘했어요':'수고했어요';$('testDate').textContent=new Date().toLocaleString('ko-KR',{dateStyle:'medium',timeStyle:'short'});const cats=[...new Set(questions.map(q=>q.cat))];$('categoryBars').innerHTML=cats.map(c=>{const n=answers.filter(a=>a.category===c&&a.correct).length;return `<div class="bar-row"><span>${c}</span><div class="bar-bg"><div class="bar-fill" style="width:${n*20}%"></div></div><span class="bar-value">${n} / 5</span></div>`}).join('');const max=Math.max(...answers.map(a=>a.time),1);$('timeBars').innerHTML=answers.map((a,i)=>`<div class="time-col"><span>${a.time.toFixed(1)}</span><div class="time-fill" style="height:${Math.max(6,a.time/max*80)}px"></div><span>${i+1}</span></div>`).join('');}
function start(){current=0;answers=[];startedAt=performance.now();show('testView');render();clearInterval(timerId);timerId=setInterval(()=>$('timer').textContent=fmt((performance.now()-startedAt)/1000),500)}
$('startBtn').onclick=start;$('retryBtn').onclick=start;$('resetBtn').onclick=()=>{clearInterval(timerId);show('introView')};$('nextBtn').onclick=()=>{if(current<19){current++;render()}else finish()};$('csvBtn').onclick=()=>{const rows=[['문항','범주','정답','응답','정답여부','반응시간(초)','그림파일명'],...answers.map(a=>[a.question,a.category,a.answer,a.selected,a.correct?'정답':'오답',a.time.toFixed(2),a.image])];const csv='\uFEFF'+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`ppvt-r-result-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url)};

