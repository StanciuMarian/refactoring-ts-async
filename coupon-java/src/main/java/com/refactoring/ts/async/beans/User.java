package com.refactoring.ts.async.beans;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Long countryId;

	private String cnp;
	
	private String fullName;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCountryId() {
		return countryId;
	}

	public User setCountryId(Long countryId) {
		this.countryId = countryId;
		return this;
	}

	public String getCnp() {
		return cnp;
	}

	public User setCnp(String cnp) {
		this.cnp = cnp;
		return this;
	}

	public String getFullName() {
		return fullName;
	}

	public User setFullName(String fullName) {
		this.fullName = fullName;
		return this;
	}
	
	

}
