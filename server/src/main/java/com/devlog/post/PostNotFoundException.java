package com.devlog.post;

public class PostNotFoundException extends RuntimeException {
  public PostNotFoundException(String msg) {
    super(msg);
  }
}
