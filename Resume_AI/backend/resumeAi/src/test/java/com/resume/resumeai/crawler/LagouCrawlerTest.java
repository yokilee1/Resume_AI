package com.resume.resumeai.crawler;

import com.resume.resumeai.domain.JobPosition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LagouCrawlerTest {

    private LagouCrawler lagouCrawler;
    private WebDriverProvider driverProvider;
    private WebDriver driver;

    @BeforeEach
    void setUp() {
        driverProvider = mock(WebDriverProvider.class);
        driver = mock(WebDriver.class);
        when(driverProvider.createDriver()).thenReturn(driver);
        lagouCrawler = new LagouCrawler(driverProvider);
    }

    @Test
    @DisplayName("crawl: 成功模拟拉勾页面解析并收集数据")
    void crawl_success() {
        WebElement item = mock(WebElement.class);
        WebElement titleElem = mock(WebElement.class);
        WebElement companyElem = mock(WebElement.class);
        WebElement salaryElem = mock(WebElement.class);
        WebElement locElem = mock(WebElement.class);

        when(driver.findElements(any(By.class))).thenReturn(List.of(item));
        when(item.findElement(By.cssSelector(".p-top__1F7CL a"))).thenReturn(titleElem);
        when(titleElem.getText()).thenReturn("Java Engineer");
        when(titleElem.getAttribute("href")).thenReturn("http://lagou.com/job1");
        
        when(item.findElement(By.cssSelector(".company-name__2-SjF a"))).thenReturn(companyElem);
        when(companyElem.getText()).thenReturn("Cool Tech");
        
        when(item.findElement(By.cssSelector(".money__3Lkgq"))).thenReturn(salaryElem);
        when(salaryElem.getText()).thenReturn("20k-30k");
        
        when(item.findElement(By.cssSelector(".position__21iO4"))).thenReturn(locElem);
        when(locElem.getText()).thenReturn("Beijing");

        List<JobPosition> results = lagouCrawler.crawl("Java", "北京");

        assertThat(results).hasSize(1);
        JobPosition job = results.get(0);
        assertThat(job.getJobTitle()).isEqualTo("Java Engineer");
        assertThat(job.getCompanyName()).isEqualTo("Cool Tech");
        verify(driver).quit();
    }
}
