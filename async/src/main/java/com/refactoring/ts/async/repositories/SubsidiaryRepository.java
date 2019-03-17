package com.refactoring.ts.async.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.refactoring.ts.async.beans.Subsidiary;

public interface SubsidiaryRepository extends JpaRepository<Subsidiary, Long>{

	List<Subsidiary> getSubsidiariesByCityCityCode(String cityCode);
	List<Subsidiary> getSubsidiariesByOperationsOperationCode(String operationCode);
}
