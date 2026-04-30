package com.devlog.post;

import com.devlog.post.PostEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<PostEntity, Long> {
  public List<PostEntity> findAllByOrderByCreatedAtAsc();
}
