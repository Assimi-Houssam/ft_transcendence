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

import { RoomPage } from "../pages/RoomPage.js";
import { router } from "../routes/routes.js";

const anime = window.anime;

const NotificationType = {
    ReceivedFriendRequest: "ReceivedFriendRequest",
    AcceptedFriendRequest: "AcceptedFriendRequest",
    RoomInvite: "RoomInvite",
}

class Notification extends HTMLElement {
    constructor(notificationData) {
        super();
        this.notificationData = notificationData;
        console.log("notification data:", notificationData);
        this.notificationType = notificationData.type;

        this.senderUsername = notificationData.from_user.username;
        this.senderPfp = "http://localhost:8000" + notificationData.from_user.pfp;
        this.senderId = notificationData.from_user.id;
        
        if (this.notificationType === NotificationType.RoomInvite) {
            this.roomData = notificationData.roomData;

            this.gamemode = this.roomData.gamemode;
            this.teamSize = this.roomData.teamSize;
        }
        this.content = this.getNotificationContent();
        
        if (!this.content)
            return;
        console.log("noti content:", this.content);
        this.addEventListener("click", this.onClickHandler.bind(this));
    }
    getNotificationContent() {
        switch (this.notificationType) {
            case NotificationType.ReceivedFriendRequest:
                return "sent you a friend request";
            case NotificationType.AcceptedFriendRequest:
                return "accepted your friend request";
            case NotificationType.RoomInvite:
                return `challenged you on ${this.gamemode} (${this.teamSize})`;
            default:
                return "";
        }
    }
    onClickHandler(evt) {
        this.dispatchEvent(new CustomEvent("notificationDelete", { detail: this, bubbles: true }));
        if (evt.target.classList.contains('notification-delete')) {
            return;
        }
        switch (this.notificationType) {
            case NotificationType.RoomInvite:
                router.navigate("/rooms/" + this.notificationData.roomId, new RoomPage(this.roomData));
                break;
            case NotificationType.ReceivedFriendRequest:
                router.navigate("/user/" + this.senderId);
                console.log("navigating to:", "/user" + this.senderId);
                break;
            case NotificationType.AcceptedFriendRequest:
                router.navigate("/user/" + this.senderId);
                break;
            default: 
                break;
        }
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="notification-c">
                <img class="notification-img" src="${this.senderPfp}"></img>
                <div class="notification-content-container">
                    <div class="notification-content"><a class="notification-src">${this.senderUsername}</a> ${this.content}</div>
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
    delete(animateMinHeight = true) {
        anime({
            targets: this,
            height: 0,
            minHeight: animateMinHeight ? 0 : this.style.minHeight,
            marginLeft: ["0%", "-100%"],
            easing: "easeOutExpo",
            opacity: 0,
            duration: 600,
            complete: () => { this.remove(); }
        });
    }
}

customElements.define("notification-item", Notification);

export class NotificationCenter extends HTMLElement {
    constructor() {
        super();
        this.ws = new WebSocket("ws://localhost:8000/ws/cable/");
        this.notifications = [];
        this.ws.onmessage = this.onNotificationReceived.bind(this);

        this.outerClickHandler = (e) => {
            if (!e.target.className.startsWith("notification") && !e.target.localName.startsWith("notification"))
                this.hide();
        }
        document.addEventListener("notiSendDM", (evt) => {
            const detail = evt.detail;
            this.ws.send(JSON.stringify({ message: detail.message, userId: detail.userId }));
        });
    }
    onNotificationReceived(evt) {
        const incommingNoti = JSON.parse(evt.data);
        if (incommingNoti.hasOwnProperty("message")) {
            console.log("dispatching dm received event");
            document.dispatchEvent(new CustomEvent("notiReceivedDm", {detail: incommingNoti, bubbles: true}));
            return;
        }

        const notiElem = new Notification(incommingNoti.notification);
        notiElem.style.opacity = '1';
        notiElem.style.marginLeft = "0%";
        this.notifications.push(notiElem);
        this.connectedCallback();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="notification-center-header">
                <div class="notification-headline">All Notifications (<a class="notification-count">${this.notifications.length}</a>)</div>
                <div class="notification-clear">Clear All</div>
            </div>
            <div class="notifications-list"></div>`;
        this.querySelector(".notification-clear").onclick = () => { this.clearNotifications(); }

        for (let noti of this.notifications)
            this.querySelector(".notifications-list").append(noti);
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
            targets: this.notifications,
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