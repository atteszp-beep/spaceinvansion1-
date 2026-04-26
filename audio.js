const AudioSystem=(()=>{

const ctx=new (window.AudioContext||window.webkitAudioContext)();

function play(f,t){

const o=ctx.createOscillator();
const g=ctx.createGain();

o.connect(g);
g.connect(ctx.destination);

o.type=t;
o.frequency.value=f;

g.gain.value=0.2;
g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.2);

o.start();
o.stop(ctx.currentTime+0.2);
}

return{
laser:()=>play(800,"sawtooth"),
hit:()=>play(200,"square"),
warp:()=>play(500,"sine")
};

})();