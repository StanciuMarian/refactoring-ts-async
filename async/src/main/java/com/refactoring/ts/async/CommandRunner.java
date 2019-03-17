package com.refactoring.ts.async;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.refactoring.ts.async.beans.User;
import com.refactoring.ts.async.repositories.UserRepository;

@Component
public class CommandRunner implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public void run(String... args) throws Exception {
		User user = new User();
		user.setFirstName("Marian");
		user.setLastName("Stanciu");
		userRepository.saveAndFlush(user);
	}

}
