package com.notify.channel;

import com.notify.model.Channel;
import com.notify.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EmailChannel implements NotificationChannel {

    private static final Logger log = LoggerFactory.getLogger(EmailChannel.class);

    @Override
    public Channel getType() { return Channel.EMAIL; }

    @Override
    public void send(Notification notification) throws ChannelException {
        log.info("Sending EMAIL to user {}: {}", notification.getUserId(),
                notification.getRenderedContent());
        // In production: integrate with SES, SendGrid, etc.
    }
}
