package com.notify.channel;

import com.notify.model.Channel;
import com.notify.model.Notification;

/**
 * Strategy interface — each channel implements its own delivery logic.
 */
public interface NotificationChannel {

    Channel getType();

    /**
     * Send the notification. Throws on failure.
     */
    void send(Notification notification) throws ChannelException;

    class ChannelException extends RuntimeException {
        public ChannelException(String message) { super(message); }
        public ChannelException(String message, Throwable cause) { super(message, cause); }
    }
}
