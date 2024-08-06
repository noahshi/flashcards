import React, { Component } from "react";
import { isRecord } from './record';
import { CreateMenu } from "./CreateMenu";
import { PracticeMenu } from "./PracticeMenu";
import { StartMenu } from "./StartMenu";
import { Flashcard, fromJson } from "./flashcard";
import { Score, ScoreMenu } from "./ScoreMenu";


/**
 * EC Features:
 * - saves progress on create menu if save is not pressed/not successful
 * - flip button on practice menu replaced with actual flipping card
 * - shows all missed flashcards at the end of each practice
 */

/** Type to make keeping track of the current menu easier */
export type MenuType = "start" | "create" | "practice"  | "scores";

type FlashcardAppState = {
   /** Current menu the app is on */
   menu : MenuType;
   /** deck name to be passed onto the practice menu */
   deckName : string;
   /** flashcards to be passed onto the practice menu */
   flashcards : Flashcard[];
}

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    this.state = { menu : "start", flashcards : [], deckName : "" };
  }
  
  render = (): JSX.Element => {
    switch(this.state.menu){
      case "create":
        return <CreateMenu checkValidName={this.doNameCheckClick} saveDeck={this.doSaveDeckClick} changeMenu={this.setMenuState}/>;
      case "practice":
        return <PracticeMenu changeMenu={this.setMenuState} name={this.state.deckName} deck={this.state.flashcards} saveScore={this.doSaveScoreClick}/>;
      case "scores":
        return <ScoreMenu changeMenu={this.setMenuState} getScores={this.getScores}/>;
      default:
        return <StartMenu changeMenu={this.setMenuState} loadDeck={this.doLoadClick} setName={this.setName} getDeckList={this.getDeckList} />;
    }
  };

  /** function for switching menus */
  setMenuState = (menuType : MenuType): void => {
    this.setState({menu : menuType});
  }

  /** function for setting the name of the deck to be used in the practice menu */
  setName = (name : string) : void => {
    this.setState({deckName : name});
  }

  /** Logs fetch errors to the console */
  doFetchError = (call: String, msg: String) : number => {
    console.error(`Error fetching /${call}: ${msg}`);
    return -1;
  }

  /** Saves flashcard deck to the server */
  doSaveDeckClick = async (name: string, value: unknown) : Promise<number> => {
    return fetch('/api/save-deck', {method: 'POST', body: JSON.stringify({name: name, value: value}), 
        headers: {'Content-Type': 'application/json'}})
        .then(this.doSaveDeckResp)
        .catch(() => this.doFetchError("save-deck", "failed to connect to server"));
  }

  /** Checks if the deck save request was valid,
   *  returns -4 if fetch failed due to missing parameters, 
   * -1 if it failed to other reasons, and 0 if it suceeded */
  doSaveDeckResp = (res: Response) : number => {
    if(res.status === 400){
      this.doFetchError("save-deck", `bad status code ${res.status}: ${res.statusText}`);
      return -4;
    }
    if (res.status !== 200) {
      this.doFetchError("save-deck", `bad status code ${res.status}: ${res.statusText}`);
      return -1;
    }
    return 0;
  }

  /** Saves score to the server, returns -1 if fetch failed, 0 if it suceeded */
  doSaveScoreClick = async (name: string, deck: string, value: number) : Promise<number> => {
    return fetch('/api/save-score', {method: 'POST', body: JSON.stringify({name: name, deck: deck, value: value}), 
        headers: {'Content-Type': 'application/json'}})
        .then(this.doSaveScoreResp)
        .catch(() => this.doFetchError("save-score", "failed to connect to server"));
  }

  /** Checks if the score save request was valid, returns -1 if it isnt, 0 if it is*/
  doSaveScoreResp = (res: Response) : number => {
    if (res.status !== 200) {
      this.doFetchError("save-score", `bad status code ${res.status}: ${res.statusText}`);
      return -1;
    }
    return 0;
  }

  /** Checks if the name given is already in use, returns true if it isnt, false if it is, returns -1 if fetch failed */
  doNameCheckClick = async (name: string) : Promise<boolean | number> => {
    return fetch('/api/checkname?' + new URLSearchParams({name: name}))
      .then(this.doNameCheckResp)
      .catch(() => this.doFetchError("checkname", "failed to connect to server"));
  }

  /** Checks if the name check request was valid, returns -1 if it isnt, returns boolean value requested if it is */
  doNameCheckResp = async (res: Response) : Promise<boolean | number> => {
    if (res.status !== 200) {
      this.doFetchError("checkname", `bad status code ${res.status}: ${res.statusText}`);
      return -1;
    }
    return res.json().then(this.doNameCheckJson);
  }

  /** Checks if the response is in json, will attempt to parse if it is, returns -1 if it isnt */
  doNameCheckJson = (json: unknown) : number | boolean => {
    if(!isRecord(json)){
      this.doFetchError("checkname", "response is not json");
      return -1;
    }
    return validNameFromJson(json.value);
  }

  /** loads the deck with the clicked name */
  doLoadClick = (name: string) : void => {
    this.setState({deckName: name});
    fetch('/api/load-deck?' + new URLSearchParams({name: name}))
        .then(this.doLoadResp)
        .catch(() => this.doFetchError("load", "failed to connect to server"));
  }

  /** checks if the load request was valid, will attempt to load the practice menu with the requested deck if it is */
  doLoadResp = (res: Response) : void => {
    if (res.status !== 200) {
      this.doFetchError("load-deck", `status code ${res.status}: ${res.statusText}`);
      return;
    }
    res.json().then(this.doLoadJson);
  }

  /** Sends the user to the practice menu with the loaded deck, logs an error if the input is not json */
  doLoadJson = (json: unknown) : void => {
    if(!isRecord(json)){
      this.doFetchError("load-deck", "response is not json");
      return;
    }
    this.setState({menu: "practice", flashcards: fromJson(json.value)});
  }

  /** Loads the list of saved decks */
  getDeckList = async (): Promise<number | string[]> => {
    return fetch('/api/list')
      .then(this.doListResp)
      .catch(() => this.doFetchError("list", "failed to connect to server"));
  }

  /** Checks if the list request was valid, will attempt to parse the list if it is */
  doListResp = async (res: Response) : Promise<string[] | number> => {
    if (res.status !== 200) {
      this.doFetchError("list", `status code ${res.status}: ${res.statusText}`);
      return -1;
    }
    return res.json().then(this.doListJson);
  }

  /** Attempts to parse the json as a list, will log an error if the input is not json */
  doListJson = (json: unknown) : number | string[] => {
    if(!isRecord(json)){
      this.doFetchError("list", "response is not json");
      return -1;
    }
    return deckNamesFromJson(json.decks);
  }

  /** Loads the list of saved scores */
  getScores = async (): Promise<number | Score[]> => {
    return fetch('/api/load-scores')
      .then(this.doLoadScoresResp)
      .catch(() => this.doFetchError("load-scores", "failed to connect to server"));
  }

  /** Checks if the load score request was valid, will attempt to parse the response if it is */
  doLoadScoresResp = async (res: Response) : Promise<Score[] | number> => {
    if (res.status !== 200) {
      this.doFetchError("load-scores", `status code ${res.status}: ${res.statusText}`);
      return -1;
    }
    return res.json().then(this.doLoadScoresJson);
  }

  /** Attempts to parse the json as a list of scores, will log an error and return -1 if the input is not json */
  doLoadScoresJson = (json: unknown) : number | Score[] => {
    if(!isRecord(json)){
      this.doFetchError("load-scores", "response is not json");
      return -1;
    }
    return scoresFromJson(json.value);
  }
}

