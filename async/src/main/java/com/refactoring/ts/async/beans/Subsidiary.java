package com.refactoring.ts.async.beans;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Entity
public class Subsidiary {

	
	@Id
	@Column(name = "subsidiary_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToMany(mappedBy = "subsidiaries")
	
	private Set<Operation> operations;
	
	private String subsidiaryCode;
	
	private String subsidiaryName;
	
	@ManyToOne()
	private City city;
	
	public City getCity() {
		return city;
	}
	public void setCity(City city) {
		this.city = city;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Set<Operation> getOperations() {
		return operations;
	}
	public void setOperations(Set<Operation> operations) {
		this.operations = operations;
	}
	public String getSubsidiaryCode() {
		return subsidiaryCode;
	}
	public void setSubsidiaryCode(String subsidiaryCode) {
		this.subsidiaryCode = subsidiaryCode;
	}
	public String getSubsidiaryName() {
		return subsidiaryName;
	}
	public void setSubsidiaryName(String subsidiaryName) {
		this.subsidiaryName = subsidiaryName;
	}
	
	
 }
