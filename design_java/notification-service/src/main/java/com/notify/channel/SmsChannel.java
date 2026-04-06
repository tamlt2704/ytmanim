package com.notify.channel;

import com.notify.model.Channel;
import com.notify.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SmsChannel implements NotificationChannel {

    private static final Logger log = LoggerFactory.getLogger(SmsChannel.class);

    @Override
    public Channel getType() { return Channel.SMS; }

    @Override
    public void send(Notification notification) throws ChannelException {
        log.info("Sending SMS to user {}: {}", notification.getUserId(),
                notification.getRenderedContent());
        // In production: integrate with Twilio, SNS, etc.
    }
}
