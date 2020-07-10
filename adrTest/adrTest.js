var num = 3;

function postCall() {
  for (i = 0; i < num; i++) {
    var name = "field_name" + i;
    console.log(name);
    var currentName = document.getElementById(name).value;
    console.log(currentName);
  }
}
