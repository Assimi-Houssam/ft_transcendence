import { MessageBox } from "../components/MessageBox.js";
import Toast from "../components/Toast.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import { router } from "../routes/routes.js";
import { Loader } from "../components/Loading.js";

export class EnableTwoFactor extends HTMLElement {
    constructor() {
        super();
    }
    async updateUserInfo(newPassword) {
        let formData = new FormData();
        formData.append("mfa_enabled", true);
        formData.append("confirm_password", newPassword);
        const res = await ApiWrapper.post("/user/update", formData, false);
        const data = await res.json();
        if (!res.ok) {
            Toast.error(data.detail);
            return;
        }
        console.log("2fa enabled, should redirect to /settings now");
        Toast.success("2FA has been enabled on your account");
        router.navigate("/settings");
    }
    handleNext(e) {
        new MessageBox(
            "Confirm password",
            "Please enter your password",
            "Confirm",
            this.updateUserInfo,
            "",
            "",
            "Confirm password", true).show();
    }
    async getProvisioningQr() {
        const req = await ApiWrapper.get("/user/qr");
        const resp = await req.json();
        this.qr = resp.provisioning_qr;
        console.log("qr:", resp);
    }
    async connectedCallback() {
        this.innerHTML = new Loader().outerHTML;
        await this.getProvisioningQr();
        this.innerHTML = `
        <div class="mfa-enable-container">
            <div class="qr_code">
                <img src="data:image/png;base64, ${this.qr}">
            </div>
            Scan this qr code using any authenticator app, once done, press the next button
        </div>
        <div class="mfa-enable-footer">
            <div class="BtnStartGame">
                <button type="button" id="BtnStartGame">Next</button>
            </div>
        </div>`;
        this.querySelector(".BtnStartGame").onclick = this.handleNext.bind(this);
    }
};

customElements.define("enable-two-factor", EnableTwoFactor);