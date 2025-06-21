package org.example.service.domain.Impl;

import jakarta.transaction.Transactional;
import org.example.model.Team;
import org.example.repository.TeamRepository;
import org.example.service.domain.TeamDomainService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamDomainServiceImpl implements TeamDomainService {

    private final TeamRepository teamRepository;

    public TeamDomainServiceImpl(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Override
    public List<Team> findAll() {
        return this.teamRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(String id) {
        this.teamRepository.deleteTeamById(id);
    }
}
