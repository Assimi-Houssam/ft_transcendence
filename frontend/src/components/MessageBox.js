const anime = window.anime;

function fadeAnim(target, target_opacity) {
    anime({
        targets: target,
        easing: "linear",
        duration: 70,
        opacity: target_opacity
    })
}

export class MessageBox extends HTMLElement {
    /**
     * @param {*} title (required): the message box title
     * @param {*} content (required): the message box content
     * @param {*} primaryButtonText (required): the message box primary button text
     * @param {*} primaryButtonCallback (required): the message box's primary button callback
     * @param {*} secondaryButtonText: the message box's secondary button text (if set to null or an empty string, it wont be displayed)
     * @param {*} secondaryButtonCallback: the message box's secondary button callback
     * @param {*} textBoxContent: if set to anything other than null, it'll display a text box inside the message box,
     *                            the content is used for the text box placeholder text, the text box content is sent 
     *                            back as a parameter to the button callback, if the text box is empty, the primary 
     *                            button callback wont be called.
     * @note after any of the buttons are clicked and the callbacks are executed, the 
     *       message box hides itself automatically.
     */
    constructor(title, content, primaryButtonText, primaryButtonCallback,
                secondaryButtonText = "", secondaryButtonCallback = null, textBoxContent = "") {
        super();
        if (!title || !content || !primaryButtonText || !primaryButtonCallback)
            return;
        this.primaryButtonCallback = primaryButtonCallback;
        this.secondaryButtonCallback = secondaryButtonCallback;
        this.outerClickHandler = this.handleOuterClick.bind(this);
        this.buttonCicked = false;
        this.innerHTML = `
            <div class="msg-box-container gradient-dark-bg ${textBoxContent ? "text-box" : ""}">
                <div class="msg-box-title">
                    ${title}
                </div>
                <div class="msg-box-content">
                    ${content}
                </div>
                ${textBoxContent ? `<input class="msg-box-input" placeholder="${textBoxContent}"></input>` : ""}
                <div class="msg-box-button-container ${!secondaryButtonText ? 'centered' : ''}">
                    <div class="msg-box-button-primary">${primaryButtonText}</div>
                    ${secondaryButtonText ? `<div class="msg-box-button-secondary">${secondaryButtonText}</div>` : ''}
                </div>
            </div>`;
        document.getElementById('root').classList.add('blur');
    }
    handleOuterClick(e) {
        const cn = e.target.className;
        if (!cn.startsWith("msg-box"))
            this.hide();
    }
    async btnCbWrapper(event, cb, btn) {
        if (this.buttonCicked)
            return;
        this.buttonCicked = true;
        const text_box = document.querySelector(".msg-box-input");
        const text_box_content = text_box ? text_box.value : "";
        const is_secondary_btn = btn.className === "msg-box-button-secondary";
        if (text_box && !text_box_content && !is_secondary_btn) {
            this.buttonCicked = false;
            return;   
        }
        btn.style.opacity = "40%";
        if (cb.constructor.name === "AsyncFunction") {
            event.target.innerHTML = "<preloader-mini></preloader-mini>";
            await cb(text_box_content);
        }
        else {
            cb(text_box_content);
        }
        this.hide();
    }
    show() {
        document.body.appendChild(this);
        document.getElementById('root').style.pointerEvents = 'none';
        anime({
            targets: ".msg-box-container",
            easing: "easeInExpo",
            opacity: 1,
            duration: 100,
            complete: () => {
                document.addEventListener('click', this.outerClickHandler);
            }
        });
        const primary_btn = document.querySelector(".msg-box-button-primary");
        primary_btn.addEventListener('click', async (e) => { this.btnCbWrapper(e, this.primaryButtonCallback, primary_btn); });
        primary_btn.addEventListener('mouseenter', () => { fadeAnim(primary_btn, 0.6); });
        primary_btn.addEventListener('mouseleave', () => {
            if (!this.buttonCicked)
                fadeAnim(primary_btn, 1);
        });
        const secondary_btn = document.querySelector(".msg-box-button-secondary");
        if (!secondary_btn || !this.secondaryButtonCallback) {
            if (!secondary_btn)
                return;
            secondary_btn.style.opacity = "60%";
            secondary_btn.style.cursor = "default";
            return;
        }
        secondary_btn.addEventListener('click', async (e) => { this.btnCbWrapper(e, this.secondaryButtonCallback, secondary_btn); });
        secondary_btn.addEventListener('mouseenter', () => { fadeAnim(secondary_btn, 0.6); });
        secondary_btn.addEventListener('mouseleave', () => {
            if (!this.buttonCicked)
                fadeAnim(secondary_btn, 1);
        });
        
    }
    hide() {
        document.getElementById('root').classList.remove('blur');
        document.getElementById('root').style.pointerEvents = 'auto';
        document.removeEventListener('click', this.outerClickHandler);
        anime({
            targets: ".msg-box-container",
            easing: "easeOutExpo",
            opacity: 0,
            duration: 200,
            complete: () => { document.body.removeChild(this); }
        });
    }
};

customElements.define("message-box", MessageBox);
