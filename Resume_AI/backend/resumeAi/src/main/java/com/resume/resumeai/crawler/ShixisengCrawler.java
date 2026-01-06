package com.resume.resumeai.crawler;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.Inflater;

import org.apache.fontbox.ttf.CmapSubtable;
import org.apache.fontbox.ttf.CmapTable;
import org.apache.fontbox.ttf.TTFParser;
import org.apache.fontbox.ttf.TrueTypeFont;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;

import com.resume.resumeai.domain.JobPosition;

import io.github.bonigarcia.wdm.WebDriverManager;

@Component("shixisengCrawler")
public class ShixisengCrawler implements BaseCrawler {

    // 参考 Bilibili 专栏提供的映射字典
    // https://www.bilibili.com/opus/890390821212258353
    private static final String PLAIN_TEXTS = "0123456789一师X会四计财场DHLPT聘招工d周|端p年hx设程二五天tCG前KO网SWcgkosw广市月个BF告NRVZ作bfjnrvz三互生人政AJEI件M行QUYaeim软qU银y联";

    @Override
    public List<JobPosition> crawl(String keyword, String city) {
        List<JobPosition> jobs = new ArrayList<>();
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); // 无头模式
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        // 设置中文环境，有助于避免部分编码问题
        options.addArguments("--lang=zh-CN");
        options.addArguments("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

        WebDriver driver = new ChromeDriver(options);
        try {
            // 实习僧搜索URL构造
            String url = "https://www.shixiseng.com/interns?keyword=" + keyword + "&city=" + city;
            driver.get(url);
            
            // 简单等待页面加载
            Thread.sleep(3000);

            // 1. 获取当前页面的字体 URL 并构建映射表
            String pageSource = driver.getPageSource();
            String fontUrl = extractFontUrl(pageSource);
            Map<Integer, Character> fontMap = buildFontMap(fontUrl);

            List<WebElement> items = driver.findElements(By.cssSelector(".intern-wrap.intern-item"));
            // 第一步：先收集列表页的基本信息和详情页链接
            for (WebElement item : items) {
                try {
                    JobPosition job = new JobPosition();
                    
                    String title = decodeText(item.findElement(By.cssSelector(".f-l.intern-detail__job a")).getText(), fontMap);
                    String company = decodeText(item.findElement(By.cssSelector(".f-r.intern-detail__company a")).getText(), fontMap);
                    String salary = decodeText(item.findElement(By.cssSelector(".f-l.intern-detail__job .day")).getText(), fontMap);
                    String link = item.findElement(By.cssSelector(".f-l.intern-detail__job a")).getAttribute("href");
                    
                    job.setJobTitle(title);
                    job.setCompanyName(company);
                    job.setSalary(salary);
                    job.setSourceUrl(link);
                    job.setLocation(city); 
                    job.setCrawlTime(LocalDateTime.now());
                    
                    jobs.add(job);
                } catch (Exception e) {
                    // 忽略单个解析错误
                    continue;
                }
            }

            // 第二步：逐个访问详情页获取职位描述
            for (JobPosition job : jobs) {
                try {
                    if (job.getSourceUrl() != null) {
                        driver.get(job.getSourceUrl());
                        // 随机延时 1-2秒，避免被反爬拦截
                        Thread.sleep(1000 + (long)(Math.random() * 1000));
                        
                        try {
                            // 详情页可能使用不同的字体，理论上应该重新解析
                            // 但通常同一会话或同一时间段内字体 URL 是固定的或者类似的，这里尝试复用或重新提取
                            String detailPageSource = driver.getPageSource();
                            String detailFontUrl = extractFontUrl(detailPageSource);
                            // 如果详情页字体不同，重新构建映射 (简单判断 URL 是否变化)
                            Map<Integer, Character> detailFontMap = fontMap;
                            if (detailFontUrl != null && !detailFontUrl.equals(fontUrl)) {
                                detailFontMap = buildFontMap(detailFontUrl);
                            }

                            // 尝试提取职位描述，实习僧通常使用 .job_part 类
                            WebElement descElement = driver.findElement(By.cssSelector(".job_part"));
                            String description = decodeText(descElement.getText(), detailFontMap);
                            job.setJobDescription(description);
                        } catch (Exception ex) {
                            job.setJobDescription("描述提取失败或无详情");
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Failed to crawl detail for: " + job.getJobTitle());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
        }
        return jobs;
    }

    /**
     * 从页面源码中提取 WOFF 字体 URL
     * 改进正则匹配，支持更多格式
     */
    private String extractFontUrl(String pageSource) {
        // 尝试匹配 src: url(...) 格式，兼容引号和不同后缀
        // 常见格式: src: url(https://www.shixiseng.com/interns/iconfonts/file?rand=0.123)
        // 改进：src:\s*url\(['"]?([^'\"()]+file\?[^'\"()]+)['"]?\
        Pattern pattern = Pattern.compile("src:\\s*url\\(['\"]?([^'\"()]+file\\?[^'\"()]+)['\"]?\\)");
        Matcher matcher = pattern.matcher(pageSource);
        if (matcher.find()) {
            String url = matcher.group(1).trim();
            if (!url.startsWith("http")) {
                // 处理相对路径
                if (url.startsWith("//")) {
                    url = "https:" + url;
                } else {
                    url = "https://www.shixiseng.com" + url;
                }
            }
            return url;
        }
        return null;
    }

    /**
     * 构建字体映射表
     * 改进：添加请求头，模拟浏览器行为，防止 403 Forbidden
     * 改进：支持 WOFF 格式转换
     */
    private Map<Integer, Character> buildFontMap(String fontUrl) {
        Map<Integer, Character> map = new HashMap<>();
        if (fontUrl == null || fontUrl.isEmpty()) {
            return map;
        }

        try {
            URL url = new URL(fontUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            // 设置关键请求头，防止 403 Forbidden
            connection.setRequestMethod("GET");
            // 使用与 Selenium 设置一致的 User-Agent
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            connection.setRequestProperty("Referer", "https://www.shixiseng.com/");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            // 检查响应码
            int responseCode = connection.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                System.err.println("Failed to download font. Response code: " + responseCode + ", URL: " + fontUrl);
                return map;
            }

            byte[] fontData;
            try (InputStream is = connection.getInputStream()) {
                 ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                 int nRead;
                 byte[] data = new byte[1024];
                 while ((nRead = is.read(data, 0, data.length)) != -1) {
                     buffer.write(data, 0, nRead);
                 }
                 fontData = buffer.toByteArray();
            }
            
            // 尝试转换 WOFF -> TTF
            try {
                fontData = convertWoffToTtf(fontData);
            } catch (Exception e) {
                System.err.println("WOFF conversion failed, trying as raw TTF: " + e.getMessage());
            }

            try (InputStream fontStream = new ByteArrayInputStream(fontData)) {
                TTFParser parser = new TTFParser();
                TrueTypeFont font = parser.parse(fontStream);
                
                // 获取 Cmap 表
                CmapSubtable cmap = font.getCmap().getSubtable(CmapTable.PLATFORM_UNICODE, CmapTable.ENCODING_UNICODE_1_0);
                if (cmap == null) {
                    cmap = font.getCmap().getSubtable(CmapTable.PLATFORM_UNICODE, CmapTable.ENCODING_UNICODE_2_0_BMP);
                }

                if (cmap != null) {
                    // FontBox 2.0 API 差异，FontBox 没有直接暴露 GlyphID 顺序的简单方法
                    // 但 CmapTable 存储了 charCode -> glyphId 的映射
                    // 我们需要遍历所有可能的 charCode，或者直接从 post/glyf 表反向查找
                    // 这里我们遍历 cmap 中的所有映射
                    // 实习僧通常使用 Private Use Area (PUA) 范围，通常在 E000 - F8FF
                    
                    for (int code = 0xE000; code <= 0xF8FF; code++) {
                        int glyphId = cmap.getGlyphId(code);
                        // glyphId 0 (.notdef) 和 1 (.null/nonmarkingreturn) 通常跳过
                        // 实习僧逻辑通常是 glyphId - 2 对应字典索引
                        if (glyphId > 1 && (glyphId - 2) < PLAIN_TEXTS.length()) {
                             char realChar = PLAIN_TEXTS.charAt(glyphId - 2);
                             map.put(code, realChar);
                        }
                    }
                }
                font.close();
                System.out.println("Font map built with " + map.size() + " entries from " + fontUrl);
            }
        } catch (Exception e) {
            System.err.println("Failed to build font map from " + fontUrl + ": " + e.getMessage());
        }
        return map;
    }
    
    /**
     * 将 WOFF 1.0 格式字节数组转换为 TTF 格式字节数组
     */
    private byte[] convertWoffToTtf(byte[] woffData) throws Exception {
        try (DataInputStream in = new DataInputStream(new ByteArrayInputStream(woffData))) {
            // WOFF Header
            int signature = in.readInt();
            if (signature != 0x774F4646) { // "wOFF"
                return woffData; // Not WOFF, return original
            }
            int flavor = in.readInt();
            int length = in.readInt();
            short numTables = in.readShort();
            short reserved = in.readShort();
            int totalSfntSize = in.readInt();
            short majorVersion = in.readShort();
            short minorVersion = in.readShort();
            int metaOffset = in.readInt();
            int metaLength = in.readInt();
            int metaOrigLength = in.readInt();
            int privOffset = in.readInt();
            int privLength = in.readInt();
            
            // Table Directory Entries
            class TableDirectoryEntry {
                int tag;
                int offset;
                int compLength;
                int origLength;
                int origChecksum;
                byte[] data;
            }
            
            TableDirectoryEntry[] tables = new TableDirectoryEntry[numTables];
            // Read WOFF directory
            for (int i = 0; i < numTables; i++) {
                tables[i] = new TableDirectoryEntry();
                tables[i].tag = in.readInt();
                tables[i].offset = in.readInt();
                tables[i].compLength = in.readInt();
                tables[i].origLength = in.readInt();
                tables[i].origChecksum = in.readInt();
            }
            
            // Prepare Output
            ByteArrayOutputStream ttfOut = new ByteArrayOutputStream(totalSfntSize);
            DataOutputStream out = new DataOutputStream(ttfOut);
            
            // Write TTF Header
            out.writeInt(flavor);
            out.writeShort(numTables);
            // Calculate searchRange, entrySelector, rangeShift
            int entrySelector = 0;
            while ((1 << (entrySelector + 1)) <= numTables) {
                entrySelector++;
            }
            int searchRange = (1 << entrySelector) * 16;
            int rangeShift = numTables * 16 - searchRange;
            
            out.writeShort(searchRange);
            out.writeShort(entrySelector);
            out.writeShort(rangeShift);
            
            // Calculate offsets and prepare table data
            int currentOffset = 12 + numTables * 16; // Start after TTF header + directory
            
            // We must process tables in order to write directory correctly?
            // No, the directory must list tables. The offset in directory must point to where we write the data.
            // We will write data sequentially after the directory.
            
            for (TableDirectoryEntry table : tables) {
                // Align to 4 bytes
                while (currentOffset % 4 != 0) {
                    currentOffset++;
                }
                
                // Read data from WOFF
                byte[] tableData = new byte[table.compLength];
                System.arraycopy(woffData, table.offset, tableData, 0, table.compLength);
                
                if (table.compLength < table.origLength) {
                    // Decompress
                    Inflater inflater = new Inflater();
                    inflater.setInput(tableData);
                    byte[] decompressed = new byte[table.origLength];
                    int resultLength = inflater.inflate(decompressed);
                    inflater.end();
                    if (resultLength != table.origLength) {
                        // Warning or error?
                    }
                    table.data = decompressed;
                } else {
                    table.data = tableData;
                }
                
                // Update table offset for TTF directory
                // We use a temporary field or just write directory now?
                // We need to write directory first.
                // But we need to know offsets.
                // So we calculate offsets in this loop, but write directory later?
                // Or write directory now and data later?
                // Wait, we need to iterate twice.
                // First pass: Read/Decompress data and calculate offsets.
                // Second pass: Write Directory.
                // Third pass: Write Data.
            }

            // Let's recalculate offsets properly
            int dataOffset = 12 + numTables * 16;
            for (TableDirectoryEntry table : tables) {
                 while (dataOffset % 4 != 0) {
                    dataOffset++;
                }
                table.offset = dataOffset; // Reuse offset field for TTF offset
                dataOffset += table.data.length;
            }
            
            // Write TTF Directory
            for (TableDirectoryEntry table : tables) {
                out.writeInt(table.tag);
                out.writeInt(table.origChecksum);
                out.writeInt(table.offset);
                out.writeInt(table.origLength);
            }
            
            // Write Table Data
            for (TableDirectoryEntry table : tables) {
                while (ttfOut.size() % 4 != 0) {
                    out.write(0);
                }
                out.write(table.data);
            }
            
            return ttfOut.toByteArray();
        }
    }

    /**
     * 使用映射表解码文本
     */
    private String decodeText(String text, Map<Integer, Character> fontMap) {
        if (text == null) return "";
        if (fontMap == null || fontMap.isEmpty()) return cleanText(text);

        StringBuilder sb = new StringBuilder();
        for (char c : text.toCharArray()) {
            int code = (int) c;
            if (fontMap.containsKey(code)) {
                sb.append(fontMap.get(code));
            } else {
                sb.append(c);
            }
        }
        return cleanText(sb.toString());
    }

    /**
     * 清洗文本，去除不可见字符
     */
    private String cleanText(String text) {
        if (text == null) return "";
        // 去除首尾空格和常见的不可见字符
        return text.trim().replaceAll("[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f]", "");
    }
}
