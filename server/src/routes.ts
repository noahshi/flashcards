import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

//map from deck names to flashcard decks 
const decks: Map<string, unknown> = new Map<string, unknown>();
//scores array
let scores : [string, string, number][] = [];

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
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
export const saveDeck = (req: SafeRequest, res: SafeResponse): void => {
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
}

/**
 * Handles request for /load-deck by returning the flashcard deck requested.
 *
 * takes "name" of deck from query
 *
 * Responds with 400 if "name" is missing,
 * 404 if there is no "value" corresponding with the given "name",
 * otherwise with success confirmation and the requested "value"
 */
export const loadDeck = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  if(!decks.has(name)){
    res.status(404).send('deck not found');
    return;
  }
  res.send({value: decks.get(name)});
}

/**
 * Handles request for /save-score by storing the given score.
 *
 * Takes name of the user ("name"), name of the deck ("deck"), and the score ("value") to store from body
 *
 * Responds with 400 if "name", "deck", or "value" is missing, 404 if there is no deck with the name "deck",
 * otherwise with success confirmation
 */
export const saveScore = (req: SafeRequest, res: SafeResponse): void => {
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
  if(!decks.has(deck)){
    res.status(404).send('deck not found');
    return;
  }
  scores.push([name, deck, value]);
  res.send();
}

/**
 * Handles request for /load-scores by returning the list of the scores currently saved
 *
 * Does not take any parameters
 *
 * Responds with success confirmation and the list of scores
 */
export const loadScores = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({value: scores});
}

/**
 * Handles request for /checkname by checking if there is no deck using the name requested
 *
 * Takes "name" to check from query
 *
 * Responds with 400 if "name" is missing, othewise with success confirmation and
 * a boolean value of whether "name" is available or not
 */
export const checkName = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  res.send({value: !decks.has(name)});
}

/**
 * Handles request for /list by returning the list of the names of all decks currently saved
 *
 * Does not take any parameters
 *
 * Responds with success confirmation and the list of deck names
 */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({decks: Array.from(decks.keys())});
}


/** Used in tests to clear the deck map */
export const resetDecksForTesting = (): void => {
  decks.clear();
}

/** Used in tests to clear the scores map */
export const resetScoresForTesting = (): void => {
  scores = [];
}