/** parses the json into a boolean, throws an error if the given json is not a boolean*/
const validNameFromJson = (val : unknown) :  boolean => {
  if(typeof val !== 'boolean'){
    throw new Error(`value is not a boolean: ${typeof val}`);
  }
  return val;
}

/** Parses the json into an array of names, will throw an error if the 
 * json is not an array or if an element of the array is not a string */
const deckNamesFromJson = (val: unknown): string[] => {
  if (!Array.isArray(val)) {
    throw new Error(`value is not an array: ${typeof val}`);
  }

  const deckNames: string[] = [];
  for (const deckName of val) {
    if (typeof deckName !== 'string') {
      throw new Error(`File Name is not a string: ${typeof deckName}`);
    } else {
      deckNames.push(deckName);
    }
  }
  return deckNames;
};
/** Parses the json into an array of scores, will throw an error if the 
 * json is not an array or if an element of the array is not a Score */
const scoresFromJson = (val: unknown): Score[] => {
  if (!Array.isArray(val)) {
    throw new Error(`value is not an array: ${typeof val}`);
  }

  const scores: Score[] = [];
  for (const score of val) {
    if (!Array.isArray(score)) {
      throw new Error(`score is not an array: ${typeof score}`);
    }
    if(score.length !== 3){
      throw new Error(`score of the wrong length: ${typeof score}`);
    }
    if(typeof score[0] !== 'string' || typeof score[1] !== 'string' || typeof score[2] !== 'number'){
      throw new Error(`score is in the wrong format: [${typeof score[0]}, ${typeof score[1]}, ${typeof score[2]}]`);
    }
    scores.push({name: score[0], deck: score[1], score: score[2]});
  }
  return scores;
};