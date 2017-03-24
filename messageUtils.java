package vn.fjs.live.utils;

import java.util.Locale;

import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ResourceBundleMessageSource;

import vn.fjs.live.common.DBConstants;

public class MessageUtils {

	/**
	 * Read file message.properties
	 * @return
	 */
	@Bean
	public static ResourceBundleMessageSource messageSource() {
		ResourceBundleMessageSource source = new ResourceBundleMessageSource();
		source.setBasename("META-INF/i18n/messages");
		source.setUseCodeAsDefaultMessage(true);
		return source;
	}

	/**
	 * Get message WITHOUT param
	 * @param messageKey
	 * @return message
	 */
	public static String getMessage(String messageKey) {
		return getMessage(messageKey, DBConstants.EMPTY);
	}

	/**
	 * Get message WITH param
	 * @param messegeKey
	 * @param params
	 * @return message
	 */
	public static String getMessage(String messegeKey, String... params) {
		return messageSource().getMessage(messegeKey, params, Locale.JAPANESE);
	}
}
