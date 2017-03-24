/**
 * CREATED BY : KHANG-VA
 * Date : 2017/03/17
 * Copyright (c) 2000-2008 FUJINET, All Rights Reserved.
 * 
 */
package vn.fjs.live.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * Thông tin người đùng ánh xạ đến table fu001 của database
 * @author khang-va
 *
 */
@Data
public class Users implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String id;
	
    private String name;

    private String avatar;

    private String birthday;

    private String email;

    private String gender;
    
    public Users() {
    	this.name = "";
        this.avatar = "";
        this.birthday = "";
        this.email = "";
        this.gender = "";
        this.id = "";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
    
}
