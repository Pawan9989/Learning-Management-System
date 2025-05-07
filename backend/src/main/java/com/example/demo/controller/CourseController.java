package com.example.demo.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Course;
import com.example.demo.entity.User;
import com.example.demo.service.CourseService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService; // Add this to fetch user info

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    // Admin-only endpoint for adding a course
    @PostMapping("/addcourse")
    public ResponseEntity<?> addCourse(@RequestBody Course course, @RequestParam Long userId) {
        User user = userService.getUserById(userId);
        if (user == null || !user.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admin can add courses");
        }
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.ok(createdCourse);
    }

    @PostMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        return courseService.updateCourse(id, updatedCourse);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
    @GetMapping("/recommend")
    public List<Course> recommendCourses(@RequestParam String interests) {
        return courseService.recommendCourses(interests);
    }
}



// package com.example.demo.controller;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import com.example.demo.entity.Course;
// import com.example.demo.service.CourseService;

// @RestController
// @RequestMapping("/api/courses")
// public class CourseController {

//     @Autowired
//     private CourseService courseService;

//     @GetMapping
//     public List<Course> getAllCourses() {
//         return courseService.getAllCourses();
//     }

//     @GetMapping("/{id}")
//     public Course getCourseById(@PathVariable Long id) {
//         return courseService.getCourseById(id);
//     }

//     @PostMapping
//     public Course createCourse(@RequestBody Course course) {
//         return courseService.createCourse(course);
//     }

//     @PostMapping("/{id}")
//     public Course updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
//         return courseService.updateCourse(id, updatedCourse);
//     }

//     @DeleteMapping("/{id}")
//     public void deleteCourse(@PathVariable Long id) {
//         courseService.deleteCourse(id);
//     }

    
// }

