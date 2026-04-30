import { login, signup } from "./modules/auth/authenticate.mjs";

console.log();
export default function auth() {
  const template = document.createElement("template");
  template.innerHTML = `
    <div id="auth-container" class="auth-window" data-mode="login">
        <div class="auth-body">
            <div class="title">
                <h1 class="login-mode">Login</h1>
                <h1 class="signup-mode">Signup</h1>
            </div>

            <p id="error-msg"></p>

            <div class="inputs">
                <label for="auth-email">Email</label>
                <input id="auth-email" type="email" required />
                <label class="signup-mode" for="auth-username">Username</label>
                <input class="signup-mode" id="auth-username" type="text" required>

                    <label for="auth-password">Password</label>
                    <input id="auth-password" type="password" required />
                    <label class="signup-mode" for="auth-confirm">Enter password again</label>
                    <input class="signup-mode" id="auth-confirm" type="password" required>
                    </div>


                    <div class="submit-btn">
                        <button class="login-mode">Login</button>
                        <button class="signup-mode">signup</button>
                    </div>


                    <div class="footer">
                        <div class="auth-toggle">
                            <span class="login-mode">Don't have an account?</span>
                            <span class="signup-mode">Already have an account?</span>
                            <button class="auth-toggle-btn" id="auth-toggle">
                                <span class="signup-mode">Login</span>
                                <span class="login-mode">signup</span>
                            </button>
                        </div>
                        <span class="login-mode"><a href="#">Forgot password?</a></span>
                    </div>
            </div>
        </div>
    </div>
   `;

  // the event listner on the toggle auth button
  const node = template.content.firstElementChild;

  // the auth submit buttons
  const loginBtn = node.querySelector(".submit-btn .login-mode");
  const signupBtn = node.querySelector(".submit-btn .signup-mode");

  node.querySelector("#auth-toggle").addEventListener("click", () => {
    const mode = node.dataset.mode;
    console.log();
    node.dataset.mode = mode === "login" ? "signup" : "login";
  });

  loginBtn.addEventListener("click", async () => {
    const email = node.querySelector("#auth-email").value.trim();
    const password = node.querySelector("#auth-password").value.trim();
    const errorMsg = node.querySelector("#error-msg");
    errorMsg.textContent = "";
    const result = await login(email, password);

    if (!result.success) {
      errorMsg.textContent = result.message;
      return;
    }
    window.location.hash = "#/home";
  });

  signupBtn.addEventListener("click", async () => {
    const email = node.querySelector("#auth-email").value.trim();
    const username = node.querySelector("#auth-username").value.trim();
    const password = node.querySelector("#auth-password").value.trim();
    const errorMsg = node.querySelector("#error-msg");

    errorMsg.textContent = "";
    const result = await signup(email, username, password);

    if (!result.success) {
      errorMsg.textContent = result.message;
      return;
    }

    window.location.hash = "#/home";
  });

  return node;
}
