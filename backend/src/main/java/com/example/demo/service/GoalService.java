package com.example.demo.service;

import com.example.demo.entity.Goal;
import com.example.demo.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GoalService {
    @Autowired
    private GoalRepository goalRepository;

    public List<Goal> getGoalsByUserId(Long userId) {
        return goalRepository.findByUserId(userId);
    }

    public Goal saveGoal(Goal goal) {
        return goalRepository.save(goal);
    }
}