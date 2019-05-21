package com.refactoring.ts.async;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@Autowired
	private MessageSource messageSource;

	@ResponseBody
	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorResponse handleBusinessException(HttpServletRequest request, IllegalArgumentException exception) {
		String messageKey = exception.getMessage();
		String userMessage = messageSource.getMessage(messageKey, new Object[] {}, messageKey, Locale.ENGLISH);
		return new ErrorResponse(messageKey, userMessage);
	}
	
	class ErrorResponse {
		public String messageKey;
		public String userMessage;
		
		public ErrorResponse(String messagekey,String userMessage) {
			this.messageKey = messagekey;
			this.userMessage = userMessage;
		}
	}
}
