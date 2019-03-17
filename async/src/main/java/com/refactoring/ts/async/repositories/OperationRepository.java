package com.refactoring.ts.async.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.refactoring.ts.async.beans.Operation;

public interface OperationRepository extends JpaRepository<Operation, Long> {

}
