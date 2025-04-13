package com.project.realtime_collaboration_platform.controller;


import com.project.realtime_collaboration_platform.model.Document;
import com.project.realtime_collaboration_platform.service.DocumentService;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor

public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/saveDocs")
    public ResponseEntity<?> saveDoc ( @RequestBody Document document){

        documentService.saveToDB(document);

        return new ResponseEntity<>("saved", HttpStatus.OK);
    }

}
