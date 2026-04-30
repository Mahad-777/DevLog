package com.devlog.post;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.devlog.user.UserEntity;
import com.devlog.user.UserRepository;

@Service
public class PostService {

  private final PostRepository postRepository;
  private final UserRepository userRepository;

  public PostService(PostRepository postRepository, UserRepository userRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public List<PostEntity> getAllPosts() {
    return postRepository.findAllByOrderByCreatedAtAsc();
  }

  public PostEntity createPost(CreatePostRequest request, Authentication authentication) {
    // Resolve the logged-in user from the session
    String email = authentication.getName();
    UserEntity author = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

    PostEntity post = new PostEntity();
    post.setTitle(request.title());
    post.setBody(request.body());
    post.setAuthorId(author.getId());
    post.setAuthorUsername(author.getUsername());

    return postRepository.save(post);
  }

  public void deletePost(long postId, Authentication authentication) {
    PostEntity post = postRepository.findById(postId)
        .orElseThrow(() -> new PostNotFoundException("Post not found"));

    String email = authentication.getName();
    UserEntity requester = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

    boolean isManager = requester.getRole() == UserEntity.Role.MANAGER;
    boolean isOwner = post.getAuthorId().equals(requester.getId());

    if (!isManager && !isOwner) {
      throw new UnauthorizedPostActionException("You do not have permission to delete this post");
    }

    postRepository.delete(post);
  }
}
