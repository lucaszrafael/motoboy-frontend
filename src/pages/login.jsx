import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/login.module.scss";

export default function Login({ baseUrl }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const router = useRouter();
  const api = axios.create({ baseURL: baseUrl });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post(`/api/signIn`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.data.token);
      router.push("/");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card}>
        <h1>Login</h1>
        <div>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Login
        </button>
        <a href="/signup">New user? Register now</a>
      </form>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      baseUrl: process.env.API_URL,
    },
  };
}
