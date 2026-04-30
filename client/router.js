import { isauthenticated } from "./modules/auth/authenticate.mjs";

const routes = {};
const protectedRoutes = ["#/home"];

// Just registers the route, nothing else
export function buildRoute(path, page) {
  routes[path] = page;
}

const renderRoute = function (path, page) {
  if (!path || !page) return;
  const app = document.querySelector(".container");
  app.innerHTML = "";
  app.appendChild(page());
  if (path === "#/home" && window.renderPosts) {
    window.renderPosts();
  }
};

// Called once on startup to render the initial page
export function initRouter() {
  const currPath = window.location.hash || "#/";
  const loggedin = isauthenticated();

  if (!loggedin && protectedRoutes.includes(currPath)) {
    window.location.hash = "#/";
    return;
  }

  if (loggedin && currPath === "#/") {
    window.location.hash = "#/home";
    return;
  }

  renderRoute(currPath, routes[currPath]);
}

window.addEventListener("hashchange", () => {
  const currPath = window.location.hash || "#/";
  const loggedin = isauthenticated();

  if (loggedin && currPath === "#/") {
    window.location.hash = "#/home";
    return;
  }

  if (!loggedin && protectedRoutes.includes(currPath)) {
    window.location.hash = "#/";
    return;
  }

  renderRoute(currPath, routes[currPath]);
});
