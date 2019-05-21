package com.refactoring.ts.async.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.refactoring.ts.async.dto.CityDto;
import com.refactoring.ts.async.dto.CountryDto;
import com.refactoring.ts.async.dto.CouponForm;
import com.refactoring.ts.async.dto.StoreDto;
import com.refactoring.ts.async.repositories.CityRepository;
import com.refactoring.ts.async.repositories.CountryRepository;
import com.refactoring.ts.async.repositories.StoreRepository;

@RestController
@RequestMapping("/api")
public class AppController {

	
	@Autowired
	private CountryRepository countryRepo;
	
	@Autowired
	private CityRepository cityRepo;
	
	@Autowired
	private StoreRepository storeRepo;
	
	@Autowired
	private CouponService couponService;
	
	
	@GetMapping("/countries")
	public List<CountryDto> getAllCountries() {
		return countryRepo.findAll().stream()
					.map(CountryDto::new)
					.collect(Collectors.toList());
	}
	
	@GetMapping("/countries/{countryIso}/cities")
	public List<CityDto> getCitiesByCountry(@PathVariable String countryIso) {
		return cityRepo.findAllByCountryIso(countryIso).stream()
					.map(CityDto::new)
					.collect(Collectors.toList());
	}
	
	@GetMapping("/cities/{cityId}/stores")
	public List<StoreDto> getStoresByCity(@PathVariable Long cityId) {
		return storeRepo.findAllByCityId(cityId).stream()
					.map(StoreDto::new)
					.collect(Collectors.toList());
	}
	
	
	@GetMapping("/validateReceiptId")
	public void validateReceiptId(@RequestParam String bf, @RequestParam long storeId) {
		if (!couponService.validateReceiptId(bf, storeId)) {
			throw new IllegalArgumentException();
		}
	}
	
	@PostMapping("/coupon")
	public String requestCoupon(@RequestBody CouponForm form) {
		if (!couponService.validateReceiptId(form.receiptId, form.storeId)) {
			throw new IllegalArgumentException();
		}
		return couponService.generateCoupon(form.receiptId, form.cnp);
	}
	
}
