package com.refactoring.ts.async.dto;

import com.refactoring.ts.async.beans.Store;

public class StoreDto {

	public Long id;
	public String name;
	public String storeTypeName;
	
	public StoreDto(Store store) {
		this.id = store.getId();
		this.name = store.getName();
		this.storeTypeName = store.getType().getLabel();
	}
	
}
