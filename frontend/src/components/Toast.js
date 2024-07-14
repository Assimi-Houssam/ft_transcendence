class Toast extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.tostsIcons = {
            success: "../../assets/icons/success.png",
            error: "../../assets/icons/success.png",
        }
        this.shadowRoot.innerHTML = `
            <style>
                .toast {
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: 99000;
                    background-color: #333;
                    color: #fff;
                    border-radius: 5px;
                    display: none;
                    width: 300px;
                }
                .toast_content {
                    margin-left: 10px;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .toast_content img {
                    width: 30px;
                    height: 30px;
                }
                .toast_success {
                    background-color: green;
                }
                .toast_error {
                    background-color: red;
                }

                .timeline {
                    height: 5px;
                    background: white;
                    border-radius: 10px;
                    width: 0%;
                }
            </style>
            <div class="toast"></div>
        `;
    }
    show(message, type) {
        const toast = this.shadowRoot.querySelector(".toast");
        toast.innerHTML = `<div class="toast_content">
            <img src="${this.tostsIcons[type]}" alt="icon" />
            <p>${message}</p>
        </div>`;
        toast.className = `toast toast_${type}`;
        toast.style.display = "block";
        const timeLineElemnts  = document.createElement("div");
        timeLineElemnts.className = "timeline";
        toast.appendChild(timeLineElemnts);
        const timeline = toast.querySelector(".timeline");
        let isEnded = false;
        let startWidth = 0;
        const id = setInterval(() => {
            if (isEnded)
                clearInterval(id);
            startWidth += 1;
            timeline.style.width = `${startWidth}%`;
        }, 50);
        setTimeout(() => {
            toast.style.display = "none";
            toast.className = 'toast'; // Reset the class
            isEnded = true;
        }, 5000);
    }

    static success(message) {
        Toast.instance.show(message, 'success');
    }

    static error(message) {
        Toast.instance.show(message, 'error');
    }
}

customElements.define("toast-message", Toast);
Toast.instance = document.createElement('toast-message');
document.body.appendChild(Toast.instance);

export default Toast;