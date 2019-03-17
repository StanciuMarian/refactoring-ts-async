package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.City;

public class CityDto {

	public String cityCode;
	public String cityName;
	
	public CityDto(City city) {
		cityCode = city.getCityCode();
		cityName = city.getCityName();
	}
}
