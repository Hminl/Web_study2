// blackjack.js
let card = [10, 9, 2];
let cardBank = [5, 7, 1, 4];

let sum = card[0] + card[1];
let bankSum = cardBank[0] + cardBank[1];

if (sum <= 21) {
    sum += card[2];
} if (sum === 21){
    console.log('You BlackJack');
}

let i = 2;
while (bankSum > 17) {
    bankSum += cardBank[i];
    i++;
}

if (bankSum > 21 || (sum <= 21 && sum > bankSum)) {
 console.log('You win');
} if (sum > 21 || (bankSum <= 21 && sum < bankSum)){
 console.log('Bank wins');
} if (bankSum == sum ){
    console.log('Draw');
}
console.log(`You have ${sum} points`);
console.log(`Bank have ${bankSum} points`);

