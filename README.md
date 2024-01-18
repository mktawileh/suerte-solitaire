# Suerte Solitaire

A homemade classic solitaire card game coded in JavaScript.

Suerte Solitaire implements the standard solitaire mechanics without complexity. The name "Suerte" conveys the luck-based nature of success in the card game.

## Origin Story
Suerte Solitaire was envisioned and brought to life by [me :)](https://github.com/mthead5) starting at the young age of 16. Driven by passion and creativity, all code and assets were independently developed from scratch.

## Running the game
The game requires no installation. Simply open the ```index.html``` file locally in a browser to play. Everything is self-contained in pure client-side JavaScript.

## How to Play
The game deals one card at a time from the deck into the waste pile or "deal box". Only the top card is visible. 

Click and drag cards from the deal box or temporary holder boxes at the bottom to move them.

### Central Build Box
* Stack cards down from Six to Ace in any suit order.
* An empty box can start with a 6 card.
* If the box ends with an Ace, you can put another 6 on top.

### Corner Target Boxes
* Build 4 up sequences from 7 to King by suit.
* Each target box holds one sequence.

### Temporary Holder Boxes
* The side boxes hold temporary cards for future moves.

### Valid Card Moves
* You can only move a card or sequence if it matches the required order of the destination box.
* You can put one card of any number and suit in the temporary holder boxes.

### Finishing the Game
* When the central and corner boxes all contain complete sequences, you win :)
* If the deal deck runs out first, you lose :(
