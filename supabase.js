var SB=window.supabase.createClient(
  'https://uktfnntgmjhhpaonsvch.supabase.co',
  'sb_publishable_tkWMAQPVrl7nBWDgGiMX9g_zjKlcy2H'
);
function FOTO_URL(ruta){return SB.storage.from('fotos').getPublicUrl(ruta).data.publicUrl}
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

/* ---- Me gusta (compartido por index.html y perfil.html) ---- */
var HEART='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
function likeBtn(id,n,on){
  return '<button type="button" class="like'+(on?' on':'')+'" data-id="'+esc(id)+'" aria-pressed="'+(on?'true':'false')+'" aria-label="Me gusta">'+HEART+'<span>'+(n||0)+'</span></button>';
}
async function toggleLike(btn){
  var s=(await SB.auth.getSession()).data.session;
  if(!s||!s.user.email){location.href='acceso.html';return}
  if(btn.dataset.busy)return;
  btn.dataset.busy='1';
  var id=btn.dataset.id,sp=btn.querySelector('span'),n=parseInt(sp.textContent,10)||0,on=btn.classList.contains('on');
  function pon(v,num){btn.classList.toggle('on',v);btn.setAttribute('aria-pressed',v?'true':'false');sp.textContent=Math.max(num,0)}
  pon(!on,n+(on?-1:1));
  var r=on?await SB.from('likes').delete().eq('foto_id',id).eq('user_id',s.user.id)
          :await SB.from('likes').insert({foto_id:id,user_id:s.user.id});
  if(r.error){
    if(!on&&r.error.code==='23505'){pon(true,n)}else{pon(on,n)}
  }
  delete btn.dataset.busy;
}
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('.like');
  if(b){e.preventDefault();e.stopPropagation();toggleLike(b)}
});

/* ---- Teléfono (solo celulares de Perú) ---- */
function normTel(v){
  var d=String(v||'').replace(/[\s\-().]/g,'');
  if(/^9\d{8}$/.test(d))return '+51'+d;
  if(/^519\d{8}$/.test(d))return '+'+d;
  if(/^\+519\d{8}$/.test(d))return d;
  return null;
}
async function tieneTel(uid){
  var r=await SB.from('contactos').select('telefono').eq('user_id',uid).maybeSingle();
  return r.data?r.data.telefono:null;
}

/* ---- Identificador aleatorio (funciona también en navegadores antiguos o sin HTTPS) ---- */
function uuid(){
  if(window.crypto&&crypto.randomUUID&&window.isSecureContext)return crypto.randomUUID();
  var b=new Uint8Array(16);
  if(window.crypto&&crypto.getRandomValues){crypto.getRandomValues(b)}
  else{for(var i=0;i<16;i++)b[i]=Math.floor(Math.random()*256)}
  b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
  var h=[].map.call(b,function(x){return ('0'+x.toString(16)).slice(-2)}).join('');
  return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
}
