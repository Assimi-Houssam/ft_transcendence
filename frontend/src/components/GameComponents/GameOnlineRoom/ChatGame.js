export class ChatGame extends HTMLElement {
    constructor(){
        super();
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = now.getTime();
        console.log(now.setHours(0,0,0,0));
    }

    connectedCallback(){
        this.innerHTML = `
            <div class = "chat-container">
                <div class="chat-container-content">
                    <div class="chat-header">Room Chat</div>

                    <div class="ContainerChat">
                        <div class = "chat-box" id="chat-box">
                            <div class="chat-box-content">
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
                                </div>
                                <div class="user-chat">
                                    <div class ="sidebar-chatbox">
                                        <span class="timestamp">12:31:43</span>
                                        <span class="username" style="color: purple;">mamazza..</span>
                                    </div>
                                    <div class="container-msg">
                                        <span class="message">hi!</span>
                                    </div>
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