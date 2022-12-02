function plot() {
  strokeWeight(2);
  if (box_re.checked()) {
    stroke(color(0, 0, 255, 220));
    for (let i = 0; i < N - 1; i++) {
      line(i * spacing, 175 - 250 * psi[i].re, (i + 1) * spacing, 175 - 250 * psi[i + 1].re);
    }
  }
  if (box_im.checked()) {
    stroke(color(255, 0, 0, 177));
    for (let i = 0; i < N - 1; i++) {
      line(i * spacing, 175 - 250 * psi[i].im, (i + 1) * spacing, 175 - 250 * psi[i + 1].im);
    }
  }
  if (box_prob.checked()) {
    stroke(255, 177);
    for (let i = 0; i < N - 1; i++) {
      line(i * spacing, 175 - 1500 * (pow(psi[i].re, 2) + pow(psi[i].im, 2)), (i + 1) * spacing, 175 - 1500 * (pow(psi[i + 1].re, 2) + pow(psi[i + 1].im, 2)));
    }
  }
  for (let i = 0; i < N - 1; i++) {
    stroke(color(0, 255, 0, 177));
    line(i * spacing, 175 - scale * V[i], (i + 1) * spacing, 175 - scale * V[i + 1]);
  }
}

function evolve() {
  for (let i = 1; i < N-1; i++) {
    psi[i].re += (dt / 2) * (-(0.5 / m) * (psi[(i + 1) % N].im - 2 * psi[i].im + psi[(N + i - 1) % N].im) + V[i] * psi[i].im);
  }
  for (let i = 1; i < N-1; i++) {
    psi[i].im -= (dt) * (-(0.5 / m) * (psi[(i + 1) % N].re - 2 * psi[i].re + psi[(N + i - 1) % N].re) + V[i] * psi[i].re);
  }
  for (let i = 1; i < N-1; i++) {
    psi[i].re += (dt / 2) * (-(0.5 / m) * (psi[(i + 1) % N].im - 2 * psi[i].im + psi[(N + i - 1) % N].im) + V[i] * psi[i].im);
  }
}

function setPotential() {
  if (barrier_width == max_width) {
    for (let i = 0; i < N; i++) {
      if (i > N / 2) V[i] = barrier_height;
      else V[i] = 0;
    }
  } else {
    for (let i = 0; i < N; i++) {
      if (i > N / 2 - barrier_width / 2 && i < N / 2 + barrier_width / 2) V[i] = barrier_height;
      else V[i] = 0;
    }
  }
}

function reset() {
  for (let i = 0; i < N; i++) {
    let x = i;
    // psi[i] = math.complex(sin(2*math.pi*i/(N-1)),0);
    psi[i] = math.chain(exp(-pow(x - N / 4, 2) / (4 * pow(sigma, 2)))).multiply(math.exp(math.complex(0, k * x))).multiply(1 / sqrt(sigma)).done();
  }
  t = 0;
}

function erasepotential() {
  for (let i = 0; i < N; i++) {
    V[i] = 0;
  }
}

function box_re_event() {
  if (this.checked()) {
    alert("yes");
  } else {
    alert("no");
  }
}

function change_draw_mode() {
  drawmode = !drawmode;
}