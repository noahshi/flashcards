import React, {MouseEvent} from "react";
import { Component } from "react"
import { MenuType } from "./FlashcardApp";
import "./style.css";

/** Record for managing scores. Contains the name, deck, and score*/
export type Score = {name: string, deck : string, score: number};

type ScoreProps = {
    /** function for changing menus */
    changeMenu: (newMenu : MenuType) => void;
    /** function for getting all the scores */
    getScores: () => Promise<number | Score[]>;
}

type ScoreState = {
    /** array of all the scores */
    scores? : Score[];
}

export class ScoreMenu extends Component<ScoreProps, ScoreState> {
    constructor(props: ScoreProps) {
        super(props);
    
        this.state = { };
    }
    render = (): JSX.Element => {
        return  <div>
                    <h1>Scores</h1>
                    <fieldset>{this.renderScores()}</fieldset>
                    <input type="button" onClick={this.doReturnClick} value="Back" className="button top-margin"></input>
                </div>;
    }

    /** returns to start menu */
    doReturnClick = (_event: MouseEvent<HTMLInputElement>) : void => {
        this.props.changeMenu("start");
    }

    /** Turns the array of scores into an unordered list of HTML components */
    renderScores = (): JSX.Element => {
        if (this.state.scores === undefined) {
            return <p>Loading scores...</p>;
        } if (this.state.scores.length === 0) {
            return <p>No scores to load.</p>;
        }else {
            const items : JSX.Element[] = [];
            for (const [index, item] of this.state.scores.entries()) {
                //truncates long strings to maintain a readable scores list
                const truncName = (item.name.length > 30) ? `${item.name.substring(0, 30)}...` : item.name;
                const truncDeck = (item.deck.length > 30) ? `${item.deck.substring(0, 30)}...` : item.deck;
                items.push(
                <li className="score" key={index}>
                    <p>{`${truncName},`} <b>{truncDeck}</b> {`:${Math.round(item.score)}`}</p>
                </li>);
            }
            return <ul className="saved-scores">{items}</ul>;
        }
    }

    /** gets scores when page loads */
    componentDidMount = async (): Promise<void> => {
        this.props.getScores().then(this.doLoadScoresResp);
        
    }

    /** checks if the scores array received is valid, changes the corresponding state to it if it is, otherwise, set the state value to undefined*/
    doLoadScoresResp = (val : number | Score[]) : void => {
        if(typeof val === 'number'){
            this.setState({scores: undefined});
        } else {
            this.setState({scores: val});
        }
    }
}