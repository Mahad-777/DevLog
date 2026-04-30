package com.devlog.post;

public class UnauthorizedPostActionException extends RuntimeException {
  public UnauthorizedPostActionException(String msg) {
    super(msg);
  }
}
