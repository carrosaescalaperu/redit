var SB=window.supabase.createClient(
  'https://uktfnntgmjhhpaonsvch.supabase.co',
  'sb_publishable_tkWMAQPVrl7nBWDgGiMX9g_zjKlcy2H'
);
function FOTO_URL(ruta){return SB.storage.from('fotos').getPublicUrl(ruta).data.publicUrl}
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
