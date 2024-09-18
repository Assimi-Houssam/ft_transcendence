import { langChatGame } from "../../../utils/translate/gameTranslate.js";

export class ContainerChat extends HTMLElement {
  constructor() {
    super();
    this.lang = localStorage.getItem("lang");
  }

  connectedCallback(){
    this.innerHTML = `
      <div class="ContainerChat">
          <div class = "chat-box" id="chat-box">
              <div id="chats" class="chat-box-content">
              </div>
          </div>
          <div class="input_msg">
              <input type="text" placeholder="${langChatGame[this.lang]["Placeholder"]}" class="chat-input" id="chat-input">
          </div>
      </div>
    `
  }
}

customElements.define("container-chat", ContainerChat)

class SingleMessage extends HTMLElement {
  constructor(message, username = "rouali") {
    super();
    this.message = message;
    this.classList.add("user-chat");
    this.username = username;
    const now = new Date();
    this.hours = now.getHours();
    this.minutes = now.getMinutes();
    this.seconds = now.getSeconds();
  }

  connectedCallback() {
    this.innerHTML = `
            <div class ="sidebar-chatbox">
                <span class="timestamp">${this.hours < 10 ? `0${this.hours}` : `${this.hours}`}:${this.minutes < 10 ? `0${this.minutes}` : `${this.minutes}`}:${this.seconds < 10 ? `0${this.seconds}` : `${this.seconds}`}</span>
                <span class="username" style="color: purple;">${this.username}</span>
            </div>
            <div id="container-msg" class="container-msg">
                <span class="message">${this.message}</span>
            </div>`;
  }
}

customElements.define("single-message", SingleMessage);

export class ChatGame extends HTMLElement {
  constructor(username, message) {
    super();
    this.username = username;
    this.message = message;
    this.lang = localStorage.getItem("lang");
  }

  connectedCallback() {
    this.innerHTML = `
            <div class = "chat-container">
                <div class="chat-container-content">
                    <div class="chat-header">${langChatGame[this.lang]["chatTitle"]}</div>
                    <container-chat></container-chat>
                </div>
            </div>
        `;

    const message = document.getElementById("chat-input");
    const chats = document.getElementById("chats");

    this.addEventListener("keypress", (e) => {
      if (e.key.toLowerCase() == "enter") {
        if (message.value.length > 120) {
          message.value = "";
          return;
        }
        if (String(message.value).trim().length === 0) return;
        this.dispatchEvent(new CustomEvent("roomChatSend", {detail: message.value, bubbles: true}));
        message.value = "";
        chats.scrollTop = chats.scrollHeight;
      }
    });
  }
  appendMessage(username, message) {
    let chats = this.querySelector(".chat-box-content");
    chats.appendChild(new SingleMessage(message, username));
  }
}

customElements.define("chat-game", ChatGame);
