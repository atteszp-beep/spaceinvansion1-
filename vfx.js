const VFX=(()=>{

let fx=[];

function add(x,y,t){
fx.push({x,y,type:t,life:1});
}

function update(ctx){

fx.forEach((e,i)=>{

e.life-=0.05;
if(e.life<=0) fx.splice(i,1);

ctx.globalAlpha=e.life;

if(e.type==="warp"){
ctx.strokeStyle="#00ffff";
ctx.beginPath();
ctx.arc(e.x,e.y,80*e.life,0,Math.PI*2);
ctx.stroke();
}

});

ctx.globalAlpha=1;
}

return{
warp:(x,y)=>add(x,y,"warp"),
update
};

})();