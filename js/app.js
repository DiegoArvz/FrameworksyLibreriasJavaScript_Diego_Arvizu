
$( document ).ready(function() {
  var reinicio_counter = 0;
  changeColorTitle();
  $(".btn-reinicio").click(function(){
    reinicio_counter++;
    if(reinicio_counter <2){
      $(".btn-reinicio").text("Reiniciar");
      timerFunc();
      generaDulcesEnTablero();
    }
    else{
      location.reload();
    }
  });


});

function addMovimientos(){
  var movimientos = parseInt($("#movimientos-text").text());
  movimientos++;
  document.getElementById('movimientos-text').innerHTML = movimientos;
}

function addPuntos(){
  var puntos = parseInt($("#score-text").text());
  puntos++;
  document.getElementById('score-text').innerHTML = puntos;
}


  function changeColorTitle(){
    $(".main-titulo").css("color", "#ffff00");

    setTimeout(function(){ changeColorTitleSecond() }, Math.floor(Math.random() * 1000));
  }

  function changeColorTitleSecond(){
    $(".main-titulo").css("color", "#fff");

    setTimeout(function(){ changeColorTitle() }, Math.floor(Math.random() * 1000));
  }


  function generaDulcesEnTablero(){
    for (var j = 0; j <= $(".panel-tablero").children().length ; j++) {
      var col_num = j;
      var col_element = $(".panel-tablero").find($(".col-"+col_num));
      var col_element_children = col_element.children().length;
      for (var i = col_element_children; i < 7; i++) {
        var num = Math.floor(Math.random() * 4)+1;
        var image = "image/"+num+".png";
        var style = "width:100%;height:14.28%;";
        var theClass;
        if(num == 1){
          theClass="dulce_1";
        }else if(num == 2){
          theClass="dulce_2";
        }else if(num == 3){
          theClass="dulce_3";
        }else if(num == 4){
          theClass="dulce_4";
        }
        var candy_element ="<img src="+image+" style="+style+" class="+theClass+">"

        col_element.prepend(candy_element);
      }
    }
    asignarIDs();
    DroppableDraggable();
    checkForCandyCoincidence();
  }

  function asignarIDs(){
      for (var j = 0; j < $(".panel-tablero").children().length ; j++) {
        var col_num = j;
        var col_element = $(".panel-tablero").find($(".col-"+(col_num+1)));
        $.each(col_element.children(), function(key, value){
          var element = $(col_element).children().eq(key);

          var unique_ID = ""+j+""+key;
          $(element).attr('id', unique_ID);
        });
      }
  }

  function DroppableDraggable(){
    for (var j = 0; j < $(".panel-tablero").children().length ; j++) {
      var col_num = j;
      var col_element = $(".panel-tablero").find($(".col-"+(col_num+1)));
      $.each(col_element.children(), function(key, value){
        var element = $(col_element).children().eq(key);
        asignarDroppableDraggable(element);
      });
    }
  }

  function asignarDroppableDraggable(element){
    $(element).draggable(
    );
    $(element).droppable({
      drop: function( event, ui ) {
        var changePositions = false;
        var drop_container_id = element.get(0).id;//drop container
        var dragged_id = ui.draggable.get(0).id;//dragged container

        var drop_id_first = parseInt(drop_container_id.charAt(0));
        var drop_id_second = parseInt(drop_container_id.charAt(1));

       var dragged_id_first = parseInt(dragged_id.charAt(0));
       var dragged_id_second = parseInt(dragged_id.charAt(1));

       if((dragged_id_first -1) == drop_id_first && dragged_id_second == drop_id_second){ //saber si esta la izquierda
         changePositions = true;
       }
       else if((dragged_id_first +1) == drop_id_first && dragged_id_second == drop_id_second){// derecha

         changePositions = true;
       }
       else if((dragged_id_first) == drop_id_first && (dragged_id_second-1) == drop_id_second){// iarriba
         changePositions = true;
       }
       else if((dragged_id_first) == drop_id_first && (dragged_id_second+1) == drop_id_second){// abajo
         changePositions = true;
       }

       if(changePositions){
        var drop_position = $(element.get(0)).position();

        var dragged_position = $(ui.draggable.get(0)).position();
         dragged_position.top = dragged_position.top - ui.position.top - drop_position.top;
         dragged_position.left = dragged_position.left - ui.position.left - drop_position.left;
         var dragged_element =  ui.draggable.get(0);
         var dropcontainer_element = element.get(0);

         var parent_dragged = $(dragged_element).parent().get(0);
         var prent_dropcontainer = $(dropcontainer_element).parent().get(0);

         //get the sibling in which the dragged will be after
         var new_dragged_index = $(prent_dropcontainer).children().eq($(dropcontainer_element).index()-1);
         var new_dropcontainer_index = $(parent_dragged).children().eq($(dragged_element).index()-1);

         var draggable_index = $(dragged_element).index();
         var container_index = $(dropcontainer_element).index();

         if(draggable_index > 0 ){

           if(new_dragged_index.index() == 6){
              $(prent_dropcontainer).prepend($(dragged_element));
           }else{
             $(new_dragged_index).after($(dragged_element));
             $(new_dropcontainer_index).after($(dropcontainer_element));
           }
         }
         else{
           $(prent_dropcontainer).prepend($(dragged_element));
           $(parent_dragged).prepend($(dropcontainer_element));
         }
         $(dragged_element).css("top", "0");
         $(dragged_element).css("left", "0");
         $(dragged_element).css("opacity", "0");
         $(dragged_element).animate({
            opacity: 1
          },'slow');
          changePositions = false;
          addMovimientos();
          setTimeout(function(){ generaDulcesEnTablero(); }, 700);
        //   asignarIDs();

       }else {
         var drop_position = $(element.get(0)).position();
         var dragged_position = $(ui.draggable.get(0)).position();
         dragged_position.top =   dragged_position.top - drop_position.top;
         dragged_position.left = dragged_position.left - drop_position.left;
         $(ui.draggable.get(0)).animate({
           left: dragged_position.left,
           top: dragged_position.top
         },'slow');
       }
      }
    });
  }

  function checkForCandyCoincidence(){
    var row_column_coincidence = [];
    var row_coincidence = checkHorizontalTriads();
    var row_column_coincidence = checkVerticalTriads(row_coincidence);
    fadeInFadeOutElement(row_column_coincidence, 6);
  }

  function checkHorizontalTriads() {
    var countInARow = 1;
    var elementsReference = [];
    var finalList = [];
    var allElements = [];
    for (var i = 0; i < $(".panel-tablero").children().length; i++) {//rows
      var newtype = false;
      for (var j = 1; j < $(".panel-tablero").children().length ; j++) {
        var col_num = j;
        var tablero = $(".panel-tablero");

        var currentColChild = tablero.find($(".col-"+col_num));
        var nextColChild= tablero.find($(".col-"+(col_num+1)));

        elementsReference.push(currentColChild.children().eq(i));
        if(currentColChild.children().eq(i).attr('class') === nextColChild.children().eq(i).attr('class')){

          if(countInARow > 1){
           elementsReference.pop();
          }
          elementsReference.push(nextColChild.children().eq(i));
          countInARow++;

          if(elementsReference.length >=3){
            if(finalList.length == 0 || newtype ){
              for(var k = 0; k < elementsReference.length; k++){
                finalList.push( elementsReference[k]);
              }
              newtype = false;
            }
            else{
              for(var k = countInARow-1; k < elementsReference.length; k++){
                finalList.push( elementsReference[k]);
              }
            }
          }

        }
        else {
          if(finalList.length > 0){
              newtype = true;
          }
          elementsReference = [];
          countInARow = 1;
        }
      }

      allElements = allElements.concat(finalList);
      finalList = [];
      elementsReference = [];
      countInARow = 1;
    }

    return allElements;
  }

  function checkVerticalTriads(allElements){
    var countInCol = 1;
    var elementsReference = [];
    var finalList = [];
    var ids = [];
    $.each(allElements, function(key, value){

        ids.push(value.get(0).id);

    });
    for (var i = 0; i < $(".panel-tablero").children().length; i++) {
      var newtype = false;
      var tablero = $(".panel-tablero");
      var currentCol = tablero.find($(".col-"+(i+1)));


      for (var j = 0; j < currentCol.children().length-1; j++) {
        if(currentCol.children().eq(j).attr('class') === currentCol.children().eq(j+1).attr('class')){
          elementsReference.push(currentCol.children().eq(j));
          if(countInCol > 1){
            elementsReference.pop();
          }
          elementsReference.push(currentCol.children().eq(j+1));
          countInCol++;
          if(elementsReference.length >=3){

            if(finalList.length == 0 || newtype ){
              for(var k = 0; k < elementsReference.length; k++){
                finalList.push( elementsReference[k]);
              }
              newtype = false;
            }
            else{
              for(var k = countInCol-1; k < elementsReference.length; k++){
                finalList.push( elementsReference[k]);
              }
            }
          }

        }
        else {
          if(finalList.length > 0){
              newtype = true;
          }
          elementsReference = [];
          countInCol = 1;
        }
      }
      $.each(finalList, function(key, value){
        var included = false;
        for (var i = 0; i < ids.length; i++) {
          if((ids[i] == value.get(0).id)){
            included = true;
            break;
          }
        }
        if(!included){
          allElements.push(value);
        }
      });

      finalList = [];
      elementsReference = [];
      countInCol = 1;
    }

      return allElements;
  }

  function fadeInFadeOutElement(list, entero){
    fadeOutElements(list, entero);
  }

  function fadeOutElements(list, entero){
    var thelist = list;
    $.each(list, function(key, value){
      var element = value.get(0);
      $(element).animate({
        opacity: "0"
      },'fast');
    });
    var e = entero;
    e--;
    if(e > 0){
        fadeInElements(thelist, e);
    }
    else {

      $.each(list, function(key, value){
        var element = value.get(0);
        $(element).fadeOut( "slow", function() {
          addPuntos();
          $(element).remove();
          if(key == list.length-1){
              if(this != undefined){
                setTimeout(function(){ generaDulcesEnTablero(); }, 500);
              }
          }
        });
      });
    }
  }

  function fadeInElements(list, entero){
    var thelist = list;
    $.each(list, function(key, value){
      var element = value.get(0);
      $(element).animate({
        opacity: "1"
      },'fast');
    });
    var e = entero;
    e--;
    if(e > 0){
      fadeOutElements(list, e);
    }
    else {
      $.each(list, function(key, value){
        var element = value.get(0);
        $(element).fadeOut( "slow", function() {
          addPuntos();
          $(element).remove();
          if(key == list.length-1){
              if(this != undefined){
                setTimeout(function(){ generaDulcesEnTablero(); }, 500);
              }
          }
        });
      });

    }
  }
