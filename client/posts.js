import { cutPost, formatDate } from "./utils.js"; // Ensure formatDate is imported
import "./modules/post/Post.js";
import { getUser } from "./modules/auth/authenticate.mjs";
import { GetPosts, DeletePost } from "./modules/post/Post.js";

/**
 * 1. The Post Card Template
 * We pass 'currentUsername' so we can immediately know if the user is the author
 */
function postCard(post, currentUsername) {
  const pfp = localStorage.getItem("pfp");
  const isAuthor = post.authorUsername === currentUsername;

  const template = document.createElement("template");
  template.innerHTML = `
    <div class="post" data-id="${post.id}">
      <div class="post-header">
        <div class="author">
          <div class="user-details">
            ${
              pfp
                ? `<div class="pfp"><img src="${pfp}" alt="pfp"></div>`
                : `<div class="default-pfp">
                  ${post.authorUsername?.charAt(0).toUpperCase() ?? "U"}
                </div>`
            }
          </div>
          <div class="author-cred">
            <span class="author-name">${post.authorUsername}</span>
          </div>
        </div>
        <div class="post-details">
          <time datetime="${post.createdAt}"> ${formatDate(new Date(post.createdAt))} </time>
        </div>
      </div>

      <div class="post-title">
        <h2>${post.title}</h2>
      </div>

      <div class="post-body">
        <p class="post-text">${cutPost(post.body) || ""}</construct}</p>
      </div>

      <div class="post-footer">
        <!-- We pass both ID and AuthorName to the handler -->
        <button class="menu-btn" onclick="handlePostMenu('${post.id}', '${post.authorUsername}')">•••</button>
      </div>
    </div>
  `;
}

export function posts() {
  return `<div class="grid-container" id="posts-grid"></div>`;
}

/**
 * 2. The Global Modal Logic
 * This function creates the modal once and attaches it to the body if it doesn't exist.
 */
function ensureModalExists() {
  if (document.getElementById("post-menu-modal")) return;

  const modalHtml = `
    <div id="post-menu-modal" class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div id="modal-actions">

        </div>
        <button class="close-btn" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

window.closeModal = function () {
  const modal = document.getElementById("post-menu-modal");
  if (modal) modal.style.display = "none";
};

/**
 * 3. The Menu Handler
 * This opens the global modal and populates it with the specific post's data
 */
window.handlePostMenu = function (postId, authorName) {
  ensureModalExists();

  const modal = document.getElementById("post-menu-modal");
  const actionsContainer = document.getElementById("modal-actions");
  const currentUsername = getUser();

  // Reset contents
  actionsContainer.innerHTML = "";
  modal.style.display = "flex";

  // Check if the person clicking is the author
  if (authorName === currentUsername) {
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete Post";
    deleteBtn.className = "btn-delete";
    deleteBtn.onclick = () => window.deletePost(postId); // Pass the ID!
    actionsContainer.appendChild(deleteBtn);
  }
};

/**
 * 4. Main Rendering Logic
 */
window.renderPosts = async function () {
  try {
    const currentUsername = getUser();
    // Assuming GetPosts.fetch() returns the array of posts
    const data = await GetPosts.fetch();

    const grid = document.getElementById("posts-grid");
    grid.innerHTML = data.map((post) => postCard(post, currentUsername)).join("");
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
};

window.deletePost = async function (id) {
  if (!confirm("delete this post?")) return;
  try {
    await DeletePost.submit(id);
    // Fixed the selector syntax error from your original code
    const postElement = document.querySelector(`.post[data-id="${id}"]`);
    if (postElement) {
      postElement.remove();
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Could: not delete post. " + err.message);
  }
};
