/**
 * CREATED BY : KHANG-VA
 * Date : 2017/03/17
 * Copyright (c) 2000-2008 FUJINET, All Rights Reserved.
 * 
 */

package vn.fjs.live.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * Data được gửi lên từ màn hình đăng nhập
 * @author khang-va
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AuthenticationRequest extends Request{
	
	// user account
	public String email;
	
	// password
	public String password;
	
	// keep alive
	public String rememberMe;
	
	public AuthenticationRequest() {
		this.email = "";
		this.password = "";
		this.rememberMe="0";
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRememberMe() {
		return rememberMe;
	}

	public void setRememberMe(String rememberMe) {
		this.rememberMe = rememberMe;
	}
}
