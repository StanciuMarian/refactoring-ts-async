package com.refactoring.ts.async.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.refactoring.ts.async.beans.Store;

public interface StoreRepository extends JpaRepository<Store, Long> {
	List<Store> findAllByCityId(Long cityId);
}
