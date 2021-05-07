
function ShowHideMethod() {
    var eulerDiv = document.getElementById('eulerContent');
	var montecarloDiv = document.getElementById('montecarloContent');
    var isEuler = document.getElementById('euler');
	if (isEuler.checked) {
		montecarloDiv.classList.add('hide');
		eulerDiv.classList.remove('hide');
        plot('#eulerGraphic');
	} else {
		eulerDiv.classList.add('hide');
		montecarloDiv.classList.remove('hide');
        plot('#montecarloGraphic');
	}
}

function plot(target = "#eulerGraphic") {
	functionPlot({
		target: target,
		// width: 100,
		// height: 100,
		yAxis: { domain: [-1, 9] },
		grid: true,
		data: [
			{
				fn: 'x^2',
				derivative: {
					fn: '2 * x',
					updateOnMouseMove: true,
				},
			},
		],
	});
}

function calcularEuler () {
	const eulerFunction = document.getElementById ('funcion_euler').value;
	const tiempoIni = document.getElementById('ti').value;
	const tiempoFin = document.getElementById('tf').value;
	const xIni = document.getElementById('xi').value;
	const intervalos = document.getElementById('intervalos').value;
	const puntos = euler(eulerFunction, tiempoIni, tiempoFin, xIni, intervalos);
	plot('#eulerGraphic', eulerFunction, tiempoIni, tiempoFin, xIni, intervalos);                              
}

function euler () {
	
}