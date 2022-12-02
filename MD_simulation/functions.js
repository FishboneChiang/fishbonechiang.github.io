class Ball {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.Fx = 0; 
        this.Fy = 0;
        this.radius = radius;
    }
    show(){
        ellipse(this.x, this.y, 2*this.radius);
    }
    kick(dt){
        this.vx += this.Fx * dt;
        this.vy += this.Fy * dt;
    }
    drift(dt){
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
    checkBoundary(){
        if(this.x<this.radius||this.x>width-this.radius){
            this.vx *= -1; P += 2*abs(this.vx);
        }
        if(this.y<this.radius||this.y>height-this.radius){
            this.vy *= -1; P += 2*abs(this.vy);
        }
    }
}

function updateVariables(){
    let vy = 0, vx = 0;
    for(b of ball){
        b.Fx = -beta*b.vx; b.Fy = g-beta*b.vy;
        vx += b.vx; vy += b.vy;
    }
    vx /= num; vy /= num;
    // update cells
    for(let n = 0; n<num; n++){
        let i = int(ball[n].x/R), j = int(ball[n].y/R);
        cell[i][j][cell[i][j].length] = n;
    }
    // loop over cells
    for(let i = 0; i<nx; i++){
        for(let j = 0; j<ny; j++){
            while(cell[i][j].length>0){
                let n = cell[i][j][cell[i][j].length-1];
                // K += 0.5 * ( (ball[n].vx-vx)*(ball[n].vx-vx) + (ball[n].vy-vy)*(ball[n].vy-vy) );
                K += 0.5 * ( ball[n].vx*ball[n].vx + ball[n].vy*ball[n].vy );
                V -= g*ball[n].y;
                for(let k = i-1; k<=i+1; k++){
                    for(let l = j-1; l<=j+1; l++){
                        if(k<0||k>=nx||l<0||l>=ny) continue;
                        for(let m of cell[k][l]){
                            if(n==m) continue;
                            let sx = ball[n].x-ball[m].x;
                            let sy = ball[n].y-ball[m].y;
                            let ss = sx*sx+sy*sy;
                            let Fx = 0, Fy = 0;
                            if(ss<RR){
                                let attract = sigma6/ss/ss/ss;
                                let repel = attract * attract;
                                let ff = (24/ss) * (2*repel - attract);
                                Fx = ff * sx; Fy = ff * sy;
                                V += 4 * (repel-attract);
                            }
                            ball[n].Fx += Fx; ball[n].Fy += Fy;
                            ball[m].Fx -= Fx; ball[m].Fy -= Fy;
                        }
                    }
                }
                cell[i][j].pop();
            }
        }
    }
}

function resume(){
    dt = 0.01;
}
function pause(){
    dt = 0;
}
function reset(){
    ball = [];
    t = 0;
}

function cool(){
    mode = 'cool';
    t0 = Date.now();
}
function heat(){
    mode = 'heat';
    t0 = Date.now();
}
function off(){
    mode = 'off';
}
function gravity(){
    if(g==0){
        document.getElementById("gravity").innerHTML = "On";
        g = 0.098;
    }else{
        document.getElementById("gravity").innerHTML = "Off";
        g = 0;
    }
}

function setContrast(){
    contrast = document.getElementById("contrastSlider").value;
    // alert(contrast);
}

function setIter(){
    iter_per_frame = document.getElementById("iterSlider").value;
    document.getElementById("iter").innerHTML = "Iter per frame = "+iter_per_frame;
    // alert(contrast);
}