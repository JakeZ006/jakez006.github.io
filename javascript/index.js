const butDecrease = document.getElementById('butDecrease');
const butReset = document.getElementById('butReset');
const butIncrease = document.getElementById("butIncrease");
const butSave = document.getElementById("butSave");
const butLoad = document.getElementById("butLoad");
const counter = document.getElementById("counter");

let count = 0;
let save = 0;

butIncrease.onclick = function(){
  count++;
  counter.textContent = count;
}

butDecrease.onclick = function(){
  count--;
  counter.textContent = count;
}

butReset.onclick = function(){
  count = 0;
  counter.textContent = count;
}

butSave.onclick = function(){
  save = count
}

butLoad.onclick = function(){
  count = save
  counter.textContent = count;
}
