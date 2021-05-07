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

function plot(target = "#eulerGraphic", eulerFunction, tiempoIni, tiempoFin, xIni, intervalos) {
	functionPlot({
		target: target,
		// width: 100,
		// height: 100,
		yAxis: { domain: [-1, 9] },
		grid: true,
		data: [
			{
				fn: eulerFunction,
				range: [tiempoIni, tiempoFin],

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

function euler (eulerFunction, tiempoIni, tiempoFin, xIni, intervalos) {
	var h = (tiempoFin - tiempoIni)/intervalos;
	var valores = [];
        var x = xIni;
        var t = tiempoIni;
        valores.push({ t : t, x : x });
        while (t < tiempoFin) {
            x = x + h * evaluar(x, t, eulerFunction);
            t = t + h;
        valores.push({ t : t, x : x });
        }
        return valores;
}

function  evaluar(x, t, eulerFunction) {
        
	while(eulerFunction.includes("sin")){
		let sin = eulerFunction.match(/sin\((.)\)/)[1] === "t" ? Math.sin(t) : Math.sin(x);
		let variable = eulerFunction.match(/sin\((.)\)/)[1];
		eulerFunction = eulerFunction.replace("sin("+variable+")",sin);
	}
	while(eulerFunction.includes("cos")){
		let cos = eulerFunction.match(/cos\((.)\)/)[1] === "t" ? Math.cos(t) : Math.cos(x);
		let variable = eulerFunction.match(/cos\((.)\)/)[1];
		eulerFunction = eulerFunction.replace("cos("+variable+")",cos);
	}
	while(eulerFunction.includes("sqrt")){
		let sqrt = eulerFunction.match(/sqrt\((.)\)/)[1] === "t" ? Math.sqrt(t) : Math.sqrt(x);
		let variable = eulerFunction.match(/sqrt\((.)\)/)[1];
		eulerFunction = eulerFunction.replace("sqrt("+variable+")",sqrt);
	}
	return eval(eulerFunction);
}
