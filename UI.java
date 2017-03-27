package fjn.vn.fjnlivestream.utils;

import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;

import fjn.vn.fjnlivestream.R;

public class UI {
    public static void show_Screen (@NonNull FragmentManager fragmentManager,
                                           @NonNull Fragment fragment) {

        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.add(R.id.cFrame, fragment);
        transaction.commit();
    }

    public static void switch_Screen(Fragment current, Fragment next){
        FragmentTransaction transaction = current.getFragmentManager().beginTransaction();
        transaction.replace(R.id.cFrame, next);
        transaction.commit();
    }
}
