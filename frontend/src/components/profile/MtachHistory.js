class MatchHistoryCard extends HTMLElement {
  constructor(data) {
    super();
    this.data = data; //data need to be an js object
  }

  connectedCallback() {
    this.innerHTML = `
      //game history card here
    `
  }
}

customElements.define("match-history-card", MatchHistory);

export class MatchHistory extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <h2 class="profile_titles">Match History</h2>
      <div id="match_historys"></div>
    `
  }
}