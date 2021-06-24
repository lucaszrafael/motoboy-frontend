import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Header from "../components/Header";
import PurchasedCard from "../components/PurchasedCard";

import styles from "../styles/Home.module.scss";

export default function Home({ baseUrl }) {
  const [user, setUser] = useState();
  const [purchases, setPurchases] = useState([]);

  const router = useRouter();

  const api = axios.create({
    baseURL: baseUrl,
  });

  useEffect(async () => {
    const token = localStorage.getItem("token");

    if (!token) await router.push("/login");

    const response = await api.get("/api/purchases", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const userResponse = await api.get("/api/users/profile", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    setPurchases(response.data.data);
    setUser(userResponse.data.data);
  }, []);

  return (
    <div className={styles.container}>
      <Header
        title="Compras"
        secondButtonTitle="Adicionar nova compra"
        buttonHref="/purchase"
      />
      <div className={styles.purchases}>
        {purchases.map((purchase) => {
          return <PurchasedCard key={purchase._id} {...purchase} />;
        })}
      </div>
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
