'use client';

import styles from "@/app/styles/loading.module.css";

export default function Loading({stopBtnHandler}: {stopBtnHandler: () => void}) {

    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>게시글을 찾는 중입니다...</p>
            <button className={styles.button} onClick={stopBtnHandler}>중지</button>
        </div>
    )
}