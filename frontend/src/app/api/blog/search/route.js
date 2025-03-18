import { NextResponse } from 'next/server';

export async function POST(req) {
  
    const body = await req.json();
    const { postName } = body;
  
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
      return NextResponse.json(data, {status: 200});

    } catch (error) {
      console.error('Error fetching Naver Blog Search:', error);
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, {status: 500});
    }
  }
  