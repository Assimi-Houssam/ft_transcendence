export class SettingsPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <h1>Settings Page</h1>
        `;
    }
}

customElements.define('settings-page', SettingsPage);