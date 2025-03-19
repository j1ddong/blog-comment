import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {

  const { NAVER_AUTH_CLIENT_ID, NAVER_API_AUTH_BASE_URL, BASE_URL } = process.env;

  const CALLBACK_URL = `${BASE_URL}api/oauth/login/callback`;

  const url = `${NAVER_API_AUTH_BASE_URL}authorize?response_type=code&client_id=${NAVER_AUTH_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=blog-comment`;

  let browser;
  try {
    // Puppeteer 브라우저 시작
    browser = await puppeteer.launch({
      headless: false, // 브라우저 창 없이 실행 (헤드리스 모드)
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // 로그인 페이지로 이동
    await page.goto(url);

    // blogId가 포함된 URL을 기다림
    const isBlogFound = await waitForBlogId(page, 1200, 1000);
    if (!isBlogFound) {
      return NextResponse.json({message: 'Blog ID not found in URL'}, {status: 404});
    }

    const currentUrl = page.url();
    const queryParams = new URLSearchParams(currentUrl.split('?')[1]);
    const logNo = queryParams.get('logNo');

    const blogUrl = `https://blog.naver.com/PostView.naver?${queryParams.toString()}`;

    // 블로그 게시글로 이동
    await page.goto(blogUrl);

    // 댓글 열기 버튼 클릭
    const commentBtnSelector = `#Comi${logNo}`;
    await page.waitForSelector(commentBtnSelector);
    const commentBtnElement = await page.$(commentBtnSelector);
    await commentBtnElement.click();

    // 댓글 영역으로 스크롤
    await page.evaluate((selector) => {
      document.querySelector(selector).scrollIntoView(true);
    }, commentBtnSelector);

    // 댓글 입력 요소 대기 및 입력
    const commentInputSelector = `#naverComment_201_${logNo}__write_textarea`;
    await page.waitForSelector(commentInputSelector);
    await page.type(commentInputSelector, '안녕하세요!');

    // 댓글 작성 버튼 클릭 (주석 처리된 부분)
    const submitButtonSelector = '[data-uiselector="writeButton"]';
    await page.click(submitButtonSelector);

    return NextResponse.json({message: '댓글 작성 완료'}, {status: 200});
    
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error);
    return NextResponse.json({message: `댓글 작성 중 오류 발생: ${error.message}`}, {status: 500});
  } finally {
    if (browser) {
      //await browser.close(); // 브라우저 종료
    }
  }
}

// blogId가 포함된 URL을 기다리는 함수
async function waitForBlogId(page, maxRetries, intervalMs) {
  for (let i = 0; i < maxRetries; i++) {
    const currentUrl = page.url();
    if (currentUrl.includes('blogId=')) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}
