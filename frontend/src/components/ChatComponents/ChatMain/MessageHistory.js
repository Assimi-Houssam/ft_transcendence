class ReceivedMessageCard extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
		<div class="message-received">
			<p id="received-content-message">
				<span>${this.getAttribute("message")}</span>
				<span class="message-time">${this.getAttribute("time")}</span>
			</p>
		</div>`;
  }
}

customElements.define("received-message-card", ReceivedMessageCard);

class SenderMessageCard extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
		<div class="message-sender">
			<p id="sender-content-message">
				<span>${this.getAttribute("message")}</span>
				<span class="message-time">${this.getAttribute("time")}</span>
			</p>
		</div>`;
  }
}

customElements.define("sender-message-card", SenderMessageCard);

export class MessageHistory extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
		<div class="message-history">
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
			<received-message-card 
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</received-message-card>
			<sender-message-card
				message="On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer mise en page elle-même." 
				time="12:00" 
				sender="amine amazzal">
			</sender-message-card>
		</div>`;
  }
}

customElements.define("message-history", MessageHistory);
