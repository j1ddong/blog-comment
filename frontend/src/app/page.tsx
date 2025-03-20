"use client";

import styles from "@/app/styles/home.module.css";
import { SetStateAction, useRef, useState } from "react";
import Loading from "@/app/components/Loading";
import { API_ENDPOINTS } from "@/config/apiConfig";


export default function Home() {
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const now = new Date();

  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const [loginId, setLoginId] = useState("");
  const [loginPswd, setLoginPswd] = useState("");
  const [blogName, setBlogName] = useState("");
  const [postName, setPostName] = useState("");
  const [postDate, setPostDate] = useState(`${year}-${month}-${day}`);

  const handleLoginIdChange = (e: { target: { value: string; }; }) => setLoginId(e.target.value);
  const handleLoginPswdChange = (e: { target: { value: string; }; }) => setLoginPswd(e.target.value);
  const handleBlogNameChange = (e: { target: { value: string; }; }) => setBlogName(e.target.value);
  const handlePostNameChange = (e: { target: { value: string; }; } ) => setPostName(e.target.value);
  const handlePostDateChange = (e: {
    target: { value: SetStateAction<string> };
  }) => setPostDate(e.target.value);

  const blogSearchBtnOnClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if(!loginId || !loginPswd || !blogName || !postName) {
      alert("모든 정보를 작성해주세요.");
      return;
    } 
    setLoading(true);
    loadingRef.current = true;

    const body = JSON.stringify({
      loginId: loginId.trim(),
      loginPswd: loginPswd.trim(),
      blogName: blogName.trim(),
      postName: postName.trim(),
      postDate: postDate.split("-").join("")
    })

    const url = API_ENDPOINTS.MAIN;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body
      });

      setLoading(false);

      if(response.status === 200) {
        alert("댓글 작성이 완료되었습니다.");
      } else if(response.status === 404) {
        alert("블로그 게시글을 찾지 못했습니다.")
      } else {
        alert("댓글 작성 중 문제가 있어 작성되지 않았습니다.")
      }
      setLoginId("");
      setLoginPswd("");
      setBlogName("");
      setPostName("");
      setPostDate(`${year}-${month}-${day}`);
    } catch (err) {
      throw err;
    }

  };

  const stopBtnHandler = () => {
    const confirmAction = confirm('정말 중지하시겠습니까?');

    if (confirmAction) {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  return (
    <div>
      <main>
        {loading && <Loading stopBtnHandler={stopBtnHandler}/>}
        <form onSubmit={blogSearchBtnOnClick} className={styles.container}>
          <h1 className={styles.title}>블로그 찾기</h1>
          <label htmlFor="id" className={styles.label}>
            아이디
          </label>
          <input
            type="text"
            id="id"
            placeholder="네이버 아이디를 입력하세요"
            className={styles.input}
            value={loginId}
            onChange={handleLoginIdChange}
          />
          <label htmlFor="id" className={styles.label}>
            비밀번호
          </label>
          <input
            type="password"
            id="id"
            placeholder="네이버 비밀번호를 입력하세요"
            className={styles.input}
            value={loginPswd}
            onChange={handleLoginPswdChange}
          />
          <label htmlFor="blogName" className={styles.label}>
            블로그 이름
          </label>
          <input
            type="text"
            id="blogName"
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
            id="PostName"
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
