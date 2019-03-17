package com.refactoring.ts.async;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.refactoring.ts.async.beans.City;
import com.refactoring.ts.async.beans.Operation;
import com.refactoring.ts.async.beans.Subsidiary;
import com.refactoring.ts.async.beans.User;
import com.refactoring.ts.async.repositories.CityRepository;
import com.refactoring.ts.async.repositories.OperationRepository;
import com.refactoring.ts.async.repositories.SubsidiaryRepository;
import com.refactoring.ts.async.repositories.UserRepository;

@Component
public class CommandRunner implements CommandLineRunner {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired 
	private SubsidiaryRepository subsidiaryRepo;
	
	@Autowired 
	private OperationRepository operationRepo;
	
	@Autowired
	private CityRepository cityRepo;
	
	@Override
	public void run(String... args) throws Exception {
		User user = new User();
		user.setFirstName("Marian");
		user.setLastName("Stanciu");
		userRepo.saveAndFlush(user);
		
		City city = new City();
		city.setCityCode("B");
		city.setCityName("Bucuresti");
		cityRepo.saveAndFlush(city);
		
		Subsidiary s = new Subsidiary();
		s.setSubsidiaryCode("ABC");
		s.setSubsidiaryName("BANKING COTROCENI");
		s.setCity(city);
		subsidiaryRepo.saveAndFlush(s);
		
		Operation o = new Operation();
		o.setOperationName("Retragere");
		o.setOperationCode("RT");
		operationRepo.saveAndFlush(o);
		
	    Set<Subsidiary> subsidiaries = new HashSet<>();
	    subsidiaries.add(s);
	    
	    Set<Operation> operations = new HashSet<>();
	    operations.add(o);
		o.setSubsidiaries(subsidiaries);
		s.setOperations(operations);
		
		subsidiaryRepo.saveAndFlush(s);
		operationRepo.saveAndFlush(o);
		
	}
}
