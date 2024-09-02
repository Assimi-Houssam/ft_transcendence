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
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <h2 class="profile_titles">Statistics</h2>
      <div id="statistics_cards"></div>
    `
    const statisticsCards = document.getElementById("statistics_cards");
    statisticsCards.appendChild(new StatisticCard("../../../assets/icons/cup.png", "WINS", 0))
    statisticsCards.appendChild(new StatisticCard("../../../assets/icons/xp.png", "YOUR XP", 253))
    statisticsCards.appendChild(new StatisticCard("../../../assets/icons/controle.png", "MATCHES PLAYED", 4))
  }
}

customElements.define("profile-statistics", ProfileStatistics);