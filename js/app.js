const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const page = $('#page');

const DB_NAMES = ['films','lenses','cameras','jobo','development'];
let DB = {};
let timer = null;
let state = loadState();

const I18N = {
  en: {
    langName:'English', chooseLanguage:'Choose Language', english:'English', chinese:'简体中文', dashboard:'Dashboard', exposure:'Exposure', library:'Library', darkroom:'Darkroom', shotlog:'Shot Log', settings:'Settings', shots:'Shots', films:'Films', lenses:'Lenses', cameras:'Cameras', jobo:'JOBO', latestShot:'Latest Shot', noShot:'No shot yet.', quickStatus:'Quick Status', offlinePWA:'Offline PWA', ready:'Ready', notSupported:'Not supported', localData:'Local data', records:'records', exposureCalculator:'Exposure Calculator', film:'Film', iso:'ISO', customISO:'Custom ISO', filmName:'Film name', lens:'Lens', focalLength:'Focal length', customFocal:'Custom focal length mm', lensName:'Lens name', camera:'Camera', cameraName:'Camera name', meteredShutter:'Metered Shutter', customExposureSeconds:'Custom exposure seconds', bellowsExtension:'Bellows extension mm', filter:'Filter', customFilterEV:'Custom filter EV', zone:'Zone', customZoneEV:'Custom Zone EV offset', aiZoneSuggestion:'AI Zone Suggestion', chooseSubject:'Choose a subject to get Zone advice.', calculate:'Calculate', applyAIZone:'Apply AI Zone', saveShot:'Save Shot', saved:'Saved', finalExposure:'Final Exposure', metered:'Metered shutter', beforeReciprocity:'Before reciprocity', totalComp:'Total compensation', bellows:'Bellows', reciprocity:'Reciprocity', reciprocityRule:'Reciprocity rule', aiLogic:'AI Logic', autoExposure:'Auto Exposure', autoZone:'Auto Zone', autoReciprocity:'Auto Reciprocity', autoDevelopment:'Auto Development', exposureNormal:'Exposure combination looks normal.', bigComp:'Large compensation: check Filter / Bellows entries.', longExposure:'Long exposure: reciprocity applied; bracket important work.', bellowsAdvice:'Large bellows compensation: confirm actual bellows extension.', velviaAdvice:'Velvia has low latitude: protect highlights.', negAdvice:'Color negative: protect shadows; slight overexposure is usually safe.', librarySearch:'Library Search', searchPlaceholder:'Search film, lens, camera, JOBO, development...', noResults:'No results', darkroomTimer:'Darkroom Timer', processFilm:'Process / Film', customProcessDeveloper:'Custom process / developer', customTime:'Custom time', start:'Start', pause:'Pause', reset:'Reset', devComplete:'Development complete', aiDevelopment:'AI Development', temperature:'Temperature', method:'Method', time:'Time', advice:'Advice', c41e6Advice:'Temperature stability is critical.', bwAdvice:'JOBO Rotary value is a starting point; test important negatives.', data:'Data', exportJSON:'Export JSON', importJSON:'Import JSON', clear:'Clear', clearShots:'Clear all shots?', invalidJSON:'Invalid JSON', backupAll:'Backup All Data', restoreBackup:'Restore Backup', install:'Install', installText:'iPhone: Safari → Share → Add to Home Screen.', about:'About', restored:'Restored', other:'Other...', noneNeeded:'None needed', generic:'Generic', useStart:'Use as starting point and test your own workflow.', meteredAperture:'Metered Aperture', customAperture:'Custom f-number', compensationMode:'Compensation Mode', keepAperture:'Keep Aperture', keepShutter:'Keep Shutter', autoBalance:'Auto Balance', finalCombination:'Final combination', finalAperture:'Final aperture', notSet:'Not set', flashPower:'Flash Power', flashISO:'Flash ISO', gnNumber:'GN Number (ISO100, meters)', flashFNumber:'Flash f-number', distanceM:'Distance (m)', calculateFlash:'Calculate Flash', basePower:'Base power', finalPower:'Final power', requiredGN:'Required GN', compensationForFlash:'Flash compensation', overFullPower:'Need more than full power', belowMinPower:'1/128 or lower', flashHint:'Uses Bellows / Filter plus independent flash exposure compensation.', flashExposureComp:'Flash exposure compensation', flashAdvice:'Flash advice', increaseISO:'Increase ISO to about', decreaseISO:'Lower ISO to about', openAperture:'Open aperture to about', closeAperture:'Stop down to about', moveCloser:'Move flash closer to', moveFarther:'Move flash farther to', powerOK:'Flash power is within normal range.', lang:'Language', resetMeter:'Reset Meter', fillMeteredExposure:'Please select Metered Shutter to calculate.'
  },
  zh: {
    langName:'简体中文', chooseLanguage:'选择语言', english:'English', chinese:'简体中文', dashboard:'首页', exposure:'曝光计算', library:'资料库', darkroom:'暗房', shotlog:'拍摄记录', settings:'设置', shots:'记录', films:'胶片', lenses:'镜头', cameras:'相机', jobo:'JOBO', latestShot:'最新拍摄', noShot:'还没有拍摄记录。', quickStatus:'快速状态', offlinePWA:'离线 PWA', ready:'已准备', notSupported:'不支持', localData:'本机资料', records:'条记录', exposureCalculator:'曝光计算器', film:'胶片', iso:'ISO', customISO:'自定义 ISO', filmName:'胶片名称', lens:'镜头', focalLength:'焦距', customFocal:'自定义焦距 mm', lensName:'镜头名称', camera:'相机', cameraName:'相机名称', meteredShutter:'测光快门', customExposureSeconds:'自定义曝光秒数', bellowsExtension:'皮腔延伸 mm', filter:'滤镜', customFilterEV:'自定义滤镜 EV', zone:'Zone 分区', customZoneEV:'自定义 Zone EV 偏移', aiZoneSuggestion:'AI Zone 建议', chooseSubject:'选择拍摄主体以取得 Zone 建议。', calculate:'计算', applyAIZone:'套用 AI Zone', saveShot:'保存拍摄', saved:'已保存', finalExposure:'最终曝光', metered:'测光快门', beforeReciprocity:'互易律前曝光', totalComp:'总补偿', bellows:'皮腔补偿', reciprocity:'互易律', reciprocityRule:'互易律规则', aiLogic:'AI 建议', autoExposure:'自动建议曝光', autoZone:'自动建议 Zone', autoReciprocity:'自动建议 Reciprocity', autoDevelopment:'自动建议显影', exposureNormal:'曝光组合正常。', bigComp:'曝光补偿很大：建议检查 Filter / Bellows 是否填错。', longExposure:'长曝光：已自动套用互易律；重要照片建议包围曝光。', bellowsAdvice:'皮腔补偿明显：请确认实际皮腔长度。', velviaAdvice:'Velvia 宽容度低：建议保护高光。', negAdvice:'彩色负片建议保护阴影，轻微过曝通常安全。', librarySearch:'资料库搜索', searchPlaceholder:'搜索胶片、镜头、相机、JOBO、显影资料...', noResults:'没有结果', darkroomTimer:'暗房计时器', processFilm:'流程 / 胶片', customProcessDeveloper:'自定义流程 / 显影液', customTime:'自定义时间', start:'开始', pause:'暂停', reset:'重设', devComplete:'显影完成', aiDevelopment:'AI 显影建议', temperature:'温度', method:'方式', time:'时间', advice:'建议', c41e6Advice:'温度稳定最重要。', bwAdvice:'JOBO Rotary 时间可作起点，重要底片建议先测试。', data:'数据', exportJSON:'导出 JSON', importJSON:'导入 JSON', clear:'清除', clearShots:'清除所有拍摄记录？', invalidJSON:'JSON 无效', backupAll:'备份所有数据', restoreBackup:'恢复备份', install:'安装', installText:'iPhone：Safari → 分享 → 加入主画面。', about:'关于', restored:'已恢复', other:'Other...', noneNeeded:'不需要', generic:'通用', useStart:'作为起点使用，重要工作请测试自己的流程。', meteredAperture:'测光光圈', customAperture:'自定义光圈', compensationMode:'补偿模式', keepAperture:'保持光圈', keepShutter:'保持快门', autoBalance:'自动平衡', finalCombination:'最终组合', finalAperture:'最终光圈', notSet:'不设置', flashPower:'闪光灯功率', flashISO:'闪灯 ISO', gnNumber:'GN 指数（ISO100，米）', flashFNumber:'闪灯光圈', distanceM:'距离（米）', calculateFlash:'计算闪灯', basePower:'基础功率', finalPower:'最终功率', requiredGN:'需要 GN', compensationForFlash:'闪灯补偿', overFullPower:'超过全功率，需要更大闪灯或开大光圈', belowMinPower:'1/128 或更低', flashHint:'会套用皮腔 / 滤镜，并使用独立闪灯曝光补偿。', flashExposureComp:'闪灯曝光补偿', flashAdvice:'闪灯建议', increaseISO:'ISO 提高到约', decreaseISO:'ISO 降低到约', openAperture:'光圈开到约', closeAperture:'光圈收至约', moveCloser:'闪灯移近到', moveFarther:'闪灯移远到', powerOK:'闪灯功率在正常范围内。', lang:'语言', resetMeter:'重设测光', fillMeteredExposure:'请选择测光快门后再计算。'
  }
};
function currentLang(){return state.settings.lang || localStorage.lfmpLang || 'en'}
function t(k){return (I18N[currentLang()]||I18N.en)[k] || I18N.en[k] || k}
Object.assign(I18N.en,{autoZone:'AI Exposure Suggestion',exposureCompensation:'Exposure Compensation',customExposureComp:'Custom exposure compensation EV',aiExposureSuggestion:'AI Exposure Suggestion',chooseSubjectEV:'Choose a subject to get exposure suggestion.',applyAISuggestion:'Apply AI Suggestion',applyCompBy:'Apply Compensation By',applyByShutter:'Shutter',applyByAperture:'Aperture',exposureSummary:'Exposure Summary',meteredExposure:'Metered Exposure',flashExposureTotal:'Exposure Total'});
Object.assign(I18N.zh,{autoZone:'AI 曝光建议',exposureCompensation:'曝光补偿',customExposureComp:'自定义曝光补偿 EV',aiExposureSuggestion:'AI 曝光建议',chooseSubjectEV:'选择拍摄主体以取得曝光建议。',applyAISuggestion:'套用 AI 建议',applyCompBy:'补偿应用到',applyByShutter:'快门',applyByAperture:'光圈',exposureSummary:'曝光摘要',meteredExposure:'测光曝光',flashExposureTotal:'曝光总补偿'});

