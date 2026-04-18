package com.resume.resumeai.crawler;

import org.springframework.stereotype.Component;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.ByteArrayOutputStream;

public interface FontLoader {
    byte[] downloadFont(String fontUrl);
}

@Component
class DefaultFontLoader implements FontLoader {
    @Override
    public byte[] downloadFont(String fontUrl) {
        try {
            URL url = new URL(fontUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            try (InputStream is = connection.getInputStream();
                 ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
                int nRead;
                byte[] data = new byte[1024];
                while ((nRead = is.read(data, 0, data.length)) != -1) {
                    buffer.write(data, 0, nRead);
                }
                return buffer.toByteArray();
            }
        } catch (Exception e) {
            return null;
        }
    }
}
