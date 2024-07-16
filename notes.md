# creating your own component:
if your component fetches data from the backend, it must have an `isLoaded` method, that returns a promise, that promise should be resolved once you've finished fetching data, let's take the `Navbar` component for example:

```
export class Navbar extends HTMLElement {
    constructor() {
        super();
        // data from the server that should be fetched
        this.data = null;
        // the promise object that isLoaded will return
        this.loaded_promise = this.fetchData();
      }
      async isLoaded() {
        return this.loaded_promise;
      }
      async fetchData() {
        // we fetch the data we need from the server, in this case, we're just fetching the current user's info
        // `fetch` returns a promise, we save the promise in a variable and return it
        const req = await api_get("/me");
        // we parse the server's response into a json
        this.data = await req.json();
        // we return the promise
        return req;
      }
      // connectedCallback is called once the element has been attached to the dom
      async connectedCallback() {
        // we fetch the data from the server
        await this.fetchData();
        // 
        this.innerHTML = `<the component's html code>`;
      }
}
// define our component in the customElements registry
customElements.define('navbar-component', Navbar);```
```

now, we've created a navbar, let's see how we'll use it
```
// we create the navbar
const navbar = document.createElement("navbar-component");
// we wait for the navbar to be loaded, once it's loaded,
// we can do whatever we want with it, here we're just appending it to a `.content` div
navbar.isLoaded().then(() => {
    document.querySelector(".content_").append(navbar);
})
// if any error has occured, we just log it, you can do some other stuff here
// though, like display an error toast or whatnot, up to you!
.catch((error) => {
    console.log("an exception occured: ", error);
});
```

# creating a component that doesnt fetch any data
in this case you have 2 choices, if the element is an entire page, you can just return a resolved promeise in `isLoaded`, otherwise, you dont even need `isLoaded` method
