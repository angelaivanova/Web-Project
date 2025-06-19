package org.example.repository;

import org.example.model.TeacherSubjectAllocation;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface TeacherSubjectAllocationRepository extends JpaSpecificationRepository<TeacherSubjectAllocation, Long>{

    List<TeacherSubjectAllocation> findByProfessorId(String professorId);

    Page<TeacherSubjectAllocation> findAll(Specification<TeacherSubjectAllocation> filter, Pageable page);
}
