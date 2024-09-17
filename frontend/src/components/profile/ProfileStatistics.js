import { langProfileStatistics } from "../../utils/translate/gameTranslate.js";

export class StatisticCard extends HTMLElement {
  constructor(icon, title, counter) {
    super();
    this.classList.add("statistic_card");
    this.icon = icon;
    this.title = title;
    this.counter = counter;
  }

  connectedCallback() {
    this.innerHTML = `
      <img src=${this.icon} alt=${this.title} >
      <div class="statistic_card_left_item">
        <h1>${this.counter}</h1>
        <p>${this.title}</p>
      </div>
    `
  }
}

customElements.define("statistic-card", StatisticCard);

export class ProfileStatistics extends HTMLElement {
  constructor(userInfo) {
    super();
    this.userInfo = userInfo;
    this.lang = localStorage.getItem("lang");
  }

  connectedCallback() {
    this.innerHTML = `
      <h2 class="profile_titles">${langProfileStatistics[this.lang]["Statistics"]}</h2>
      <div id="statistics_cards"></div>
    `
    const statisticsCards = document.getElementById("statistics_cards");
    statisticsCards.appendChild(new StatisticCard("../../../assets/icons/cup.png", langProfileStatistics[this.lang]["Wins"], this.userInfo.matches_won))
    statisticsCards.appendChild(new StatisticCard("../../../assets/icons/xp.png", langProfileStatistics[this.lang]["Xp"], this.userInfo.xp))
    statisticsCards.appendChild(new StatisticCard("../../../assets/icons/controle.png", langProfileStatistics[this.lang]["MatchesPlayed"], this.userInfo.matches_played))
  }
}

customElements.define("profile-statistics", ProfileStatistics);