package com.bank.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic transferTopic(@Value("${transfer.topic}") String topic) {
        return TopicBuilder.name(topic)
                .partitions(10)  // parallel processing across partitions
                .replicas(1)
                .build();
    }
}
