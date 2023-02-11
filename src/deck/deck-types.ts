import { Config } from "../state/config";
import { DeckType } from "./deck-type";

export const getDeckTypes = (config: Config) => {
    return {
        standard: new DeckType(
            'standard',
            [
                { name: 'A', points: 11 },
                { name: '2', points: 2 },
                { name: '3', points: 3 },
                { name: '4', points: 4 },
                { name: '5', points: 5 },
                { name: '6', points: 6 },
                { name: '7', points: 7 },
                { name: '8', points: 8 },
                { name: '9', points: 9 },
                { name: '10', points: 10 },
                { name: 'J', points: 10 },
                { name: 'Q', points: 10 },
                { name: 'K', points: 10 },
            ],
            [{ name: 'Clubs', icon: 'filter-filled' }, { name: 'Diamonds', icon: 'debug-breakpoint-log' }, { name: 'Hearts', icon: 'heart' }, { name: 'Spades', icon: 'debug-breakpoint-function' }]
        ),
        training: new DeckType(
            'training',
            [
                { name: 'A', points: 11 },
                { name: '2', points: 2 },
                { name: '3', points: 3 },
                { name: '4', points: 4 },
                { name: '5', points: 5 },
                { name: '6', points: 6 },
                { name: '7', points: 7 },
                { name: '8', points: 8 },
                { name: '9', points: 9 },
                { name: '10', points: 10 },
                { name: 'J', points: 10 },
                { name: 'Q', points: 10 },
                { name: 'K', points: 10 },
            ],
            [
                { name: 'Jumping Jacks', weight: 2 },
                { name: 'Sit-ups', weight: 2 },
                { name: 'Squats', weight: 1.5 },
                { name: 'Push-ups', weight: 1 },
            ]
        ),
        ...getCustomDecks(config)
    } as { [name: string]: DeckType };
};

const getCustomDecks = (config: Config) => {
    return config.customDecks.reduce((decks, deck) => {
        if (!deck.name) {
            return decks;
        }

        decks[deck.name] = new DeckType(deck.name, deck.cards, deck.cardTypes);
        return decks;
    }, {} as { [name: string]: DeckType });
};
