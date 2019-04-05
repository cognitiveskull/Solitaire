import lodash from "lodash";
import Pile from "./Pile.js";

class Game {
  constructor(deck, stack, cards) {
    this.piles = [];
    this.deck = deck;
    this.stack = stack;
    this.cards = cards;
  }

  startGame() {
    const cards = lodash.shuffle(this.cards);
    for (let index = 0; index < 7; index++) {
      const pile = new Pile();
      const restrictedCards = cards.splice(0, index);
      pile.addRestrictedCards(restrictedCards);
      pile.addAccessibleCard(cards.splice(0, 1));
      this.piles.push(pile);
    }
    this.stack.addAccessibleCards(cards);
  }

  getStack() {
    return this.stack;
  }

  getPiles() {
    return this.piles;
  }

  getDeck() {
    return this.deck;
  }

  moveCardBetweenPile(card, dragLocation, dropLocation) {
    const draggingFrom = card.draggingFrom.split(" ")[0];
    const pileNumber = dropLocation.split(" ")[1];
    if (pileNumber && this.piles[pileNumber].isAbleToDrop(card)) {
      if (this.piles[dragLocation]) {
        this.piles[dragLocation].moveCardToDeck();
      }
      if (draggingFrom === "open-card") {
        this.stack.updateStack(card);
      }
      return true;
    }
    return false;
  }

  drop(cardDetails, dropLocation) {
    const card = JSON.parse(cardDetails);
    const dragLocation = card.draggingFrom.split(" ")[1];
    const draggingFrom = card.draggingFrom.split(" ")[0];
    console.log("drag location " + card.draggingFrom);
    console.log("dropping at " + dropLocation);
    if (this.deck.isAbleToDrop(card, dropLocation)) {
      if (this.piles[dragLocation]) {
        this.piles[dragLocation].moveCardToDeck();
      }
      if (draggingFrom === "open-card") {
        this.stack.updateStack(card);
      }
      return true;
    }

    return this.moveCardBetweenPile(card, dragLocation, dropLocation);
  }
}

export default Game;
