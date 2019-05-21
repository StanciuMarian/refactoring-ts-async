package com.refactoring.ts.async.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.refactoring.ts.async.beans.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
}
