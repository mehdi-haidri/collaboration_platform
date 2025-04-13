package com.project.realtime_collaboration_platform.repository;

import com.project.realtime_collaboration_platform.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository< Document ,Integer> {
}
