package com.travel.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

public class NavbarAndSearchTest {

    WebDriver driver;

    @BeforeClass
    public void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:4200");
    }

    @Test(priority = 1)
    public void verifyTitleAndNavbar() {
        String title = driver.getTitle();
        System.out.println("Page title: " + title);
        Assert.assertNotNull(title);
    }

    @Test(priority = 2)
    public void testNavbarNavigation() {
        WebElement destLink = driver.findElement(By.linkText("Destinations"));
        destLink.click();

        new WebDriverWait(driver, Duration.ofSeconds(5)).until(
            d -> d.getCurrentUrl().contains("/destinations")
        );

        Assert.assertTrue(driver.getCurrentUrl().contains("/destinations"));
    }

    @Test(priority = 3)
    public void testSearchInput() {
        driver.get("http://localhost:4200");

        WebElement searchBox = driver.findElement(By.xpath("//input[@placeholder='Search destinations']"));
        searchBox.sendKeys("Goa");

        new WebDriverWait(driver, Duration.ofSeconds(5)).until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("ul.list-group li")
        ));

        WebElement firstSuggestion = driver.findElement(By.cssSelector("ul.list-group li"));
        System.out.println("First suggestion: " + firstSuggestion.getText());
        firstSuggestion.click();
    }

    @Test(priority = 4)
    public void testAccountDropdown() {
        WebElement dropdownToggle = driver.findElement(By.cssSelector(".fa-user-circle"));
        dropdownToggle.click();

        new WebDriverWait(driver, Duration.ofSeconds(3)).until(ExpectedConditions.visibilityOfElementLocated(
            By.className("dropdown-menu")
        ));

        WebElement dropdownMenu = driver.findElement(By.className("dropdown-menu"));
        Assert.assertTrue(dropdownMenu.isDisplayed());
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}
