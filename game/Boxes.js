class Boxes {
  
  constructor () {

    this.__defineGetter__("boxesNames", ()=> ["one", "two", "three", "four", "center", "holder", "viewer", "seven_1", "seven_2", "seven_3", "seven_4", "six"]);
    this.__defineGetter__("visual", ()=> [this.one, this.two, this.three, this.four]);
    this.__defineGetter__("seven", ()=> [this.seven_1, this.seven_2, this.seven_3, this.seven_4]);
    this.boxes = [];
    this.layer = ce("div", {class: "layer"});
    this.lockedLayer = ce("div", {class: "layer"});

    for (let i = 0; i < this.boxesNames.length; i++) {
      let box = this.box(i, this.boxElement(this.boxesNames[i]));
      this[this.boxesNames[i]] = box;
      this.boxes.push(box);
    }

  }

  box(boxKey, element) {
    let boxes = this;
    let inside = [];
    let locked = false;
    let lockedElement = this.boxLockedElement(this.boxesNames[boxKey]);
    return {
      key: boxKey,
      name: this.boxesNames[boxKey],
      element: element,
      get inside() {
        return inside;
      },
      set locked(value) {

        if (typeof value == "boolean") locked = value;
        else locked = false;
        if (locked) boxes.lockedLayer.append(lockedElement), this.lockedElement = lockedElement;
        
      },
      get locked() {
        return locked;
      },
      put(card) { 
        inside.push(card);
        return card;
      },
      pull(card) {
        inside.splice(inside.indexOf(card), 1);
        return card;
      }
    }
  }

  boxElement(boxname) {
    let e = ce("div", {class: "box " + boxname});
    e.__defineGetter__("position", function(){  return this.getBoundingClientRect() });
    return e; 
  }

  boxLockedElement(boxname) {
    let e = ce("div", {class: "lock " + boxname});
    e.__defineGetter__("position", function(){  return this.getBoundingClientRect() });
    return e;
  }

  lock(boxes) {
    for(let i = 0; i < boxes.length; i++) {
      this[boxes[i]].locked = true;
    }
  }

}
