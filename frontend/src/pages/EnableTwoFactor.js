import { MessageBox } from "../components/MessageBox.js";
import Toast from "../components/Toast.js";
import ApiWrapper from "../utils/ApiWrapper.js";
import { router } from "../routes/routes.js";
import { Loader } from "../components/Loading.js";
import { langMFA, langConfirmPassPopup } from "../utils/translate/gameTranslate.js";

export class EnableTwoFactor extends HTMLElement {
    constructor() {
        super();
        this.lang = localStorage.getItem("lang");
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
        Toast.success(langMFA[this.lang]["MfaEnabled"]);
        router.navigate("/settings");
    }
    handleNext(e) {
        new MessageBox(
            langConfirmPassPopup[this.lang]["Title"],
            langConfirmPassPopup[this.lang]["ConfirmPass"],
            langConfirmPassPopup[this.lang]["BtnConfirm"],
            this.updateUserInfo.bind(this),
            "",
            "",
            langConfirmPassPopup[this.lang]["PlaceHolder"], true).show();
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
            <div class="mfa-enable-title">
                <h1>Scan QR code </h1>
                <p>Scan using any authenticator app, once done, press the next button</p>
            </div>
            <div class="qr_code">
                <img src="data:image/png;base64, ${this.qr}">
            </div>
            ${langMFA[this.lang]["ScanQr"]}
        </div>
        <div class="mfa-enable-footer">
            <div class="BtnStartGame">
                <button type="button" id="BtnStartGame">${langMFA[this.lang]["BtnNext"]}</button>
            </div>
        </div>`;
        this.querySelector(".BtnStartGame").onclick = this.handleNext.bind(this);
    }
};

customElements.define("enable-two-factor", EnableTwoFactor);