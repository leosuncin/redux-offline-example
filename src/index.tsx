import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import { store } from "./app/store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if (process.env.NODE_ENV === "production") {
  serviceWorkerRegistration.register({
    onUpdate(registration) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("There is a new version available, do you want to reload?")) {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    },
  });
} else {
  serviceWorkerRegistration.unregister();
}
