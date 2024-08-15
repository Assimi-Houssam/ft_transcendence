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

        const popup = this.querySelector(".ContainerPopupInviteFreiends");
        const card = this.querySelector(".ContainerPopupInviteFreiends_card");

        popup.addEventListener("click", (event) => {
            if (!card.contains(event.target)){
                const elem = document.querySelector("invite-friends");
                elem.style.display = "none";
            }
        });
    }
}

customElements.define('invite-friends', InviteFriends);