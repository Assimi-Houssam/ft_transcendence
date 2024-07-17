class Toast extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.tostsIcons = {
            success: "../../assets/icons/success.png",
            error: "../../assets/icons/error.png",
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
                    width: 400px;
                }
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
                .toast_content {
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .toast_content_icon {
                    border-radius: 10px;
                }
                .toast_content img {
                    width: 30px;
                    height: 30px;
                }
                .toast_success {
                    background-color: #2d2f3d;
                }
                .toast_error {
                    background-color: #2d2f3d;
                }
                h4 {
                    font-size: 1.2rem;
                    margin-bottom: 3px;
                }
                p {
                    font-size: 13px;
                    line-height: 1.5;
                    color: #ccc;
                    font-weight: 300;
                }
                .toast_error h4 {
                    font-weight: bold;
                }

                .timeline {
                    height: 5px;
                    background: white;
                    border-radius: 10px;
                    width: 0%;
                }
  
                .close_ {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    margin-left: auto;
                    padding: 5px;
                    height: 30px;
                    width: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    background-color: #fff;
                    top: -5%;
                    right: -3%;
                    border-radius: 50px;
                    cursor: pointer;
                }
            </style>
            <div class="toast"></div>
        `;
    }
    show(message, type) {
        const toast = this.shadowRoot.querySelector(".toast");
        toast.innerHTML = `<div class="toast_content">
            <div class="toast_content_icon">
                <img src="${this.tostsIcons[type]}" alt="icon" />
            </div>
            <div class="toast_content_body">
                <h4>${type && type.toUpperCase()}</h4>
                <p>${message}</p>
            </div>
            <button class="close_" id="close_">&times;</button>
        </div>`;
        toast.style.display = "block";
        toast.className = `toast toast_${type}`;
        anime({
            targets: toast,
            translateX: [300, 0],
            opacity: 1,
        });
        const timeLineElemnts  = document.createElement("div");
        timeLineElemnts.className = "timeline";
        toast.appendChild(timeLineElemnts);
        const close_ = toast.querySelector("#close_");
        close_.addEventListener("click", () => {
            anime({
                targets: toast,
                translateX: [0, 500],
                opacity: 1,
            });
            toast.className = 'toast'; // Reset the class

        })
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
            anime({
                targets: toast,
                translateX: [0, 500],
                opacity: 1,
            });
            toast.className = 'toast'; // Reset the class
            isEnded = true;
            toast.style.display = "none";
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

/**
 * USAGE:
 * import Toast from "<path to Toast.js>";
 * For ssucces message: Toast.success("Success message");
 * For error message: Toast.error("Error message");
 * 
 * NOTE: The toast will automatically disappear after 5 seconds
 * PS:
 *  right now we apply only success and error, mybe later we can add more types
 */