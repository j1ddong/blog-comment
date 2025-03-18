"use client";

import styles from "@/app/styles/search.module.css";
import { SetStateAction, useState } from "react";
import { API_ENDPOINTS } from "@/config/apiConfig";

export default function BlogSearch() {
  const now = new Date();

  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const [blogName, setBlogName] = useState("");
  const [postName, setPostName] = useState("");
  const [postDate, setPostDate] = useState(`${year}-${month}-${day}`);

  const handleBlogNameChange = (e: { target: { value: string; }; }) => setBlogName(e.target.value);
  const handlePostNameChange = (e: { target: { value: string; }; } ) => setPostName(e.target.value);
  const handlePostDateChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setPostDate(e.target.value);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const searchBlogPost = async(retryCount = 0) => {
    const MAX_RETRIES = 500; 

    const url = API_ENDPOINTS.BLOGSEARCH;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postName: postName.trim()}),
      });

      const htmlBlogSearchResponse = await response.text();
      const blogSearchResponse = JSON.parse(htmlBlogSearchResponse);
      const formattedDate = postDate.split("-").join("");

      const blogSearchResult = blogSearchResponse.items.find(
        (elem: { bloggername: string; postdate: string }) => {
          return (
            elem.bloggername === blogName.trim() && elem.postdate === formattedDate
          );
        }
      );

      if (!blogSearchResult) {
        if (retryCount < MAX_RETRIES) {
          await delay(1000);
          await searchBlogPost(retryCount + 1);
        } else {
          alert("블로그가 검색되지 않았습니다. 다시 확인해주세요.");
        }
        return;
      }

      const parts = blogSearchResult.link.split("/");
      const blogId = parts[parts.length - 2];
      const postId = parts[parts.length - 1];

      const currentUrl = window.location.href;
      location.replace(currentUrl + "?blogId=" + blogId + "&logNo=" + postId);

    } catch (err) {
      throw err;
    }
  }

  const blogSearchBtnOnClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if(!blogName || !postName) {
      alert("블로그 이름과 게시글 이름을 작성해주세요.");
      return;
    } 
    searchBlogPost();

   
  };

  return (
    <div>
      <main>
        <form onSubmit={blogSearchBtnOnClick} className={styles.container}>
          <h1 className={styles.title}>블로그 찾기</h1>
          <label htmlFor="blogName" className={styles.label}>
            블로그 이름
          </label>
          <input
            type="text"
            placeholder="블로그 이름을 입력하세요"
            className={styles.input}
            value={blogName}
            onChange={handleBlogNameChange}
          />
          <label htmlFor="postName" className={styles.label}>
            게시글 이름
          </label>
          <input
            type="text"
            placeholder="게시글 이름을 입력하세요"
            value={postName}
            className={styles.input}
            onChange={handlePostNameChange}
          />
          <label htmlFor="postDate" className={styles.label}>
            게시글 날짜
          </label>
          <input
            id="postDate"
            type="date"
            className={styles.input}
            value={postDate}
            onChange={handlePostDateChange}
          />
          <button type="submit" className={styles.button}>
            검색하기
          </button>
        </form>
      </main>
      <footer></footer>
    </div>
  );
}
