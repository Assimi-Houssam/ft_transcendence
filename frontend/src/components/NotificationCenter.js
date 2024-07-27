/*
notification types:
- fr sent
- fr accepted
- game invite
- tournament invite

system:
- notifications are stored on the server side
- each time the user logs in, we fetch his new unread notifications (if any)
- clicking in an invite notification would display a messagebox asking if the user wants to join the game
- clicking in an incoming friend request noti would redirect to the profile page with the option to selected whether to accept or not inplace of the send fr button
- clicking in an accepted friend request noti would redirect to the profile page
- clicking on the username in the notification would redirect to the profile page of said user

notes:
- fix overflow when a messagebox is displayed
- add notification type enum
- should make links that has a user's profile page automatically redirect to the profile page
*/

const anime = window.anime;

const NotificationType = {
    ReceivedFriendRequest: "ReceivedFriendRequest",
    AcceptedFriendRequest: "AcceptedFriendRequest",
    RoomInvite: "RoomInvite",
    TournamentInvite: "TournamentInvite"
}

class Notification extends HTMLElement {
    constructor(notificationType, sender, gameMode = null, gameSize = null) {
        super();
        this.sender = sender; // should be userid instead
        this.notificationType = notificationType;
        this.gameMode = gameMode
        this.gameSize = gameSize;
        this.content = this.getNotificationContent();
        // todo: figure out how to handle errors like these
        if (!this.content)
            return;
        this.pfpUrl = "http://localhost:8000/media/default.jpeg"; // temporary
    }
    getNotificationContent() {
        switch (this.notificationType) {
            case NotificationType.ReceivedFriendRequest:
                return "sent you a friend request";
            case NotificationType.AcceptedFriendRequest:
                return "accepted your friend request";
            case NotificationType.RoomInvite:
                return `challenged you on ${this.gameMode} (${this.gameSize})`;
            case NotificationType.TournamentInvite:
                return `invited you to a ${this.gameMode} tournament (${this.gameSize})`;
            default:
                return "";
        }
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="notification-c">
                <img class="notification-img" src="${this.pfpUrl}"></img>
                <div class="notification-content-container">
                    <div class="notification-content"><a class="notification-src">${this.sender}</a> ${this.content}</div>
                    <div class="notification-date">22-7-2024 8:28</div>
                </div>
            </div>
            <img class="notification-delete" src="../../assets/icons/circle-x.svg"></img>
        `;
        this.addEventListener('mouseover', () => {
            this.style.backgroundColor = "rgba(56, 60, 78, 0.5)";
        });
        this.addEventListener('mouseout', () => {
            this.style.backgroundColor = "rgba(56, 60, 78, 0.0)";
        });
        this.querySelector(".notification-delete").onclick = () => {
            this.dispatchEvent(new CustomEvent("notificationDelete", { detail: this, bubbles: true }));
        };
    }
    delete(animateMinHeight = true) {
        anime({
            targets: this,
            height: 0,
            minHeight: animateMinHeight ? 0 : this.style.minHeight,
            marginLeft: ["0%", "-100%"],
            easing: "easeOutExpo",
            opacity: 0,
            duration: 600,
            complete: () => {this.remove();}
        });
    }
}

customElements.define("notification-item", Notification);

export class NotificationCenter extends HTMLElement {
    constructor() {
        super();
        console.log("ctor called");
        // todo: here, we connect to the server, and get the unread notifications and append them here
        this.notifications = [];
        this.outerClickHandler = (e) => {
            if (!e.target.className.startsWith("notification") && !e.target.localName.startsWith("notification"))
                this.hide();
        }
        
        // testing
        for (let i = 0; i < 5; i++)
            this.notifications.push(new Notification(NotificationType.AcceptedFriendRequest, "miyako" + i));
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="notification-center-header">
                <div class="notification-headline">All Notifications (<a class="notification-count">${this.notifications.length}</a>)</div>
                <div class="notification-clear">Clear All</div>
            </div>
            <div class="notifications-list"></div>`;
        this.querySelector(".notification-clear").onclick = () => { this.clearNotifications(); }

        // testing
        for (let noti in this.notifications)
            this.querySelector(".notifications-list").append(this.notifications[noti]);
    }
    clearNotifications() {
        const notis = this.notifications;
        for (let i = 0; i < notis.length; i++) {
            setTimeout(() => { notis[i].delete(false); }, i * 30);
        }
        this.notifications = [];
        this.querySelector(".notification-count").textContent = 0;
    }
    show() {
        document.body.appendChild(this);
        this.addEventListener("notificationDelete", (e) => { 
            const noti = e.detail;
            const noti_idx = this.notifications.indexOf(noti);
            noti.delete();
            this.notifications.splice(noti_idx, 1); 
            this.querySelector(".notification-count").textContent = this.notifications.length;
        });
        anime({
            targets: this,
            left: ['100%', '70%'],
            opacity: 1,
            duration: 450,
            easing: 'easeOutQuint',
            complete: () => {
                document.body.addEventListener("click", this.outerClickHandler);
            }
        });
        anime({
            targets: this.querySelectorAll('notification-item'),
            opacity: 1,
            marginLeft: ["100%", "0%"], 
            delay: anime.stagger(20),
            duration: 600,
            easing: 'easeOutQuint'
        });
    }
    hide() {
        anime({
            targets: this,
            left: ['70%', '100%'],
            opacity: 0,
            duration: 500,
            easing: 'easeOutQuint',
            complete: () => {
                document.body.removeChild(this);
                document.body.removeEventListener("click", this.outerClickHandler);
            }
        });
    }
}

customElements.define("notification-center", NotificationCenter);