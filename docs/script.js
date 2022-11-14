function change(off, pos){
  var letter = Array.from(pos)[0];
  var n = parseInt(Array.from(pos)[1]);

  var atual = document.getElementById(letter+n);
  var next = document.getElementById(letter+(n+off));

  var temp_img_old = atual.innerHTML.split("flags/")[1].split("\.")[0];
  var temp_name_old = atual.innerHTML.split("flag\">")[1];

  var temp_img_new = next.innerHTML.split("flags/")[1].split("\.")[0];
  var temp_name_new = next.innerHTML.split("flag\">")[1];

  atual.innerHTML = atual.innerHTML.replace(temp_img_old, temp_img_new).replace(temp_name_old, temp_name_new);
  next.innerHTML = next.innerHTML.replace(temp_img_new, temp_img_old).replace(temp_name_new, temp_name_old);

  update();
}

function down(pos){
  change(1, pos);
}

function up(pos){
  change(-1, pos);
}

function changeTo(elemA, elemB){

  var temp_img_old = elemA.innerHTML.split("flags/")[1].split("\.")[0];
  var temp_name_old = elemA.innerHTML.split("flag\">")[1];

  var temp_img_new = elemB.innerHTML.split("flags/")[1].split("\.")[0];
  var temp_name_new = elemB.innerHTML.split("flag\">")[1];

  elemA.innerHTML = elemA.innerHTML.replace(temp_img_old, temp_img_new).replace(temp_name_old, temp_name_new);
}

function update(){
  var chaves = document.getElementsByClassName("time-chave");
  for (var i = 0; i < chaves.length; ++i) {
    var item = chaves[i];

    var temp_img_old = item.innerHTML.split("flags/")[1].split("\.")[0];
    var temp_name_old = item.innerHTML.split("flag\">")[1];

    item.innerHTML = item.innerHTML.replace(temp_img_old, "UND").replace(temp_name_old, "Undefined");
  }


  for (var i = 1; i < 9; ++i) {
    var label = "a"+i;

    var a = document.getElementById(label+"a");
    var temp_a = document.getElementById(a.getAttribute("holder"));
    changeTo(a, temp_a);

    var b = document.getElementById(label+"b");
    var temp_b = document.getElementById(b.getAttribute("holder"));
    changeTo(b, temp_b);

  }

}


function winner(i, letter, mult){
  ref_a = letter+(mult+2*(i-1))+"a";
  ref_b = letter+(mult+2*(i-1))+"b";

  score_a = parseInt(document.getElementById(letter+(mult+2*(i-1))+"s1").value)
  score_b = parseInt(document.getElementById(letter+(mult+2*(i-1))+"s2").value)

  if(score_a>score_b){
    return ref_a;
  }

  if(score_b>score_a){
    return ref_b;
  }

  return -1;
}

function calcBracket(refA, refB, i){
  ref = refA+i+"a";
  ref_winner = winner(i, refB, 1);
  if(ref_winner != -1){
    changeTo(document.getElementById(ref), document.getElementById(ref_winner));
  }

  ref = refA+i+"b";
  ref_winner = winner(i, refB, 2);
  if(ref_winner != -1){
    changeTo(document.getElementById(ref), document.getElementById(ref_winner));
  }
}

function chave(pos){
  for (var i = 1; i < 9; ++i) {
    if (i <= 4){
      //Quartas
      calcBracket("b", "a", i);
    }
    if (i <= 2){
      //Semi
      calcBracket("c", "b", i);
    }
    if (i == 1){
      //Final
      calcBracket("d", "c", i);
    }
  }

}
function bracketJson(ref){
  var ref_a = ref+"a";
  var team_a = document.getElementById(ref_a).innerHTML.split("flags/")[1].split("\.")[0];
  var ref_b = ref+"b";
  var team_b = document.getElementById(ref_b).innerHTML.split("flags/")[1].split("\.")[0];

  score_a = parseInt(document.getElementById(ref+"s1").value)
  score_b = parseInt(document.getElementById(ref+"s2").value)

  return "'"+ref+"':{'"+team_a+"':"+score_a+",'"+team_b+"':"+score_b+"}";

  return "";
}


function copy(){
  var s = "{'groups':{";

  for (var i = 0; i < 8; ++i) {
    //Group
    var letter = String.fromCharCode(97 + i).toUpperCase();
    s+="'"+letter+"':[";
    for(var j = 1; j < 5; ++j){
      var ref = letter+j;
      var elem = document.getElementById(ref);
      var team = elem.innerHTML.split("flags/")[1].split("\.")[0];
      s+= "'"+team+"'";

      if(j!=4){
        s+=",";
      }
    }
    s+="]";
    if(i!=7){
      s+=",";
    }
  }
  s+="},";

  //chaves

  s+="'results':{";
  for (var i = 1; i < 9; ++i) {
    s += bracketJson("a"+i);
    if(i!=8){
      s+=",";
    }
    if (i <= 4){
      s += bracketJson("b"+i);
      s+=",";
    }
    if (i <= 2){
      s += bracketJson("c"+i);
      s+=",";
    }
    if (i == 1){
      s += bracketJson("d"+i);
      s+=",";
    }
  }
  s+="}"

  s+="}";

  navigator.clipboard.writeText(s);

  alert("Codigo copiado, favor colar na DM do Bot no Discord.");
}


$( document ).ready(function() {
  update();
});
