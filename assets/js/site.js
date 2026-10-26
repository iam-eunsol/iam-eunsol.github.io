(function(){
  // carousels (papers on home, songs on spare time)
  [].slice.call(document.querySelectorAll('[data-carousel-wrap]')).forEach(function(wrap){
    var car=wrap.querySelector('[data-carousel]');
    var cards=[].slice.call(car.querySelectorAll('.pc')), dots=[].slice.call(wrap.querySelectorAll('.dotbtn')), n=cards.length, i=0;
    function render(){
      cards.forEach(function(c,k){
        var off=k-i; if(off>n/2)off-=n; if(off<-n/2)off+=n; var a=Math.abs(off);
        c.style.setProperty('--off',off); c.style.setProperty('--sc',off===0?1:.86); c.style.setProperty('--op',a===0?1:(a===1?.45:0)); c.style.setProperty('--z',10-a);
        c.classList.toggle('is-current',off===0); c.classList.toggle('is-peek',a===1); c.classList.toggle('is-hidden',a>1);
        c.setAttribute('aria-hidden',off===0?'false':'true');
        c.querySelectorAll('a,button').forEach(function(el){el.tabIndex=off===0?0:-1});
        if(off!==0){var au=c.querySelector('audio'); if(au)au.pause();}
      });
      dots.forEach(function(d,k){d.setAttribute('aria-current',k===i?'true':'false')});
      fit();
    }
    // size the stage to the current card so short cards don't leave empty space
    function fit(){
      var c=cards[i]; c.style.height='auto';
      var h=c.offsetHeight; c.style.height='';
      car.style.height=h+'px';
    }
    window.addEventListener('resize',fit);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
    function go(k){i=(k+n)%n;render()}
    wrap.querySelectorAll('[data-prev]').forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
    wrap.querySelectorAll('[data-next]').forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
    dots.forEach(function(d,k){d.addEventListener('click',function(){go(k)})});
    cards.forEach(function(c,k){c.addEventListener('click',function(e){if(k!==i){e.preventDefault();go(k)}})});
    car.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(i-1);if(e.key==='ArrowRight')go(i+1)});
    render();
  });
  // research filters + abstracts
  var filters=[].slice.call(document.querySelectorAll('[data-filter]'));
  filters.forEach(function(b){b.addEventListener('click',function(){
    var f=b.getAttribute('data-filter');
    filters.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    document.querySelectorAll('.paper').forEach(function(p){p.hidden=!(f==='all'||p.getAttribute('data-stream')===f)});
  })});
  document.querySelectorAll('[data-abs]').forEach(function(b){b.addEventListener('click',function(){
    var el=document.getElementById(b.getAttribute('aria-controls')), open=b.getAttribute('aria-expanded')==='true';
    el.hidden=open; b.setAttribute('aria-expanded',open?'false':'true'); b.textContent=open?'Read the abstract':'Hide abstract';
  })});
  // open the abstract linked from the home page (#paper-id)
  if(location.hash){var t=document.querySelector(location.hash+' [data-abs]'); if(t)t.click();}
  // song players
  var players=[].slice.call(document.querySelectorAll('[data-player]'));
  function fmt(s){s=Math.floor(s||0);return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
  var PLAY='<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>', PAUSE='<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor"/></svg>';
  players.forEach(function(p){
    var au=p.querySelector('audio'), btn=p.querySelector('.play'), bar=p.querySelector('.bar'), fill=p.querySelector('.bar i'), time=p.querySelector('.time'), name=btn.getAttribute('data-name');
    btn.addEventListener('click',function(){ if(au.paused){players.forEach(function(q){var a=q.querySelector('audio'); if(a!==au)a.pause()}); au.play()} else au.pause() });
    au.addEventListener('play',function(){btn.innerHTML=PAUSE;btn.setAttribute('aria-label','Pause '+name)});
    au.addEventListener('pause',function(){btn.innerHTML=PLAY;btn.setAttribute('aria-label','Play '+name)});
    au.addEventListener('timeupdate',function(){fill.style.width=(au.currentTime/(au.duration||1)*100)+'%';time.textContent=fmt(au.currentTime)});
    au.addEventListener('ended',function(){fill.style.width='0';time.textContent=time.getAttribute('data-dur')});
    bar.addEventListener('click',function(e){var r=bar.getBoundingClientRect(); if(au.duration){au.currentTime=(e.clientX-r.left)/r.width*au.duration; if(au.paused)au.play()}});
  });
})();
