export class HomePage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
		<div class="Container_Home">
			<div class="container gradient-purple-blue">
				<div class="under-container bubble" style="height:100vh;">
					<div class="line">
						<div class="square" id="square">W</div>
						<div class="square" >e</div>
						<div class="square" >l</div>
						<div class="square" >c</div>
						<div class="square" >o</div>
						<div class="square" >m</div>
						<div class="square" >e</div>
						<div class="square" style="margin-left:30px;">t</div>
						<div class="square" >o</div>
					</div>
					<div class="line">
						<div class="square" >T</div>
						<div class="square" >R</div>
						<img class="square" src="./../../assets/images/logo.png" height="79%">
						<div class="square" >N</div>
						<div class="square" >C</div>
						<div class="square" >E</div>
						<div class="square" >N</div>
						<div class="square" >D</div>
						<div class="square" >E</div>
						<div class="square" >N</div>
						<div class="square" >C</div>
						<div class="square" >E</div>
					</div>
				</div>
				<div class="under-container" style="position: absolute; bottom: 65px;">
					<div class="chevron"></div>
					<div class="chevron"></div>
					<div class="chevron"></div>
				</div>
				<div class="under-container">
					<div class="Contributeurs">
						<div class="line">
							<div class="square" >C</div>
							<div class="square" >o</div>
							<div class="square" >n</div>
							<div class="square" >t</div>
							<div class="square" >r</div>
							<div class="square" >i</div>
							<div class="square" >b</div>
							<div class="square" >u</div>
							<div class="square" >t</div>
							<div class="square" >e</div>
							<div class="square" >u</div>
							<div class="square" >r</div>
							<div class="square" >s</div>
						</div>
					</div>
				</div>
				<div class="Contributeurs_row">
					<div class="PfpContributeurs">
						<img src="./../../assets/images/nelmous.jpg"width=100% style="border-radius: 50%;">
						<h2>Nel-mous</h2>
					</div>
					<div class="PfpContributeurs">
						<img src="./../../assets/images/hassimi.jpeg" width=100% style="border-radius: 50%;">
						<h2>Hassimi</h2>
					</div>
					<div class="PfpContributeurs">
						<img src="./../../assets/images/ikorchi.jpeg" width=100% style="border-radius: 50%;">
						<h2>Ikorchi</h2>
					</div>
					<div class="PfpContributeurs">
						<img src="./../../assets/images/rouali.jpeg" width=100% style="border-radius: 50%;">
						<h2>Rouali</h2>
					</div>
					<div class="PfpContributeurs">
						<img src="./../../assets/images/mamazzal.jpeg" width=100% style="border-radius: 50%;">
						<h2>Mamazzal</h2>
					</div>
				</div>
			</div>
		</div>
    `;

    let square = document.getElementsByClassName("square");
    for (let i = 0; i < square.length; i++) {
      square[i].addEventListener("mouseenter", function () {
        this.classList.add("rubberBand");
        this.addEventListener(
          "animationend",
          function () {
            this.classList.remove("rubberBand");
          },
          false
        );
      });
    }	
  }
}

customElements.define("home-page", HomePage);
