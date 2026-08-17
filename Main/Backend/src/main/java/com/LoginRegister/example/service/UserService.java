package com.LoginRegister.example.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.repository.UsersRepo;
import com.LoginRegister.example.requests.LoginRequest;
import com.LoginRegister.example.requests.LoginResponse;

@Service
public class UserService {
	
	@Autowired 
	UsersRepo usersRepo;
	
	public Users addUser(Users user) {
		
		return usersRepo.save(user);
		
	}
	public LoginResponse loginUser(LoginRequest loginRequest) {

    Optional<Users> user = usersRepo.findById(loginRequest.getUserId());

    if (user.isEmpty()) {
        return new LoginResponse(false, null);
    }

    Users user1 = user.get();

    if (!user1.getPassword().equals(loginRequest.getPassword())) {
        return new LoginResponse(false, null);
    }

    return new LoginResponse(true, user1.getRole());
}

}
