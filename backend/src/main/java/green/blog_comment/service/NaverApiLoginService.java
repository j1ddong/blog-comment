package green.blog_comment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NaverApiLoginService {

    @Value("${app.naver.login.clientId}")
    private String clientId;

    @Value("${app.naver.login.clientSecret}")
    private String clientSecret;

    @Value("${app.naver.login.auth.baseUrl}")
    private String naverApiBaseUrl;

    @Value("${app.backend.url}")
    private String backendBaseUrl;

    public String getAccessToken(String code, String state) {

        String redirectUri = backendBaseUrl + "api/oauth/navaer/accessToken/callback";
        String apiURL = naverApiBaseUrl + "token?grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&redirect_uri=" + redirectUri
                + "&code=" + code
                + "&state=" + state;

        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(apiURL, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("access_token").asText(); // 액세스 토큰 반환
        } catch (Exception e) {
            throw new RuntimeException("Failed to get access token", e);
        }
    }
}
