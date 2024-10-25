export default class NoteCardComponent extends HTMLElement {

    constructor() {
        super()

        this.attachShadow({ mode: 'open' });

        this.load();

        this.loaded = false;
    }

    static get observedAttributes() {
        return ['title', 'content', 'favorite', 'color', 'date', 'mode'];
    }

    static style = null;

    async load() {
        if (!NoteCardComponent.style) {
            const cssText = await fetch('http://localhost:3000/css/notecard.css?inline');

            const styleSheet = new CSSStyleSheet();

            styleSheet.replaceSync(await cssText.text());

            NoteCardComponent.style = styleSheet;
        }
        
        this.shadowRoot.adoptedStyleSheets = [NoteCardComponent.style];

        this.init()
    }

    init() {
        const article = document.createElement('article');
        const header = document.createElement('header');
        const main = document.createElement('main');
        const footer = document.createElement('footer');

        const title = document.createElement('input');
        const content = document.createElement('textarea');
        const date = document.createElement('span');
        const button = document.createElement('button');

        title.setAttribute('type', 'text');
        title.setAttribute('placeholder', 'Titre');
        title.setAttribute('name', 'title');
        title.className = 'title';

        content.setAttribute('placeholder', 'Contenu');
        content.setAttribute('name', 'content');
        content.className = 'content';

        date.className = 'date';

        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
        `;
        button.className = 'edit';

        header.append(title);
        main.append(content);
        footer.append(date, button);

        article.append(header, main, footer);

        button.addEventListener('click', () => {
            this.setAttribute('mode', 'edit');
        })

        this.shadowRoot.append(article);

        this.build()
    }

    build() {
        const title = this.getAttribute('title');
        const content = this.getAttribute('content');
        const date = this.getAttribute('date');

        this.shadowRoot.querySelector('.title').value = title;
        this.shadowRoot.querySelector('.content').value = content;
        this.shadowRoot.querySelector('.date').textContent = date;

        
        if(this.getAttribute('mode') === 'edit') {
            this.shadowRoot.querySelector('.title').removeAttribute('readonly');
            this.shadowRoot.querySelector('.content').removeAttribute('readonly');

            document.addEventListener('click', (event) => {
                if (!this == event.target) {
                    const id = this.getAttribute('id');

                    fetch('http://localhost:3000/note/update', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: this.shadowRoot.querySelector('.title').value,
                            content: this.shadowRoot.querySelector('.content').value,
                            id: id
                        })
                    }).then(() => {
                        this.setAttribute('mode', 'view');
                    })
                }
            });
        } else {
            this.shadowRoot.querySelector('.title').setAttribute('readonly', '');
            this.shadowRoot.querySelector('.content').setAttribute('readonly', '');
        }

        if(!this.loaded) this.loaded = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {

        console.log(name, oldValue, newValue)

        if(!this.loaded) return;

        if (NoteCardComponent.observedAttributes.includes(name) && oldValue && !newValue || NoteCardComponent.observedAttributes.includes(name)) {
            this.build();
        }
    }
}

customElements.define('note-card', NoteCardComponent);