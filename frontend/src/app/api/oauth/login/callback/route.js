import { NextResponse } from 'next/server';

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
  
    if (!code || !state) {
      return res.status(400).json({ message: 'Missing required parameters: code or state' });
    }

    const { NAVER_AUTH_CLIENT_ID, NAVER_API_AUTH_BASE_URL, NAVER_AUTH_CLIENT_SECRET, BASE_URL } = process.env;
  
    try {
      // 액세스 토큰 요청을 위한 URL 생성
      const redirectUri = `${BASE_URL}api/oauth/accessToken/callback`;
      const apiURL = `${NAVER_API_AUTH_BASE_URL}token?grant_type=authorization_code`
        + `&client_id=${NAVER_AUTH_CLIENT_ID}`
        + `&client_secret=${NAVER_AUTH_CLIENT_SECRET}`
        + `&redirect_uri=${encodeURIComponent(redirectUri)}`
        + `&code=${code}`
        + `&state=${state}`;
  
      // 액세스 토큰 요청
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }
      await response.json();

      return NextResponse.json({status: 200});
    } catch (error) {
      console.error('Error fetching access token:', error);
      return NextResponse.json({error: error.message}, {status: 500});
    }
  }