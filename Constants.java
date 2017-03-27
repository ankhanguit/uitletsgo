package fjn.vn.fjnlivestream.model;

import android.provider.BaseColumns;

public final class DbConstants {
    private DbConstants() {
    }

    /**
     * Định nghĩa nội dung bảng Task trong database .
     */
    public static abstract class TaskEntry implements BaseColumns {
        public static final String TABLE_NAME = "task";
        public static final String COLUMN_NAME_ENTRY_ID = "entryid";
        public static final String COLUMN_NAME_TITLE = "title";
        public static final String COLUMN_NAME_DESCRIPTION = "description";
        public static final String COLUMN_NAME_COMPLETED = "completed";
    }
}
