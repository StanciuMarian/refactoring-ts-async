package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.City;

public class CityDto {
	public Long id;
	public String name;
	
	public CityDto(City city) {
		this.id = city.getId();
		this.name = city.getName();
	}
}
