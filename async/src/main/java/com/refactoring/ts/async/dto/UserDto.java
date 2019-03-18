package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.User;

public class UserDto {

	public Long countryId;
	public Long cityId;
	
	public String cnp;
	public String fullName;
	
	public UserDto(User user) {
		this.countryId = user.getCountryId();
		this.cityId = user.getCityId();
		this.cnp = user.getCnp();
		this.fullName = user.getFullName();
	}
	

	
}
