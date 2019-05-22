package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.User;

public class UserDto {

	public Long countryCode;
	public String cnp;
	public String fullName;
	
	public UserDto(User user) {
		this.countryCode = user.getCountryId();
		this.cnp = user.getCnp();
		this.fullName = user.getFullName();
	}
	
}
