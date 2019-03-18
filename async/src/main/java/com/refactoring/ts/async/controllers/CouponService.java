package com.refactoring.ts.async.controllers;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.refactoring.ts.async.repositories.StoreRepository;

@Service
public class CouponService {
	@Autowired
	private StoreRepository storeRepo;
	

	public boolean validateBF(String bf, long storeId) {
		if (storeRepo.findById(storeId) == null) {
			return false;
		}
		if (bf.length() == 4 && bf.charAt(0) == bf.charAt(3)) { // fake ;P
			return true; 
		} else {
			return false; 
		}
	}
	
	public String generateCoupon(String bf, String cnp) {
		try { 
			MessageDigest md = MessageDigest.getInstance("SHA-512"); 
			byte[] messageDigest = md.digest((bf+cnp).getBytes()); 
			BigInteger no = new BigInteger(1, messageDigest); 
			String hashtext = no.toString(16); 
			while (hashtext.length() < 32) { 
				hashtext = "0" + hashtext; 
			} 
			return hashtext.substring(0, 8); 
		} catch (NoSuchAlgorithmException e) { 
			throw new RuntimeException(e); 
		} 
	}
}
