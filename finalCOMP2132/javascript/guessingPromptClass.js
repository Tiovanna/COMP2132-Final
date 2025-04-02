class guessingPrompt{
  constructor(word, hint){
    this.word = word
    this.hint = hint
  }

  getWord(){
    return `${this.word}`
  }

  getHint(){
    return `${this.hint}`
  }

  toString(){
    return `${this.word}|${this.hint}`
  }
}