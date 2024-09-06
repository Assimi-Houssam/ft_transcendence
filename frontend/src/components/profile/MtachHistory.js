export class MatchHistoryCard extends HTMLElement {
  constructor(history) {
    super();
    this.history = history; //type => js obkect
    this.classList.add("RoomListContainerBtn")
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="Room">
      <div class="RoomTypeGame">
        <img id="RoomTeamGameType" src="../../../assets/images/pong.png" width="28px" height="28px">
      </div>
      <div class="RoomContent">
          <div class="RoomContentCard">
              <div class="RoomContentCard_flex">
                  <div class="RoomTeam">
                      <p id="RoomTeamSize">2v2</p>
                  </div>
                  <div class="RoomName">
                      <p id="RoomTitleName">mamazzal's room</p>
                  </div>
                  <div class="RoomTime">
                      <p id="RoomTeamTime">3 min</p>
                  </div>
              </div>
              <div class="RoomContentCard_flex _RoomContentCard_flex_left">
                  <div class="RoomPlayer">
                      <p id="SizePlayers">WIN</p>
                  </div>
                  <div class="RoomHosted">
                      <p>hosted by <span style="color: var(--orchid)">mamazzal<span></p>
                  </div>
                  <div class="RoomUsers"> <img src="img" > </div>
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
