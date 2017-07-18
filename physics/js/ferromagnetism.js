const kb  = 1.3806488e-23;
const muB = 0.0;

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