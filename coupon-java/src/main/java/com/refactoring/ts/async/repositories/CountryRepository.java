package com.refactoring.ts.async.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.refactoring.ts.async.beans.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {

}
