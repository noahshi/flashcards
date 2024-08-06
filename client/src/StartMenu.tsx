import React, {MouseEvent} from "react";
import { Component } from "react"
import { MenuType } from "./FlashcardApp";
import "./style.css";

type StartProps = {
    /** Function for changing menus */
    changeMenu: (newMenu : MenuType) => void;
    /** function for setting name of deck about to be loaded into the practice menu */
    setName: (name : string) => void;
    /** loads a deck into the practice menu */
    loadDeck : (name : string) => void;
    /** gets the names of all the decks */
    getDeckList : () => Promise<number | string[]>;
}

type StartState = {
  /** list of names of all the decks */
  decks?: string[];
}

export class StartMenu extends Component<StartProps, StartState> {
    constructor(props: StartProps) {
        super(props);
    
        this.state = { };
    }

    render = (): JSX.Element => {
        return <div className="start-menu">
                    <h2>Flashcard Practicer 4000</h2>
                    <input type="button" onClick={this.doCreateClick} value="Create Flashcards" className="button top-margin"></input>
                    <fieldset><legend>Saved Flashcard Decks</legend>{this.renderDecks()}</fieldset>
                    <input type="button" onClick={this.doScoresClick} value="View Scores" className="button top-margin"></input>
                </div>;
    }

    /** opens the create menu */
    doCreateClick = (_event : MouseEvent<HTMLInputElement>) : void => {
        this.props.changeMenu("create");
    }

    /** attempts to load the practice menu with deck with the same name as the element clicked on */
    doLoadClick = (event : MouseEvent<HTMLAnchorElement>) : void => {
        this.props.setName(event.currentTarget.text);
        this.props.loadDeck(event.currentTarget.text);
    }

    /** opens the scores menu */
    doScoresClick = (_event : MouseEvent<HTMLInputElement>) : void => {
        this.props.changeMenu("scores");
    }

    /** Turns the array of deck names into an unordered list of HTML components */
    renderDecks = (): JSX.Element => {
        if (this.state.decks === undefined) {
            return <p>Loading decks...</p>;
        } if (this.state.decks.length === 0) {
            return <p>No decks to load.</p>    
        }else {
            const items : JSX.Element[] = [];
            for (const [index, item] of this.state.decks.entries()) {
                items.push(
                <li className="deck" key={index}>
                    <a href="#" onClick={this.doLoadClick}>{item}</a>
                </li>);
        }
            return <ul className="saved-decks">{items}</ul>;
        }
    };

    /** loads list of deck names when page opens */
    componentDidMount = async (): Promise<void> => {
        this.props.getDeckList().then(this.doListResp);
        
    }

    /** checks if the deck names array received is valid, 
     * changes the corresponding state value to it if it is, 
     * otherwise, set the state value to undefined */
    doListResp = (val : number | string[]) : void => {
        if(typeof val === 'number'){
            this.setState({decks: undefined});
        } else {
            this.setState({decks: val});
        }
    }
}