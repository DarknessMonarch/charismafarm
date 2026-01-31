import Image from "next/image";
import styles from "@/app/style/loading.module.css";
import Logo from "@/public/assets/logo.png";

export default function Loading() {
  return (
    <div className={styles.loadingComponent}>
      <Image
        className={styles.loadingImg}
        src={Logo}
        alt="CharismaFarm Logo"
        height={300}
        loading="lazy"
      />
    </div>
  );
}
