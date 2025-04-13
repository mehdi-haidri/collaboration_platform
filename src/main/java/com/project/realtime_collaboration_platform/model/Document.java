package com.project.realtime_collaboration_platform.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    Integer id;
    String name;
    String description;
    String ownerId;
    String content;
}
