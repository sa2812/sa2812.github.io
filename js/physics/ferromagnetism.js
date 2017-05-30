var kb  = 1.3806488e-23;
var muB = 0.0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomCell(array) {
	var N = array.length;
	x = getRandomIntInclusive(0, N-1);
	y = getRandomIntInclusive(0, N-1);
	return [x, y];
}

function getValue(array, x, y) {
	return array[x][y].value;
}

function neighbourEnergy(array, x, y) {
	var N = array.length;
	return (array[x][(y + 1) % N].value  + array[(x + 1) % N][y].value) * array[x][y].value + (muB * array[x][y].value);
}

function energyChange(array, beta, x, y) {
    var currentValue = array[x][y].value;
    var N = array.length;

    // up, right, down, left
    deltaE = (array[((x == 0 ? array.length : x) - 1) % N][y].value + array[x][(y + 1) % N].value + array[(x + 1) % N][y].value + array[x][((y == 0 ? array.length : y) - 1) % N].value) * 
    		 currentValue * 2 + muB * currentValue * 2;

    if (deltaE < 0) {
        array[x][y].value = -currentValue;
        return [deltaE, -2 * currentValue];
    } else if (deltaE > 0) {
        if (Math.random() < Math.exp(-deltaE * beta)) {
            array[x][y].value = -currentValue;
            return [deltaE, -2 * currentValue];
        } else {
            return [0, 0];
        }
    } else {
        return [0, 0];
    }
}

function totalEnergy(array) {
	var energy = 0.0;
	var N = array.length;

	for (x = 0; x < N; x++) {
		for (y = 0; y < N; y++) {
			energy += neighbourEnergy(array, x, y);
		}
	}
	return energy;
}

function totalMagnetisation(array) {
    var sum = 0;
    for(a = 0; a < array.length; a++) {
        if (typeof array[a].value == "number") {
            sum += array[a];
        } else {
            sum += totalMagnetisation(array[a]);
        }
    }
    return sum;
}

function generateArray(temp, N) {
	var array = [];
	if (temp) {
		for (i=0; i<N; i++) {	
			var row = [];
			for (j=0; j<N; j++) {
				x = getRandomIntInclusive(0, 1);
				if (x == 0) {
					row.push(-1);
				} else {
					row.push(1);
				}
			}
			array.push(row);
		}
	} else {
		x = getRandomIntInclusive(0,1);
		if (x == 0) {
			x = -1;
		}
		for (i=0; i<N; i++) {
			var row = [];
			for (j=0; j<N; j++) {
				row.push(x);
			}
			array.push(row);
		}
	}
	return array;
}

function iterate(array, beta, Etot=0) {
    // Returns:
    // energy        - A list of the energy of the array over the iterations.
    // magnetisation - A list of the total magnetisation of the array.
    // spin_sum      - The sum of all of the spins of the atoms in the array.
    var energy   = [];
    var spinSum  = [];
    var sma      = [];
    var totalE;
    var N = array.length;

    // If total energy has already been found previously then just input that
    // value back in here instead of recalculating it all.
    if (Etot != null) {
        totalE = Etot;
    } else {
        totalE = totalEnergy(array);
    }

    energy.push(totalE);
    spinSum.push(totalMagnetisation(array));

    var iterations = 0;
    var checkpoint = 5000;
    // Let system reach equilibrium
    while (iterations <= 20000 || Math.abs(sma[sma.length - 2] - sma[sma.length - 1]) > 0.1) {
        rand          = pickRandomCell(array);
        stepChange    = energyChange(array, beta, rand[0], rand[1]);
        nextEnergy    = energy[energy.length - 1] + stepChange[0]
        nextSpinSum = spinSum[spinSum.length - 1] + stepChange[1]
        if (iterations == checkpoint) {
            l = energy.slice(Math.max(energy.length - 2500, 1));
            smaN = l.reduce((a, b) => a + b, 0)/parseFloat(l.length);
            sma.push(smaN);
            checkpoint += 2500;
        }

        energy.push(nextEnergy);
        spinSum.push(nextSpinSum);
        iterations += 1;

        console.log(iterations);
    }

    for (i=0 ; i<10000 ; i++) {
        rand        = pickRandomCell(array);
        stepChange  = energyChange(array, beta, rand[0], rand[1]);
        nextEnergy  = energy[energy.length - 1] + stepChange[0];
        nextSpinSum = spinSum[spinSum.length - 1] + stepChange[1];

        energy.push(nextEnergy);
        spinSum.push(nextSpinSum);
    }

    return [energy.slice(Math.max(energy.length - iterations, 1)), spinSum.slice(Math.max(spinSum.length - iterations, 1)), array, energy[energy.length - 1], spinSum[spinSum.length - 1]/parseFloat(N**2)];
}