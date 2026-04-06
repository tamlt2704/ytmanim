package com.notify.channel;

import com.notify.model.Channel;
import com.notify.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PushChannel implements NotificationChannel {

    private static final Logger log = LoggerFactory.getLogger(PushChannel.class);

    @Override
    public Channel getType() { return Channel.PUSH; }

    @Override
    public void send(Notification notification) throws ChannelException {
        log.info("Sending PUSH to user {}: {}", notification.getUserId(),
                notification.getRenderedContent());
        // In production: integrate with FCM, APNs, etc.
    }
}
