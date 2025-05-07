package com.example.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
private JwtUtil jwtUtil;

@Autowired
private UserDetailsService userDetailsService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // --- Streak Endpoints ---

    // Get user's current streak
    @GetMapping("/{id}/streak")
    public int getStreak(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return user != null ? user.getStreak() : 0;
    }

    // Update streak (should be called on learning activity)
    @PostMapping("/{id}/streak")
    public void updateStreak(@PathVariable Long id) {
        userService.updateStreak(id);
    }

    // Reset streak
    @PutMapping("/{id}/streak/reset")
    public void resetStreak(@PathVariable Long id) {
        userService.resetStreak(id);
    }

    // Set streak to a specific value (admin/debug)
    @PutMapping("/{id}/streak")
    public void setStreak(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer value = body.get("streak");
        userService.setStreak(id, value != null ? value : 0);
    }

    @PostMapping("/add")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/details")
    public User getUserByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.authenticateUser(email, password);

        try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
    final String jwt = jwtUtil.generateToken(userDetails.getUsername());

    return ResponseEntity.ok(Collections.singletonMap("token", jwt));
    }

    private String generateToken(User user) {
        return ("userId=" + user.getId() + ", email=" + user.getEmail());
    }

}
// package com.example.demo.controller;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.example.demo.entity.User;
// import com.example.demo.service.UserService;

// import java.util.Collections;
// import java.util.Date;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/users")
// public class UserController {

//     @Autowired
//     private UserService userService;

//     @GetMapping
//     public List<User> getAllUsers() {
//         return userService.getAllUsers();
//     }

//     @GetMapping("/{id}")
//     public User getUserById(@PathVariable Long id) {
//         return userService.getUserById(id);
//     }

//     @PostMapping("/add")
//     public User createUser(@RequestBody User user) {
//         return userService.createUser(user);
//     }

//     @PutMapping("/{id}")
//     public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
//         return userService.updateUser(id, updatedUser);
//     }

//     @DeleteMapping("/{id}")
//     public void deleteUser(@PathVariable Long id) {
//         userService.deleteUser(id);
//     }
//     @GetMapping("/details")
//     public User getUserByEmail(@RequestParam String email) {
//         return userService.getUserByEmail(email);
//     }
//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
//         String email = credentials.get("email");
//         String password = credentials.get("password");

//         User user = userService.authenticateUser(email, password);

//         if (user == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
//         }

//         String token = generateToken(user);

//         return ResponseEntity.ok(Collections.singletonMap("token", token));
//     }

//     private String generateToken(User user) {
//         return ("userId=" + user.getId() + ", email=" + user.getEmail());
//     }

// }