package com.project.realtime_collaboration_platform.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@Table
public class Document {
    @Id
     @GeneratedValue
    Integer id;
    String name;
    String description;
    String ownerId;
    @Lob
    @Column(length = 10485760)
    String content;
    String type;
}
