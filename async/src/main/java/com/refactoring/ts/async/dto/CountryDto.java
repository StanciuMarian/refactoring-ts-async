package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.Country;

public class CountryDto {
	public Long id;
	public String name;
	
	public CountryDto(Country country) {
		this.id = country.getId();
		this.name = country.getName();
	}

	
}
