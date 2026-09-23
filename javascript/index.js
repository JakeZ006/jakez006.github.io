input.addEventListener('keyup', function(event){
  if(event.key){NoLTypedDisplay.textContent = input.value.length;}})

window.addEventListener('keydown', function(event){
  if(event.key === 'Enter'){mainButtonLogic()}})

async function loadDict(){
  const rawFile = await fetch('javascript/json/data.json');
  dict = await rawFile.json();
  difficultyOptions('medium')
  debug()
}

function debug(){
  let longestWord = longestSyno = longestDefi = longestIPA = '';
  let tested = [];
  let dups = [];
  for(i in dict){
    let bool = tested.includes(dict[i].word)
    if(!bool){
      tested.push(dict[i].word);
    }else{
      dups.push(dict[i].word);
    }
    if(dups == false){
      dups = 'None';
    }
    if(dict[i].word.length > longestWord.length){
      longestWord = dict[i].word;
    }
    for(x in dict[i].synonyms){
      if(dict[i].synonyms[x].length > longestSyno.length){
        longestSyno = dict[i].synonyms[x];
      }
    }
    if(dict[i].definition.length > longestDefi.length){
      longestDefi = dict[i].definition;
    }
    if(dict[i].ipa.length > longestIPA.length){
      longestIPA = dict[i].ipa;
    }
  }
  console.log(`Total words:  ${dict.length}
Duplicates : ${dups}
Longest word (${longestWord.length}): ${longestWord}
Longest synonym (${longestSyno.length}): ${longestSyno}
Longest definition (${longestDefi.length}): "${longestDefi}"
Longest IPA (${longestIPA.length}): ${longestIPA} `);
}


function slide(){
  if (slideOpt === 'preset'){
    slider.style.transform = 'translateX(105%)';
    presets.style.color = '#E6F9E6';
    custom.style.color = '#1c2921';
    slideOpt = 'custom';
  }else if(slideOpt === 'custom'){
    slider.style.transform = presets.style.color = custom.style.color =  '';
    slideOpt = 'preset';
  }
}

function difficultyOptions(difficultyLvl){

  if(difficultyLvl === 'easy'){
    difficulty = 'easy';
    rounds = Math.ceil(dict.length / 4);
    timeDifficultyDisplay.textContent = 'Time: ∞';
  }else{
    if(difficultyLvl === 'medium'){
      difficulty = 'medium';
      time = dict.length * 10;
      rounds = Math.ceil(dict.length / 2);
    }else if(difficultyLvl === 'hard'){
      difficulty = 'hard';
      time = dict.length * 5;
      rounds = dict.length;
    }
    timeDifficultyDisplay.textContent = 'Time: ' + time;
    timeDisplay.textContent = time + 's';
  }
  roundsDifficultyDisplay.textContent = 'Rounds: ' + rounds;
}

function startGame(){
  setupBox.style.display = 'none';
  gameBox.style.display = 'flex';
  scoreDisplay.textContent = 'Score: 0/' + rounds;
  if(difficulty === 'easy'){
    clockInterval = setInterval(() =>  {
      time ++;
      timeDisplay.textContent = time + 's';
      if(total >= rounds){
        endGame()
      }
    }, 1000)
  }else{
    clockInterval = setInterval(() => {
      time --;
      timeDisplay.textContent = time + 's';
      if(time <= 0 || total >= rounds){
        endGame()
      }
    }, 1000)
  }
  main()
}

function endGame(){
  input.disabled = 'true';
  input.value = 'Finished !';
  clearInterval(clockInterval)
  numOfLettersTotal.textContent = answer.textContent = definition.textContent = synonymsDisplay.innerHTML = '';
  mainButton.style.boxShadow = mainButton.style.pointerEvents = hintButton.style.boxShadow = hintButton.style.pointerEvents = 'none';
  mainButton.style.transform = hintButton.style.transform = 'translate( 4px, 4px)';
  input.style.color = 'black';
}


