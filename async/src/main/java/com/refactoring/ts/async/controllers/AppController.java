package com.refactoring.ts.async.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.refactoring.ts.async.dto.CityDto;
import com.refactoring.ts.async.dto.OperationDto;
import com.refactoring.ts.async.dto.SubsidiaryDto;
import com.refactoring.ts.async.repositories.CityRepository;
import com.refactoring.ts.async.repositories.OperationRepository;
import com.refactoring.ts.async.repositories.SubsidiaryRepository;

@RestController
@RequestMapping("/api")
public class AppController {

	
	@Autowired
	private CityRepository cityRepo;
	
	@Autowired
	private SubsidiaryRepository subsidiaryRepo;
	
	@Autowired
	private OperationRepository operationRepo;
	
	
	@GetMapping("/cities")
	public List<CityDto> getCities() {
		return cityRepo.findAll().stream()
					.map(CityDto::new)
					.collect(Collectors.toList());
	}
	
	@GetMapping("/subisidiariesByCityCode")
	public List<SubsidiaryDto> getSubsidiariesByCityCode(@RequestParam String cityCode) {
		return subsidiaryRepo.getSubsidiariesByCityCityCode(cityCode).stream()
					.map(SubsidiaryDto::new)
					.collect(Collectors.toList());
	}
	
	@GetMapping("/subisidiariesByOperationCode")
	public List<SubsidiaryDto> getSubsidiariesByOperationCode(@RequestParam String operationCode) {
		return subsidiaryRepo.getSubsidiariesByOperationsOperationCode(operationCode).stream()
					.map(SubsidiaryDto::new)
					.collect(Collectors.toList());
	}
	
	
	@GetMapping("/operation")
	public List<OperationDto> getOperations() {
		return operationRepo.findAll().stream()
					.map(OperationDto::new)
					.collect(Collectors.toList());
	}
}
