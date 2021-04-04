
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
