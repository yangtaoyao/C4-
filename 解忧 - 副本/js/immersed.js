(function(w){

document.addEventListener('plusready',function(){
	console.log("Immersed-UserAgent: "+navigator.userAgent);
},false);

var immersed = 0;
var ms=(/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
if(ms&&ms.length>=3){
	immersed=parseFloat(ms[2]);
}
w.immersed=immersed;

if(!immersed){
	return;
}
var t=document.getElementById('header');
//t&&(t.style.paddingTop=immersed+'px',t.style.background='-webkit-linear-gradient(top,rgba(215,75,40,1),rgba(215,75,40,0.8))',t.style.color='#FFF');
t&&(t.style.paddingTop=immersed+'px',t.style.height=immersed+44+'px');

t=document.getElementById('home-header');
//t&&(t.style.paddingTop=immersed+'px',t.style.background='-webkit-linear-gradient(top,rgba(215,75,40,1),rgba(215,75,40,0.8))',t.style.color='#FFF');
t&&(t.style.paddingTop=immersed+'px',t.style.height=immersed+75+'px');

t=document.getElementById('content');
t&&(t.style.paddingTop=immersed+'px');

t=document.getElementById('scontent');
t&&(t.style.marginTop=immersed+'px');

t=document.getElementById('dcontent');
t&&(t.style.marginTop=immersed+'px');

t=document.getElementById('map');
t&&(t.style.marginTop=immersed+'px');

t=document.getElementById('pullrefresh');
t&&(t.style.paddingTop=immersed+75+'px');

t=document.getElementById('wode');
t&&(t.style.paddingTop=immersed+44+'px');

t=document.getElementById('top_bg02');
t&&(t.style.background='#F0AD4E');

})(window);