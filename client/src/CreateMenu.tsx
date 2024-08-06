import React, { MouseEvent } from "react";
import { Component } from "react"
import { MenuType } from "./FlashcardApp";
import { Flashcard, createFlashcard, toJson } from "./flashcard";
import "./style.css";

type CreateProps = {
    /** function for checking if the input name is in use */
    checkValidName: (name: string) => Promise<number | boolean>;
    /** function for saving the deck to the server */
    saveDeck: (name: string, json : unknown) => Promise<number>;
    /** function for changing menus */
    changeMenu: (newMenu : MenuType) => void;
}

type CreateState = {
    /** name of the deck being created */
    name? : string;
    /** flashcards of the deck being created */
    deck? : Flashcard[];
    /** feedback text for when deck save fails */
    saveResponse : JSX.Element;
    /** saves name of unfinished deck */
    nameField: string;
    /** saves cards of unfinished deck */
    cardField: string;
}

export class CreateMenu extends Component<CreateProps, CreateState> {
    constructor(props: CreateProps) {
        super(props);
    
        this.state = { nameField : "", cardField : "", saveResponse : <h2></h2> };
    }

    render = (): JSX.Element => {
        return <div>
                    <h1>Create a Flashcard Deck</h1>
                    <p>Name:</p>
                    <textarea id="name" rows={1} cols={40} onChange={this.doNameChange} defaultValue={this.state.nameField}></textarea>
                    <p>Cards (one per line formatted front|back)</p>
                    <textarea id="cards" rows={10} cols={40} onChange={this.doCardsChange} defaultValue={this.state.cardField}></textarea><br/>
                    <input type="button" onClick={this.doSaveClick} value="Save" className="button"></input>
                    <input type="button" onClick={this.doReturnClick} value="Back" className="button"></input>
                    {this.state.saveResponse}
                </div>;
    }

    /** attempts to saves deck to server. Checks for the following errors: no name, no cards, invalid cards */
    doSaveClick = async (_event: MouseEvent<HTMLInputElement>) : Promise<void> => {
        const name = document.querySelector<HTMLTextAreaElement>('#name')?.value.trim();
        const text = document.querySelector<HTMLTextAreaElement>('#cards')?.value.trim();
        
        //NO NAME ERROR
        if(typeof name === 'undefined' || name === ""){
            this.setState({saveResponse : <h2 className="error">Error: Name cannot be empty</h2>});
            return;
        }
        
        //NO CARDS ERROR
        if (typeof text === 'undefined' || text === "") {
            this.setState({saveResponse : <h2 className="error">Error: No cards to save</h2>});
            return;
        }
        const deck = textToFlashcardDeck(text);

        //INVALID CARDS ERROR
        if(deck.length === 0){
            this.setState({saveResponse : <h2 className="error">Error: Invalid Cards</h2>});
            return;
        }
        this.setState({saveResponse : <h2>Checking name availability...</h2>, name: name, deck: deck});
        this.props.checkValidName(name).then(this.doSave1Resp);
            
    }
    
    /** part 2 of function that saves deck to server. Checks for the following errors: server down, name already taken */
    doSave1Resp = async (val : number | boolean) : Promise<void> => {
        //FAILED TO CONNECT TO SERVER ERROR
        if(typeof val === 'number'){
            this.setState({saveResponse : <h2 className="error">Error: Failed to connect to server</h2>});
            return;
        }

        //NAME TAKEN ERROR
        if(!val){
            this.setState({saveResponse : <h2 className="error">Error: Name already in use</h2>});
            return;
        }
                            //these values should not be null at this point, written to make linter happy
        this.props.saveDeck(this.state.name ?? "", toJson(this.state.deck ?? [])).then(this.doSave2Resp);
        
    }

    /** part 3 of function that saves deck to server. Catches save function failing error */
    doSave2Resp = async (val : number) : Promise<void> => {
        //SAVE FAILED
        if(val === -1){
            this.setState({saveResponse : <h2 className="error">Error: Saved failed, try again later</h2>});
            return;
        }

        //DECK SAVED
        this.setState({saveResponse : <h2 className="success">Deck Saved!</h2>});
        if (typeof(Storage) !== "undefined") {
            localStorage.removeItem("name");
            localStorage.removeItem("cards");
        }
    }

    /** returns to start menu */
    doReturnClick = (_event: MouseEvent<HTMLInputElement>) : void => {
        this.props.changeMenu("start");
    }

    /** called when name textarea is changed, saves new value to localStorage, will also save cards textarea to localStorage, it is isn't already */
    doNameChange = () : void => {
        if (typeof(Storage) !== "undefined") {
            const name = document.querySelector<HTMLTextAreaElement>('#name')?.value.trim();
            if(typeof name !== 'undefined') {
                localStorage.setItem("name", name);
            }
            if(localStorage.getItem("cards") === null){
                this.doCardsChange();
            }
        }
    }

    /** called when cards textarea is changed, saves new value to localStorage, will also save name textarea to localStorage, it is isn't already */
    doCardsChange = () : void => {
        if (typeof(Storage) !== "undefined") {
            const text = document.querySelector<HTMLTextAreaElement>('#cards')?.value.trim();
            if(typeof text !== 'undefined') {
                localStorage.setItem("cards", text);
            }
            if(localStorage.getItem("name") === null){
                this.doNameChange();
            }
        }
    }

    /** loads saved name and cards values from local storage if they exist */
    componentDidMount = async (): Promise<void> => {
        if (typeof(Storage) !== "undefined") {
            const storedName = localStorage.getItem("name");
            if(storedName !== null){
                this.setState({nameField : storedName});
            }

            const storedText = localStorage.getItem("cards");
            if(storedText !== null){
                this.setState({cardField : storedText});
            }
        }
    }
}

/** converts cards textarea into an array of flashcards, returns empty array if input is in the wrong format */
const textToFlashcardDeck = (text : string) : Flashcard[] => {
    const cards : string[] = text.split('\n');
    const deck : Flashcard[] = [];
    for(const card of cards){
        const split : string[] = card.split('|');
        if(split.length != 2){
            return [];
        }
        if(split[0] === "" || split[1] === ""){
            return [];
        }
        deck.push(createFlashcard(split[0], split[1]));
    }
    return deck;
}