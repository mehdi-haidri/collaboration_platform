package com.project.realtime_collaboration_platform.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.realtime_collaboration_platform.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Component
@RequiredArgsConstructor
public class WebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
    private final Map<String, List<WebSocketSession>> docSessions = new ConcurrentHashMap<>();
    private final DocumentService documentService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        // Get doc ID from URL query
        Map<String, Object> message = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        String docId = getDocId(session);
        logger.info("Connection established for docId: {}", docId);  // Log message

        docSessions.computeIfAbsent(docId, k -> new ArrayList<>()).add(session);
        logger.info("sessions: {}", docSessions );

        String lastSave = documentService.getLastSave(Integer.parseInt(docId));
        if(lastSave != null && !lastSave.isEmpty()) {
            message.put("type", "lastSave");
            message.put("value", lastSave);
            session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
        }

        List<String> chnages =  documentService.getAllOpsForDoc(docId);
                for (var msg : chnages ){
                    message.put("type", "change");
                    message.put("value", msg);
                    session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
                }
      /*  NotifyOthers(session,docId);*/


    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, Object> msg = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        msg.put("type", "change");
        msg.put("value", message.getPayload());
        String docId = getDocId(session);
        documentService.applyOperation(docId, message.getPayload());
        for (WebSocketSession s : docSessions.get(docId)) {
            if (s.isOpen() && !s.getId().equals(session.getId())) {
                s.sendMessage(new TextMessage(mapper.writeValueAsString(msg)));
            }
        }

    }

    protected void NotifyOthers(WebSocketSession session , String docId) throws IOException {
        for (WebSocketSession s : docSessions.get(docId)) {
            if (s.isOpen() && !s.getId().equals(session.getId())) {
                s.sendMessage(new TextMessage("new user loged in "));
            }
        }
    }

    private String getDocId(WebSocketSession session) {
        URI uri = session.getUri();
        return uri != null && uri.getQuery() != null
                ? uri.getQuery().split("=")[1] // crude parsing: ?docId=abc123
                : "default";
    }
}
