package com.project.realtime_collaboration_platform.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditMessage {
    private String docId;
    private String user;
    private String html;
    private String timestamp;
}