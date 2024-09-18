import { router } from "../../routes/routes.js";
import { langProfileGraph } from "../../utils/translate/gameTranslate.js";

export class ProfileGraph extends HTMLElement {
    constructor(matches) {
        super();
        this.matches = matches;
        this.lang = localStorage.getItem("lang");
    }
    filterUserScores() {
        const currentUserId = Number(router.route.params["userID"]);
        const userScores = this.matches.map(match => {
            const userTeam = match.red_team.some(player => player.id === currentUserId) ? 'red' : 'blue';
            const userScore = userTeam === 'red' ? match.red_team_score : match.blue_team_score;
            return {
                timestamp: match.timestamp,
                score: userScore
            };
        });
        return userScores;
    }
    async connectedCallback() {
        if (!this.matches.length) {
            this.innerHTML = `
                <h2 class="profile_titles" style="padding-top: 25px">${langProfileGraph[this.lang]["ProfileTitles"]}</h2>
                <div class="empty-section">${langProfileGraph[this.lang]["EmptySection"]}</div>
            `;
            return;
        }
        this.innerHTML = `
            <h2 class="profile_titles" style="padding-top: 25px">${langProfileGraph[this.lang]["ProfileTitles"]}</h2>
            <canvas class="player-chart"></canvas>
        `;
        const scores = this.filterUserScores();

        const timestamps = scores.map(score => {
            const date = new Date(score.timestamp * 1000);
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        });
        const scoreValues = scores.map(score => score.score);

        const canvas = this.querySelector(".player-chart");
        canvas.width = window.innerHeight * 1.4;
        canvas.height = window.innerHeight * 0.4;
        var ctx = canvas.getContext("2d");
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Score',
                    data: scoreValues,
                    borderColor: '#FAE744',
                    fill: false,
                }]
            },
            options: {
                responsive: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            font: {
                                family: 'nasalization'
                            },
                            display: true,
                            text: 'Time'
                        },
                        ticks: {
                            font: {
                                family: 'nasalization'
                            },
                            color: 'white'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            font: {
                                family: 'nasalization'
                            },
                            display: true,
                            text: 'Score'
                        },
                        ticks: {
                            font: {
                                family: 'nasalization'
                            },
                            color: "white"
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            font: {
                                family: 'nasalization'
                            }
                        }
                    }
                },
                font: {
                    family: 'nasalization'
                }
            }
        });
    }
}

customElements.define("profile-graph", ProfileGraph)