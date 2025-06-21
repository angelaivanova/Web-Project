package org.example.service.domain;

import org.example.model.Student;
import org.example.model.Team;

import java.util.List;

public interface TeamDomainService {
    List<Team> findAll();
    void delete(String id);
}
