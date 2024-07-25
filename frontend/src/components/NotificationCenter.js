/*
notification types:
- fr sent
- fr accepted
- game invite
- tournament invite

system:
- notifications are stored on the server side
- each time the user logs in, we fetch his new unsread notifications (if any)
- clicking in an invite notification would display a messagebox asking if the user wants to join the game
- clicking in an incoming friend request noti would redirect to the profile page with the option to selected whether to accept or not inplace of the send fr button
- clicking in an accepted friend request noti would redirect to the profile page
- clicking on the username in the notification would redirect to the profile page of said user

notes:
- fix overflow when a messagebox is displayed
- add notification type enum
- should make links that has a user's profile page automatically redirect to the profile page
*/

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
                    <div class="notification-content"><a>${this.sender}</a> ${this.content}</div>
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
    }
}

customElements.define("notification-item", Notification);

export class NotificationCenter extends HTMLElement {
    constructor() {
        super();
        this.notifications = [];
        // testing
        for (let i = 0; i < 5; i++)
            this.notifications.push(new Notification(NotificationType.AcceptedFriendRequest, "miyako"));
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="notification-center-header">
                <div class="notification-headline">All Notifications (<a>${this.notifications.length}</a>)</div>
                <div class="notification-clear">Clear All</div>
            </div>
            <div class="notifications-list"></div>`;
        for (let noti in this.notifications)
            this.querySelector(".notifications-list").append(this.notifications[noti]);
    }
}

customElements.define("notification-center", NotificationCenter);