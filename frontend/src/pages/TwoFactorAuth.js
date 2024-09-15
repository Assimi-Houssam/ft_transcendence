export default class TwoFactorAuth extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="two_factor_card_header">
                <img src="../../assets/icons/twofa.webp" alt="two factor icon" />
                <h3> 2FA Authentication </h3>
                <p>Please scan the QR code and enter the 6 digits to ferify</p>
            </div>
            <div class="twofactor_code">
                <div class="qr_code">
                    <img src="../../assets/images/qr.png">
                </div>
                <div class="two_factor">
                    <p>Enter 6 digits code</p>
                    <div id="twofa_inputs" class="twofa_inputs">
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                        <input type="text" />
                    </div>
                    <button>Verify 2FA code</button>
                </div>
            </div>
        `
        const inputs = document.getElementById("twofa_inputs");
        inputs.addEventListener("input", (e) => {
            const input = e.target;
            if (isNaN(input.value))
                input.value = ""
            else if (input.value.length == 1) {
                const next_input = input.nextElementSibling;
                next_input && (next_input.focus(), next_input.value = "")
            } else if (input.value.length > 1)
                input.value = input.value[0];
            else {
                input.focus();
                return;
            }
        })

        inputs.addEventListener("keyup", (e) => {
            const input = e.target;
            if (e.key.toLowerCase() == "backspace" || e.key.toLowerCase() == "delete") {
                input.value = "";
                const prev = input.previousElementSibling
                if (prev)
                    prev.focus();
            }
        })
    }
}

customElements.define("two-factor-page", TwoFactorAuth);