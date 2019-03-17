package com.refactoring.ts.async.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.refactoring.ts.async.beans.City;

public interface CityRepository extends JpaRepository<City, Long> {

}
