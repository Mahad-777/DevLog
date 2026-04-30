import { nav } from "./nav.js";
import { posts } from "./posts.js";
import { createPost } from "./createPost.js";
const html = String.raw;
export default function homePage() {
  const template = document.createElement("template");
  template.innerHTML = `${nav(true)} ${posts()} ${createPost()}`;
  return template.content;
}
