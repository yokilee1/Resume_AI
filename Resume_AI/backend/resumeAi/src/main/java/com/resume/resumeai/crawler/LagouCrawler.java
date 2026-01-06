package com.resume.resumeai.crawler;

import com.resume.resumeai.domain.JobPosition;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component("lagouCrawler")
public class LagouCrawler implements BaseCrawler {

    @Override
    public List<JobPosition> crawl(String keyword, String city) {
        List<JobPosition> jobs = new ArrayList<>();
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

        WebDriver driver = new ChromeDriver(options);
        try {
            // 拉勾搜索URL (拉勾反爬较严，可能需要登录Cookie，这里尝试公开搜索页)
            String url = "https://www.lagou.com/jobs/list_" + keyword + "?city=" + city;
            driver.get(url);
            
            Thread.sleep(5000); // 等待较长加载时间

            // 拉勾页面结构经常变动，以下为示例选择器
            List<WebElement> items = driver.findElements(By.cssSelector(".item__10RTO"));
            
            for (WebElement item : items) {
                try {
                    JobPosition job = new JobPosition();
                    String title = item.findElement(By.cssSelector(".p-top__1F7CL a")).getText();
                    String company = item.findElement(By.cssSelector(".company-name__2-SjF a")).getText();
                    String salary = item.findElement(By.cssSelector(".money__3Lkgq")).getText();
                    String link = item.findElement(By.cssSelector(".p-top__1F7CL a")).getAttribute("href");
                    String loc = item.findElement(By.cssSelector(".position__21iO4")).getText(); // 包含地点信息

                    job.setJobTitle(title);
                    job.setCompanyName(company);
                    job.setSalary(salary);
                    job.setSourceUrl(link);
                    job.setLocation(loc);
                    job.setJobDescription("详见链接");
                    job.setCrawlTime(LocalDateTime.now());
                    
                    jobs.add(job);
                } catch (Exception e) {
                    continue;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
        }
        return jobs;
    }
}
