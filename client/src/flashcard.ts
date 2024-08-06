/** Flashcard type. vocab is the front side, definition is the back side */
export type Flashcard = {readonly vocab: string, readonly definition: string};

/**
 * Creates and returns a flashcard record with the given front and back 
 * @param vocab text to put on the front
 * @param defintion text to put on the back
 * @returns flashcard record with the given text
 */
export const createFlashcard = (vocab : string, defintion : string) : Flashcard => {
    return {vocab : vocab, definition : defintion};
}

/**
 * Converts an array of flashcards to JSON
 * @param cards card array to convert
 * @returns card array in JSON format
 */
export const toJson = (cards : Flashcard[]) : unknown => {
    const cardArray : unknown[] = [];
    for(const card of cards) {
        cardArray.push([card.vocab, card.definition]);
    }
    return cardArray;
}

/**
 * Converts JSON into an array of flashcards
 * @param data data to convert
 * @returns equivalent array of flashcards
 * @throws Error if the given data is not an array
 * @throws Error if the elements of the array cannot be converted into flashcards
 */
export const fromJson = (data : unknown) : Flashcard[] => {
    if(Array.isArray(data)){
        const cardArray : Flashcard[] = [];
        for(const card of data){
            cardArray.push(cardFromJson(card));
        }
        return cardArray;
    } else {
        throw new Error(`type ${typeof data} is not a valid flashcard deck`);
    }
}

/**
 * Converts JSON to a flashcard
 * @param data data to convert
 * @returns flashcard equivalent of the given data
 * @throws Error if the data given is not an array
 * @throws Error if the given data is not an array of length 2, 
 * where both elements are strings
 */
export const cardFromJson = (data : unknown) : Flashcard => {
    if(!Array.isArray(data)){
        throw new Error(`type ${typeof data} is not a valid flashcard`);
    }

    if(data.length === 2 && typeof data[0] === 'string' &&  typeof data[1] === 'string'){
        return createFlashcard(data[0], data[1]);
    } else {
        throw new Error('invalid flashcard format');
    }
}