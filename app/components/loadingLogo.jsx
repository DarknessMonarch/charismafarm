import styles from "@/app/style/loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingComponent}>
       <span className={styles.loader}></span>
    </div>
  );
}
