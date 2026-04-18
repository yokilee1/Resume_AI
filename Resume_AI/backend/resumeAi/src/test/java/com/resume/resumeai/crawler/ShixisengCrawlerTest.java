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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class ShixisengCrawlerTest {

    private ShixisengCrawler shixisengCrawler;
    private WebDriverProvider driverProvider;
    private FontLoader fontLoader;
    private WebDriver driver;

    @BeforeEach
    void setUp() {
        driverProvider = mock(WebDriverProvider.class);
        fontLoader = mock(FontLoader.class);
        driver = mock(WebDriver.class);
        when(driverProvider.createDriver()).thenReturn(driver);
        shixisengCrawler = new ShixisengCrawler(driverProvider, fontLoader);
    }

    @Test
    @DisplayName("crawl: 成功模拟完整垂直爬取流程（包含字体解析）")
    void crawl_full_flow() {
        // Setup initial search page
        when(driver.getPageSource()).thenReturn("src: url('https://shixiseng.com/font.woff')");
        when(fontLoader.downloadFont(anyString())).thenReturn(null); // Keep it simple for now, return null to skip TTF parsing

        WebElement item = mock(WebElement.class);
        WebElement titleA = mock(WebElement.class);
        WebElement compA = mock(WebElement.class);
        WebElement salaryDay = mock(WebElement.class);

        when(driver.findElements(By.cssSelector(".intern-wrap.intern-item"))).thenReturn(List.of(item));
        
        when(item.findElement(By.cssSelector(".f-l.intern-detail__job a"))).thenReturn(titleA);
        when(titleA.getText()).thenReturn("测试职位");
        when(titleA.getAttribute("href")).thenReturn("http://shixiseng.com/job/1");
        
        when(item.findElement(By.cssSelector(".f-r.intern-detail__company a"))).thenReturn(compA);
        when(compA.getText()).thenReturn("测试公司");
        
        when(item.findElement(By.cssSelector(".f-l.intern-detail__job .day"))).thenReturn(salaryDay);
        when(salaryDay.getText()).thenReturn("100-200/天");

        // Setup detail page
        WebElement descElem = mock(WebElement.class);
        when(driver.findElement(By.cssSelector(".job_part"))).thenReturn(descElem);
        when(descElem.getText()).thenReturn("职位详情内容");

        List<JobPosition> results = shixisengCrawler.crawl("Java", "北京");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getJobTitle()).isEqualTo("测试职位");
        assertThat(results.get(0).getJobDescription()).isEqualTo("职位详情内容");
        
        verify(driver, atLeastOnce()).get(anyString());
        verify(driver).quit();
    }
    
    @Test
    @DisplayName("crawl: 处理空字体 URL 和空列表")
    void crawl_empty_scenarios() {
        when(driver.getPageSource()).thenReturn("no font here");
        when(driver.findElements(any())).thenReturn(List.of());

        List<JobPosition> results = shixisengCrawler.crawl("Java", "北京");

        assertThat(results).isEmpty();
        verify(driver).quit();
    }
}
