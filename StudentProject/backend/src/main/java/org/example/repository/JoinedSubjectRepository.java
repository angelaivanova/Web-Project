package org.example.repository;

import org.example.model.JoinedSubject;
import org.springframework.stereotype.Repository;

@Repository
public interface JoinedSubjectRepository extends JpaSpecificationRepository<JoinedSubject, String> {

    JoinedSubject findByMainSubject_Id(String mainSubject);
}
