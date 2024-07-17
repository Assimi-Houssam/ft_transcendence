# component design patterns

## if your component is fetching data from the server
you must have a `load` and `isLoaded`, aswell as a `Promise` that gets resolved once data fetching has finished
here's an example component that fetches from the server
(note: a component could be anything, it could be an entire page or just a simple button)

```
import ApiWrapper from "../utils/ApiWrapper.js"

export class MyComponent extends HTMLElement {
  constructor() {
    super();
	// data fetched from the server that your component will need
    this.data = null;
	// this promise gets resolved once you've finished the data you need from the server
    this.loaded_promise = new Promise((resolved, rejected) => {
      this.resolved_callback = resolved;
      this.rejected_callback = rejected;
    });
  }
  load() {
	// here, we send a GET request to `/me`, which returns the user data
    ApiWrapper.get("/me").then((req) => {
      if (!req) {
        throw new Error("/me request failed");
      }
      if (!req.ok) {
        console.log("server returned: ", req.status);
        throw new Error("Req failed");
      }
      return req.json();
    })
    .then((data) => {
      console.log("data was received successfully!");
      // we set this.data to the data received from the server
	  // this.data will then be read from to set some fields in the component's html
	  this.data = data;
      this.resolved_callback();
    })
    .catch(error => {
      this.rejected_callback(error);
    })
  }
  // isLoaded returns the loaded_promise
  isLoaded() {
    return this.loaded_promise;
  }
  async connectedCallback() {
    this.innerHTML = `<p>${this.data.username}</p>`;
  }
}
customElements.define('navbar-component', Navbar);
```

now that we've created a simple component that fetches data from the server, let's see how another component will load that component inside itself

```
import { MyComponent } from "./MyComponent.js";

export class AnotherComponent extends HTMLElement {
  constructor() {
    super();
	// same thing, we init a promise that gets resolved once this component has finished loading
    this.loaded_promise = new Promise((resolved, rejected) => {
      this.resolved_callback = resolved;
      this.rejected_callback = rejected;
    });
    this.my_component = null;
  }
  load() {
	// we create our custom component
    const comp = new MyComponent();
	// we load it (VERY IMPORTANT)
    comp.load();
	// once the component has finished loading, we do whatever we want it
    comp.isLoaded().then(() => {
      this.navbar = nav;
      this.resolved_callback();
    })
	// if any error occurs, catch it
    .catch(error => {
      this.rejected_callback(error);
    })
  }
  // again, isLoaded returns the loaded_promise
  isLoaded() {
    return this.loaded_promise;
  }
  connectedCallback() {
	// just a example, you can do whaterver we want here
    this.prepend(this.navbar);
  }
}

customElements.define("layout-wrapper", LayoutWrapper);
```

## if your component is not fetching anything from the server and doesnt have any child components that fetch data from the server
then you just put the component's html in `connectedCallback`, nothing more

# why?
so we can have a cute little loading animation when a page is fetching data from the server lolz