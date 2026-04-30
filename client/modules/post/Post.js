// Java script Post Interface

// Indirection class for API
/**
 * This class will be responsible for connecting to the server.
 * It implements low coupling and indirection. It also helps with high cohesion since
 * it creates a single point of failure
 */
class APIGateway {
  constructor() {
    this.url = "http://localhost:9090/api/posts";
  }

  // send to server
  async post(post) {
    console.log(post);
    try {
      const response = await fetch(this.url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(post),
      });
      return await response.json();
    } catch (err) {
      console.log("Works up to here");
      throw err;
    }
  }

  // retrieve from server
  async get(id) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: "GET",
        headers: {},
        credentials: "include",
      });
      return response;
    } catch (err) {
      return err;
    }
  }

  async getAll() {
    try {
      const response = await fetch(this.url, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        return data;
      }
    } catch (err) {
      return err;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: "DELETE",
        headers: {},
        credentials: "include",
      });
      return true;
    } catch (err) {
      return err;
    }
  }
}

class Post {
  #id;
  #title;
  #body;
  #authorUsername;
  #createdAt;
  #apiGateway;

  constructor({ id, title, body, authorUsername, createdAt } = {}) {
    this.#id = id ?? null;
    this.#title = title ?? "";
    this.#body = body ?? "";
    this.#authorUsername = authorUsername ?? "";
    this.#createdAt = createdAt ?? null;
    this.#apiGateway = new APIGateway();
  }

  // ── Getters ───────────────────────────────────────────────
  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }
  get body() {
    return this.#body;
  }
  get authorUsername() {
    return this.#authorUsername;
  }
  get createdAt() {
    return this.#createdAt;
  }

  // ── Setters ───────────────────────────────────────────────
  set title(v) {
    this.#title = v;
  }
  set body(v) {
    this.#body = v;
  }
  set authorUsername(v) {
    this.#authorUsername = v;
  }

  get _gateway() {
    return this.#apiGateway;
  }
}

// this is the class for creating a post
class CreatePost extends Post {
  constructor(title, body) {
    super({ title, body, authorUsername: localStorage.getItem("username") });
  }

  async submit() {
    const data = {
      title: this.title,
      body: this.body,
    };
    return await this._gateway.post(data);
  }

  // Convenience static factory so callers don't need to manage
  // the object lifecycle themselves.
  static async submit(title, body) {
    const post = new CreatePost(title, body);
    return await post.submit();
  }
}

class DeletePost extends Post {
  constructor(id) {
    super({ id });
  }

  async submit() {
    return await this._gateway.delete(this.id);
  }

  static async submit(id) {
    const post = new DeletePost(id);
    return await post.submit();
  }
}

class GetPosts extends Post {
  async getAll() {
    return await this._gateway.getAll();
  }

  static async fetch() {
    return await new GetPosts().getAll();
  }
}

export { CreatePost, Post, APIGateway, GetPosts, DeletePost };
