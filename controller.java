/**
 * CREATED BY : KHANG-VA
 * Date : 2017/02/27
 * Copyright (c) 2000-2008 FUJINET, All Rights Reserved.
 * 
 */
package vn.fjs.live.controller.api;

import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NON_AUTHORITATIVE_INFORMATION;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.fjs.live.common.Constants;
import vn.fjs.live.dto.Users;
import vn.fjs.live.dto.request.AuthenticationRequest;
import vn.fjs.live.dto.response.AuthenticationResponse;
import vn.fjs.live.dto.response.MessageResponse;
import vn.fjs.live.dto.response.Response;
import vn.fjs.live.service.impl.AuthenticationServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

@CrossOrigin
@RestController
@Transactional(value = "transactionManager", readOnly = true)
@RequestMapping(value = "/user", headers = "Accept=application/json")
public class AuthenticationController {

	@Autowired
	AuthenticationServiceImpl authenticationService;

	@RequestMapping(method = GET)
	public ResponseEntity<Response> test() {
		List<Users> users = authenticationService.login("khang", "12345");
		if (users.size() > 0) {
			Users user = users.get(0);
			AuthenticationResponse res = new AuthenticationResponse(true, "Login successful", user);
			return new ResponseEntity<Response>(res, new HttpHeaders(), OK);
		}

		MessageResponse res = new MessageResponse();
		res.setMessage("Test oke");
		return new ResponseEntity<Response>(res, new HttpHeaders(), OK);
	}

	@Transactional(readOnly = false)
	@RequestMapping(method = POST, value = "/login")
	public ResponseEntity<Response> login(@RequestBody AuthenticationRequest data) {

		if (Constants.EMPTY.equals(data.getEmail()) || Constants.EMPTY.equals(data.getPassword())) {

			// validate error
			AuthenticationResponse res = new AuthenticationResponse(false, "Input empty", new Users());
			return new ResponseEntity<Response>(res, new HttpHeaders(), BAD_REQUEST);
			
			
		} else {

			List<Users> users = authenticationService.login(data.getEmail(), data.getPassword());
			if (users.size() > 0) {
				
				Users user = users.get(0);
				AuthenticationResponse res = new AuthenticationResponse(true, "Login successful", user);
				return new ResponseEntity<Response>(res, new HttpHeaders(), OK);
			}
		}

		AuthenticationResponse res = new AuthenticationResponse(false, "Login failure", new Users());
		return new ResponseEntity<Response>(res, new HttpHeaders(), NON_AUTHORITATIVE_INFORMATION);
	}
}
