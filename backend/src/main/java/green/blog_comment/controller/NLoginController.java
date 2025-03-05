package green.blog_comment.controller;

import green.blog_comment.service.NaverApiLoginService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/api") // 공통 URL prefix
public class NLoginController {
    private final NaverApiLoginService naverApiLoginService;

    public NLoginController(NaverApiLoginService naverApiLoginService) {
        this.naverApiLoginService = naverApiLoginService;
    }

    @Value("${app.frontend.url}")
    private String blogFrontendUrl;

    @GetMapping("/oauth/naver/login/callback")
    public String getAccessToken(@RequestParam("code") String code, @RequestParam("state") String state) throws Exception {
        String accessToken = naverApiLoginService.getAccessToken(code, state);
        return "redirect:" + blogFrontendUrl + "blog/search";
    }
}
