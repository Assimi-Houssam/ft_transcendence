import { RoomPage } from "../pages/RoomPage.js";
import { router } from "../routes/routes.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import { langNotificationCenter } from "../utils/translate/gameTranslate.js";

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
        this.notificationType = notificationData.type;

        this.senderUsername = notificationData.from_user.username;
        this.senderPfp = ApiWrapper.getUrl() + notificationData.from_user.pfp;
        this.senderId = notificationData.from_user.id;
        this.date = this.convertTsToDate(notificationData.timestamp);
        if (this.notificationType === NotificationType.RoomInvite) {
            this.roomData = notificationData.roomData;

            this.gamemode = this.roomData.gamemode;
            this.teamSize = this.roomData.teamSize;
        }
        this.content = this.getNotificationContent();
        
        if (!this.content)
            return;
        this.addEventListener("click", this.onClickHandler.bind(this));
    }
    convertTsToDate(epoch) {
        let date = new Date(epoch * 1000);
    
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
    
        let hours = date.getHours();
        let minutes = date.getMinutes();
    
        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
    
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
    getNotificationContent() {
        switch (this.notificationType) {
            case NotificationType.ReceivedFriendRequest:
                return "sent you a friend request";
            case NotificationType.AcceptedFriendRequest:
                return "accepted your friend request";
            case NotificationType.RoomInvite:
                return `challenged you on ${this.gamemode} (${this.teamSize === "1" ? "1v1" : "2v2"})`;
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
                    <div class="notification-date">${this.date}</div>
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
        this.ws = new WebSocket(ApiWrapper.getWsUrl() + "/ws/cable/");
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
        this.lang = localStorage.getItem("lang");
        this.innerHTML = `
            <div class="notification-center-header">
                <div class="notification-headline">${langNotificationCenter[this.lang]["NotifHeadline"]} (<a class="notification-count">${this.notifications.length}</a>)</div>
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
                try {
                    document.body.removeChild(this);
                    document.body.removeEventListener("click", this.outerClickHandler);
                }
                catch (e) {}
            }
        });
    }
}

customElements.define("notification-center", NotificationCenter);