import { NextResponse } from 'next/server';

export async function getBlogUrl(blogName, postName, postDate, retryCount = 0) {
  const MAX_RETRIES = 500; 

  try {
    const blogSearchResponse = await searchBlog(postName)

    const blogSearchResult = blogSearchResponse.items.find(
      (elem) => {
        return (
          elem.bloggername === blogName.trim() && elem.postdate === postDate
        );
      }
    );

    if (!blogSearchResult) {
      if (retryCount < MAX_RETRIES) {
        await delay(1000);
        await getBlogUrl(blogName, postName, postDate, retryCount + 1);
      }
      return;
    }

    const parts = blogSearchResult.link.split("/");
    const blogId = parts[parts.length - 2];
    const postId = parts[parts.length - 1];

    const blogUrl = `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${postId}`;
    return blogUrl;
  } catch (err) {
    throw err;
  }
}

export async function searchBlog(postName) {

  if (!postName) {
    return NextResponse.json({ message: 'Missing required parameter: postName' }, {status: 400});
  }
  
  const { NAVER_SEARCH_CLIENT_ID, NAVER_SEARCH_CLIENT_SECRET, NAVER_API_SEARCH_BASE_URL } = process.env;
  
  try {
    // 검색어 인코딩
    const encodedQuery = encodeURIComponent(postName);
  
    // 네이버 검색 API URL 생성
    const apiURL = `${NAVER_API_SEARCH_BASE_URL}blog?display=100&query=${encodedQuery}`;
  
    // 요청 헤더 설정
    const headers = {
      'X-Naver-Client-Id': NAVER_SEARCH_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_SEARCH_CLIENT_SECRET,
    };
  
    // 네이버 검색 API 호출
    const response = await fetch(apiURL, { headers });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch data from Naver API: ${response.statusText}`);
    }
  
    const data = await response.json();
  
    // 결과 반환
    return data
  
  } catch {
    return null;
  }

}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}