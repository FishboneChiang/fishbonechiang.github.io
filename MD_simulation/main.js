// Animation parameters
let t, dt;
let iter_per_frame, fps, contrast;
let start = false, mode = 'off', t0;

// Molecule parameters
let radius, sigma, R;
let RR, sigma6;

// Physical variables
let g, v0, beta;
let E, K, V, T, P;
let sample, data;

// Variables for cells
let nx, ny, cell = [];

// Variables for molecules
let ball = [], num;

function setup() {

    // create canvas
    let canvas = createCanvas(600, 600, P2D);
    canvas.parent("simulation");
    background(50);

    // set parameters
    t = 0; dt = 0.05;
    iter_per_frame = 100;
    contrast = 40;
    radius = 5; sigma = 2.2 * radius; R = 3 * sigma;
    RR = pow(R, 2); sigma6 = pow(sigma, 6);
    g = 0; v0 = 2; beta = 0;
    E = 0; K = 0; V = 0; P = 0;
    sample = 100; 
    data = new Array(sample).fill([0,0]);

    // initialize cells
    nx = ceil(width / R); ny = ceil(height / R);
    for (let i = 0; i < nx; i++) {
        cell[i] = [];
        for (let j = 0; j < ny; j++) {
            cell[i][j] = [];
        }
    }

}


function draw() {

    background(50);

    // hint
    if(!start){
        dt = 0;
        push();
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(20);
        text("CLICK HERE TO CREATE PARTICLES", width/2, height/2);
        pop();
        if(mouseIsPressed&&mouseX>0&&mouseX<width&&mouseY>0&&mouseY<height){
            start = true;
            dt = 0.01;
        }
    }
    
    // update variables
    num = ball.length;
    fps = frameRate();
    K /= iter_per_frame; V /= iter_per_frame;
    E = K + V; 
    if(dt!=0){
        T = K / (num || 1); 
        P /= (iter_per_frame*dt);
        data.shift();
        data.push([T,P]);
    }
    T = 0; P = 0;
    for(let dt of data){
        T += dt[0]; P += dt[1];
    }
    T /= sample; P /= sample;
    switch (mode) {
        case 'cool':
            if(Date.now()-t0<50) beta = 0.01; 
            else off();
            break;
        case 'heat':
            if(Date.now()-t0<50 && T<100) beta = -0.01;
            else off();
            break;
        case 'off':
            beta = 0;
            if(T>100) beta=0;
            break;
    }

    // draw molecules
    for(let b of ball){
        let vv = b.vx*b.vx + b.vy*b.vy;
        fill(contrast*vv, 127, 255-contrast*vv);
        b.show();
    }

    // show information
    fill(0,255,0);
    text("FPS = "+int(frameRate()), 15, 20);
    let info1 = document.getElementById("info1");
    info1.innerHTML = "t = "+int(t);
    info1.innerHTML += "&nbsp&nbspN = "+num;
    info1.innerHTML += "&nbsp&nbspE = "+nf(E,0,3);
    info1.innerHTML += "&nbsp&nbspT = "+nf(T,0,3);
    info1.innerHTML += "&nbsp&nbspP = "+nf(P,0,3);
    document.getElementById("iter").innerHTML = "Iter per frame = "+iter_per_frame;

    // time evolution
    E = 0; K = 0; V = 0; P = 0;
    for(let iter = 1; iter<=iter_per_frame; iter++){
        for(let b of ball){
            b.kick(dt/2);
            b.drift(dt);
        }
        updateVariables();
        for(let b of ball){
            b.kick(dt/2);
            b.checkBoundary();
        }
        t += dt;
    }

    // new balls
    if(mouseIsPressed&&mouseX>0&&mouseX<width&&mouseY>0&&mouseY<height){
        push();
        noFill(); stroke(255);
        ellipse(mouseX, mouseY, 100);
        pop();
        for(let n = 0; n<5; n++){
            let flag = true;
            let x = mouseX + random(-50, 50);
            let y = mouseY + random(-50, 50);
            if(x>width-radius||x<radius||y>height-radius||y<radius) continue;
            for(let b of ball){
                let sx = b.x - x, sy = b.y - y;
                if(sx*sx+sy*sy<sigma*sigma){
                    flag = false; break;
                }
            }
            if(flag) ball[ball.length] = new Ball(x, y, random(-v0, v0), random(-v0, v0));
        }
    }

}