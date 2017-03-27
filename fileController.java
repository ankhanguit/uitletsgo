(/webapp/image)

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLDecoder;

import javax.servlet.ServletContext;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.fjs.live.common.Constants;

@RestController
@RequestMapping(value = "/file")
public class FileController {

	@RequestMapping(method = GET, value = "/{fileName:.+}")
	public void getImage(HttpServletResponse response, HttpServletRequest request,
			@PathVariable("fileName") String fileName) {
		try {
			String saveDirectory = request.getServletContext().getRealPath("/") + "\\image\\";
			File file = new File(saveDirectory, URLDecoder.decode(fileName, "UTF-8"));
			if (file.exists()) {

				String contentType = request.getServletContext().getMimeType(file.getName());
				response.setContentType(contentType);

				FileInputStream fin = new FileInputStream(file);
				ServletOutputStream out = response.getOutputStream();
				BufferedInputStream bin = new BufferedInputStream(fin);
				BufferedOutputStream bout = new BufferedOutputStream(out);
				int ch = 0;
				while ((ch = bin.read()) != -1) {
					bout.write(ch);
				}
				response.flushBuffer();
				bin.close();
				fin.close();
				bout.close();
				out.close();
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
