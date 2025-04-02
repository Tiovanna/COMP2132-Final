const footerText = document.getElementById("footer-text")
footerText.innerHTML = `Footer text :D`



function fetchPromptJSON(){
  return fetch('../javascript/promptFile.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("ERROR: JSON prompt response invalid!")
      }
      return response.json()
    })
}



function getWordAndHint(json) {
  const promptKeys = Object.keys(json)
  const randomKey = promptKeys[Math.floor(Math.random() * promptKeys.length)]
  prompt = new guessingPrompt(randomKey, json[randomKey])
  return prompt
}



function createKeyboard(){
  const layout = {
    row1: "QWERTYUIOP".split(""),
    row2: "ASDFGHJKL".split(""),
    row3: "ZXCVBNM".split("")
  }
  Object.keys(layout).forEach(rowId =>{
    const rowElement = document.getElementById(rowId)
    layout[rowId].forEach(letter => {
      const button = document.createElement("button")
      button.classList.add("qwerty-btn")
      button.textContent = letter

      button.addEventListener("click", () =>{
        let word=prompt.getWord().toUpperCase()
        let letter=button.textContent

        if (word.includes(letter)) {
          button.classList.add("guess-correct")
          guessedLetters.push(letter)
          updateWordDisplay(word, guessedLetters)
          if (word.split("").every(letter => guessedLetters.includes(letter))) {
            displayWinMessage()
            disableAllButtons()
          }}
        else{
          button.classList.add("disabled")
          updateHangmanImage()
        }
        button.disabled = true
      })
      rowElement.appendChild(button)
    })
  })
}



function displayWord(word){
  const wordContainer = document.getElementById("wordDisplay")
  wordContainer.innerHTML = word.split("").map(()=>"_").join(" ")
}



function displayWinMessage(){
  const gameContainer = document.getElementById("game-container")
  const winMessage = document.createElement("div")
  winMessage.classList.add("win-message")
  winMessage.innerHTML = `<h2>You Win!</h2>`

  const playAgainButton = document.createElement("button")
  playAgainButton.textContent = "Play Again?"
  playAgainButton.classList.add("play-again-btn", "fade-in")

  playAgainButton.addEventListener("click", ()=>{
    location.reload()
  })

  winMessage.appendChild(playAgainButton)
  gameContainer.appendChild(winMessage)
}



function displayLoseMessage(){
  const gameContainer = document.getElementById("game-container")
  const winMessage = document.createElement("div")
  winMessage.classList.add("lose-message")
  winMessage.innerHTML = `<h2>You lost...</h2>`

  const playAgainButton = document.createElement("button")
  playAgainButton.textContent = "Try again?"
  playAgainButton.classList.add("play-again-btn", "fade-in")

  playAgainButton.addEventListener("click", ()=>{
    location.reload()
  })

  winMessage.appendChild(playAgainButton)
  gameContainer.appendChild(winMessage)
}



function disableAllButtons(){
  document.querySelectorAll(".qwerty-btn").forEach(button=>{
    button.disabled=true
    button.classList.add("disabled")
  })
}



function updateWordDisplay(word, guessedLettersArray){
  const wordContainer = document.getElementById("wordDisplay")
  wordContainer.innerHTML = word.split("").map(letter=>(guessedLettersArray.includes(letter) ? letter:"_")).join(" ")
}



function displayHangedMan(){
  const outputB = document.getElementById("output-partb")
  let image = document.getElementById("hangman-image")

  if (!image){
    image = document.createElement("img")
    image.id="hangman-image"
    image.src="../images/hangman0.png"
    image.alt="Hangman progress"
    outputB.appendChild(image)
  }
}



function updateHangmanImage(){
  if(incorrectGuesses < maxIncorrectGuesses){
    incorrectGuesses ++
    const image = document.getElementById("hangman-image")
    image.src=`../images/hangman${incorrectGuesses}.png`

    if(incorrectGuesses == maxIncorrectGuesses){
      displayLoseMessage()
      disableAllButtons()
    }
  }
}



async function main() {
  try {
    const jsonData = await fetchPromptJSON()
    const outputA = document.getElementById("output-parta")
    guessedLetters=[]
    incorrectGuesses = 0
    maxIncorrectGuesses = 7
    
    displayHangedMan()
    let prompt = getWordAndHint(jsonData)
    partAOutput = prompt.getHint()
    displayWord(prompt.getWord())
    
    createKeyboard()

    outputA.innerHTML = partAOutput

    

  } catch (error) {
    console.error("Error: ", error);
  }
}



main()