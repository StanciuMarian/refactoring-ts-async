package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.Operation;

public class OperationDto {

	public String operationName;
	public String operationCode;
	
	public OperationDto(Operation o) {
		operationCode = o.getOperationCode();
		operationName = o.getOperationName();
	}
}
