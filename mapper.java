/**
 * CREATED BY : KHANG-VA
 * Date : 2017/03/17
 * Copyright (c) 2000-2008 FUJINET, All Rights Reserved.
 * 
 */
package vn.fjs.live.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import vn.fjs.live.dto.Users;

/**
 * Mapping lên đến file src/resrourcé/vn/fjs/live/persistence/AccountMapper.xml
 */
@Mapper
public interface AccountMapper {
	
	// thực hiện truy vấn database để xử lý đăng nhập
	List<Users> login(final @Param("username") String username, final @Param("password") String password);
}
