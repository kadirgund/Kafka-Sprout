package com.example.backend.controllers;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.example.backend.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

@EnableScheduling
@Controller
public class MetricsController {

  @Autowired
  public AdminService admin;

  @Autowired
  private SimpMessagingTemplate template;

  @Scheduled(fixedRate = 3000)
  public void metrics() throws ExecutionException, InterruptedException {
    System.out.println("scheduled");
    this.template.convertAndSend("/topic/metrics",admin.metrics());
  }

  @MessageMapping("/test")
  @SendTo("/topic/metrics")
  public Map<String, Object> greeting(Map<String, Object> message) throws Exception {
    System.out.println(message.get("message"));
    return message;
  }

}