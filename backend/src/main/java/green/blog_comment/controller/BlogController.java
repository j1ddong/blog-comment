package green.blog_comment.controller;

import green.blog_comment.service.BlogCommentService;
import green.blog_comment.service.NaverApiBlogService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api") // 공통 URL prefix
public class BlogController {

    private final NaverApiBlogService naverApiBlogService;
    private final BlogCommentService blogCommentService;

    @Autowired
    public BlogController(BlogCommentService blogCommentService, NaverApiBlogService naverApiBlogService) {
        this.blogCommentService = blogCommentService;
        this.naverApiBlogService = naverApiBlogService;
    }

    @CrossOrigin(origins = "http://localhost:3000") // 특정 Origin만 허용
    @GetMapping("/main")
    public String newChromBlogComment() throws Exception {
        blogCommentService.postComment();
        return "ok";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/blog/search")
    public String blogSearch(HttpServletRequest request) {
        String postName = request.getParameter("postName");
        return naverApiBlogService.searchBlog(postName);
    }

}
