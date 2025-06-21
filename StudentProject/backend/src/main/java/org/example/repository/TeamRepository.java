package org.example.repository;

import jakarta.transaction.Transactional;
import org.example.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Team t WHERE t.id = :id")
    void deleteTeamById(@Param("id") String id);
    List<Team> findByTopicId(String topicId);
}
