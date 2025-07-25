package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import java.util.List;
import java.time.LocalDate;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            return userRepository.save(existingUser);
        }
        return null;
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User authenticateUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // --- Streak logic ---
    public void updateStreak(Long userId) {
        User user = getUserById(userId);
        if (user == null) return;

        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null || lastActive.isBefore(today.minusDays(1))) {
            user.setStreak(1);
        } else if (lastActive.isEqual(today.minusDays(1))) {
            user.setStreak(user.getStreak() + 1);
        }
        // If already updated today, do nothing

        user.setLastActiveDate(today);
        saveUser(user);
    }
    public void resetStreak(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setStreak(0);
            userRepository.save(user);
        }
    }
    public void setStreak(Long id, int streak) {
        // Logic to set the streak for the user with the given id
        User user = getUserById(id);
        if (user != null) {
            user.setStreak(streak);
            // Save the updated user (assuming a repository exists)
            userRepository.save(user);
        }
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
// package com.example.demo.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.example.demo.entity.User;
// import com.example.demo.repository.UserRepository;

// import java.util.List;

// @Service
// public class UserService {

//     @Autowired
//     private UserRepository userRepository;

//     public List<User> getAllUsers() {
//         return userRepository.findAll();
//     }

//     public User getUserById(Long id) {
//         return userRepository.findById(id).orElse(null);
//     }

//     public User createUser(User user) {
//         return userRepository.save(user);
//     }

//     public User updateUser(Long id, User updatedUser) {
//         User existingUser = userRepository.findById(id).orElse(null);
//         if (existingUser != null) {
//             existingUser.setUsername(updatedUser.getUsername());
//             existingUser.setEmail(updatedUser.getEmail());
//             return userRepository.save(existingUser);
//         }
//         return null;
//     }
    
//     public User getUserByEmail(String email) {
//         return userRepository.findByEmail(email);
//     }
    
//     public User authenticateUser(String email, String password) {
//         return userRepository.findByEmailAndPassword(email, password);
//     }

//     public void deleteUser(Long id) {
//         userRepository.deleteById(id);
//     }
// }
