const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to along train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
   ];
   
let words = [];
let wordIndex = 0;
let startTime = Date.now();
let Timerank = [];
let whatrank = "";

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const messagerank = document.getElementById('rank');
const typedValueElement = document.getElementById('typed-value');

document.getElementById('start').classList.add('startact');

document.getElementById('modalCloseBtn').addEventListener('click', () =>{
    console.log("modal btn");
    document.getElementById('modal_back').style.display = "none";
})


document.getElementById('start').addEventListener('click',() => {
    typedValueElement.disabled = false;
    document.getElementById('start').disabled = true;
    document.getElementById('start').classList.remove('startact');
    document.getElementById('start').classList.add('startnone');

    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;
    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';
    typedValueElement.value = '';
    typedValueElement.focus();
    startTime = new Date().getTime();
   });

   typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;
    
    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        
        Timerank.push(elapsedTime / 1000);
        Timerank.sort((a,b) => a-b);
        console.log(Timerank);
        localStorage.setItem('Rank', JSON.stringify(Timerank));

        Timerank = JSON.parse(localStorage.getItem('Rank'));
        const rankmsg = `1st ${Timerank[0]}
        2nd ${Timerank[1]}
        3rd ${Timerank[2]}`;
        messagerank.innerText = rankmsg;

        if(elapsedTime/1000 === Timerank[0]){
            whatrank = "1st";
        } else if(elapsedTime/1000 === Timerank[1]){
            whatrank = "2nd";
        } else if(elapsedTime/1000 === Timerank[2]){
            whatrank = "3rd";
        }else{
            whatrank = "NO RANKED"
        }
        const message = `You finished in ${elapsedTime / 1000} seconds. Your rank is ${whatrank}.`;
        messageElement.innerText = message;


        typedValueElement.disabled = true;
        document.getElementById('start').disabled = false;
        document.getElementById('start').classList.remove('startnone');
        document.getElementById('start').classList.add('startact');

        document.getElementById('modal_back').style.display = "flex"
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) { //
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
        quoteElement.childNodes[wordIndex-1].classList.add('over');
        wordElement.classList.remove('highlight');
        //wordElement.className = ' ';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';

        
        
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
   });