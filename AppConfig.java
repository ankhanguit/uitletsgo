package fjn.vn.fjnlivestream.utils;

import android.content.Context;

import fjn.vn.fjnlivestream.model.Injection;
import fjn.vn.fjnlivestream.presenter.LoginPresenter;
import fjn.vn.fjnlivestream.presenter.LoginPresenterImpl;
import fjn.vn.fjnlivestream.presenter.SearchPresenter;
import fjn.vn.fjnlivestream.presenter.SearchPresenterImpl;
import fjn.vn.fjnlivestream.presenter.ShowStreamPresenter;
import fjn.vn.fjnlivestream.presenter.ShowStreamPresenterImpl;
import fjn.vn.fjnlivestream.presenter.StreamPresenter;
import fjn.vn.fjnlivestream.presenter.StreamPresenterImpl;
import fjn.vn.fjnlivestream.view.LoginFrag_;
import fjn.vn.fjnlivestream.view.SearchFrag_;
import fjn.vn.fjnlivestream.view.ShowStreamFrag_;
import fjn.vn.fjnlivestream.view.StreamFrag_;

/**
 * Created by quang-nh on 2017/03/20.
 */

public class AppConfig {
    public static final String STREAM_URL = "rtsp://172.16.10.162:1935/live";
    //public static final String STREAM_URL = "rtsp://10.0.2.2:1935/vod/sample.mp4";
    public static final String PUBLISHER_USERNAME = "quang-nh";
    public static final String PUBLISHER_PASSWORD = "A123";

    public static final String SERVER_HOST = "http://172.16.10.162";
    public static final String SERVER_PORT = "8080";
    public static final String SERVER_API = "/live_FJS/api/";
    public static final String SERVER_FILE_API = "/live_FJS/api/file/";


    public static LoginFrag_ loginFrag;
    public static SearchFrag_ searchFrag;
    public static StreamFrag_ streamFrag;
    public static ShowStreamFrag_ showStreamFrag;

    public static LoginPresenter loginPresenter;
    public static SearchPresenter searchPresenter;
    public static StreamPresenter streamPresenter;
    public static ShowStreamPresenter infoPresenter;

    public static void init(Context context) {
        loginFrag = LoginFrag_.newInstance();
        searchFrag = SearchFrag_.newInstance();
        streamFrag = StreamFrag_.newInstance();
        showStreamFrag = ShowStreamFrag_.newInstance();

        loginPresenter = new LoginPresenterImpl(Injection.provideTasksRepository(context), loginFrag);
        searchPresenter = new SearchPresenterImpl(Injection.provideTasksRepository(context), searchFrag);
        streamPresenter = new StreamPresenterImpl(Injection.provideTasksRepository(context), streamFrag);
        infoPresenter = new ShowStreamPresenterImpl(Injection.provideTasksRepository(context), showStreamFrag);
    }

    // Hàm tạo đường dẫn đến web server
    public static String createURL() {
        StringBuilder URL = new StringBuilder("");
        URL.append(SERVER_HOST);
        URL.append(":");
        URL.append(SERVER_PORT);
        URL.append(SERVER_API);

        return URL.toString();
    }

    // Hàm tạo đường dẫn đến thư mục file trên server
    public static String createFileURL() {
        StringBuilder URL = new StringBuilder("");
        URL.append(SERVER_HOST);
        URL.append(":");
        URL.append(SERVER_PORT);
        URL.append(SERVER_FILE_API);

        return URL.toString();
    }
}