const SHUTTERS = [['1/8000',1/8000],['1/4000',1/4000],['1/2000',1/2000],['1/1000',1/1000],['1/500',1/500],['1/250',1/250],['1/125',1/125],['1/60',1/60],['1/30',1/30],['1/15',1/15],['1/8',1/8],['1/4',1/4],['1/2',1/2],['1s',1],['2s',2],['4s',4],['8s',8],['15s',15],['30s',30],['1m',60],['2m',120],['4m',240],['8m',480],['15m',900],['30m',1800]];
const APERTURES = [0.7,0.8,0.9,1.0,1.1,1.2,1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22,25,29,32,36,40,45,51,57,64,72,81,90,128];
const ISO_VALUES = [12,20,25,32,40,50,64,80,100,125,160,200,250,320,400,500,640,800,1000,1250,1600,3200,6400];
const FOCALS = [47,58,65,75,90,105,120,135,150,180,210,240,300,360,450,480,600,720,1200];
const FILTERS = [['None',0],['+0.3 EV',0.3],['+0.5 EV',0.5],['+1 EV',1],['+1.5 EV',1.5],['+2 EV',2],['+2.5 EV',2.5],['+3 EV',3],['+4 EV',4],['+5 EV',5],['+6 EV',6],['+10 EV',10]];
const FLASH_COMP = [-3,-2.7,-2.3,-2,-1.7,-1.3,-1,-0.7,-0.3,0,0.3,0.7,1,1.3,1.7,2,2.3,2.7,3];
const EXPOSURE_COMP = Array.from({length:31},(_,i)=>Number((-5+i/3).toFixed(2)));
function evLabel(v){const sign=v>0?'+':''; const rounded=Math.round(v*3)/3; if(Math.abs(rounded) < 0.01) return '0 EV'; const whole=Math.trunc(Math.abs(rounded)); const rem=Math.round((Math.abs(rounded)-whole)*3); const frac=rem===1?'1/3':rem===2?'2/3':''; const txt=whole&&frac?`${whole} ${frac}`:(whole?String(whole):frac); return `${sign}${txt} EV`;}
const SCENES = {
  en:[['none','No AI exposure suggestion'],['backlit_portrait','Backlit portrait → +1 EV'],['snow','Snow / white scene → +2 EV'],['black_clothes','Black clothes / black suit → -2 EV'],['asian_skin','Asian skin → +1 EV'],['dark_skin','Dark skin → -1/2 EV'],['white_dress','White wedding dress → +2 1/2 EV'],['green_grass','Green grass → 0 EV'],['blue_sky','Blue sky → +1/2 EV'],['clouds','White clouds → +2 EV'],['night_sky','Night sky → -3 EV']],
  zh:[['none','无 AI 曝光建议'],['backlit_portrait','逆光人像 → +1 EV'],['snow','雪景 / 白色场景 → +2 EV'],['black_clothes','黑衣服 / 黑西装 → -2 EV'],['asian_skin','亚洲肤色 → +1 EV'],['dark_skin','深色肤色 → -1/2 EV'],['white_dress','白色婚纱 → +2 1/2 EV'],['green_grass','绿草 → 0 EV'],['blue_sky','蓝天 → +1/2 EV'],['clouds','白云 → +2 EV'],['night_sky','夜空 → -3 EV']]
};
const ZONE_RULES = {
  backlit_portrait:{zone:6, ev:1, reason:{en:'Backlit portrait usually benefits from about +1 EV on the subject.', zh:'逆光人像主体通常建议约 +1 EV。'}},
  snow:{zone:7, ev:2, reason:{en:'Snow / white scenes usually need about +2 EV to stay bright with texture.', zh:'雪景 / 白色场景通常建议约 +2 EV 来保留明亮感与纹理。'}},
  black_clothes:{zone:3, ev:-2, reason:{en:'Black fabric with detail usually needs about -2 EV.', zh:'黑色布料要保留细节通常建议约 -2 EV。'}},
  asian_skin:{zone:6, ev:1, reason:{en:'Skin tone often benefits from about +1 EV.', zh:'肤色通常可用约 +1 EV。'}},
  dark_skin:{zone:4.5, ev:-0.5, reason:{en:'Dark skin often looks natural around -1/2 EV.', zh:'深色肤色通常用约 -1/2 EV 更自然。'}},
  white_dress:{zone:7.5, ev:2.5, reason:{en:'White dress with texture usually needs about +2 to +2.5 EV.', zh:'白色婚纱保留纹理通常建议 +2 到 +2.5 EV。'}},
  green_grass:{zone:5, ev:0, reason:{en:'Green grass is close to meter middle value.', zh:'绿草接近测光表中灰值。'}},
  blue_sky:{zone:5.5, ev:0.5, reason:{en:'Blue sky often benefits from about +1/2 EV depending on tone.', zh:'蓝天通常可用约 +1/2 EV，视颜色深浅调整。'}},
  clouds:{zone:7, ev:2, reason:{en:'White clouds with detail usually need about +2 EV.', zh:'有细节的白云通常建议约 +2 EV。'}},
  night_sky:{zone:2, ev:-3, reason:{en:'Night sky should stay dark; about -3 EV is a useful starting point.', zh:'夜空应保持很暗，约 -3 EV 可作起点。'}}
};

