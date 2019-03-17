package com.refactoring.ts.async.beans;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

@Entity
public class Operation {

	@Id
	@Column(name = "operation_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String operationName;
	
	private String operationCode;

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name="Operation_Subsidiary",
			 joinColumns = {@JoinColumn(referencedColumnName = "operation_id")},
			 inverseJoinColumns = {@JoinColumn(referencedColumnName = "subsidiary_id")})
	private Set<Subsidiary> subsidiaries;
 
	public String getOperationCode() {
		return operationCode;
	}
	
	public void setOperationCode(String operationCode) {
		this.operationCode = operationCode;
	}
	
	public Long getId() {
		return id;
	}

	public Set<Subsidiary> getSubsidiaries() {
		return subsidiaries;
	}

	public void setSubsidiaries(Set<Subsidiary> subsidiaries) {
		this.subsidiaries = subsidiaries;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOperationName() {
		return operationName;
	}

	public void setOperationName(String operationName) {
		this.operationName = operationName;
	}
}
