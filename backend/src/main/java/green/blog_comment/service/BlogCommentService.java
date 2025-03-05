package green.blog_comment.service;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Duration;

@Service
public class BlogCommentService {

    @Value("${app.naver.login.clientId}")
    private String clientId;

    @Value("${app.backend.url}")
    private String backendBaseUrl;

    @Value("${app.naver.login.auth.baseUrl}")
    private String naverApiBaseUrl;


    public void postComment() throws Exception {
        // ChromeDriver 경로 설정 (환경에 맞게 수정)
        System.setProperty("webdriver.chrome.driver", "/opt/homebrew/bin/chromedriver");

        // ChromeOptions 설정 (헤드리스 모드 사용 가능)
        ChromeOptions options = new ChromeOptions();
        //options.addArguments("--headless"); // 브라우저 창 없이 실행
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920x1080");

        WebDriver driver = new ChromeDriver(options);

        try {
            String CALLBACK_URL = backendBaseUrl + "api/oauth/naver/login/callback";
            // 로그인 기능 구현
            String url = naverApiBaseUrl + "authorize?response_type=code&client_id=" +
                    clientId +
                    "&redirect_uri=" +
                    CALLBACK_URL +
                    "&state=" +
                    "blog-comment";
            // 로그인 페이지 이동
            driver.get(url);

            boolean isBlogFound = waitForBlogId(driver, 1200, 1000);
            if(!isBlogFound) return;

            String currentUrl = driver.getCurrentUrl();
            String queryString = "";
            String logNo = "";

            URL queryurl = new URL(currentUrl);
            queryString = queryurl.getQuery();

            String[] queryParts = queryString.split("=");
            logNo = queryParts[queryParts.length - 1];


            String blogUrl = "https://blog.naver.com/PostView.naver?" + queryString;
            // 블로그 게시글로 이동
            driver.get(blogUrl);

            // 댓글 열기 버튼
            WebElement commentBtnElement = driver.findElement(By.id("Comi" + logNo));
            // 댓글 영역 열기
            commentBtnElement.click();

            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("arguments[0].scrollIntoView(true);", commentBtnElement);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));

            // 댓글 입력 요소
            WebElement commentElement = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.id("naverComment_201_" + logNo + "__write_textarea")
            ));
            // 댓글 입력
            commentElement.sendKeys("안녕하세요! 매크로입니당");

            // 댓글 작성 버튼
            WebElement commentSubmitBtnelement = driver.findElement(By.cssSelector("[data-uiselector='writeButton']"));
            //commentSubmitBtnelement.click();

        } catch (Exception e) {
            throw new Exception("댓글 작성 중 오류 발생: " + e.getMessage(), e);
        } finally {
            //driver.quit(); // 브라우저 종료
        }
    }

    private static boolean waitForBlogId(WebDriver driver, int maxRetries, int intervalMs) throws InterruptedException {
        for (int i = 0; i < maxRetries; i++) {
            String currentUrl = driver.getCurrentUrl();
            // blogId가 포함된 경우 처리
            if (currentUrl.contains("blogId=")) {
                return true;
            }
            Thread.sleep(intervalMs);
        }
        return false;
    }

}

