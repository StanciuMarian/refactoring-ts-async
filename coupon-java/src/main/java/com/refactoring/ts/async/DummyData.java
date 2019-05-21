package com.refactoring.ts.async;

import static java.util.Arrays.asList;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.refactoring.ts.async.beans.Country;
import com.refactoring.ts.async.beans.Store;
import com.refactoring.ts.async.beans.Store.Type;
import com.refactoring.ts.async.beans.City;
import com.refactoring.ts.async.beans.User;
import com.refactoring.ts.async.repositories.CountryRepository;
import com.refactoring.ts.async.repositories.StoreRepository;
import com.refactoring.ts.async.repositories.CityRepository;
import com.refactoring.ts.async.repositories.UserRepository;

@Component
public class DummyData implements CommandLineRunner {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private CountryRepository countryRepo;
	
	@Override
	public void run(String... args) throws Exception {
		Country romania = new Country("Romania")
			.setIso("RO")
			.addCity(new City("Bucharest")
					.addStore(new Store("Bucharest Militari", Type.MEDIUM))
					.addStore(new Store("Bucharest Metrou Politehnica", Type.SMALL))
					.addStore(new Store("Bucharest Military Residence", Type.LARGE))
					)
			.addCity(new City("Ploiesti")
					.addStore(new Store("Gara de Sud", Type.MEDIUM))
					.addStore(new Store("A7 #sîeu", Type.LARGE)));
		Country hungary = new Country("Hungary")
				.setIso("HU")
				.addCity(new City("Budapesta")
						.addStore(new Store("Budapesta North Train Station", Type.MEDIUM))
						.addStore(new Store("Budapesta Kaszásdűlő", Type.LARGE))
						.addStore(new Store("Budapesta Liszt Ferenc Airport", Type.SMALL))
						);
		
		countryRepo.saveAll(asList(romania, hungary));
		
		userRepo.saveAndFlush(new User()
				.setFullName("Marian Stanciu")
				.setCnp("1000000123456")
				.setCountryId(romania.getId())
				);
	}
}
