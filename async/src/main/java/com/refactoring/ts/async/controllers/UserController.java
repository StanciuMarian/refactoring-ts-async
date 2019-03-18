package com.refactoring.ts.async.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.refactoring.ts.async.beans.User;
import com.refactoring.ts.async.dto.UserDto;
import com.refactoring.ts.async.repositories.UserRepository;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private UserRepository userRepo;
	
	@GetMapping("/current-user") 
	public UserDto getCurrentUser() {
		User onlyUser = userRepo.findAll().get(0);
		return new UserDto(onlyUser);
	}
}
