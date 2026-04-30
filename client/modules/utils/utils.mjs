// This is the function that can be used to display error messages to the user
export function errorMsg(msg) {
  const element = document.getElementById("error-msg");
  element.textContent = msg;
  element.style.display = "block";
}
