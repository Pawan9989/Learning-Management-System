package com.example.demo.controller;

// Ensure the Goal class exists in the specified package or update the import to the correct package
import com.example.demo.entity.Goal; // Verify this path or correct it
import com.example.demo.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    @Autowired
    private GoalService goalService;

    @GetMapping("/{userId}")
    public List<Goal> getGoals(@PathVariable Long userId) {
        return goalService.getGoalsByUserId(userId);
    }

    @PostMapping
    public Goal addGoal(@RequestBody Goal goal) {
        return goalService.saveGoal(goal);
    }
}