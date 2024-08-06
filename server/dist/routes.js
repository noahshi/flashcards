"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetScoresForTesting = exports.resetDecksForTesting = exports.list = exports.checkName = exports.loadScores = exports.saveScore = exports.loadDeck = exports.saveDeck = void 0;
//map from deck names to flashcard decks 
const decks = new Map();
//scores array
let scores = [];
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param) => {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
/**
 * Handles request for /save-deck by storing the given flashcard deck.
 *
 * Takes "name" of the deck and the "value" to store from body
 *
 * Responds with 400 if "name" or "value" is missing, otherwise with success confirmation
 */
const saveDeck = (req, res) => {
    const name = req.body.name;
    if (name === undefined || typeof name !== 'string' || name === "") {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    const value = req.body.value;
    if (value === undefined) {
        res.status(400).send('required argument "value" was missing');
        return;
    }
    decks.set(name, value);
    res.send();
};
exports.saveDeck = saveDeck;
/**
 * Handles request for /load-deck by returning the flashcard deck requested.
 *
 * takes "name" of deck from query
 *
 * Responds with 400 if "name" is missing,
 * 404 if there is no "value" corresponding with the given "name",
 * otherwise with success confirmation and the requested "value"
 */
const loadDeck = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    if (!decks.has(name)) {
        res.status(404).send('deck not found');
        return;
    }
    res.send({ value: decks.get(name) });
};
exports.loadDeck = loadDeck;
/**
 * Handles request for /save-score by storing the given score.
 *
 * Takes name of the user ("name"), name of the deck ("deck"), and the score ("value") to store from body
 *
 * Responds with 400 if "name", "deck", or "value" is missing, 404 if there is no deck with the name "deck",
 * otherwise with success confirmation
 */
const saveScore = (req, res) => {
    const name = req.body.name;
    if (name === undefined || typeof name !== 'string' || name === "") {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    const deck = req.body.deck;
    if (deck === undefined || typeof deck !== 'string' || deck === "") {
        res.status(400).send('required argument "deck" was missing');
        return;
    }
    const value = req.body.value;
    if (value === undefined || typeof value !== 'number') {
        res.status(400).send('required argument "value" was missing');
        return;
    }
    if (!decks.has(deck)) {
        res.status(404).send('deck not found');
        return;
    }
    scores.push([name, deck, value]);
    res.send();
};
exports.saveScore = saveScore;
/**
 * Handles request for /load-scores by returning the list of the scores currently saved
 *
 * Does not take any parameters
 *
 * Responds with success confirmation and the list of scores
 */
const loadScores = (_req, res) => {
    res.send({ value: scores });
};
exports.loadScores = loadScores;
/**
 * Handles request for /checkname by checking if there is no deck using the name requested
 *
 * Takes "name" to check from query
 *
 * Responds with 400 if "name" is missing, othewise with success confirmation and
 * a boolean value of whether "name" is available or not
 */
const checkName = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    res.send({ value: !decks.has(name) });
};
exports.checkName = checkName;
/**
 * Handles request for /list by returning the list of the names of all decks currently saved
 *
 * Does not take any parameters
 *
 * Responds with success confirmation and the list of deck names
 */
const list = (_req, res) => {
    res.send({ decks: Array.from(decks.keys()) });
};
exports.list = list;
/** Used in tests to clear the deck map */
const resetDecksForTesting = () => {
    decks.clear();
};
exports.resetDecksForTesting = resetDecksForTesting;
/** Used in tests to clear the scores map */
const resetScoresForTesting = () => {
    scores = [];
};
exports.resetScoresForTesting = resetScoresForTesting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSx5Q0FBeUM7QUFDekMsTUFBTSxLQUFLLEdBQXlCLElBQUksR0FBRyxFQUFtQixDQUFDO0FBQy9ELGNBQWM7QUFDZCxJQUFJLE1BQU0sR0FBZ0MsRUFBRSxDQUFDO0FBRTdDLHdFQUF3RTtBQUN4RSw0RUFBNEU7QUFDNUUsbURBQW1EO0FBQ25ELE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBYyxFQUFvQixFQUFFO0lBQ2pELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QjtTQUFNLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQ3BDLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7U0FBTTtRQUNMLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQyxDQUFDO0FBR0Y7Ozs7OztHQU1HO0FBQ0ksTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFnQixFQUFFLEdBQWlCLEVBQVEsRUFBRTtJQUNwRSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7UUFDakUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUM3RCxPQUFPO0tBQ1I7SUFDRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUM3QixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7UUFDdkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUM5RCxPQUFPO0tBQ1I7SUFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDYixDQUFDLENBQUE7QUFiWSxRQUFBLFFBQVEsWUFhcEI7QUFFRDs7Ozs7Ozs7R0FRRztBQUNJLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDcEUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELE9BQU87S0FDUjtJQUVELElBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdkMsT0FBTztLQUNSO0lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUE7QUFaWSxRQUFBLFFBQVEsWUFZcEI7QUFFRDs7Ozs7OztHQU9HO0FBQ0ksTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFnQixFQUFFLEdBQWlCLEVBQVEsRUFBRTtJQUNyRSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7UUFDakUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUM3RCxPQUFPO0tBQ1I7SUFDRCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7UUFDakUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUM3RCxPQUFPO0tBQ1I7SUFDRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUM3QixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQ3BELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDOUQsT0FBTztLQUNSO0lBQ0QsSUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUM7UUFDbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN2QyxPQUFPO0tBQ1I7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNiLENBQUMsQ0FBQTtBQXRCWSxRQUFBLFNBQVMsYUFzQnJCO0FBRUQ7Ozs7OztHQU1HO0FBQ0ksTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFpQixFQUFFLEdBQWlCLEVBQVEsRUFBRTtJQUN2RSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7QUFDNUIsQ0FBQyxDQUFBO0FBRlksUUFBQSxVQUFVLGNBRXRCO0FBRUQ7Ozs7Ozs7R0FPRztBQUNJLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDckUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELE9BQU87S0FDUjtJQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUE7QUFQWSxRQUFBLFNBQVMsYUFPckI7QUFFRDs7Ozs7O0dBTUc7QUFDSSxNQUFNLElBQUksR0FBRyxDQUFDLElBQWlCLEVBQUUsR0FBaUIsRUFBUSxFQUFFO0lBQ2pFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDOUMsQ0FBQyxDQUFBO0FBRlksUUFBQSxJQUFJLFFBRWhCO0FBR0QsMENBQTBDO0FBQ25DLE1BQU0sb0JBQW9CLEdBQUcsR0FBUyxFQUFFO0lBQzdDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoQixDQUFDLENBQUE7QUFGWSxRQUFBLG9CQUFvQix3QkFFaEM7QUFFRCw0Q0FBNEM7QUFDckMsTUFBTSxxQkFBcUIsR0FBRyxHQUFTLEVBQUU7SUFDOUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNkLENBQUMsQ0FBQTtBQUZZLFFBQUEscUJBQXFCLHlCQUVqQyJ9