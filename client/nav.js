import { createPost } from "./createPost.js";

window.logout = async function () {
  // Tell the server to invalidate the session
  await fetch("http://localhost:9090/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch(() => {}); // ignore network errors — clear client state regardless

  // Clear client-side storage
  localStorage.removeItem("username");
  localStorage.removeItem("pfp");
  localStorage.removeItem("role");

  window.location.hash = "#/";
};

const html = String.raw;
export function nav() {
  const pfp = localStorage.getItem("pfp");
  return html`
    <nav class="nav-bar">
      <div class="title"><span>DevLog</span></div>
      <div class="left-side">
        <div id="create-post-btn" class="create-post-btn">
          <button popovertarget="post-modal">Create Post</button>
        </div>
        <div id="user-details" class="user-details" onclick="overlay()">
          ${pfp
            ? `<div class="pfp"><img src="${pfp}"></div>`
            : `<div class="default-pfp">
                ${localStorage.getItem("username")?.charAt(0).toUpperCase() ?? "U"}
              </div>`}
        </div>
      </div>
    </nav>
  `;
}

window.overlay = function () {
  // Don't stack overlays if one already exists
  if (document.getElementById("overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.innerHTML = `
    <div class="overlay">
      <ul>
        <li><span onclick="logout()">Log Out</span></li>
      </ul>
    </div>
  `;

  document.getElementById("user-details").appendChild(overlay);

  // Close when clicking anywhere outside user-details
  setTimeout(() => {
    window.addEventListener("click", function handler(e) {
      if (!document.getElementById("user-details")?.contains(e.target)) {
        overlay.remove();
        window.removeEventListener("click", handler);
      }
    });
  }, 0); // setTimeout prevents the click that opened it from immediately closing it
};
