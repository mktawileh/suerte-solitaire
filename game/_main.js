class Game {
  constructor(name, large) {

    this.gameElement = ce("div", {class: "card-game-element"})
    
    let selector = document.querySelector('#'+name);
    selector.classList.add("card-game-selector")
    selector.append(this.gameElement);

    this.frontGame = ce("div", {class: "main"});
    this.playButton = ce("button", {class: "start-btn"}, "العب");
    this.playButton.addEventListener("click", function() {
      this.init();
    }.bind(this))

    this.sound = {flip: "game/sounds/flip.wav", drop:"game/sounds/drop.wav", wrong: "game/sounds/wrong.mp3", win: "game/sounds/win.mp3", lose: "game/sounds/lose.mp3"};

    if (!this.gameElement) return this;
    
    this.frontGame.append(ce("h1", {class: "start-word"}, "ابدأ لعبة جديدة"), this.playButton);
    this.gameElement.append(this.frontGame);
    
  }
  
  init(start) {
    
    this.frontGame.innerHTML = "";
    this.gameElement.innerHTML = "";

    this.b = new Boxes(true);
    this.d = new Deck(this.b.boxes, true);

    let game = this;

    this.gameElement.append(this.b.lockedLayer);
    this.gameElement.append(this.d.topLayer);
    this.gameElement.append(this.d.layer);
    this.gameElement.append(this.b.layer);

    for (let i = 0; i < this.b.boxes.length; i++){
      let box = this.b.boxes[i];
      this.b.layer.append(box.element);
    }

    this.b.lock(["seven_1", "seven_2", "seven_3", "seven_4", "holder"]);

    this.d.shuffle();

    // Rules.
    for (let i = 0; i < this.d.cards.length; i++){
      let card = this.d.cards[i];
      this.d.layer.append(card.element);
      card.flip().moveTo(this.b.holder, null, null);
      
      card.isWin = function() {
        game.handleWin();
      }

      card.basics = function(box) {
        // center box rules.
        if (box.name == "center" && (box.inside.length == 0 || box.inside[box.inside.length - 1].number == 1) && this.number == 6) return true;
        let last = box.inside[box.inside.length - 1];
        if (box.name == "center" && box.inside.length > 0 && last.number - 1 == this.number && this.number < 6) {
          if (this.number == 1 && box.inside >= 23) {
            box.end = true;
            box.locked = true;
          }
          return true;
        }
        // sevens box rules.
        if (box.name.indexOf("seven") > -1 && this.number == 7) return true;
        if (last && box.name.indexOf("seven") > -1 && this.number - 1 == last.number && this.number > 7) {
          if (this.number == 13) box.end = true;
          return true;
        }
        // six box rules.
        if (box.name.indexOf("six") > -1 && this.number == 6) return true;
        // one, two three rules.
        if (box.key >= 0 && box.key <= 3 && this.box.name == "viewer" && box.inside.length == 0) return true;
        return false;
      }

  
    }

    this.b.holder.lockedElement.addEventListener("click", function(){
      game.distribute();
    });

    this.distribute();

  }

  distribute() {
    let game = this;
    let holder = this.b.holder;
    let viewer = this.b.viewer;
    let empty = false;
    let movement = [];

    function toBox(boxname) {
      
      if (game.b[boxname].inside.length == 0) {

        if (viewer.inside.length == 0 && holder.inside.length > 0) {
          let lastHold = holder.inside.pop();
          empty = true;
          movement.push(lastHold.flip(), game.b[boxname]);
        } else if (viewer.inside.length > 0) {
          let lastView = viewer.inside.pop();
          empty = true;
          movement.push(lastView, game.b[boxname]);
        }

      }

    }

    toBox("one");
    toBox("two");
    toBox("three");
    toBox("four");

    if (!empty) {
      if (holder.inside.length != 0) {
        this.handleWin();
        this.handleLose();
        new Audio(this.sound.flip).play();
        this.flipLastCard(movement);
      } else {
        new Audio(this.sound.wrong).play();
      }
    }

    function doMovement(movement) {
      if (movement.length > 0) {
        let from = movement.shift(),
        to = movement.shift();
        from.moveTo(to, doMovement, movement, true);
      }
    }
    
    doMovement(movement);
    
  }

  flipLastCard(movement){
    let last = this.b.holder.inside[this.b.holder.inside.length - 1];
    if (last) movement.push(last.flip(), this.b.viewer);
  }

  handleWin() {
    if (this.b.seven_1.end && this.b.seven_2.end && this.b.seven_3.end && this.b.seven_4.end && this.b.center.end) {

      this.frontGame.innerHTML = "";
      this.frontGame.append(
        ce("h1", {class: "word"}, "تهانينا. لقد ربحت"),
        ce("div", {class: "emoji emoji--yay"}, [
          ce("div", {class: "emoji__face"}, [
            ce("div", {class: "emoji__eyebrows"}),
            ce("div", {class: "emoji__mouth"})
          ])
        ]),
        this.playButton
      );
      new Audio(this.sound.win).play();
      this.gameElement.append(this.frontGame);

    }
  }

  handleLose() {

    if (this.b.holder.inside.length == 1) {
      this.frontGame.innerHTML = "";
      this.frontGame.append(
        ce("h1", {class: "word"}, "حظ أوفر"),
        ce("div", {class: "emoji emoji--sad"}, [
          ce("div", {class: "emoji__face"}, [
            ce("div", {class: "emoji__eyebrows"}),
            ce("div", {class: "emoji__eyes"}),
            ce("div", {class: "emoji__mouth"})
          ])
        ]),
        this.playButton);
        new Audio(this.sound.lose).play();
        this.gameElement.append(this.frontGame);
    }

  }

}

let g = new Game("ddd", true);