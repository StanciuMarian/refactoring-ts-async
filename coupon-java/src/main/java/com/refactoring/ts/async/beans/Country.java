package com.refactoring.ts.async.beans;

import static java.util.Collections.unmodifiableList;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Country {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String iso;
	
	@OneToMany(cascade= CascadeType.ALL, mappedBy = "country")
	private List<City> cities = new ArrayList<>();

	private Country() {
	}

	public Country(String name) {
		this.name = name;
	}

	public List<City> getCities() {
		return unmodifiableList(cities);
	}

	public Country addCity(City city) {
		cities.add(city);
		city.setCountry(this);
		return this;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public String getIso() {
		return iso;
	}

	public Country setIso(String iso) {
		this.iso = iso;
		return this;
	}

	public Country setName(String cityName) {
		this.name = cityName;
		return this;
	}
	
	
	 
}
