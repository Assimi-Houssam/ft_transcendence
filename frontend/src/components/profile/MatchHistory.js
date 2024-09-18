import ApiWrapper from "../../utils/ApiWrapper.js"
import { router } from "../../routes/routes.js";
import { langRoomCard } from "../../utils/translate/gameTranslate.js";
import { langMatchHistory } from "../../utils/translate/gameTranslate.js";

export class MatchHistoryCard extends HTMLElement {
  constructor(roomData, userId = 0) {
    super();
    this.roomData = roomData;
    this.userId = Number(router.route.params["userID"]);
    this.classList.add("RoomListContainerBtn");
    this.lang = localStorage.getItem("lang");
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
    let color = "white";
    if (userTeam === "red") {
      leftScore = this.roomData.red_team_score;
      rightScore = this.roomData.blue_team_score;
    }
    else {
      leftScore = this.roomData.blue_team_score;
      rightScore = this.roomData.red_team_score;
    }
    if (userTeam === "red") {
      if (this.roomData.red_team_score > this.roomData.blue_team_score) {
        winCondition = "WIN";
        color = "#FAE744";
      }
      else if (this.roomData.red_team_score < this.roomData.blue_team_score) {
        winCondition = "LOSS";
        color = "#FF6666";
      }
      else
        winCondition = "DRAW";
    }
    if (userTeam === "blue") {
      if (this.roomData.blue_team_score > this.roomData.red_team_score) {
        winCondition = "WIN";
        color = "#FAE744";
      }
      else if (this.roomData.blue_team_score < this.roomData.red_team_score) {
        winCondition = "LOSS";
        color = "#FF6666";
      }
      else
        winCondition = "DRAW";
    }
    this.innerHTML = `
    <div class="Room Room_width">
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
                      <p id="SizePlayers" style="color: ${color};">${winCondition}</p>
                  </div>
                  <div class="RoomHosted">
                      <p>${langRoomCard[this.lang]["hostedBy"]} <span style="color: var(--orchid)">${this.roomData.host}<span></p>
                  </div>
                  <div class="RoomUsers"> ${this.roomData.players.map(user => `<img src="${ApiWrapper.getUrl() + user.pfp}" width="20px">`).join('')}</div>
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
    this.lang = localStorage.getItem("lang");
  }
  async connectedCallback() {
    if (!this.scores.length) {
      this.innerHTML = `
        <h2 class="profile_titles">${langMatchHistory[this.lang]["MatchHistory"]}</h2>
        <div class="empty-section">${langMatchHistory[this.lang]["NoMatches"]}</div>
      `;
      return;
    }
    this.innerHTML = `
      <h2 class="profile_titles">${langMatchHistory[this.lang]["MatchHistory"]}</h2>
      <div id="match_historys"></div>`;
    const matchHistorysParrent = document.getElementById("match_historys");
    let index = 0;
    for (let score of [...this.scores].reverse()) {
      if (index >= 5) 
        break;
      matchHistorysParrent.appendChild(new MatchHistoryCard(score));
      index++;
    }
  }
}

customElements.define("match-history", MatchHistory);
