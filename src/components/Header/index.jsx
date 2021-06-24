import { useRouter } from "next/router";

import styles from "./styles.module.scss";

export default function Header({ title, secondButtonTitle, buttonHref }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <div>
        <a href={buttonHref}>{secondButtonTitle}</a>
        <a onClick={handleLogout}>Sair</a>
      </div>
    </div>
  );
}
