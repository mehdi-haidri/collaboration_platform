package com.project.realtime_collaboration_platform.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.realtime_collaboration_platform.model.Document;
import com.project.realtime_collaboration_platform.service.DocumentService;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor

public class DocumentController {

    private final DocumentService documentService;


    @PostMapping("/saveDocs")
    public ResponseEntity<?> saveDoc ( @RequestBody Document document){

        documentService.saveToDB(document);
        HashMap<String , Object> responseMap = new HashMap<>();
        responseMap.put("error" , false);
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }

    @GetMapping("/create/{type}")
    public ResponseEntity<?> createDoc(@PathVariable String type){
        try{
            Document document = new Document();
            document.setType(type);
            document =  documentService.createDocument(document);
            HashMap<String , Object> responseMap = new HashMap<>();
            responseMap.put("error" , false);
            responseMap.put("data" , document);
            return new ResponseEntity<>(responseMap, HttpStatus.OK);
        }catch (Exception ignored){
            HashMap<String , Object> responseMap = new HashMap<>();
            responseMap.put("error" , true);
            responseMap.put("message" , "something went wrong");
            return new ResponseEntity<>(responseMap, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoc(@PathVariable Integer id){


        try{
            String content = documentService.getLastSave(id);
            HashMap<String , Object> responseMap = new HashMap<>();
            responseMap.put("error" , false);
            responseMap.put("data" , content);
            return new ResponseEntity<>(responseMap, HttpStatus.OK);
        }catch (Exception ignored){
            HashMap<String , Object> responseMap = new HashMap<>();
            responseMap.put("error" , true);
            responseMap.put("message" , "something went wrong");
            return new ResponseEntity<>(responseMap, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
