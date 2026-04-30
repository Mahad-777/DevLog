package com.devlog.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devlog.post.CreatePostRequest;
import com.devlog.post.PostEntity;
import com.devlog.post.PostService;

import jakarta.validation.Valid;

/**
 * PostController — Controller pattern
 *
 * Receives HTTP requests and delegates immediately to PostService.
 * It contains zero business logic — its only job is to translate
 * HTTP into service calls and service results back into HTTP responses.
 *
 * Pattern: Controller (GRASP)
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  /**
   * GET /api/posts
   * View all posts — available to any authenticated user (Dev and above).
   */
  @GetMapping
  public ResponseEntity<List<PostEntity>> getAllPosts() {
    var r = postService.getAllPosts();
    r.forEach(post -> System.out.println(post.getAuthorUsername()));
    return ResponseEntity.ok(postService.getAllPosts());

  }

  /**
   * POST /api/posts
   * Create a new post — Authors and Managers only.
   * Spring injects Authentication automatically from the session.
   */
  @PostMapping
  public ResponseEntity<PostEntity> createPost(
      @Valid @RequestBody CreatePostRequest request,
      Authentication authentication) {

    PostEntity created = postService.createPost(request, authentication);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  /**
   * DELETE /api/posts/{id}
   * Delete a post — Authors (own posts only) or Managers (any post).
   * Ownership enforcement is handled inside PostService, not here.
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePost(
      @PathVariable long id,
      Authentication authentication) {

    postService.deletePost(id, authentication);
    return ResponseEntity.noContent().build(); // 204
  }
}
