export class InviteFriends extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="ContainerPopupInviteFreiends">
                <div class="ContainerPopupInviteFreiends_card">
                    <div class="TitlePopup">
                        <h2>Invite friends</h2>
                    </div>
                    <div class="content_line">
                        <div class="line_x"></div>
                    </div>
                    <div class="InviteFreindsPopup">
                        <div class="InviteFreindsPopup_content">
                            <div class="CardFriend">
                                <div class="CardFriend_name">
                                    <img src="../../../assets/images/p1.png" width="40px" height="40px">
                                    <h4>Rouali</h4>
                                </div>
                                <button>Invite!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const InviteFriendsBtn = document.getElementById("InviteFriendsBtn");
        const popup = this.querySelector(".ContainerPopupInviteFreiends");
        const card = this.querySelector(".ContainerPopupInviteFreiends_card");

        InviteFriendsBtn.addEventListener("click", () => {
            const elemnt = document.querySelector("invite-friends");
            elemnt.style.display = "block";
            anime({
                targets: ".ContainerPopupInviteFreiends_card",
                scale: [0, 1],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutBack'
            });
        });

        popup.addEventListener("click", (event) => {
            if (!card.contains(event.target)) {
                anime({
                    targets: ".ContainerPopupInviteFreiends_card",
                    scale: [1, 0],
                    opacity: [1, 0],
                    duration: 500,
                    easing: 'easeInBack',
                    complete: () => {
                        const elemnt = document.querySelector("invite-friends");
                        elemnt.style.display = "none";
                    }
                });
            }
        });
    }
}

customElements.define('invite-friends', InviteFriends);