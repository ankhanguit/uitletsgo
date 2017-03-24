package vn.fjs.live.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.fjs.live.dto.Users;
import vn.fjs.live.persistence.AccountMapper;
import vn.fjs.live.service.AuthenticationService;

@Service
public class AuthenticationServiceImpl implements AuthenticationService{

	@Autowired
	AccountMapper accountMapper;

	/**
	 * Chuyển tiếp yêu cầu đăng nhập từ controller đến persistence
	 */
	@Override
	public List<Users> login(String username, String password) {
		// TODO Auto-generated method stub
		return accountMapper.login(username, password);
	}
}
