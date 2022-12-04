/* Parameters */
let spacing = 7; 
let Nx = 100, Ny = 40;
let dx = 1, dt = 1, t = 0;
let c = dx/dt;
let u0 = 0.15, nu = 0.03, omega = 1.0/(3.0*nu + 0.5);
let e = [ [-1, 1], [-1, 0], [-1, -1], [0, 1], [0, 0], [0, -1], [1, 1], [1, 0], [1, -1] ];
let w = [ 1/36, 4/36, 1/36, 4/36, 16/36, 4/36, 1/36, 4/36, 1/36 ];
let iter = 25;
let y_min = 12, y_max = 28;
let mode = 1; 

/* Define varialbes */
let n = new Array(Nx);
let u = new Array(Nx);
let rho = new Array(Nx);
let curl = new Array(Nx);
let neq = new Array(Nx);
let nn = new Array(Nx);
let boundary = new Array(Nx);

function setup() {
  createCanvas(spacing*Nx, spacing*Ny+40);

  /* Initialization */
  for (let i = 0; i<Nx; i++) {
    n[i] = new Array(Ny);
    u[i] = new Array(Ny);
    rho[i] = new Array(Ny);
    curl[i] = new Array(Ny).fill(0);
    neq[i] = new Array(Ny);
    nn[i] = new Array(Ny);
    boundary[i] = new Array(Ny).fill(false);
    for (let j = 0; j<Ny; j++) {
      n[i][j] = new Array(9);
      for (let k = 0; k<9; k++) {
        n[i][j][k] = f(u0, 0, k);
      }
      u[i][j] = new Array(2);
      neq[i][j] = new Array(9);
      nn[i][j] = new Array(9);
    }
  }
  CalculateDensity();
  CalculateVelocity();
  CalculateNeq();

  /* Set boundary */
  for (let i = 0; i<Nx; i++) {
    for (let j = 0; j<Ny; j++) {
      if ( i>=20&&i<=20 && j>=y_min&&j<=y_max ) {
        boundary[i][j] = true;
      }
    }
  }
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    for (let i = 0; i<Nx; i++) {
      for (let j = 0; j<Ny; j++) {
        boundary[i][j] = false;
      }
    }
  }
  if (key === 'r' || key === 'R') {
    t = 0;
    for (let i = 0; i<Nx; i++) {
      for (let j = 0; j<Ny; j++) {
        if (i>=20&&i<=20&&j>=y_min&&j<=y_max) {
          boundary[i][j] = true;
        } else {
          boundary[i][j] = false;
        }
      }
    }
    for (let i = 0; i<Nx; i++) {
      for (let j = 0; j<Ny; j++) {
        for (let k = 0; k<9; k++) {
          n[i][j][k] = f(u0, 0, k);
        }
      }
    }
  }
  if (key === '1') {
    mode = 1; // plot curl
  }
  if (key === '2') {
    mode = 2; // plot ux
  }
  if (key === '3') {
    mode = 3; // plot uy
  }
}

function draw() {
  // drawings
  background(255);
  CalculateCurl();
  //noStroke();
  strokeWeight(0.1);

  let col;
  for (let i = 0; i<Nx; i++) {
    for (let j = 0; j<Ny; j++) {
      if (mode === 2) { 
        col = map(u[i][j][0], -u0/5, u0/2.5, -50, 50);
      } else if (mode === 3) { 
        col = map(u[i][j][1], -u0/5, u0/5, -50, 50);
      } else { 
        col = map(curl[i][j], -0.004, 0.004, -50, 50);
      }
      fill( color(225+col/2, 225, 225-col/2, 255) );
      if (boundary[i][j]) { 
        fill(0);
      }
      rect(i*spacing, j*spacing, spacing, spacing);
    }
  }

  fill(0);
  textSize(15);
  text("steps = " + nf(t, 0, 0), 15, 20);
  text("Press R to reset the simulation. Press E to erase the boundaries. Press 1/2/3 to display curl/ux/uy.", 10, spacing*Ny+15);
  let nx = floor(mouseX/spacing), ny = floor(mouseY/spacing);
  if ( nx>=0&&nx<Nx && ny>=0&&ny<Ny ) {
    text("Curl: " + nf(-curl[nx][ny], 0, 4) + "   ux: " + nf(u[nx][ny][0], 0, 4) + "   uy: " + nf(-u[nx][ny][1], 0, 4), 10, spacing*Ny+30);
  }

  // update
  for (let n = 0; n<iter; n++) {
    // update boundary
    if (mouseIsPressed && nx>0&&nx<Nx-1&&ny>0&&ny<Ny-1 ) {
      boundary[nx][ny] = true;
    }
    // calculate macroscopic variables
    CalculateDensity();
    CalculateVelocity();
    CalculateNeq();
    // collision
    Collide();
    // streaming
    Stream();
    t += dt;
  }
}
