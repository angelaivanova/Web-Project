package org.example.service.domain.Impl;

import org.example.model.*;
import org.example.model.exceptions.TopicIsAlreadyFullException;
import org.example.repository.TopicRepository;
import org.example.service.domain.TopicDomainService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TopicServiceImpl implements TopicDomainService {

    private final TopicRepository topicRepository;

    public TopicServiceImpl(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    @Override
    public List<Topic> findAll() {
        return this.topicRepository.findAll();
    }

    @Override
    public Optional<Topic> findByID(String id) {
        return this.topicRepository.findById(id);
    }

    @Override
    public boolean isClosed(String topicId) {
        return topicRepository.findById(topicId)
                .map(topic -> topic.getTeams() != null && topic.getTeams().size() >= topic.getGroupCount())
                .orElse(true);
    }

    @Override
    public Optional<Topic> chooseTopic(String topicId, String index) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found"));

        if (isClosed(topicId)) {
            throw new TopicIsAlreadyFullException();
        }

        Student student = new Student();
        student.setIndex(index);

        boolean alreadyExists = topic.getTeams().stream()
                .flatMap(t -> t.getMembers().stream())
                .anyMatch(s -> s.getIndex().equals(index));
        if (alreadyExists) {
            throw new IllegalStateException("You are already in a team for this topic.");
        }

        for (Team team : topic.getTeams()) {
            if (team.getMembers().size() < topic.getMembersPerGroup()) {
                team.getMembers().add(student);
                topicRepository.save(topic);
                return Optional.of(topic);
            }
        }

        Team newTeam = new Team();
        newTeam.setTopic(topic);
        newTeam.setMembers(List.of(student));
        topic.getTeams().add(newTeam);
        topicRepository.save(topic);

        return Optional.of(topic);
    }
}
