export function refreshPage() {}

// a utility function for truncating posts before displaying on frontpage
function cutPost(post) {
  let words = 0;
  let lastIndex = 0;

  if (post.length <= 350) return post;

  while (words < 64) {
    let i = post.indexOf(" ", lastIndex + 1);
    if (i === -1 || i >= 350) break;
    words++;
    lastIndex = i;
  }
  return post.slice(0, lastIndex > 0 ? lastIndex : 350).trimEnd() + "...";
}

function formatDate(date) {
  const now = new Date();
  const postTime = date.getTime();
  const timeDif = Math.floor((now.getTime() - postTime) / 1000 / 3600);
  const monthDif =
    (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

  if (timeDif < 24) {
    return `${timeDif}h`;
  } else if (monthDif < 12) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}

window.cutPost = cutPost;
window.formatDate = formatDate;
// window.handleModal = handleModal;

export { cutPost, formatDate };
