import ApiWrapper from "../../utils/ApiWrapper.js"
import { router } from "../../routes/routes.js";

export class MatchHistoryCard extends HTMLElement {
  constructor(roomData, userId = 0) {
    super();
    this.roomData = roomData;
    this.userId = Number(router.route.params["userID"]);
    this.classList.add("RoomListContainerBtn")
  }

  connectedCallback() {
    let userTeam = "";
    for (let red_team_entry of this.roomData.red_team) {
      if (red_team_entry.id === this.userId) {
        userTeam = "red";
        break;
      }
    }
    for (let blue_team_entry of this.roomData.blue_team) {
      if (blue_team_entry.id === this.userId)
        userTeam = "blue";
    } 

    let leftScore = "";
    let rightScore = "";
    let winCondition = null;
    if (userTeam === "red") {
      leftScore = this.roomData.red_team_score;
      rightScore = this.roomData.blue_team_score;
    }
    else {
      leftScore = this.roomData.blue_team_score;
      rightScore = this.roomData.red_team_score;
    }
    if (userTeam === "red") {
      if (this.roomData.red_team_score > this.roomData.blue_team_score)
        winCondition = "WIN";
      else if (this.roomData.red_team_score < this.roomData.blue_team_score)
        winCondition = "LOSS";
      else
        winCondition = "DRAW";
    }
    if (userTeam === "blue") {
      if (this.roomData.blue_team_score > this.roomData.red_team_score)
        winCondition = "WIN";
      else if (this.roomData.blue_team_score < this.roomData.red_team_score)
        winCondition = "LOSS";
      else
        winCondition = "DRAW";
    }
    this.innerHTML = `
    <div class="Room">
      <div class="RoomTypeGame">
        <img id="RoomTeamGameType" src="${this.roomData.gamemode === "pong" ? "../../../assets/images/pong.png" : "../../../assets/images/hockey.png"}" width="28px" height="28px">
      </div>
      <div class="RoomContent">
          <div class="RoomContentCard">
              <div class="RoomContentCard_flex">
                  <div class="RoomTeam">
                      <p id="RoomTeamSize">${this.roomData.team_size === 1 ? "1v1" : "2v2"}</p>
                  </div>
                  <div class="RoomName">
                      <p id="RoomTitleName">${this.roomData.room_name}</p>
                  </div>
                  <div class="RoomTime">
                      <p id="RoomTeamTime">${this.roomData.time} min</p>
                  </div>
              </div>
              <div class="history_score">
                ${leftScore} : ${rightScore}
              </div>
              <div class="RoomContentCard_flex _RoomContentCard_flex_left">
                  <div class="RoomPlayer">
                      <p id="SizePlayers">${winCondition}</p>
                  </div>
                  <div class="RoomHosted">
                      <p>hosted by <span style="color: var(--orchid)">${this.roomData.host}<span></p>
                  </div>
                  <div class="RoomUsers"> ${this.roomData.players.map(user => `<img src="http://localhost:8000${user.pfp}" width="20px">`).join('')}</div>
              </div>
          </div>
      </div>
  </div>`;
  }
}

customElements.define("match-history-card", MatchHistoryCard);

export class MatchHistory extends HTMLElement {
  constructor(scores) {
    super();
    this.scores = scores;
  }
  async connectedCallback() {
    if (!this.scores.length) {
      this.innerHTML = `
        <h2 class="profile_titles">Match History</h2>
        <div class="empty-section">No matches played</div>
      `;
      return;
    }
    this.innerHTML = `
      <h2 class="profile_titles">Match History</h2>
      <div id="match_historys"></div>`;
    const matchHistorysParrent = document.getElementById("match_historys");
    for (let score of this.scores) {
      matchHistorysParrent.appendChild(new MatchHistoryCard(score));
    }
  }
}

customElements.define("match-history", MatchHistory);