function main(){
  input.select();
  length = dict.length;
  do{
    num = Math.floor(Math.random() * length);
  }while(used.includes(dict[num].word))
  used.push(dict[num].word);
  numOfLettersTotal = dict[num].word.length;
  NoLTotalDisplay.textContent = `/${numOfLettersTotal}`;
  definition.textContent = dict[num].definition;
  for(let i in dict[num].synonyms){
    synonymsDisplay.innerHTML += `<li>${dict[num].synonyms[i]}</li>`
  }
  ipa.textContent = dict[num].ipa;
  letters = [...dict[num].word];
  letters.forEach(() => underscoreArray.push('_'));
  answer.textContent = `Answer:${underscoreArray.join('')}`;
}

function submit(){
  if(input.value.length === numOfLettersTotal){
    input.disabled = 'true';
    if(dict[num].word.toLowerCase() === input.value.toLowerCase()){
      input.style.color = "green";
      if(hints === 0){score ++;
      }else if(hints === 1){
        score += 0.5;
      }else if(hints === 2){
        score += 0.25;
      }
    }else {
      input.style.color = "red";
    }
    total ++;
    scoreDisplay.textContent = "Score: " + score + "/" + rounds;
    mainButton.textContent = "NEXT";
    ipaCon.style.visibility = "visible";
    answer.textContent = `Answer: ${dict[num].word}`;
  }else{
    NoLTypedDisplay.style.color = 'red';
    setTimeout(() => NoLTypedDisplay.style.color = '', 500);
  }
}

function hint(){
  hints ++;
  do{
    hintNum = Math.floor(Math.random() * letters.length);
    chosenLetter = letters[hintNum];
  }while(usedLetters.includes(chosenLetter))
  usedLetters.push(chosenLetter);
  underscoreArray.splice(hintNum, 1 ,chosenLetter);
  answer.textContent = `Answer:${underscoreArray.join('')}`;
  if(usedLetters.length >= 2){
    hintButton.textContent = 'SKIP';
    hintButton.style.backgroundColor = '#d7f4d7';
    hintButton.style.color = '#1c2921';
  }
}

function mainButtonLogic(){
  if(mainButton.textContent === "SUBMIT"){
    submit()
  }else if(mainButton.textContent === "NEXT"){
    variables('next')
    main()
  }
}

function hintButtonLogic(){
  if(hintButton.textContent === 'HINT'){
    hint()
  }else if(hintButton.textContent === 'SKIP' && mainButton.textContent === 'SUBMIT'){
    hints = 3;
    numOfLettersTotal = input.value.length;
    hintButton.disabled = 'true';
    hintButton.style.boxShadow = hintButton.style.pointerEvents = 'none';
    hintButton.style.transform = 'translate( 4px, 4px)';
    submit()
  }
}

function variables(type){
  input.disabled = hintButton.style.backgroundColor = hintButton.style.color = hintButton.style.transform =
  hintButton.disabled = hintButton.style.pointerEvents = hintButton.style.boxShadow = mainButton.style.transform =
  mainButton.disabled = mainButton.style.pointerEvents = mainButton.style.boxShadow = input.value =
  ipaCon.style.visibility = input.style.color = '';
  usedLetters = [];
  hints = NoLTypedDisplay.textContent = 0;
  hintButton.textContent = 'HINT';
  mainButton.textContent = "SUBMIT";
  underscoreArray = [];
  synonymsDisplay.innerHTML = '';
  if(type === 'home' || type === 'start'){
    loadDict()
    used = [];
    score = total = 0;
    time = 0 ;
    dict = {};
    slideOpt = 'preset';
    difficulty = 'medium';
    difficultyOptions(difficulty)
    timeDisplay.textContent = time + 's'
    if(type === 'home'){
      medium.checked = true;
      gameBox.style.display = setupBox.style.display = '';
      clearInterval(clockInterval)
    }
  }
}

variables('start')
