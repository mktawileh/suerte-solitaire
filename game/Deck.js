class Deck {
  constructor(boxes) {

    this.__defineGetter__("boxes", ()=> boxes || null);
    this.__defineGetter__("suits", ()=> ["hearts", "clubs", "diamonds", "spades"]);
    this.layer = ce("div", {class: "layer"});
    this.topLayer = ce("div", {class: "layer", style: "z-index: 1"});

    this.cards = [];
    this.cardMoving = false;
    this.init();
    this.sound = {hold: "game/sounds/hold.wav", drop:"game/sounds/drop.wav", wrong: "game/sounds/wrong.mp3"};
  }

  init() {
    this.cards = [];
    for (let suit in this.suits) {
      for (var n = 1; n <= 13; n++) {
        let card = this.card(parseInt(suit), n);
        this.cards.push(card);
      }
    }
  }

  shuffle() {
    var currentIndex = this.cards.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
    return this;
  }

  reset() {
    this.init();
    return this;
  }

  card(suitKey, number) {
    let deck = this;

    function flip() {
      this.element.classList.toggle("flipped");
      return this;
    }

    function moveTo(e, callBack, parameter, sound) {
      if (e.element || e.offsetLeft) {
        let box = e;
        e = e.element || e;
        if (this.box && this.box.inside) {
          for (let i = 0; i < this.box.inside.length; i++) {
            if (this.box.inside[i].value == this.value) {
              this.box.inside.splice(this.box.inside.indexOf(this.box.inside[i]), 1);;
            }
          }
        }

        let lastCardInBox = box.inside[box.inside.length -1];
        if (box.inside.length > 0) {
          deck.layer.append(lastCardInBox.element);
        }
        if (box && this.box && box.name != this.box.name && this.box.inside.length > 0) {
          deck.topLayer.append(this.box.inside[this.box.inside.length - 1].element);
        }
        this.box = box;
        box.inside.push(this);
        let pos = [
          e.getBoundingClientRect(),
          deck.layer.getBoundingClientRect()
        ];

        anime({
          targets: this.element,
          left: pos[0].x - pos[1].x,
          top: pos[0].y - pos[1].y,
          duration: 100,
          easing: 'linear',
          delay: 0,
          complete: function() {
            if (typeof callBack == "function") callBack(parameter);
          }
        });

        if (sound) {
          new Audio(deck.sound.drop).play();
        }
        
        deck.topLayer.append(this.element);
      }
      return this;
    }

    // Creating the card object.
    let card = {
      value: number + " " + this.suits[suitKey],
      number: number, 
      suit: suitKey + 1,
      box: null,
      flip: flip,
      moveTo: moveTo,
      onbox: null,
      canMove: false,
      basics: function(){return true /* rules of the game from _main.js. but by default return true */},
      isWin: function(){ /* check if the user win the game from _main.js */},
    }

    let element = this.cardElement(suitKey + 1, number, card);
    card.element = element;

    return card;
  }

  cardElement(suitKey, number, card) {
    let deck = this;

    // Create The Card Element.
    let element = 
    ce("div", {class: "card"}, [
      ce("span", {class: "suit_" + suitKey + " num_" + number}),
      ce("span", {class: "suit_5 num_3"})
    ]);

    function collision(e1, e2, e1_depth_percent, e2_depth_percent) {
      let p1 = e1.getBoundingClientRect();
      let p2 = e2.getBoundingClientRect();

      
      if (e1_depth_percent != null) {
        e1_depth_percent = (e1_depth_percent * 0.01);
        p1 = {
          x: p1.x + (p1.width * e1_depth_percent),
          y: p1.y + (p1.height * e1_depth_percent),
          width: p1.width * e1_depth_percent,
          height: p1.height * e1_depth_percent,
        }
      }
      
      if (e2_depth_percent != null) {
        e2_depth_percent = (e2_depth_percent * 0.01);
        p2 = {
          x: p2.x + (p2.width * e2_depth_percent),
          y: p2.y + (p2.height * e2_depth_percent),
          width: p2.width * e2_depth_percent,
          height: p2.height * e2_depth_percent,
        }
      }

      if (
        p1.x < p2.x + p2.width && p1.x + p1.width > p2.x &&
        p1.y < p2.y + p2.height && p1.y + p1.height > p2.y
        ) return true;
        return false;
    }

    // Customizing the element for the drag and drop functionality.
    let moving = false, move = false, target = null; // The target will be the dragged card.

    function mouseDown(event) {
      move = true;
      if (event.which == 1 && event.buttons > 0){
        target = element;
        element.offset = {
          x: element.offsetLeft - event.clientX,
          y: element.offsetTop - event.clientY
        };
        new Audio(deck.sound.hold).play();
      }
    }

    function mouseMove(event) {
      if (move) {
        if (event.movementX != 0 && event.movementY != 0) {
          moving = true;
        }

        element.classList.add("on-top", "no-transition", "card-hold");
        target.style.left = event.clientX + target.offset.x + "px";
        target.style.top = event.clientY + target.offset.y + "px";
      }
    }

    function mouseUp(event) {
      if (target && moving) {
        if (target.dropon || typeof deck.boxes == "object") {
          let dropon = target.dropon || deck.boxes;
          let box = null;
          for(let i in dropon) {
            let b = dropon[i];
            // Check card position, is it over any box.
            if (collision(b.element, target, null, 30)) {
              // Drop the card in the box element.
              box = b;
            }
          }
          if (box && card.basics(box)) {
            card.isWin();
            card.moveTo(box);
            new Audio(deck.sound.drop).play();
          } else {
            new Audio(deck.sound.wrong).play();
          }
          card.moveTo(card.box);
          target.classList.remove("on-top", "no-transition", "card-hold");

        }
        target = null;
      }
      moving = false;
      move = false;
    }

    element.addEventListener("mousedown", (event)=>mouseDown(event));
    document.addEventListener("mousemove", (event)=>mouseMove(event));
    document.addEventListener("mouseup", (event)=>mouseUp(event));

    return element;
  }

  moveTo(cards, box) {

    for (let i = 0; i < cards.length; i++) {
      cards[i].moveTo(box);
    }

  }

}
