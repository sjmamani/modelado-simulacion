/**
 * @author  Joaquin Mamani <github.com/sjmamani>
 * @author  Nicolas Ragusa <>
 */

(function (document, window) {
	var radios = document.forms['methods'].elements['methods'];

	for (var i = 0, max = radios.length; i < max; i++) {
		radios[i].onclick = ShowHideMethod;
	}

	calculate.onclick = calcularEuler;

	function calcularEuler() {
		var k = 0;
		var eulerFunction = getById('funcion_euler').value;
		var x = Number(getById('ti').value);
		var xf = Number(getById('tf').value);
		var y = Number(getById('xi').value);
		var n = Number(getById('intervalos').value);
		var xAxis = { domain: [x - 0.1, xf + 0.1] };

		var h = (xf - x) / n;

		var points = [[x, y]];

		for (var j = 1; j <= n; j++) {
			x = x + h;
			k = h * eval(eulerFunction);
			y = y + k;
			points.push([x, y]);
		}

		var yAxis = { domain: [points[points.length - 1][1], points[0][1]] };

		functionPlot({
			target: '#eulerGraphic',
			grid: true,
			yAxis,
			xAxis,
			data: [
				{
					points: points,
					fnType: 'points',
					graphType: 'scatter',
					color: 'red',
				},
				{
					points: points,
					fnType: 'points',
					graphType: 'polyline',
					color: '#26A69A',
				},
			],
		});
	}

	function ShowHideMethod() {
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

	function getById(id) {
		return document.getElementById(id);
	}
})(document, window);
