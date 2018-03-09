
function timerFunc() {
  document.getElementById('timer').innerHTML =
    02 + ":" + 00;
  startTimer();

  function startTimer() {
    var presentTime = document.getElementById('timer').innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    if(s==59){m=m-1}
    if(m<0){
      $(".panel-tablero").hide('slow', function(){
        var juego_terminado_text = document.createElement("h2");
        juego_terminado_text.innerHTML = "Juego Terminado";
        $(juego_terminado_text).css({
          "font-family": "gameFont",
          "font-size": "2em",
          "color": "#ffff00",
          "width": "100%",
          "text-align": "center"
        });
        $(".main-titulo").after($(juego_terminado_text));
      });
      $(".panel-score").css("width", "100%");
      $(".time").hide('slow');

    }

    document.getElementById('timer').innerHTML =
      m + ":" + s;
    if(!(m<0)){
      setTimeout(startTimer, 1000);
    }
  }

  function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
    if (sec < 0) {sec = "59"};
    return sec;
  }
}
