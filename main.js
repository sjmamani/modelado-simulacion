function ShowHideMethod() {
    var eulerDiv      = document.getElementById("eulerContent");
    var montecarloDiv = document.getElementById("montecarloContent");
    var isEuler       = document.getElementById("euler");
    if (isEuler.checked) {
        montecarloDiv.classList.add("hide");
        eulerDiv.classList.remove("hide");
    } else {
        eulerDiv.classList.add("hide");
        montecarloDiv.classList.remove("hide");
    }
}