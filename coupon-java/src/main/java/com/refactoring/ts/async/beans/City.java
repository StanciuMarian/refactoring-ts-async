package com.refactoring.ts.async.beans;

import static java.util.Collections.unmodifiableList;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class City {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "city")
	private List<Store> stores = new ArrayList<>();
	
	private String name;

	@ManyToOne
	private Country country;

	private City() {
	}
	public City(String name) {
		this.name = name;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public List<Store> getStores() {
		return unmodifiableList(stores);
	}
	public City addStore(Store store) {
		stores.add(store);
		store.setCity(this);
		return this;
	}
	public String getName() {
		return name;
	}
	public City setName(String name) {
		this.name = name;
		return this;
	}
	public void setCountry(Country country) {
		this.country = country;
	}
	
	
	
 }
