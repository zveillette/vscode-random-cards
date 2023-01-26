# zv-random-cards

A small extension to randomly pick cards from a deck. 
Also a great way to stretch between coding sessions as the cards can be changed for small exercises.

## Features

- Randomly pick cards from predefined or custom decks
- Enable/Disable automatic card pick and set the interval
- Change the deck to be small training exercices to take a break and strech between your coding sessions
- Cards can be stacked into a pile to avoid missing them when they are picked automatically

## Creating your own deck

Use the following format to create your deck. Note that a card will be created for each card type.

```json
[{
    "name": "my deck",
    "cards": [{
        "name": "my card",
        "points": 1
    }],
    "cardTypes": [{
        "name": "my card type",
        "weight": 2
    }]
}]
```
