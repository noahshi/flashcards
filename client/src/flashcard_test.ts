import * as assert from 'assert';
import { createFlashcard, toJson, fromJson, cardFromJson, Flashcard } from './flashcard';


describe('flashcard', function() {
  it('createFlashcard', function() {
    //straight line code
    assert.deepEqual(createFlashcard("front 1", "back 1"), {vocab: "front 1", definition: "back 1"});
    assert.deepEqual(createFlashcard("front 2", "back 2"), {vocab: "front 2", definition: "back 2"});
  });

  it('toJson', function(){
    //flashcards to use for tests
    const card1 : Flashcard = createFlashcard("front 1", "back 1");
    const card2 : Flashcard = createFlashcard("front 2", "back 2");
    const card3 : Flashcard = createFlashcard("front 3", "back 3");
    const card4 : Flashcard = createFlashcard("front 4", "back 4");

    // 0 loops (1 case)
    assert.deepEqual(toJson([]), []);
    
    // 1 loop
    assert.deepEqual(toJson([card1]), [["front 1", "back 1"]]);
    assert.deepEqual(toJson([card4]), [["front 4", "back 4"]]);

    // 2+ loops
    assert.deepEqual(toJson([card2 , card3]), [["front 2", "back 2"], ["front 3", "back 3"]]);
    assert.deepEqual(toJson([card1, card2, card3, card4]), 
            [["front 1", "back 1"], ["front 2", "back 2"], ["front 3", "back 3"], ["front 4", "back 4"]]);
  });

  it('fromJson', function(){
    // error case
    assert.throws(() => fromJson(7));
    assert.throws(() => fromJson("not flashcard"));

    // 0 loops (1 case)
    assert.deepEqual(fromJson([]), []);
    
    // 1 loop
    assert.deepEqual(fromJson([["front 1", "back 1"]]), [{vocab: "front 1", definition: "back 1"}]);
    assert.deepEqual(fromJson([["front 4", "back 4"]]), [{vocab: "front 4", definition: "back 4"}]);

    // 2+ loops
    assert.deepEqual(fromJson([["front 2", "back 2"], ["front 3", "back 3"]]), 
            [{vocab: "front 2", definition: "back 2"}, {vocab: "front 3", definition: "back 3"}]);
    assert.deepEqual(fromJson([["front 1", "back 1"], ["front 2", "back 2"], ["front 3", "back 3"], ["front 4", "back 4"]]), 
            [{vocab: "front 1", definition: "back 1"},{vocab: "front 2", definition: "back 2"}, 
            {vocab: "front 3", definition: "back 3"},{vocab: "front 4", definition: "back 4"}]);
  });

  it('cardFromJson', function(){
    // error - input not array
    assert.throws(() => cardFromJson(14));
    assert.throws(() => cardFromJson("not flashcard"));

    // error - array length != 2
    assert.throws(() => cardFromJson(["front"]));
    assert.throws(() => cardFromJson(["front", "back", "side"]));

    // error - array elements not strings
    assert.throws(() => cardFromJson([true, "back"]));
    assert.throws(() => cardFromJson(["front", 21]));

    //straight line code
    assert.deepEqual(cardFromJson(["front 1", "back 1"]), {vocab: "front 1", definition: "back 1"});
    assert.deepEqual(cardFromJson(["front 2", "back 2"]), {vocab: "front 2", definition: "back 2"});
  });
});
