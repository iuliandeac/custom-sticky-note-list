class CustomStickyNote extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    const style = document.createElement('style');
    const title = document.createElement('h3');
    const body = document.createElement('p');
    const dueDate = document.createElement('p');
    const doneButton = document.createElement('button');
    const container = document.createElement('div');

    title.classList.add('title');
    body.classList.add('body');
    dueDate.classList.add('due-date');
    doneButton.classList.add('done-button');
    doneButton.innerHTML = '✔';
    container.classList.add('container');

    style.textContent = `
      .container {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
      }
      .custom-sticky-note {
        display: inline-block;
        width: var(--custom-sticky-note-width, 200px);
        background-color: ${this.getAttribute('color') || '#ffeb3b'};
        padding: 10px;
        border-radius: 10px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        font-family: var(--custom-sticky-note-font, 'Comic Sans MS', cursive, sans-serif);
        font-size: var(--custom-sticky-note-font-size, 16px);
        color: #333;
        position: relative;
        overflow: hidden;
        text-align: ${this.getAttribute('alignment') || 'left'};
        cursor: pointer;
      }
      .custom-sticky-note .title {
        margin: 0;
        padding: 0;
        font-size: 1.2em;
      }
      .custom-sticky-note .body,
      .custom-sticky-note .due-date {
        margin: 0;
        padding: 0;
      }
      .custom-sticky-note.minimized .body,
      .custom-sticky-note.minimized .due-date {
        display: none;
      }
      .done-button {
        background-color: white;
        color: #4caf50;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: var(--custom-sticky-note-font-size, 16px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 10px;
        font-family: var(--custom-sticky-note-font, 'Comic Sans MS', cursive, sans-serif);
        box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
      }
      .custom-sticky-note.done .title {
        text-decoration: line-through;
      }
      .custom-sticky-note.done .done-button {
        display: none;
      }
    `;

    wrapper.classList.add('custom-sticky-note');
    wrapper.append(title, body, dueDate);
    container.append(wrapper, doneButton);

    this.shadowRoot.append(style, container);

    wrapper.addEventListener('click', (e) => {
      if (e.target !== doneButton) {
        wrapper.classList.toggle('minimized');
      }
    });

    doneButton.addEventListener('click', (e) => {
      const done = this.getAttribute('done') === 'true';
      this.setAttribute('done', !done);
      wrapper.classList.toggle('done', !done);
      wrapper.classList.add('minimized', !done);
      doneButton.style.display = done ? 'flex' : 'none';
      this.dispatchEvent(new CustomEvent('update', {
        detail: {
          title: this.getAttribute('title'),
          done: !done
        }
      }));
      e.stopPropagation();
    });
  }

  static get observedAttributes() {
    return ['done', 'title', 'body', 'due_date', 'color', 'alignment'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != newValue) {
      const wrapper = this.shadowRoot.querySelector('.custom-sticky-note');
      const title = this.shadowRoot.querySelector('.title');
      const body = this.shadowRoot.querySelector('.body');
      const dueDate = this.shadowRoot.querySelector('.due-date');
      const doneButton = this.shadowRoot.querySelector('.done-button');
      if (name === 'done') {
        wrapper.classList.toggle('done', newValue === 'true');
        wrapper.classList.toggle('minimized', newValue === 'true');
        doneButton.style.display = newValue === 'true' ? 'none' : 'flex';
      } else if (name === 'title') {
        title.textContent = newValue;
      } else if (name === 'body') {
        body.textContent = newValue;
      } else if (name === 'due_date') {
        dueDate.textContent = `Due date: ${newValue}`;
      } else if (name === 'color') {
        wrapper.style.backgroundColor = newValue;
      } else if (name === 'alignment') {
        wrapper.style.textAlign = newValue;
      }
    }
  }
}

class CustomStickyNoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    const style = document.createElement('style');
    const controls = document.createElement('div');
    const showAllButton = document.createElement('button');
    const showDoneButton = document.createElement('button');
    const showNotDoneButton = document.createElement('button');

    controls.classList.add('controls');
    showAllButton.textContent = 'All';
    showDoneButton.textContent = 'Done';
    showNotDoneButton.textContent = 'In progress';

    style.textContent = `
      .custom-sticky-note-list {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .controls {
        margin-top: 10px;
      }
      .controls button {
        margin: 5px;
        padding: 10px;
        font-size: var(--custom-sticky-note-font-size, 16px);
        cursor: pointer;
        background-color: white;
        border: 2px solid #ccc;
        border-radius: 10px;
        font-family: var(--custom-sticky-note-font, 'Comic Sans MS', cursive, sans-serif);
        box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
      }
    `;

    wrapper.classList.add('custom-sticky-note-list');
    controls.append(showAllButton, showDoneButton, showNotDoneButton);
    wrapper.appendChild(controls);

    this.shadowRoot.append(style, wrapper);

    showAllButton.addEventListener('click', () => this.filterNotes('all'));
    showDoneButton.addEventListener('click', () => this.filterNotes('done'));
    showNotDoneButton.addEventListener('click', () => this.filterNotes('not-done'));
  }

  connectedCallback() {
    this.notes = JSON.parse(this.getAttribute('notes') || '[]');
    this.noteWidth = this.getAttribute('note-width') || '200px';
    this.noteFont = this.getAttribute('note-font') || 'Comic Sans MS, cursive, sans-serif';
    this.noteFontSize = this.getAttribute('note-font-size') || '16px';
    this.renderNotes();
  }

  renderNotes() {
    const wrapper = this.shadowRoot.querySelector('.custom-sticky-note-list');
    wrapper.querySelectorAll('custom-sticky-note').forEach(note => note.remove());

    this.notes.forEach(note => {
      const noteElement = document.createElement('custom-sticky-note');
      noteElement.setAttribute('title', note.title);
      noteElement.setAttribute('body', note.body);
      noteElement.setAttribute('due_date', note.due_date);
      noteElement.setAttribute('done', note.done);
      noteElement.setAttribute('color', note.color);
      noteElement.setAttribute('alignment', note.alignment);
      noteElement.style.setProperty('--custom-sticky-note-width', this.noteWidth);
      noteElement.style.setProperty('--custom-sticky-note-font', this.noteFont);
      noteElement.style.setProperty('--custom-sticky-note-font-size', this.noteFontSize);

      noteElement.addEventListener('update', (e) => {
        const updatedNote = this.notes.find(n => n.title === e.detail.title);
        if (updatedNote) {
          updatedNote.done = e.detail.done;
        }
      });

      wrapper.insertBefore(noteElement, wrapper.lastChild);
    });
  }

  filterNotes(filter) {
    const notes = this.shadowRoot.querySelectorAll('custom-sticky-note');
    notes.forEach(note => {
      const isDone = note.getAttribute('done') === 'true';
      if (filter === 'all') {
        note.style.display = 'block';
      } else if (filter === 'done' && isDone) {
        note.style.display = 'block';
      } else if (filter === 'not-done' && !isDone) {
        note.style.display = 'block';
      } else {
        note.style.display = 'none';
      }
    });
  }
}

customElements.define('custom-sticky-note', CustomStickyNote);
customElements.define('custom-sticky-note-list', CustomStickyNoteList);