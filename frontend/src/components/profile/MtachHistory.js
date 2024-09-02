class MatchHistoryCard extends HTMLElement {
  constructor(history) {
    super();
    this.history = history; //history need to be an js object
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="history_card">
        <div class="RoomTypeGame">
          <img id="RoomTeamGameType" src="../../../assets/images/pong.png" width="28px" height="28px">
        </div>
        <div class="history_card_body">
          <div class="history_card_body_content">
            <div class="RoomContentCard_flex">
              <p class="RoomTeam">2v2</p>
              <p class="RoomName">mamazzal's room</p>
              <p class="RoomTime">3 min</p>
            </div>
            <p class="match_hostory_score">3 : 4 </p>
            <div class="match_hostory_left_items">
              <p class="game_status win" id="SizePlayers">WIN</p>
              <p class="game_history_host">hosted by <span style="color: var(--orchid)">mamazzal<span></p>
              <div class="RoomUsers">
                <img src="s" >
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }
}

customElements.define("match-history-card", MatchHistoryCard);

export class MatchHistory extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <h2 class="profile_titles">Match History</h2>
      <div id="match_historys"></div>
    `;
    const matchHistorysParrent = document.getElementById("match_historys");
    matchHistorysParrent.appendChild(
      new MatchHistoryCard({
        mood: "pong",
        users: [],
        winner: [],
        teamSize: 2,
        time: 3,
        scor: { winTean: 2, loseTeam: 1 },
      })
    );
    matchHistorysParrent.appendChild(
      new MatchHistoryCard({
        mood: "pong",
        teamSize: 2,
        time: 3,
      })
    );
  }
}

customElements.define("match-history", MatchHistory);