function loadState(){try{return {shots:JSON.parse(localStorage.lfmpShots||'[]'),settings:JSON.parse(localStorage.lfmpSettings||'{}')}}catch{return {shots:[],settings:{}}}}
function saveState(){localStorage.lfmpShots=JSON.stringify(state.shots);localStorage.lfmpSettings=JSON.stringify(state.settings);if(state.settings.lang)localStorage.lfmpLang=state.settings.lang}
async function loadDB(){for(const n of DB_NAMES){DB[n]=await fetch(`database/${n}.json`,{cache:'no-store'}).then(r=>r.json()).catch(()=>[]);}}
function card(tt,b){return `<section class="card"><h2>${esc(tt)}</h2>${b}</section>`}
function stat(tt,v){return `<div class="stat"><b>${esc(v)}</b><small>${esc(tt)}</small></div>`}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function row(a,b){return `<div class="row"><span>${esc(a)}</span><b>${esc(b)}</b></div>`}
function findById(arr,id){return (arr||[]).find(x=>x.id===id)||null}
function options(arr,labelFn,valueFn=x=>x.id,selected=''){return arr.map(x=>`<option value="${esc(valueFn(x))}" ${String(valueFn(x))===String(selected)?'selected':''}>${esc(labelFn(x))}</option>`).join('')+`<option value="__other">${t('other')}</option>`}
function fmt(sec){if(!isFinite(sec)||sec<=0)return'-';if(sec<1)return`1/${Math.round(1/sec)}s`;if(sec<60)return`${Number(sec.toFixed(sec<10?1:0))}s`;const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=Math.round(sec%60);return h>0?`${h}h ${m}m ${s}s`:`${m}m ${s}s`}
function parseTime(v){if(!v)return 0;const p=String(v).split(':').map(Number);return p.length===2?p[0]*60+p[1]:(Number(v)*60||0)}
function timeText(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`}
function langReason(r){return typeof r==='object'?(r[currentLang()]||r.en):r}

function initLanguageUI(){
  document.body.insertAdjacentHTML('beforeend', `<div id="langMenu" class="langMenu" hidden><button data-lang="en">🇺🇸 English</button><button data-lang="zh">🇨🇳 简体中文</button></div>`);
  const header=document.querySelector('header');
  header.insertAdjacentHTML('beforeend', `<button id="langBtn" class="langBtn">${currentLang()==='zh'?'🇨🇳':'🇺🇸'} ▼</button>`);
  $('#langBtn').onclick=()=>$('#langMenu').hidden=!$('#langMenu').hidden;
  $$('[data-lang]').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
  updateStaticLabels();
}
function setLang(lang){state.settings.lang=lang;saveState();$('#langMenu').hidden=true;$('#langBtn').textContent=(lang==='zh'?'🇨🇳':'🇺🇸')+' ▼';updateStaticLabels();route(location.hash.replace('#','')||'dashboard', true)}
function updateStaticLabels(){
  const keys=['dashboard','exposure','library','darkroom','shotlog','settings'];
  $$('[data-page]').forEach((b,i)=>b.textContent=t(keys[i]));
  const small=document.querySelector('header small'); if(small) small.textContent='Professional Final';
}

function dashboard(){const latest=state.shots[0];page.innerHTML=card(t('dashboard'),`<div class="grid">${stat(t('shots'),state.shots.length)}${stat(t('films'),DB.films.length)}${stat(t('lenses'),DB.lenses.length)}${stat(t('cameras'),DB.cameras.length)}${stat(t('jobo'),DB.jobo.length)}</div>`)+card(t('latestShot'),latest?shotView(latest):`<p class="muted">${t('noShot')}</p>`)+card(t('quickStatus'),`<p>${t('offlinePWA')}: <b>${'serviceWorker'in navigator?t('ready'):t('notSupported')}</b></p><p>${t('localData')}: <b>${state.shots.length} ${t('records')}</b></p>`)}

function exposure(){
  page.innerHTML=card(t('exposureCalculator'),`
    <label>${t('film')}</label><select id="film">${options(DB.films,f=>`${f.name} ISO ${f.iso}`)}</select>
    <div id="filmOther" class="otherbox" hidden><label>${t('iso')}</label><select id="customISOSelect">${ISO_VALUES.map(v=>`<option value="${v}" ${v===100?'selected':''}>ISO ${v}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="customISOBox" hidden><label>${t('customISO')}</label><input id="customISO" type="number" value="100"></div><label>${t('filmName')}</label><input id="customFilmName" placeholder="Other film"></div>
    <label>${t('lens')}</label><select id="lens">${options(DB.lenses,l=>`${l.name} — ${l.focalLength}mm`)}</select>
    <div id="lensOther" class="otherbox" hidden><label>${t('focalLength')}</label><select id="customFocalSelect">${FOCALS.map(v=>`<option value="${v}" ${v===150?'selected':''}>${v}mm</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="customFocalBox" hidden><label>${t('customFocal')}</label><input id="customFocal" type="number" value="150"></div><label>${t('lensName')}</label><input id="customLensName" placeholder="Other lens"></div>
    <label>${t('camera')}</label><select id="camera">${options(DB.cameras,c=>c.name)}</select><div id="cameraOther" class="otherbox" hidden><label>${t('cameraName')}</label><input id="customCameraName" placeholder="Other camera"></div>
    <label>${t('meteredShutter')}</label><select id="shutterSelect"><option value="__none">${t('notSet')}</option>${SHUTTERS.map(([label,val])=>`<option value="${val}" ${label==='1/30'?'selected':''}>${label}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="shutterOther" class="otherbox" hidden><label>${t('customExposureSeconds')}</label><input id="customShutter" type="number" step="0.001" value="1"></div>
    <label>${t('meteredAperture')}</label><select id="apertureSelect"><option value="__none">${t('notSet')}</option>${APERTURES.map(v=>`<option value="${v}">f/${v}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="apertureOther" class="otherbox" hidden><label>${t('customAperture')}</label><input id="customAperture" type="number" step="0.1" value="8"></div>
    <div class="actions"><button id="resetMeter" type="button">${t('resetMeter')}</button></div>
    <label>${t('bellowsExtension')}</label><input id="bellows" type="number" value="150">
    <label>${t('filter')}</label><select id="filterSelect">${FILTERS.map(([label,val])=>`<option value="${val}">${label}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="filterOther" class="otherbox" hidden><label>${t('customFilterEV')}</label><input id="customFilter" type="number" step="0.1" value="0"></div>
    <label>${t('exposureCompensation')}</label><select id="exposureCompSelect">${EXPOSURE_COMP.map(v=>`<option value="${v}" ${v===0?'selected':''}>${evLabel(v)}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="exposureCompOther" class="otherbox" hidden><label>${t('customExposureComp')}</label><input id="customExposureComp" type="number" step="0.1" value="0"></div>
    <label>${t('applyCompBy')}</label><select id="applyBy"><option value="shutter">${t('applyByShutter')}</option><option value="aperture">${t('applyByAperture')}</option></select>
    <label>${t('aiExposureSuggestion')}</label><select id="sceneSelect">${(SCENES[currentLang()]||SCENES.en).map(([v,tx])=>`<option value="${v}">${esc(tx.replace(/Zone [IVX0-9.]+/g,''))}</option>`).join('')}</select><div class="aiBox" id="aiZoneBox">${t('chooseSubjectEV')}</div>
    <div class="actions"><button class="primary" id="calc">${t('calculate')}</button><button id="applyZone">${t('applyAISuggestion')}</button><button id="save">${t('saveShot')}</button></div><div id="result"></div>
    <hr><h2>${t('flashPower')}</h2><small>${t('flashHint')}</small>
    <label>${t('flashISO')}</label><select id="flashISOSelect">${ISO_VALUES.map(v=>`<option value="${v}" ${v===100?'selected':''}>ISO ${v}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="flashISOOther" class="otherbox" hidden><label>${t('customISO')}</label><input id="flashCustomISO" type="number" value="100"></div>
    <label>${t('gnNumber')}</label><input id="flashGN" type="number" step="0.1" value="60">
    <label>${t('flashFNumber')}</label><select id="flashApertureSelect">${APERTURES.map(v=>`<option value="${v}" ${v===8?'selected':''}>f/${v}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="flashApertureOther" class="otherbox" hidden><label>${t('customAperture')}</label><input id="flashCustomAperture" type="number" step="0.1" value="8"></div>
    <label>${t('distanceM')}</label><input id="flashDistance" type="number" step="0.01" value="3">
    <label>${t('flashExposureComp')}</label><select id="flashCompSelect">${FLASH_COMP.map(v=>`<option value="${v}" ${v===0?'selected':''}>${v>0?'+':''}${v} EV</option>`).join('')}</select>
    <div class="actions"><button id="flashCalc">${t('calculateFlash')}</button></div><div id="flashResult"></div>`);
  let last=null;const toggle=(sel,box)=>{const e=$(sel),b=$(box);if(e&&b)b.hidden=e.value!=='__other'};const bindOther=(sel,box)=>{$(sel).onchange=()=>{toggle(sel,box);autoBellows()};toggle(sel,box)};
  bindOther('#film','#filmOther');bindOther('#lens','#lensOther');bindOther('#camera','#cameraOther');bindOther('#shutterSelect','#shutterOther');bindOther('#apertureSelect','#apertureOther');bindOther('#filterSelect','#filterOther');bindOther('#exposureCompSelect','#exposureCompOther');bindOther('#flashISOSelect','#flashISOOther');bindOther('#flashApertureSelect','#flashApertureOther');
  $('#sceneSelect').onchange=()=>{renderZoneSuggestion();autoRecalculate()};$('#applyZone').onclick=()=>{applySuggestedZone();autoRecalculate()};renderZoneSuggestion();
  $('#customISOSelect').onchange=()=>{$('#customISOBox').hidden=$('#customISOSelect').value!=='__other';syncFlashISOFromFilm();autoRecalculate()};
  $('#customFocalSelect').onchange=()=>{$('#customFocalBox').hidden=$('#customFocalSelect').value!=='__other';autoBellows();autoRecalculate()};
  function autoBellows(){const focal=getLensInfo().focalLength,current=Number($('#bellows').value);if(!current||current===150)$('#bellows').value=focal}
  $('#lens').onchange=()=>{toggle('#lens','#lensOther');$('#bellows').value=getLensInfo().focalLength;autoRecalculate()};autoBellows();
  function syncFlashISOFromFilm(){const iso=getFilmInfo().iso;if(ISO_VALUES.includes(Number(iso))){$('#flashISOSelect').value=String(iso);$('#flashISOOther').hidden=true}else{$('#flashISOSelect').value='__other';$('#flashISOOther').hidden=false;$('#flashCustomISO').value=iso||100}}
  function syncFlashApertureFromExposure(){const ap=getApertureNumber();if(!ap)return;if(APERTURES.includes(Number(ap))){$('#flashApertureSelect').value=String(ap);$('#flashApertureOther').hidden=true}else{$('#flashApertureSelect').value='__other';$('#flashApertureOther').hidden=false;$('#flashCustomAperture').value=ap}}
  function syncExposureApertureFromFlash(){const ap=getFlashApertureNumber();if(!ap)return;if(APERTURES.includes(Number(ap))){$('#apertureSelect').value=String(ap);$('#apertureOther').hidden=true}else{$('#apertureSelect').value='__other';$('#apertureOther').hidden=false;$('#customAperture').value=ap}}
  function autoRecalculate(){last=calcExposure();renderExposureResult(last);renderFlashResult()}
  syncFlashISOFromFilm();syncFlashApertureFromExposure();
  let evLock=false;
  let evPair={s:getShutterSeconds(), ap:getApertureNumber()};
  $('#resetMeter').onclick=()=>{evLock=true;$('#shutterSelect').value='__none';$('#shutterOther').hidden=true;$('#customShutter').value='';$('#apertureSelect').value='__none';$('#apertureOther').hidden=true;$('#customAperture').value='';evPair={s:null,ap:null};evLock=false;syncFlashApertureFromExposure();autoRecalculate()};
  function refreshEVPair(){evPair={s:getShutterSeconds(),ap:getApertureNumber()}}
  function linkFromAperture(){if(evLock)return;const newAp=getApertureNumber();if(!evPair.ap||!newAp){refreshEVPair();autoRecalculate();return}evLock=true;setShutterSeconds(evPair.s*((newAp/evPair.ap)**2));syncFlashApertureFromExposure();refreshEVPair();evLock=false;autoRecalculate()}
  function linkFromShutter(){if(evLock)return;const newS=getShutterSeconds();if(!newS||!evPair.ap||!evPair.s){refreshEVPair();autoRecalculate();return}evLock=true;setApertureNumber(evPair.ap*Math.sqrt(newS/evPair.s));syncFlashApertureFromExposure();refreshEVPair();evLock=false;autoRecalculate()}
  ['#film','#customISO','#bellows','#filterSelect','#customFilter','#exposureCompSelect','#customExposureComp','#applyBy'].forEach(sel=>{const el=$(sel);if(el)el.addEventListener('input',()=>{syncFlashISOFromFilm();autoRecalculate()});if(el)el.addEventListener('change',()=>{syncFlashISOFromFilm();autoRecalculate()})});
  $('#shutterSelect').addEventListener('change',()=>{toggle('#shutterSelect','#shutterOther');linkFromShutter()});
  $('#customShutter').addEventListener('input',()=>{linkFromShutter()});
  $('#apertureSelect').addEventListener('change',()=>{toggle('#apertureSelect','#apertureOther');linkFromAperture()});
  $('#customAperture').addEventListener('input',()=>{linkFromAperture()});
  ['#flashISOSelect','#flashCustomISO','#flashGN','#flashDistance','#flashCompSelect'].forEach(sel=>{const el=$(sel);if(el)el.addEventListener('input',renderFlashResult);if(el)el.addEventListener('change',renderFlashResult)});
  $('#flashApertureSelect').addEventListener('change',()=>{toggle('#flashApertureSelect','#flashApertureOther');syncExposureApertureFromFlash();refreshEVPair();autoRecalculate()});
  $('#flashCustomAperture').addEventListener('input',()=>{syncExposureApertureFromFlash();refreshEVPair();autoRecalculate()});
  $('#flashCalc').onclick=renderFlashResult;
  $('#calc').onclick=()=>{last=calcExposure();renderExposureResult(last);renderFlashResult()};
  last=calcExposure();renderExposureResult(last);renderFlashResult();
  $('#save').onclick=()=>{if(!last)last=calcExposure();const film=getFilmInfo(),lens=getLensInfo(),camera=getCameraInfo();const shot={id:crypto.randomUUID(),date:new Date().toISOString(),camera:camera.name,lens:lens.name,film:film.name,iso:film.iso,exposure:fmt(last.final),aperture:last.finalApertureLabel||last.apertureLabel||'-',bellows:+$('#bellows').value,exposureCompEV:last.exposureCompEV,totalEV:last.totalEV,filterEV:last.filterEV,notes:`${t('saved')}. ${t('reciprocity')}: ${last.reciprocityRule}`};state.shots.unshift(shot);saveState();alert(t('saved'))}
}
function getFilmInfo(){if($('#film').value==='__other'){const iso=$('#customISOSelect').value==='__other'?Number($('#customISO').value||100):Number($('#customISOSelect').value);return{name:$('#customFilmName').value||`Other Film ISO ${iso}`,iso}}const f=findById(DB.films,$('#film').value);return{name:f?.name||'Unknown Film',iso:Number(f?.iso||100),process:f?.process,type:f?.type}}
function getLensInfo(){if($('#lens').value==='__other'){const focalLength=$('#customFocalSelect').value==='__other'?Number($('#customFocal').value||150):Number($('#customFocalSelect').value);return{name:$('#customLensName').value||`Other Lens ${focalLength}mm`,focalLength}}const l=findById(DB.lenses,$('#lens').value);return{name:l?.name||'Unknown Lens',focalLength:Number(l?.focalLength||150)}}
function getCameraInfo(){if($('#camera').value==='__other')return{name:$('#customCameraName').value||'Other Camera'};const c=findById(DB.cameras,$('#camera').value);return{name:c?.name||'Unknown Camera'}}
function getShutterSeconds(){const v=$('#shutterSelect')?.value;if(!v||v==='__none')return null;if(v==='__other'){const n=Number($('#customShutter').value);return isFinite(n)&&n>0?n:null}const n=Number(v);return isFinite(n)&&n>0?n:null}
function getApertureNumber(){const v=$('#apertureSelect')?.value;if(!v||v==='__none')return null;if(v==='__other')return Number($('#customAperture').value||0)||null;return Number(v)}
function getFlashISO(){const v=$('#flashISOSelect')?.value;if(v==='__other')return Number($('#flashCustomISO')?.value||100);return Number(v||getFilmInfo().iso||100)}
function getFlashApertureNumber(){const v=$('#flashApertureSelect')?.value;if(v==='__other')return Number($('#flashCustomAperture')?.value||0)||null;return Number(v||getApertureNumber()||8)}
function fmtAperture(n){if(!n||!isFinite(n))return '-';const nearest=APERTURES.reduce((a,b)=>Math.abs(b-n)<Math.abs(a-n)?b:a,APERTURES[0]);return `f/${nearest}`}

function nearestShutterSeconds(sec){return SHUTTERS.reduce((best,item)=>Math.abs(Math.log2(item[1]/sec))<Math.abs(Math.log2(best[1]/sec))?item:best,SHUTTERS[0])[1]}
function setShutterSeconds(sec){
  if(!isFinite(sec)||sec<=0)return;
  const nearest=nearestShutterSeconds(sec);
  if(Math.abs(Math.log2(nearest/sec))<0.18){
    $('#shutterSelect').value=String(nearest);
    $('#shutterOther').hidden=true;
  }else{
    $('#shutterSelect').value='__other';
    $('#shutterOther').hidden=false;
    $('#customShutter').value=Number(sec.toFixed(sec<1?4:2));
  }
}
function setApertureNumber(ap){
  if(!isFinite(ap)||ap<=0)return;
  const nearest=APERTURES.reduce((a,b)=>Math.abs(Math.log2(b/ap))<Math.abs(Math.log2(a/ap))?b:a,APERTURES[0]);
  if(Math.abs(Math.log2(nearest/ap))<0.18){
    $('#apertureSelect').value=String(nearest);
    $('#apertureOther').hidden=true;
  }else{
    $('#apertureSelect').value='__other';
    $('#apertureOther').hidden=false;
    $('#customAperture').value=Number(ap.toFixed(1));
  }
}
function getFilterEV(){return $('#filterSelect').value==='__other'?Number($('#customFilter').value||0):Number($('#filterSelect').value)}
function getExposureCompInfo(){if($('#exposureCompSelect').value==='__other')return{ev:Number($('#customExposureComp').value||0),label:'Other'};const ev=Number($('#exposureCompSelect').value||0);return{ev,label:evLabel(ev)}}
function getZoneSuggestion(){return ZONE_RULES[$('#sceneSelect')?.value]||null}
function renderZoneSuggestion(){const z=getZoneSuggestion();$('#aiZoneBox').innerHTML=z?`<b>${evLabel(z.ev)}</b><br>${esc(langReason(z.reason))}`:t('chooseSubjectEV')}
function applySuggestedZone(){const z=getZoneSuggestion();if(!z)return;const rounded=Math.round(z.ev*3)/3;const hit=EXPOSURE_COMP.find(v=>Math.abs(v-rounded)<0.01);if(hit!==undefined){$('#exposureCompSelect').value=String(hit);$('#exposureCompOther').hidden=true}else{$('#exposureCompSelect').value='__other';$('#exposureCompOther').hidden=false;$('#customExposureComp').value=z.ev}}
function filmKey(name){return String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,'_')}
function reciprocityCorrection(film,seconds){if(!isFinite(seconds)||seconds<=1)return{final:seconds,ev:0,rule:t('noneNeeded')};const key=filmKey(film?.name||'');let corrected=seconds,rule=t('generic');if(key.includes('e100')){corrected=seconds<=100?seconds:seconds*1.05;rule='Kodak E100'}else if(key.includes('provia')){corrected=seconds<=120?seconds:seconds*1.5;rule='Provia 100F'}else if(key.includes('velvia_50')||key.includes('velvia50')){corrected=seconds<=4?seconds:Math.pow(seconds,1.15);rule='Velvia 50'}else if(key.includes('hp5')){corrected=Math.pow(seconds,1.31);rule='HP5 Plus'}else if(key.includes('fp4')||key.includes('delta_100')||key.includes('delta100')){corrected=Math.pow(seconds,1.26);rule='Ilford formula'}else if(key.includes('fomapan')||key.includes('kentmere')||key.includes('rollei')){corrected=Math.pow(seconds,1.20);rule='B&W generic'}else{corrected=Math.pow(seconds,1.15);rule='Other ISO generic'}const ev=Math.log2(corrected/seconds);return{final:corrected,ev,rule}}
function findDevelopmentRecommendation(film){const name=String(film?.name||'').toLowerCase(),process=String(film?.process||'').toLowerCase(),iso=Number(film?.iso||100);let matches=(DB.development||[]).filter(d=>String(d.film||'').toLowerCase()&&name.includes(String(d.film||'').toLowerCase().split(' ')[0]));if(!matches.length)matches=(DB.development||[]).filter(d=>String(d.process||'').toLowerCase()&&process&&String(d.process||'').toLowerCase().includes(process));if(!matches.length){if(process.includes('c-41')||name.includes('portra')||name.includes('gold')||name.includes('ektar'))return{film:film.name,process:'C-41',method:'JOBO Rotary',temperature_C:38,time:'3:15',note:'Generic C-41 standard'};if(process.includes('e-6')||name.includes('e100')||name.includes('provia')||name.includes('velvia'))return{film:film.name,process:'E-6',method:'JOBO Rotary',temperature_C:38,firstDeveloper:'6:30',note:'Generic E-6 standard'};if(iso>=800)return{film:film.name,process:'B&W',developer:'DD-X / Microphen',method:'JOBO Rotary',temperature_C:20,time:'10:00+',note:'High ISO / push film: test and adjust'};return{film:film.name,process:'B&W',developer:'DD-X / XTOL',method:'JOBO Rotary',temperature_C:20,time:'8:00',note:'Generic B&W starting recommendation'}}return matches[0]}
function aiExposureAdvice(r,film){const advice=[];if(r.totalEV>4)advice.push(t('bigComp'));if(r.final>=1)advice.push(t('longExposure'));if(r.bellowsEV>1)advice.push(t('bellowsAdvice'));if(String(film.name).toLowerCase().includes('velvia'))advice.push(t('velviaAdvice'));if(String(film.name).toLowerCase().includes('portra')||String(film.name).toLowerCase().includes('color negative'))advice.push(t('negAdvice'));if(!advice.length)advice.push(t('exposureNormal'));return advice}
function renderAIRecommendations(r){const film=getFilmInfo(),dev=findDevelopmentRecommendation(film),exp=aiExposureAdvice(r,film),z=getZoneSuggestion(),devTime=dev.time||dev.developerTime||dev.firstDeveloper||'-';return `<div class="aiBox"><b>${t('aiLogic')}</b>${row(t('autoExposure'),exp.join(' '))}${row(t('autoZone'),z?`${evLabel(z.ev)}: ${langReason(z.reason)}`:`${r.exposureCompLabel} selected`)}${row(t('autoReciprocity'),`${r.reciprocityRule} (${r.reciprocityEV.toFixed(2)} EV)`)}${row(t('autoDevelopment'),`${dev.process||'B&W'} ${dev.developer||''} ${dev.method||''} ${dev.temperature_C||20}°C ${devTime}`)}<small>${esc(dev.note||t('useStart'))}</small></div>`}
function calcExposure(){
  const film=getFilmInfo(),s=getShutterSeconds(),ap=getApertureNumber(),focal=Number(getLensInfo().focalLength||150),b=Number($('#bellows').value),filter=getFilterEV(),ec=getExposureCompInfo();
  if(!s){return{valid:false,final:0,finalAperture:ap||null,finalApertureLabel:ap?fmtAperture(ap):'',aperture:ap,apertureLabel:ap?`f/${ap}`:'-',meteredCombination:t('notSet'),finalCombination:t('fillMeteredExposure'),beforeReciprocity:0,reciprocityEV:0,reciprocityRule:t('noneNeeded'),metered:0,totalEV:0,bellowsEV:0,exposureCompEV:ec.ev,exposureCompLabel:ec.label,filterEV:filter,focal,bellows:b,applyBy:$('#applyBy')?.value||'shutter'}}
  const bellowsEV=Math.log2(Math.max((b/focal)**2,0.0001));
  const preEV=bellowsEV+filter+ec.ev;
  const applyBy=$('#applyBy')?.value||'shutter';
  const preliminaryShutter=(applyBy==='shutter'||!ap)?s*(2**preEV):s;
  const rec=reciprocityCorrection(film,preliminaryShutter);
  const totalEV=preEV+rec.ev;
  let finalShutter=s, finalAperture=ap||null;
  if(applyBy==='aperture' && ap){
    finalAperture=ap/Math.sqrt(2**totalEV);
    finalShutter=s;
  }else{
    finalShutter=s*(2**totalEV);
    finalAperture=ap||null;
  }
  return{final:finalShutter,finalAperture,finalApertureLabel:finalAperture?fmtAperture(finalAperture):'',aperture:ap,apertureLabel:ap?`f/${ap}`:'-',meteredCombination:ap?`${fmt(s)} @ f/${ap}`:fmt(s),finalCombination:finalAperture?`${fmt(finalShutter)} @ ${fmtAperture(finalAperture)}`:fmt(finalShutter),beforeReciprocity:preliminaryShutter,reciprocityEV:rec.ev,reciprocityRule:rec.rule,metered:s,totalEV,bellowsEV,exposureCompEV:ec.ev,exposureCompLabel:ec.label,filterEV:filter,focal,bellows:b,applyBy}
}



function nearestFlashPower(frac){
  if(!isFinite(frac)||frac<=0)return '-';
  if(frac>1.05)return t('overFullPower');
  const stops=[1,1/2,1/4,1/8,1/16,1/32,1/64,1/128];
  let best=stops.reduce((a,b)=>Math.abs(Math.log2(b/frac))<Math.abs(Math.log2(a/frac))?b:a,1);
  if(frac<1/128)return t('belowMinPower');
  const den=Math.round(1/best);
  return den===1?'1/1':`1/${den}`;
}
function flashDistanceAdvice(r){
  const notes=[];
  const ft=m=>(m*3.28084).toFixed(1)+' ft';
  if(!r.gn||!r.f||!r.dist)return notes;
  if(r.finalFrac>1){
    const needEV=Math.log2(r.finalFrac);
    const isoNeed=Math.round(r.iso*(2**needEV));
    const fNeed=r.f/Math.sqrt(2**needEV);
    const dNeed=r.dist/Math.sqrt(2**needEV);
    notes.push(`${t('increaseISO')} ISO ${isoNeed}`);
    notes.push(`${t('openAperture')} ${fmtAperture(fNeed)}`);
    notes.push(`${t('moveCloser')} ${dNeed.toFixed(2)} m / ${ft(dNeed)}`);
  }else if(r.finalFrac<1/128){
    const extraEV=Math.log2((1/128)/r.finalFrac);
    const isoNeed=Math.max(1,Math.round(r.iso/(2**extraEV)));
    const fNeed=r.f*Math.sqrt(2**extraEV);
    const dNeed=r.dist*Math.sqrt(2**extraEV);
    notes.push(`${t('decreaseISO')} ISO ${isoNeed}`);
    notes.push(`${t('closeAperture')} ${fmtAperture(fNeed)}`);
    notes.push(`${t('moveFarther')} ${dNeed.toFixed(2)} m / ${ft(dNeed)}`);
  }else{
    notes.push(t('powerOK'));
  }
  return notes;
}
function calcFlashPower(){
  const iso=getFlashISO(), gn=Number($('#flashGN')?.value||0), f=getFlashApertureNumber(), dist=Number($('#flashDistance')?.value||0);
  const exp=calcExposure();
  const exposureTotalEV=exp.totalEV||0;
  const flashCompEV=Number($('#flashCompSelect')?.value||0);
  const compEV=exposureTotalEV+flashCompEV;
  const gnISO=gn*Math.sqrt((iso||100)/100);
  const requiredGN=(f||0)*(dist||0);
  const baseFrac=(requiredGN/gnISO)**2;
  const finalFrac=baseFrac*(2**compEV);
  const r={iso,gn,f,dist,gnISO,requiredGN,baseFrac,finalFrac,compEV,exposureTotalEV,flashCompEV,basePower:nearestFlashPower(baseFrac),finalPower:nearestFlashPower(finalFrac)};
  r.advice=flashDistanceAdvice(r);
  return r;
}
function renderFlashResult(){
  const box=$('#flashResult');if(!box)return;const r=calcFlashPower();
  if(!r.gn||!r.f||!r.dist){box.innerHTML=`<p class="muted">${t('gnNumber')} / ${t('flashFNumber')} / ${t('distanceM')}</p>`;return}
  const advice=`<div class="aiBox"><b>${t('flashAdvice')}</b><ul>${r.advice.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  box.innerHTML=`<div class="aiBox"><b>${t('flashPower')}</b>${row(t('basePower'),r.basePower)}${row(t('finalPower'),r.finalPower)}${row(t('requiredGN'),r.requiredGN.toFixed(1))}${row(t('compensationForFlash'),`${r.compEV.toFixed(2)} EV`)}${row(t('flashExposureTotal'),`${r.exposureTotalEV.toFixed(2)} EV`)}${row(t('flashExposureComp'),`${r.flashCompEV.toFixed(1)} EV`)}</div>${advice}`;
}

function renderExposureResult(r){$('#result').innerHTML=`<hr><div class="aiBox"><b>${t('exposureSummary')}</b>${row(t('meteredExposure'),r.meteredCombination)}${row(t('exposureCompensation'),`${r.exposureCompEV.toFixed(2)} EV`)}${row(t('bellows'),`${r.bellowsEV.toFixed(2)} EV`)}${row(t('filter'),`${r.filterEV.toFixed(2)} EV`)}${row(t('reciprocity'),`${r.reciprocityEV.toFixed(2)} EV`)}${row(t('totalComp'),`${r.totalEV.toFixed(2)} EV`)}</div><div class="result">${esc(r.finalCombination)}</div>${row(t('applyCompBy'),r.applyBy==='aperture'?t('applyByAperture'):t('applyByShutter'))}${row(t('beforeReciprocity'),fmt(r.beforeReciprocity))}${row(t('reciprocityRule'),r.reciprocityRule)}${renderAIRecommendations(r)}`}


function library(){page.innerHTML=card(t('librarySearch'),`<input id="q" placeholder="${t('searchPlaceholder')}"><div id="res"></div>`);$('#q').oninput=e=>renderLibrary(e.target.value);renderLibrary('')}
function renderLibrary(q){q=q.toLowerCase().trim();let out=[];for(const[k,arr]of Object.entries(DB)){out.push(...arr.filter(x=>!q||JSON.stringify(x).toLowerCase().includes(q)).map(x=>`<div class="listitem"><b>${esc(x.name||x.model||x.film||x.process)}</b><small>${esc(k)}</small><pre>${esc(JSON.stringify(x,null,2))}</pre></div>`))}$('#res').innerHTML=out.slice(0,40).join('')||`<p class="muted">${t('noResults')}</p>`}
function darkroom(){page.innerHTML=card(t('darkroomTimer'),`<label>${t('processFilm')}</label><select id="dev">${DB.development.map((x,i)=>`<option value="${i}">${esc(x.film||x.process)} — ${esc(x.developer)} ${esc(x.time||x.developerTime||x.firstDeveloper||'')}</option>`).join('')}<option value="__other">${t('other')}</option></select><div id="devOther" class="otherbox" hidden><label>${t('customProcessDeveloper')}</label><input id="customDevName" placeholder="Other developer or process"><label>${t('customTime')}</label><input id="customDevTime" placeholder="8:30 or minutes" value="8:00"></div><div id="devinfo"></div><div id="darkAi" class="aiBox"></div><div class="actions"><button class="primary" id="start">${t('start')}</button><button id="pause">${t('pause')}</button><button class="danger" id="reset">${t('reset')}</button></div><div class="result" id="timer">00:00</div>`);let remain=0;function current(){if($('#dev').value==='__other')return{film:$('#customDevName').value||'Other Process',developer:'Other',time:$('#customDevTime').value||'8:00'};return DB.development[Number($('#dev').value)]}function showInfo(){const d=current(),tm=d.time||d.developerTime||d.firstDeveloper||'0:00';remain=parseTime(tm);$('#timer').textContent=timeText(remain);$('#devOther').hidden=$('#dev').value!=='__other';$('#devinfo').innerHTML=`<pre>${esc(JSON.stringify(d,null,2))}</pre>`;$('#darkAi').innerHTML=`<b>${t('aiDevelopment')}</b>${row(t('temperature'),`${d.temperature_C||20}°C`)}${row(t('method'),d.method||'JOBO Rotary / Tank')}${row(t('time'),tm)}${row(t('advice'),d.process==='C-41'||d.process==='E-6'?t('c41e6Advice'):t('bwAdvice'))}`}$('#dev').onchange=()=>{clearInterval(timer);showInfo()};$('#customDevTime').oninput=showInfo;$('#customDevName').oninput=showInfo;showInfo();$('#start').onclick=()=>{clearInterval(timer);timer=setInterval(()=>{remain=Math.max(0,remain-1);$('#timer').textContent=timeText(remain);if(remain<=0){clearInterval(timer);alert(t('devComplete'))}},1000)};$('#pause').onclick=()=>clearInterval(timer);$('#reset').onclick=()=>{clearInterval(timer);showInfo()}}
function shotView(s){return `<div class="listitem">${row('Date',new Date(s.date).toLocaleString())}${row(t('exposure'),s.exposure||'-')}${row(t('film'),s.film||'-')}${row(t('lens'),s.lens||'-')}${row(t('camera'),s.camera||'-')}${row(t('iso'),s.iso||'-')}<p>${esc(s.notes||'')}</p></div>`}
function shotlog(){page.innerHTML=card(t('shotlog'),state.shots.map(shotView).join('')||`<p class="muted">${t('noShot')}</p>`)+card(t('data'),`<div class="actions"><button id="export">${t('exportJSON')}</button><button id="importBtn">${t('importJSON')}</button><button class="danger" id="clear">${t('clear')}</button></div><input id="importFile" type="file" accept="application/json" hidden>`);$('#export').onclick=()=>download(JSON.stringify(state.shots,null,2),'lfmp-shots.json');$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(Array.isArray(data)){state.shots=data;saveState();shotlog()}}catch{alert(t('invalidJSON'))}};$('#clear').onclick=()=>{if(confirm(t('clearShots'))){state.shots=[];saveState();shotlog()}}}
function settings(){page.innerHTML=card(t('settings'),`<label>${t('lang')}</label><select id="settingsLang"><option value="en">English</option><option value="zh">简体中文</option></select><div class="actions"><button id="backup">${t('backupAll')}</button><button id="restoreBtn">${t('restoreBackup')}</button></div><input id="restoreFile" type="file" accept="application/json" hidden>`)+card(t('install'),`<p>${t('installText')}</p>`)+card(t('about'),'<p>Large Format Master Pro Professional Final — EV exposure engine + flash power + offline PWA + bilingual UI.</p>');$('#settingsLang').value=currentLang()||'en';$('#settingsLang').onchange=e=>setLang(e.target.value);$('#backup').onclick=()=>download(JSON.stringify({shots:state.shots,settings:state.settings,exported:new Date().toISOString()},null,2),'lfmp-backup.json');$('#restoreBtn').onclick=()=>$('#restoreFile').click();$('#restoreFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());state.shots=data.shots||[];state.settings=data.settings||{};saveState();alert(t('restored'))}catch{alert(t('invalidJSON'))}}}
function download(content,name){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function route(p='dashboard',silent=false){clearInterval(timer);$$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===p));({dashboard,exposure,library,darkroom,shotlog,settings}[p]||dashboard)();if(!silent)location.hash=p}
$$('[data-page]').forEach(b=>b.onclick=()=>route(b.dataset.page));
loadDB().then(()=>{initLanguageUI();route(location.hash.replace('#','')||'dashboard');if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js')});
