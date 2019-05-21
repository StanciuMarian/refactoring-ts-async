package com.refactoring.ts.async.beans;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Store {
	
	public enum Type {
		SMALL("Boutique"),
		MEDIUM("Shop"),
		LARGE("Hypermarket");
		private final String label;
		private Type(String label) {
			this.label = label;
		}
		public String getLabel() {
			return label;
		}
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private City city;
	
	private String name;
	
	@Enumerated(EnumType.STRING)
	private Type type;
	
	private Store() {
	}

	public Store(String name, Type type) {
		this.name = name;
		this.type = type;
	}

	public void setCity(City city) {
		this.city = city;
	}
	
	public Long getId() {
		return id;
	}
	
	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}


	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String operationName) {
		this.name = operationName;
	}
}
