import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/SignUp.module.scss";

export default function signUp({ baseUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const router = useRouter();

  const api = axios.create({
    baseURL: baseUrl,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/");
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== checkPassword) {
      setCheckPassword("");
      alert("Passwords doesn't match");
    }

    try {
      const response = await api.post("/api/users", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.data.token);
      router.push("/");
    } catch (error) {
      alert("User already exists");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card}>
        <h1>Signup</h1>
        <div>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <input
            type="password"
            placeholder="Repeat password"
            onChange={(e) => setCheckPassword(e.target.value)}
            value={checkPassword}
            required
          />
        </div>
        <button onClick={handleSubmit}>Register</button>
        <a href="/login">Have an account? Login here</a>
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
