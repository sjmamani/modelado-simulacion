/**
 * @author  Joaquin Mamani <github.com/sjmamani>
 * @author  Nicolas Ragusa <>
 */

(function (document, window) {
	var radios = document.forms['methods'].elements['methods'];

	for (var i = 0, max = radios.length; i < max; i++) {
		radios[i].onclick = showHideMethod;
	}

	calculate.onclick = calcularMontecarlo;

	function showHideMethod() {
		var eulerDiv = document.getElementById('eulerContent');
		var montecarloDiv = document.getElementById('montecarloContent');
		var isEuler = document.getElementById('euler');
		if (isEuler.checked) {
			montecarloDiv.classList.add('hide');
			eulerDiv.classList.remove('hide');
			// plot('#eulerGraphic');
		} else {
			eulerDiv.classList.add('hide');
			montecarloDiv.classList.remove('hide');
			// plot('#montecarloGraphic');
		}
	}

	function calcularMontecarlo() {
		var montecarloFunction =
			document.getElementById('funcion_montecarlo').value;
		var puntoInicial = document.getElementById('punto_inicial').value;
		var puntoFinal = document.getElementById('punto_final').value;
		var disparos = document.getElementById('disparos').value;
		const { puntos, area } = montecarlo(
			puntoInicial,
			puntoFinal,
			montecarloFunction,
			1.1,
			disparos
		);
		const puntosColores = [
			{
				puntos: puntos[0],
				color: 'green',
			},
			{
				puntos: puntos[1],
				color: 'red',
			},
		];
		const proccessedPoints = puntosColores.map(dibujarPuntos(false));
		const processedAreaFunctions = dibujarArea(
			montecarloFunction,
			puntoInicial,
			puntoFinal,
			'#26A69A20'
		);
		const otherData = {
			fn: montecarloFunction,
			range: [puntoInicial, puntoFinal],
			color: '#26A69A',
		};
		const options = {
			target: '#montecarloGraphic',
			yAxis: { domain: [-1, 9] },
			grid: true,
			data: [otherData, processedAreaFunctions, ...proccessedPoints],
		};
		functionPlot(Object.assign({}, options));

		var resultado = document.getElementById('resultadoMontecarlo');
		resultado.textContent = 'Resultado: ';
		resultado.textContent += area.toString();
	}

	const dibujarPuntos = isFullGraph => {
		const processPoints = inputData => {
			const pointList = [];
			!isFullGraph && pointList.push([]);

			inputData.puntos.forEach(e => {
				pointList.push(e);
			});

			return {
				points: pointList,
				fnType: 'points',
				graphType: 'scatter',
				color: inputData.color,
			};
		};

		return processPoints;
	};

	const dibujarArea = (func, start, end, color) => ({
		fn: func,
		range: [start, end],
		closed: true,
		color: color,
	});

	const montecarlo = (xI, xF, funcionBase, error, intentos) => {
		const esEntero = false;

		const x = { min: xI, max: xF };
		const aproxY = aproximarYs(xI, xF, 100, funcionBase);
		const y = {
			min: aproxY.min * error,
			max: aproxY.max * error,
		};

		const puntosAProbar = generateRandomArray(intentos, x, y, esEntero);

		const { exitos, fracasos } = generarConjuntosDeIntentos(
			puntosAProbar,
			funcionBase
		);

		const puntos = [
			[...exitos.negativo, ...exitos.positivo],
			[...fracasos.negativo, ...fracasos.positivo],
		];

		const area = pasoMontecarlo(exitos, intentos, xI, xF, y);

		return { puntos: puntos, area: area };
	};

	// Calcula el Area por los Exitos
	const pasoMontecarlo = (exitos, intentos, xI, xF, y) => {
		return (
			((exitos.positivo.length - exitos.negativo.length) / intentos) *
			(xF - xI) *
			(y.max - y.min)
		);
	};

	// Consigue Y min y max entre los evaluados
	const aproximarYs = (xStart, xEnd, quantity, funcionBase) => {
		let max = 0;
		let min = 0;

		// Busca en la Funcion cuales son el menor y mayor Y entre los intentados
		const evaluarValores = value => {
			const aux = solve1DFunction(funcionBase, value);

			if (aux > max) {
				max = aux;
			}

			if (aux < min) {
				min = aux;
			}
		};

		const valoresAProbar = generarValoresAProbar(xStart, xEnd, quantity);
		valoresAProbar.forEach(evaluarValores);

		return { min: min, max: max };
	};

	// Separa los Puntos entre Exitos y Fracasos
	const generarConjuntosDeIntentos = (puntos, funcionBase) => {
		const exitos = { positivo: [], negativo: [] };
		const fracasos = { positivo: [], negativo: [] };

		// Agrega Puntos en el Conjunto Pertinente
		const dividirPuntosEnConjuntos = point => {
			const valorDeLaFuncion = solve1DFunction(funcionBase, point[0]);
			const valorDeLaFuncionNegativa = solve1DFunction(
				funcionBase,
				point[0],
				true
			);
			const y = point[1];
			if (y >= 0) {
				if (y <= valorDeLaFuncion) {
					exitos.positivo.push(point);
				} else {
					fracasos.positivo.push(point);
				}
			} else {
				if (y * -1 <= valorDeLaFuncionNegativa) {
					exitos.negativo.push(point);
				} else {
					fracasos.negativo.push(point);
				}
			}
		};

		puntos.forEach(dividirPuntosEnConjuntos);

		return { exitos: exitos, fracasos: fracasos };
	};

	const solve1DFunction = (func, value, invert) => {
		const e = generateSolvableFunction(func, value, invert);
		return math.evaluate(e);
	};

	const generateSolvableFunction = (func, value, invert) => {
		const regex = /x/gi;
		const processedValue = `(${value})`;
		const replacedExpression = func.replace(regex, processedValue);
		return invert ? `(-1)*(${replacedExpression})` : replacedExpression;
	};

	// Generar Puntos a Probar
	const generarValoresAProbar = (xInicial, xFinal, cantidad) => {
		const coleccionDePuntos = [];

		// Mientras no se hayan generado todos los puntos a probar...
		while (coleccionDePuntos.length < cantidad) {
			const valorCandidato = generateRandom(xInicial, xFinal);

			// Corrobora si el punto generado ya existe o no...
			if (!coleccionDePuntos.includes(valorCandidato)) {
				coleccionDePuntos.push(valorCandidato);
			}
		}

		return coleccionDePuntos;
	};

	const generateRandom = (minI, maxI, isInteger) => {
		const min = Math.ceil(minI);
		const max = Math.floor(maxI);
		const randomNumber = Math.random() * (max - min) + min;
		return isInteger ? Math.floor(randomNumber) : randomNumber;
	};

	const generateRandomArray = (tries, x, y, isInteger) => {
		const pointArray = [];
		let e;
		for (e = 0; e < tries; e++) {
			pointArray.push(generateRandomPoints(x, y, isInteger));
		}
		return pointArray;
	};

	const generateRandomPoints = (x, y, isInteger) => {
		return [
			generateRandom(x.min, x.max, isInteger),
			generateRandom(y.min, y.max, isInteger),
		];
	};
})(document, window);
