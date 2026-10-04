/* Cuenta regresiva al cierre del sorteo: el día 4 de cada mes, 23:59:59 hora de Lima (UTC-5) */
(function(){
  var OFF=5*3600*1000;
  var MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  function cierreDe(y,m){return Date.UTC(y,m,4,23,59,59)+OFF}
  function lima(){return new Date(Date.now()-OFF)}
  function proximo(){
    var l=lima(),y=l.getUTCFullYear(),m=l.getUTCMonth(),t=cierreDe(y,m);
    if(Date.now()>t)t=cierreDe(y,m+1);
    return t;
  }
  function anterior(){
    var l=lima(),y=l.getUTCFullYear(),m=l.getUTCMonth(),t=cierreDe(y,m);
    if(Date.now()<=t)t=cierreDe(y,m-1);
    return t;
  }
  function fechaCierre(){var d=new Date(proximo()-OFF);return d.getUTCDate()+' de '+MESES[d.getUTCMonth()]}
  function dos(n){return n<10?'0'+n:''+n}
  function pintar(){
    var s=Math.max(0,Math.floor((proximo()-Date.now())/1000));
    var d=Math.floor(s/86400),h=Math.floor(s%86400/3600),mi=Math.floor(s%3600/60),se=s%60;
    var txt=d+'d '+dos(h)+'h '+dos(mi)+'m '+dos(se)+'s';
    var a=document.querySelectorAll('[data-cuenta]');
    for(var i=0;i<a.length;i++)a[i].textContent=txt;
    var b=document.querySelectorAll('[data-cierre]');
    for(i=0;i<b.length;i++)b[i].textContent='Cierra el '+fechaCierre()+' · hora de Lima';
  }
  window.CUENTA={proximo:proximo,inicio:function(){return anterior()+1000},fechaCierre:fechaCierre};
  pintar();setInterval(pintar,1000);
})();
