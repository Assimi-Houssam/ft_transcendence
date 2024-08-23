export class ChatGame extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
            <div class = "chat-container">
                <div class="chat-container-content">
                    <div class="chat-header">Room Chat</div>

                    <div class="ContainerChat">
                        <div class = "chat-box" id="chat-box">
                            <div class ="sidebar-chatbox">
                                <span class="timestamp">12:31:43</span> 
                                <span class="username" style="color: purple;">mamazza..</span>
                            </div> 
                            <div class="chat-content">
                                <div class="chat_msg">
                                    <span class="message">hiiii</span>
                                </div>
                            </div>  
                        </div>
                        <div class="input_msg">
                            <input type="text" placeholder="Type something..." class="chat-input" id="chat-input">
                            <!-- <button id="send-button">Send</button> -->
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

customElements.define('chat-game', ChatGame);