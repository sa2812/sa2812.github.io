var kb  = 1.3806488e-23;
var muB = 0.0;

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

function pickRandomCell(array) {
	const N = array.length;
	x = getRandomIntInclusive(0, N-1);
	y = getRandomIntInclusive(0, N-1);
	return [x, y];
}

function getValue(array, x, y) {
	return array[x][y].value;
}

function neighbourEnergy(array, x, y) {
	const N = array.length;
	return (array[x][(y + 1) % N].value  + array[(x + 1) % N][y].value) * array[x][y].value + (muB * array[x][y].value);
}

function energyChange(array, beta, x, y) {
    const currentValue = array[x][y].value;
    const N = array.length;

    // up, right, down, left
    const deltaE = (array[((x == 0 ? array.length : x) - 1) % N][y].value + array[x][(y + 1) % N].value + array[(x + 1) % N][y].value + array[x][((y == 0 ? array.length : y) - 1) % N].value) * 
    		       currentValue * 2 + muB * currentValue * 2;
    let newValue = 0;

    if (deltaE < 0) {
        array[x][y].value = -currentValue;
        newValue = -2 * currentValue;
    } else if ((deltaE > 0) && (Math.random() < Math.exp(-deltaE * beta))) {
        array[x][y].value = -currentValue;
        newValue = -2 * currentValue;
    }

    return [array, deltaE, newValue];
}

function totalEnergy(array) {
	let energy = 0.0;
	const N = array.length;

	for (x = 0; x < N; x++) {
		for (y = 0; y < N; y++) {
			energy += neighbourEnergy(array, x, y);
		}
	}
	return energy;
}

function totalMagnetisation(array) {
    let sum = 0;
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
	let array = [];
	if (temp) {
		for (i=0; i<N; i++) {	
			let row = [];
			for (j=0; j<N; j++) {
				const x = getRandomIntInclusive(0, 1);
				if (x == 0) {
					row.push(-1);
				} else {
					row.push(1);
				}
			}
			array.push(row);
		}
	} else {
		let x = getRandomIntInclusive(0,1);
		if (x == 0) {
			x = -1;
		}
		for (i=0; i<N; i++) {
			let row = [];
			for (j=0; j<N; j++) {
				row.push(x);
			}
			array.push(row);
		}
	}
	return array;
}

function iterate(array, beta) {
    const E = totalEnergy(array);
    const N = array.length;

    const rand = pickRandomCell(array);
    const newArray = energyChange(array, beta, rand[0], rand[1])[0];

    return newArray;
}

function run(array, n, beta) {
    let energies = [totalEnergy(array)];
    for (i=0; i<n; i++) {
        array = iterate(array, beta);
        energies.push(totalEnergy(array));
    }

    return energies;
}

// function iterate(array, beta, Etot=0) {
//     // Returns:
//     // energy        - A list of the energy of the array over the iterations.
//     // magnetisation - A list of the total magnetisation of the array.
//     // spin_sum      - The sum of all of the spins of the atoms in the array.
//     var energy   = [];
//     var spinSum  = [];
//     var sma      = [];
//     var totalE;
//     var N = array.length;

//     // If total energy has already been found previously then just input that
//     // value back in here instead of recalculating it all.
//     if (Etot != null) {
//         totalE = Etot;
//     } else {
//         totalE = totalEnergy(array);
//     }
//     console.log(totalE);

//     energy.push(totalE);
//     spinSum.push(totalMagnetisation(array));

//     var iterations = 0;
//     var checkpoint = 5000;
//     // Let system reach equilibrium
//     while (iterations <= 20000 || Math.abs(sma[sma.length - 2] - sma[sma.length - 1]) > 0.1) {
//         rand          = pickRandomCell(array);
//         stepChange    = energyChange(array, beta, rand[0], rand[1]);
//         nextEnergy    = energy[energy.length - 1] + stepChange[0]
//         nextSpinSum = spinSum[spinSum.length - 1] + stepChange[1]
//         if (iterations == checkpoint) {
//             l = energy.slice(Math.max(energy.length - 2500, 1));
//             smaN = l.reduce((a, b) => a + b, 0)/parseFloat(l.length);
//             sma.push(smaN);
//             checkpoint += 2500;
//         }

//         energy.push(nextEnergy);
//         spinSum.push(nextSpinSum);
//         iterations += 1;
//     }

//     for (i=0 ; i<100000 ; i++) {
//         rand        = pickRandomCell(array);
//         stepChange  = energyChange(array, beta, rand[0], rand[1]);
//         nextEnergy  = energy[energy.length - 1] + stepChange[0];
//         nextSpinSum = spinSum[spinSum.length - 1] + stepChange[1];

//         energy.push(nextEnergy);
//         spinSum.push(nextSpinSum);
//     }
//     console.log(energy[energy.length - 1]);
//     // return [energy.slice(Math.max(energy.length - iterations, 1)), spinSum.slice(Math.max(spinSum.length - iterations, 1)), array, energy[energy.length - 1], spinSum[spinSum.length - 1]/parseFloat(N**2)];
//     return energy[energy.length - 1];
// }