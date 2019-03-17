package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.User;

public class UserDto {

	public String firstName;
	public String lastName;
	
	public UserDto(User user) {
		firstName = user.getFirstName();
		lastName = user.getLastName();
	}
}
