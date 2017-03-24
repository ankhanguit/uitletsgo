package vn.fjs.live.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import vn.fjs.live.dto.Users;

@Mapper
public interface AccountMapper {
	
	// thực hiện truy vấn database để xử lý đăng nhập
	List<Users> login(final @Param("username") String username, final @Param("password") String password);
}
