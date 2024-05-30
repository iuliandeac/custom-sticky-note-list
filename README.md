# custom-sticky-note-list
Custom sticky note list is a simple "to-do" like UI element showing a list of sticky notes, with the possibility to mark them as done. There are also filtering options:
- All = sticky notes, regardless of their status
- Done = sticky notes that have the "done" property set to true
- In progress = sticky notes that have the "done" property set to false

## Install

Add custom-sticky-note-list to your project:
```
npm i @wcd/iuliandeac.custom-sticky-note-list
```

## Usage

Import into your module script:
```javascript
import { CustomStickyNoteList } from "custom-sticky-note-list"
```

or add to your html page:
```html
	<script src="path/custom-sticky-note-list.js"></script>
```

## Use it in your HTML
```html
<custom-sticky-note-list></custom-sticky-note-list>
```

## Component API
### Properties
#### note-width ###
The width of a sticky note. Default is 200px.
```html
<custom-sticky-note-list note-width=200px></custom-sticky-note-list>
```

#### note-font ####
The font of the text used for all sticky notes and buttons. Default is Comic Sans MS, cursive, sans-serif.
```html
<custom-sticky-note-list note-font="Times New Roman"></custom-sticky-note-list>
```

#### note-font-size ####
The size of the font used for all sticky notes. Default is 16px.
```html
<custom-sticky-note-list note-font-size=18px></custom-sticky-note-list>
```

#### notes ####
Sticky notes to display, in JSON Array format. Default is empty
```html
<custom-sticky-note-list notes='[
    {"title": "Shopping", "body": "Buy milk and eggs", "due_date": "2024-06-01", "done": false, "color": "#ffcc80", "alignment": "left"},
    {"title": "Meeting", "body": "Project meeting at 10 AM", "due_date": "2024-05-29", "done": false, "color": "#ff0000", "alignment": "center"},
    {"title": "Exercise", "body": "Morning yoga session", "due_date": "2024-05-28", "done": true, "color": "#80deea", "alignment": "right"}
  ]'></custom-sticky-note-list>
```
Object format that needs to be sent:
```javascript
{
  title: string, // Default: New note
  body: string, // Default: empty
  due_date: string, // Default: empty
  done: boolean, // Default: false
  color: HEX, // Default: #ffeb3b
  alignment: string ["start", "end", "left", "right", "center", "justify"] // Default: left
}
```

### Events
#### "click" event on sticky note item ####
This event listener toggles the minimized class on the wrapper when the wrapper is clicked, unless the click is on the doneButton.

#### "click" event on sticky note item ####
This event listener updates the done state of the sticky note, toggles classes accordingly, and dispatches a custom 'update' event.

### "attribute change callback" event ###
This lifecycle callback responds to changes in observed attributes and updates the corresponding DOM elements accordingly.
Observed attributes are 'done', 'title', 'body', 'due_date', 'color', 'alignment'.

#### "click" event on show all button ####
This event listener filters the notes to show all notes when the showAllButton is clicked.

#### "click" event on show done button ####
This event listener filters the notes to show only done notes when the showDoneButton is clicked.

#### "click" event on show in progress button ####
This event listener filters the notes to show only not-done notes when the showNotDoneButton is clicked.

#### "connected callback" event ####
This lifecycle callback initializes the component, parses the notes from the attribute, and calls the renderNotes method to display the notes at initialization and when reacting to changes in the attributes of sticky notes.





