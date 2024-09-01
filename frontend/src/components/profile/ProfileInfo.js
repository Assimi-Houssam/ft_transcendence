import { ProfileStatistics } from "./ProfileStatistics.js";

export class ProfileInfo extends HTMLElement {
  constructor() {
    super();
    this.classList.add("profile_left_items");
  }

  connectedCallback() {
    this.innerHTML = `
      <img id="profile_banner"></img>
      <div class="profile_user_info">
        <div class="profile_user_info_left_items">
            <img id="profile_pfp"  src="../../../assets/images/amine.png" ald="">
            <div>
              <h2>mamazzal</h2>
              <div class="profile_joined">
                <p id="joined">Joined Jul 11, 2024</p>
                <p id="online">online</p>
              </div>
            </div>
        </div>
        <div class="profile_user_info_settings_link">
          <a href="/settings">
            EDIT PROFILE
          </a>
        </div>
      </div>
      <div class="line_"></div>
      <profile-statistics></profile-statistics>
    `
  }
}

customElements.define("profile-info", ProfileInfo);