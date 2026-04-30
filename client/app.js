import { buildRoute } from "./router.js";
import homePage from "./homePage.js";
import auth from "./auth.js";
import "./utils/events.js";
import { initAuth } from "./modules/auth/authenticate.mjs";
import { initRouter } from "./router.js";

await initAuth();

buildRoute("#/", auth);
buildRoute("#/home", homePage);
initRouter();
