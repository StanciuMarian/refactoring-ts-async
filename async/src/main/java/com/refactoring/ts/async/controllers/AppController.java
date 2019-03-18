package com.refactoring.ts.async.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.refactoring.ts.async.dto.CountryDto;
import com.refactoring.ts.async.dto.StoreDto;
import com.refactoring.ts.async.dto.CityDto;
import com.refactoring.ts.async.repositories.CountryRepository;
import com.refactoring.ts.async.repositories.StoreRepository;
import com.refactoring.ts.async.repositories.CityRepository;

@RestController
@RequestMapping("/api")
public class AppController {

	
	@Autowired
	private CountryRepository countryRepo;
	
	@Autowired
	private CityRepository cityRepo;
	
	@Autowired
	private StoreRepository storeRepo;
	
	
	@GetMapping("/countries")
	public List<CountryDto> getAllCountries() {
		return countryRepo.findAll().stream()
					.map(CountryDto::new)
					.collect(Collectors.toList());
	}
	
	@GetMapping("/countries/{countryId}/cities")
	public List<CityDto> getCitiesByCountry(@PathVariable Long countryId) {
		return cityRepo.findAllByCountryId(countryId).stream()
					.map(CityDto::new)
					.collect(Collectors.toList());
	}
	
	@GetMapping("/cities/{cityId}/stores")
	public List<StoreDto> getStoresByCity(@PathVariable Long cityId) {
		return storeRepo.findAllByCityId(cityId).stream()
					.map(StoreDto::new)
					.collect(Collectors.toList());
	}
	
}
