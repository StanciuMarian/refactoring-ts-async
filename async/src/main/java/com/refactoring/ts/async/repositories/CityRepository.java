package com.refactoring.ts.async.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.refactoring.ts.async.beans.City;

public interface CityRepository extends JpaRepository<City, Long>{
	List<City> findAllByCountryId(Long countryId);
}
