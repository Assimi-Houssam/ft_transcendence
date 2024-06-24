export default function Home () {
  let home  = document.createElement('div');
  home.classList.add('home_');
  home.innerHTML = `
      <div class="home_header_">
          <h1> Home </h1>
      </div>
  `
  return home;
}