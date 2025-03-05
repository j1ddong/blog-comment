"use client";

import Image from "next/image";
import styles from "@/app/styles/home.module.css";
import { API_ENDPOINTS } from "@/config/apiConfig";

export default function Home() {
  const nLoginBtnOnClick = async () => {
    const url = API_ENDPOINTS.MAIN;
    try {
      await fetch(url, { method: "GET" });
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.instructions}>
          <ol className={styles.steps}>
            <li>
              <strong>네이버 로그인하기</strong>
              <p>
                하단의 <b>네이버 로그인 버튼</b>을 클릭하여 네이버 계정으로
                로그인하세요. 로그인을 완료하면 사용자 정보를 안전하게
                가져옵니다.
              </p>
            </li>
            <li>
              <strong>블로그 찾기</strong>
              <p>
                블로그 이름과 게시글 이름을 통해 게시글을 검색합니다. 
              </p>
            </li>
            <li>
              <strong>댓글 자동으로 달기</strong>
              <p>
                선택한 블로그 게시물에 설정된 댓글 내용을 자동으로 작성합니다.
              </p>
            </li>
          </ol>
        </section>
        <div className={styles.nLoginBtnImg} onClick={nLoginBtnOnClick}>
          <Image
            src="/images/nLoginBtn.png"
            alt="Naver Login Image"
            width={200}
            height={50}
          />
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
