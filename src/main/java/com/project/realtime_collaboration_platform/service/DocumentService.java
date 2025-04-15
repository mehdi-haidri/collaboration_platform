package com.project.realtime_collaboration_platform.service;

import com.project.realtime_collaboration_platform.config.WebSocketHandler;
import com.project.realtime_collaboration_platform.repository.DocumentRepository;
import com.project.realtime_collaboration_platform.model.Document;


import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor

public class DocumentService {

    private final DocumentRepository documentRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);





    public void applyOperation(String docId, String patchJson) {
        redisTemplate.opsForList().rightPush("doc:" + docId + ":ops", patchJson);
    }


    public List<String> getAllOpsForDoc(String docId) {
        String redisKey = "doc:" + docId + ":ops";
        if (Boolean.TRUE.equals(redisTemplate.hasKey(redisKey))) {
            return  redisTemplate.opsForList().range(redisKey, 0, -1);
        }
        return new ArrayList<>();
    }

    public void saveToDB(Document document) {
        logger.info(String.valueOf(document.getId()));
        Document existingDocument = documentRepository.findById(document.getId()).orElse(null);

        if (existingDocument != null) {
            // Document exists, update fields
            existingDocument.setContent(document.getContent());
            documentRepository.save(existingDocument); // Save updated document
        } else {
            // Document does not exist, save new document
            documentRepository.save(document);
        }
        redisTemplate.delete("doc:" + document.getId() + ":ops");
    }

    public String getLastSave(Integer docId) {
        Optional<Document> document = documentRepository.findById(docId);
        return document.map(Document::getContent).orElse(null);
    }

    public  Document createDocument(Document document) {
        return documentRepository.save(document);
    }


}
