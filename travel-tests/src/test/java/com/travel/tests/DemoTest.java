package com.travel.tests;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.*;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

public class DemoTest {

    WebDriver driver;

    @BeforeClass
    public void setup() {
        // ✅ Automatically handles downloading and configuring chromedriver
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        // Optional: Wait implicitly for elements
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @Test
    public void openTravelApp() {
        driver.get("http://localhost:4200");  // Replace if your local app runs elsewhere
        String title = driver.getTitle();
        System.out.println("Page Title is: " + title);
        assert title != null && !title.trim().isEmpty() : "Title should not be empty!";
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
