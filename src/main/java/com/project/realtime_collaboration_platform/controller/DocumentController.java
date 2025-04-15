package com.project.realtime_collaboration_platform.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.realtime_collaboration_platform.model.Document;
import com.project.realtime_collaboration_platform.service.DocumentService;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor

public class DocumentController {

    private final DocumentService documentService;


    @PostMapping("/saveDocs")
    public ResponseEntity<?> saveDoc ( @RequestBody Document document){

        documentService.saveToDB(document);

        return new ResponseEntity<>("saved", HttpStatus.OK);
    }

    @GetMapping("/create/{type}")
    public ResponseEntity<?> createDoc(@PathVariable String type){
        try{
            Document document = new Document();
            document.setType(type);
            documentService.createDocument(document);

            HashMap<String , Object> responseMap = new HashMap<>();
            responseMap.put("error" , false);
            responseMap.put("value" , document);

            return new ResponseEntity<>(responseMap, HttpStatus.OK);
        }catch (Exception ignored){
            HashMap<String , Object> responseMap = new HashMap<>();
            responseMap.put("error" , false);
            responseMap.put("value" , ignored);
            return new ResponseEntity<>(responseMap, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
