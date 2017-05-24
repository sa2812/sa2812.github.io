var kb  = 1.3806488e-23;
var muB = 0.0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomCell(array) {
	var N = array.length;
	x = getRandomIntInclusive(0, N);
	y = getRandomIntInclusive(0, N);
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
    var currentValue = array[x][y];
    var N = array.length;

    // up, right, down, left
    deltaE = (array[(x - 1) % N][y].value + array[x][(y + 1) % N].value + array[(x + 1) % N][y].value + array[x][(y - 1) % N].value) * 
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
            sum += arraySum(array[a]);
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