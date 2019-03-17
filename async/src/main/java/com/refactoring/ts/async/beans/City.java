package com.refactoring.ts.async.beans;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class City {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String cityCode;
	
	private String cityName;
	
	@OneToMany(mappedBy = "city")
	private Set<Subsidiary> subsidiaries;

	public Set<Subsidiary> getSubsidiaries() {
		return subsidiaries;
	}

	public void setSubsidiaries(Set<Subsidiary> subsidiaries) {
		this.subsidiaries = subsidiaries;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCityCode() {
		return cityCode;
	}

	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	
	
	 
}
