package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.Subsidiary;

public class SubsidiaryDto {

	
	public String subsidiaryCode;
	public String subsidiaryName;
	
	
	public SubsidiaryDto(Subsidiary subsidiary) {
		subsidiaryCode = subsidiary.getSubsidiaryCode();
		subsidiaryName = subsidiary.getSubsidiaryName();
	}
}
