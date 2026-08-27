const fields = ['roundsDifficultyDisplay','timeDifficultyDisplay','answer','ipa','synonym3','synonym2','synonym1','definition','NoLTotalDisplay','slider','custom','presets','scoreDisplay','timeDisplay','input','NoLTypedDisplay','ipaCon','gameBox','SlideOpt','setupBox', 'hintButton', 'mainButton', 'homeButton'];
const elements = fields.map(id => document.getElementById(id));

variables('start')

input.addEventListener('keyup', function(event){
  if(event.key){NoLTypedDisplay.textContent = input.value.length;}})

window.addEventListener('keydown', function(event){
  if(event.key === 'Enter'){mainButtonLogic()}})

async function loadDict(){
  rawFile = await fetch('javascript/json/data.json');
  dict = await rawFile.json();  
  difficultyOptions('medium')
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
    time = 0;
    rounds = Math.ceil(dict.length / 4);
    timeDifficultyDisplay.textContent = 'Time: ∞'
  }else{
    rounds = 30
    if(difficultyLvl === 'medium'){
      difficulty = 'medium';
      time = dict.length * 10;
      rounds = Math.ceil(dict.length / 2);
    }else if(difficultyLvl === 'hard'){      
      difficulty = 'hard';
      time = dict.length * 5;
      rounds = dict.length;
    }
    timeDifficultyDisplay.textContent = 'Time: ' + time
  }
  roundsDifficultyDisplay.textContent = 'Rounds: ' + rounds
}

function startGame(){
  setupBox.style.display = 'none'
  gameBox.style.display = 'flex'
  scoreDisplay.textContent = 'Score: 0/' + rounds;
  timeDisplay.textContent = time + 's'
  if(difficulty === 'easy'){
  clockInterval = setInterval(() =>  {
    time ++;
    if(total >= rounds){
      endGame()
    }
    timeDisplay.textContent = time + 's';
    }, 1000)
  }else{
    clockInterval = setInterval(() =>  {
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
  input.disabled = 'true'
  input.value = 'Finished !'
  clearInterval(clockInterval)
  numOfLettersTotal.textContent = answer.textContent = definition.textContent = synonym1.textContent = synonym2.textContent = synonym3.textContent = '';
  mainButton.style.boxShadow = mainButton.style.pointerEvents = hintButton.style.boxShadow = hintButton.style.pointerEvents = 'none';
  mainButton.style.transform = hintButton.style.transform = 'translate( 4px, 4px)';
  input.style.color = 'black';
}

function variables(type){
  input.disabled = hintButton.style.backgroundColor = hintButton.style.color = hintButton.style.transform = hintButton.disabled = hintButton.style.pointerEvents = hintButton.style.boxShadow = mainButton.style.transform = mainButton.disabled = mainButton.style.pointerEvents = mainButton.style.boxShadow = input.value = ipaCon.style.visibility = input.style.color = '';
  usedLetters = []
  hints = NoLTypedDisplay.textContent  = 0;
  hintButton.textContent = 'HINT'
  mainButton.textContent = "SUBMIT";
  if(type == 'home' || type == 'start'){
    loadDict()
    used = underscoreArray = []
    score = total = 0
    time = 240;
    timeDisplay.textContent = time + 's';
    slideOpt = 'preset';
    dict = {};
    difficulty = 'medium';
    if(type == 'home'){
      medium.checked = true
      gameBox.style.display = setupBox.style.display = ''
      clearInterval(clockInterval)
    }
  }

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
  let count = 0;
  synonym1.textContent = dict[num].synonyms[count]; count ++;
  synonym2.textContent = dict[num].synonyms[count]; count ++;
  synonym3.textContent = dict[num].synonyms[count];
  ipa.textContent = dict[num].ipa;
  function underscores(){
    letters = [...dict[num].word];
    underscoreArray = []
    for(i of letters){underscoreArray.push('_');}
    answer.textContent = `Answer:${underscoreArray.join('')}`;
  }
  underscores()
}

function submit(){
  if(input.value.length == numOfLettersTotal){
    input.disabled = 'true'
    if(dict[num].word.toLowerCase() == input.value.toLowerCase()){
      input.style.color = "green";
      if(hints == 0){score ++;
      }else if(hints == 1){score += 0.5;
      }else if(hints == 2){score += 0.25;}
    }else {input.style.color = "red";}
    total ++;
    scoreDisplay.textContent = "Score: " + score + "/" + rounds;
    mainButton.textContent = "NEXT";
    ipaCon.style.visibility = "visible";
    answer.textContent = `Answer: ${dict[num].word}`;
  }else{
    NoLTypedDisplay.style.color = 'red'
    setTimeout(() => NoLTypedDisplay.style.color = '', 500)
  }
}

function hint(){
  hints ++;
  do{
    hintNum = Math.floor(Math.random() * letters.length);
    chosenLetter = letters[hintNum];
  }while(usedLetters.includes(chosenLetter))
  usedLetters.push(chosenLetter)
  underscoreArray.splice(hintNum, 1 ,chosenLetter)
  answer.textContent = `Answer:${underscoreArray.join('')}`;
  if(usedLetters.length >= 2){
    hintButton.textContent = 'SKIP'
    hintButton.style.backgroundColor = '#d7f4d7'
    hintButton.style.color = '#1c2921'
  }
}

function mainButtonLogic(){
  if(mainButton.textContent == "SUBMIT"){
    submit()
  }else if(mainButton.textContent == "NEXT"){
    variables('next')
    main()
  }
}

function hintButtonLogic(){
  if(hintButton.textContent == 'HINT'){
    hint()
  }else if(hintButton.textContent == 'SKIP' && mainButton.textContent == 'SUBMIT'){
    hints = 3;
    numOfLettersTotal = input.value.length
    hintButton.disabled = 'true';
    hintButton.style.boxShadow = hintButton.style.pointerEvents = 'none'
    hintButton.style.transform = 'translate( 4px, 4px)'
    submit()
  }
}
