package com.project.realtime_collaboration_platform.config;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisConfig {


    private final RedisTemplate<String, String> redisTemplate;

    @EventListener(ContextRefreshedEvent.class)
    public void handleContextRefresh() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
        System.out.println("✅ Redis has been cleared at startup");
    }
}
