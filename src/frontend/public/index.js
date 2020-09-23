import Vue from "vue";
import '../assets/index.css'

let renderApp = function () {
  const App = require("./App/App.vue").default;

  const _el = document.getElementById("vue_app");
  
  const _app = new Vue({
    el: _el,
    components: {
      App,
    },
    render: (h) => h("App")
  });
}


if (process.env.NODE_ENV === 'development') {
  const ic = require("@dfinity/agent");
  if (!window.ic) {
    console.log("Development Mode");
    const { HttpAgent, IDL, Principal } = ic;

    let keyPair;
    if (!window.localStorage.getItem('testKey')) {
      console.log("No Key building")
      keyPair = ic.generateKeyPair();
      window.localStorage.setItem('testKey', JSON.stringify(keyPair));
      console.log(keyPair);
    } else {
      console.log("Key Exists. Loading")
      let dat = JSON.parse(window.localStorage.getItem('testKey'));
      keyPair = ic.makeKeyPair(dat.publicKey.data, dat.secretKey.data)
      console.log(keyPair);
    }
    const agent = new HttpAgent({
      principal: Principal.selfAuthenticating(keyPair.publicKey),
    });

    agent.addTransform(ic.makeNonceTransform());
    agent.setAuthTransform(ic.makeAuthTransform(keyPair));
    
    window.ic = { agent, HttpAgent, IDL };
  }

  if (!document.getElementById("vue_app")) {
    console.log("Writting app");
    document.write('<div id="vue_app" style="height:100vh%;"></div>');
  }

  renderApp();

} else {
  const canisterAssets = require("ic:canisters/frontend").default;
  // use the asset canister's retrieve method to request a file (the `index.html` file from above)
  canisterAssets.retrieve("index.html").then((htmlBytes) => {
    // now that you have the html, decode it and create a new element
    const html = new TextDecoder().decode(new Uint8Array(htmlBytes));
    const el = new DOMParser().parseFromString(html, "text/html");
    // insert your HTML into the bootstrap HTML under the element with id `"app"`
    document.body.replaceChild(
      el.firstElementChild,
      document.getElementById("app")
    );
    
    renderApp();
  });
};

