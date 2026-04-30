import "./utils.js";
import { CreatePost } from "./modules/post/Post.js";

const html = String.raw;

export function createPost() {
  const template = document.createElement("template");
  template.innerHTML = `
    <dialog id="post-modal" class="post-modal" popover>
      <div class="div-window">
        <div id="modal-container" class="modal-container">
          <div class="modal-close">
            <button popovertarget="post-modal" popovertargetaction="hide" style="float:right;">
              X
            </button>
          </div>

          <div class="modal-header">
            <h1>Create a post</h1>
            <div></div>
          </div>

          <form class="post-modal-form" action="">
            <div class="post-title">
              <label for="post-title-input">Title</label>
              <input id="post-title-input" type="text" required />
            </div>

            <div class="post-body">
              <div class="format-btns-container">
                <div class="formatting-btns">
                  <button type="button" class="bold" onclick="isBold()">B</button>
                  <button type="button" class="italic">I</button>
                  <button type="button" class="strikethrough">/S</button>
                  <button type="button" class="subscript">Sub</button>
                  <button type="button" class="superscript">Sup</button>
                  <button type="button" class="image">img</button>
                  <button type="button" class="link">lnk</button>
                  <button type="button" class="video">vid</button>
                  <button type="button" class="headings">H</button>
                  <button type="button" class="uList">UL</button>
                  <button type="button" class="oList">OL</button>
                  <button type="button" class="spoiler">Sp</button>
                  <button type="button" class="blockquote">BQ</button>
                  <button type="button" class="blockcode">BC</button>
                  <button type="button" class="table">T</button>
                </div>
              </div>
              <div id="post-body-input" class="post-body" contenteditable="true" data-placeholder="Text body"></div>
            </div>

            <p id="post-error" style="display:none; color:red;"></p>

            <div class="post-footer">
              <button id="post-submit" type="button">Post</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  `;

  // the event listner on the toggle auth button
  const node = template.content.firstElementChild;

  // the post submit button
  const postSubmitBtn = node.querySelector("#post-submit");

  postSubmitBtn.addEventListener("click", async () => {
    const title = document.getElementById("post-title-input").value.trim();
    const body = document.getElementById("post-body-input").innerText.trim();
    const errorEl = document.getElementById("post-error");

    // Basic client-side validation
    if (!title || !body) {
      errorEl.textContent = "Title and body cannot be empty.";
      errorEl.style.display = "block";
      console.log;
      return;
    }

    errorEl.style.display = "none";

    try {
      await CreatePost.submit(title, body);

      // Clear the form
      document.getElementById("post-title-input").value = "";
      document.getElementById("post-body-input").innerText = "";

      // Close the modal and refresh the feed
      document.getElementById("post-modal").hidePopover();
      await window.renderPosts();
    } catch (err) {
      console.error("Post creation failed:", err);
      errorEl.textContent = "Failed to create post: " + err.message;
      errorEl.style.display = "block";
    }
  });

  return node;
}
document.body.appendChild(createPost());
