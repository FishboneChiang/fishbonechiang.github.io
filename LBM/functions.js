function CalculateDensity() {
  for (let i = 0; i<Nx; i++) {
    for (let j = 0; j<Ny; j++) {
      rho[i][j] = 0;
      for (let k = 0; k<9; k++) {
        rho[i][j] += n[i][j][k];
      }
    }
  }
}

function CalculateVelocity() {
  for (let i = 0; i<Nx; i++) {
    for (let j = 0; j<Ny; j++) {
      u[i][j][0] = 0; 
      u[i][j][1] = 0;
      for (let k = 0; k<9; k++) {
        u[i][j][0] += n[i][j][k] * c * e[k][0];
        u[i][j][1] += n[i][j][k] * c * e[k][1];
      }
      u[i][j][0] /= rho[i][j];
      u[i][j][1] /= rho[i][j];
    }
  }
}

function f(ux, uy, k) {
  let eu = e[k][0]*ux+e[k][1]*uy;
  let uu = pow(ux, 2)+pow(uy, 2);
  return w[k] * (1 + 3*eu/c + (9/2)*pow(eu/c, 2) - (3/2)*uu/pow(c, 2));
}

function CalculateNeq() {
  for (let i = 0; i<Nx; i++) {
    for (let j = 0; j<Ny; j++) {
      for (let k = 0; k<9; k++) {
        neq[i][j][k] = rho[i][j] * f(u[i][j][0], u[i][j][1], k);
      }
    }
  }
}

function CalculateCurl() {
  for (let i = 1; i<Nx-1; i++) {
    for (let j = 1; j<Ny-1; j++) {
      curl[i][j] = (u[i+1][j][1]-u[i-1][j][1])/(2*dx) - (u[i][j+1][0]-u[i][j-1][0])/(2*dx);
    }
  }
}

function Collide() {
  for (let i = 1; i<Nx-1; i++) {
    for (let j = 1; j<Ny-1; j++) {
      for (let k = 0; k<9; k++) {
        n[i][j][k] += omega * (neq[i][j][k] - n[i][j][k]);
      }
    }
  }
}

function Stream() {
  for (let i = 1; i<Nx-1; i++) {
    for (let j = 1; j<Ny-1; j++) {
      if (boundary[i][j]) {
        for (let  k = 0; k<9; k++) {
          nn[i][j][k] = f(0, 0, k);
        }
        continue;
      }
      for (let  k = 0; k<9; k++) {
        // streaming
        nn[i][j][k] = n[i-e[k][0]][j-e[k][1]][k];
        // bounce back at boundary
        if (boundary[i-e[k][0]][j-e[k][1]]) {
          nn[i][j][k] = n[i][j][8-k];
        }
      }
    }
  }
  for (let i = 1; i<Nx-1; i++) {
    for (let j = 1; j<Ny-1; j++) {
      for (let k = 0; k<9; k++) {
        n[i][j][k] = nn[i][j][k];
      }
    }
  }
}
