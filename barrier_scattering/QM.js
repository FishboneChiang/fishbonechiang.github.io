// variables
let N = 1000;
let m = 1;
let t = 0;
let dt = 0.4;
let psi = [];
let V = [];
let H = [];
let U;

// graphics settings
let iter = 20;
let spacing, scale = 1500;
let button_reset, button_erase, slider_iter;
let box_re, box_im, box_prob;
let slider_k, slider_sigma;
let slider_barrier_height, slider_barrier_width;
let drawmode = false;
let button_draw;

// wave packet parameters
let k = 0.3;
let sigma = 20;

// potential parameters
let barrier_height = 0.05;
let barrier_width = N / 100;
let max_width = 200;

function setup() {
  createCanvas(600, 500, P2D);
  spacing = width / (N - 1);

  button_reset = createButton("Reset");
  button_reset.position(10, 367.5);
  button_reset.mousePressed(reset);

  slider_iter = createSlider(0, 100, 20, 1);
  slider_iter.position(170, 370);

  box_re = createCheckbox("Re(Psi)", true);
  box_re.style('font-size', 12);
  box_re.style('color', color(255, 0, 0));
  box_re.position(360, 360);
  box_im = createCheckbox("Im(Psi)", true);
  box_im.style('font-size', 12);
  box_im.style('color', color(0, 0, 255));
  box_im.position(420, 360);
  box_prob = createCheckbox("Prob density", false);
  box_prob.style('font-size', 12);
  box_prob.position(360, 380);

  slider_k = createSlider(0, 1, k, 0.01);
  slider_k.position(170, 405);
  slider_sigma = createSlider(1, 50, sigma, 1);
  slider_sigma.position(170, 430);

  slider_barrier_height = createSlider(-0.1, 0.1, barrier_height, 0.001);
  slider_barrier_height.position(450, 405);
  slider_barrier_width = createSlider(2, 200, barrier_width, 2);
  slider_barrier_width.position(450, 430);

  button_erase = createButton("Erase");
  button_erase.position(560, 367.5);
  button_erase.mousePressed(erasepotential);
  button_draw = createButton("Draw mode");
  button_draw.position(480, 367.5);
  button_draw.mousePressed(change_draw_mode);

  setPotential();

  // initialize wave function
  reset();
}

function draw() {
  background(0);
  plot();

  textSize(20);
  strokeWeight(0.1);
  fill(255);
  rect(0, 350, 600, 150);
  text("t = " + nf(t, 0, 0) + "\tfps = " + nf(frameRate(), 0, 0), 10, 25);
  if (drawmode) {
    text("Draw mode: On", 450, 25);
  } else {
    text("Draw mode: Off", 450, 25)
  }

  fill(0);
  textSize(12);
  text("iter per frame = " + iter, 60, 375);
  text("Show: ", 310, 375);
  text("Wave packet: k = " + k, 10, 410);
  text("sigma = " + sigma, 85, 435);

  push();
  translate(300, 0);
  text("Potential: height = " + barrier_height, 10, 410);
  if (barrier_width == max_width) {
    text("width = step", 65, 435);
  } else {
    text("width = " + barrier_width, 65, 435);
  }
  pop();

  // update value from slider
  iter = slider_iter.value();
  k = slider_k.value();
  sigma = slider_sigma.value();
  barrier_height = slider_barrier_height.value();
  barrier_width = slider_barrier_width.value();

  // time evolution
  for (let n = 0; n < iter; n++) {
    // psi = math.multiply(U, psi);
    evolve();
    t += dt;
  }

  // update potential
  if (drawmode) {
    if (mouseIsPressed && 0 < mouseY && mouseY < 350) {
      let x = floor(mouseX / spacing);
      let v = (-mouseY + 175) / scale;
      for (i = x - 3; i <= x + 3; i++) {
        V[i] = v;
      }
    }
  } else {
    setPotential();
  }

  // haha useful!
  // stroke(200);
  // fill(200);
  // text(mouseX + ", " + mouseY, mouseX, mouseY);
}

// Hamiltonian
// for (let i = 0; i < N; i++) {
//   H[i] = [];
//   for (let j = 0; j < N; j++) {
//     if (i !== 0 && i !== N - 1) {
//       if (i === j) H[i][j] = V[i] + 1/m;
//       else if (math.abs(i - j) === 1) H[i][j] = -1 / (2*m);
//       else H[i][j] = 0;
//     } else {
//       if (i === 0 && j === 0) H[i][j] = 0;
//       else if (i === N - 1 && j === N - 1) H[i][j] = 0;
//       else H[i][j] = 0;
//     }
//   }
// }

// time evolution operator
// H = math.matrix(H);
// let U1 = math.inv(math.chain(H).multiply(math.complex(0, dt / 2)).add(math.identity(N)).done());
// let U2 = math.chain(H).multiply(math.complex(0, -dt / 2)).add(math.identity(N)).done();
// U = math.multiply(U1, U2);