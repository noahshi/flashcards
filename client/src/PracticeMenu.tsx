import React from "react";
import { Component, MouseEvent } from "react"
import { Flashcard } from "./flashcard";
import { MenuType } from "./FlashcardApp";

type PracticeProps = {
    /** function for changing the menu */
    changeMenu : (menu : MenuType) => void;
    /** function for saving the final score to the server */
    saveScore : (name : string, deck : string, score : number) => Promise<number>;
    /** name of the flashcard deck */
    name : string;
    /** array of the flashcard deck cards */
    deck : Flashcard[];
}

type PracticeState = {
    /** name of the flashcard deck */
    name : string;
    /** current card number */
    index : number;
    /** array of the flashcards */
    flashcards : Flashcard[];
    /** number of correct answers */
    correct : number;
    /** number of incorrect answers */
    incorrect : number;
    /** button to click when correct */
    correctButton : JSX.Element;
    /** button to click when incorrect */
    incorrectButton : JSX.Element;
    /** indexes of the incorrectly answered flashcards */
    missedCards : number[];
    /** feedback text for when score save fails */
    saveResp : JSX.Element;
}

export class PracticeMenu extends Component<PracticeProps, PracticeState> {
    constructor(props: PracticeProps) {
        super(props);
    
        this.state = { name : this.props.name, index : 0, flashcards : this.props.deck, correct : 0, incorrect : 0, saveResp : <h2></h2>, missedCards : [],
                        correctButton: <input type="button" onClick={this.doCorrectClick} value="Correct" id='correct' className="button top-margin-reduced"></input>,
                        incorrectButton: <input type="button" onClick={this.doIncorrectClick} value="Incorrect" id='incorrect' className="button top-margin-reduced"></input>};
    }

    render = (): JSX.Element => {
        if(this.state.flashcards.length > 0){
            return  <div>
                        <h1>{this.state.name}</h1>
                        <h2>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h2>
                        {this.renderCard()}
                    </div>;
        } else {
            return  <div>
                        <h2 className="error">Error: Failed to load flashcard deck</h2>
                        <input type="button" onClick={this.doReturnClick} value="Back" className="button"></input>
                    </div>;
        }
    }

    /** returns to start menu */
    doReturnClick = (_event: MouseEvent<HTMLInputElement>) : void => {
        this.props.changeMenu("start");
    }

    /** transition before moving to next flashcard to make switching between cards smoother */
    doNextCardClick = (_event: MouseEvent<HTMLInputElement>) : void => {
        const card = document.getElementById("card");
        card?.classList.toggle('spin');
        this.setState({correctButton : <input type="button" onClick={this.doCorrectClick} value="Correct" id='correct' className="button top-margin-reduced" disabled></input>,
                        incorrectButton : <input type="button" onClick={this.doIncorrectClick} value="Incorrect" id='incorrect' className="button top-margin-reduced" disabled></input>});
        card?.addEventListener('transitionend', this.setNextCard, {once : true});
    }

    /** moves to next flashcard */
    setNextCard = () : void => {
        if(this.state.index < this.state.flashcards.length - 1){
            this.setState({index : this.state.index + 1});
        } else {
            this.setState({index : -1});
        }
        this.setState({correctButton : <input type="button" onClick={this.doCorrectClick} value="Correct" id='correct' className="button top-margin-reduced" disabled={false}></input>,
                        incorrectButton : <input type="button" onClick={this.doIncorrectClick} value="Incorrect" id='incorrect' className="button top-margin-reduced" disabled={false}></input>});
        
    }

    /** renders the current flashcard as an HTML element */
    renderCard = () : JSX.Element => {
        if(this.state.index >= this.state.flashcards.length){
            //error state: attempted to render a card that doesnt exists
            console.log(`index out of bounds: attempted to render card at index ${this.state.index} for array length ${this.state.flashcards.length}`);
            return  <div>
                        <h2 className="error">Error: Attempted to render a nonexistent card</h2>
                        <input type="button" onClick={this.doReturnClick} value="Back" className="button top-margin"></input>
                    </div>;

        } else if (this.state.index < 0){
            //end state: ask for name and save score
            return  <div>
                        <p>Enter your name:</p>
                        <textarea id="name" rows={1} cols={40}></textarea><br/>
                        <input type="button" onClick={this.doSaveClick} value="Save" className="button top-margin-reduced"></input> 
                        {this.state.saveResp}
                        <h2>Missed Cards:</h2>
                        {this.renderMissedCards()}
                    </div>;
        } else {
            //normal state: renders flashcard
            return <div>
                        <div className="card" id="card" key={this.state.index} onClick={this.doFlipClick}>
                            <div className="card-front">
                                <p className="card-text">{this.state.flashcards[this.state.index].vocab}</p>
                            </div>
                            <div className="card-back">
                                <p className="card-text">{this.state.flashcards[this.state.index].definition}</p>
                            </div>
                        </div>
                        <div className="button-container">
                            <div>
                                {this.state.correctButton}
                                {this.state.incorrectButton}
                            </div>
                            <div>
                                <input type="button" onClick={this.doReturnClick} value="Quit" className="button top-margin quit"></input>
                            </div>
                        </div>
                    </div>;
        }
    }

    /** renders all missed cards as an unordered list */
    renderMissedCards = () : JSX.Element => {
        if(this.state.missedCards.length === 0){
            return <p>None!</p>
        }
        const missedCards : JSX.Element[] = [];
        for(const index of this.state.missedCards){
            missedCards.push(
            <div className="card" id="card" key={index + this.state.flashcards.length} onClick={this.doFlipClick}>
                <div className="card-front">
                    <p className="card-text">{this.state.flashcards[index].vocab}</p>
                </div>
                <div className="card-back">
                    <p className="card-text">{this.state.flashcards[index].definition}</p>
                </div>
            </div>);
        }
        return <ul className="missed-cards">{missedCards}</ul>;
    }

    /** flips the flashcard when clicked */
    doFlipClick = (_event: MouseEvent<HTMLDivElement>) : void => {
        _event.currentTarget.classList.toggle('flipped');
    }
    
    /** increments the correct value before moving on to the next card */
    doCorrectClick = (_event: MouseEvent<HTMLInputElement>) : void => {
        this.setState({correct : this.state.correct + 1});
        this.doNextCardClick(_event);
    }

    /** increments the incorrect value before moving on to the next card */
    doIncorrectClick = (_event: MouseEvent<HTMLInputElement>) : void => {
        this.state.missedCards.push(this.state.index);
        this.setState({incorrect : this.state.incorrect + 1});
        this.doNextCardClick(_event);
    }

    /** saves current attempt score with name and deck name */
    doSaveClick = (_event: MouseEvent<HTMLInputElement>) : void => {
        const name = document.querySelector<HTMLTextAreaElement>('#name')?.value.trim();
        const score = this.state.correct/(this.state.correct + this.state.incorrect) * 100;
        if(typeof name === 'undefined' || name == ''){
            this.setState({saveResp : <h2 className="error">Error: Name cannot be empty</h2>});
            return;
        }
        this.props.saveScore(name, this.state.name, score).then(this.doSaveResp);
    }

    /** checks if the save request was valid, opens scores menu if it is */
    doSaveResp = (val : number) : void => {
        if(val === -4){
            this.setState({saveResp : <h2 className="error">Error: Name cannot be empty</h2>});
        } else if(val === -1){
            this.setState({saveResp : <h2 className="error">Error: Saved failed, try again later</h2>});
        } else {
            this.props.changeMenu("scores");
        }
    }
}