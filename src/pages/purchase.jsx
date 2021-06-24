import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/Purchase.module.scss";

import Header from "../components/Header";

export default function Purchase({ baseUrl }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [hasFocus, setHasFocus] = useState(false);
  const [productSelected, setProductSelected] = useState("");
  const [price, setPrice] = useState();
  const [units, setUnits] = useState();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const router = useRouter();

  const api = axios.create({
    baseURL: baseUrl,
  });

  useEffect(async () => {
    const token = localStorage.getItem("token");

    if (!token) return router.push("/login");

    try {
      const userResponse = await api.get("/api/users/profile", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.data.data.email) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (error) {}

    const productResponse = await api.get("/api/products", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    setProducts(productResponse.data.data);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude.toFixed(4));
      setLongitude(position.coords.longitude.toFixed(4));
    });
  }, [productSelected]);

  const selectProducts = (event) => {
    setSearch(event.target.value.toLowerCase());

    if (event.target.value === "") {
      return setResults([]);
    }

    setResults(products.filter((product) => product.name.startsWith(event.target.value)));
  };

  const selectProduct = async (product, productExists) => {
    setHasFocus(false);

    const token = localStorage.getItem("token");

    if (!productExists) {
      await api.post(
        "/api/products",
        {
          name: product,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const productResponse = await api.get("/api/products", {
        headers: { authorization: `Bearer ${token}` },
      });

      setProducts(productResponse.data.data);
      setProductSelected(product);
      setSearch(product);
    } else {
      setProductSelected(product);
      setSearch(product);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!search || !price || !units || !latitude || !longitude) return console.log("miss");

    const token = localStorage.getItem("token");

    const purchase = {
      productName: search,
      priceUnit: price,
      units: units,
      latitude,
      longitude,
    };

    try {
      const response = await api.post("/api/purchases", purchase, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const listResults = () =>
    results.length ? (
      <>
        {results.map((result) => (
          <div
            key={result._id}
            onClick={() => selectProduct(result.name, true)}
            className={styles.product}
          >
            {result.name}
          </div>
        ))}
        <div onClick={() => selectProduct(search, false)}>Cadastrar produto</div>
      </>
    ) : (
      search && <div onClick={() => selectProduct(search, false)}>Cadastrar produto</div>
    );
  return (
    <div className={styles.container}>
      <Header title="Adicionar compra" secondButtonTitle="Mostrar compras" buttonHref="/" />
      <div style={{ height: 75 }} />
      <div className={styles.content}>
        <form className={styles.card}>
          <h1>Nova compra</h1>
          <div className={styles.field}>
            <h4>Produto: </h4>
            <div>
              <input
                type="text"
                onChange={selectProducts}
                placeholder="search"
                value={search ? search : ""}
                onFocus={() => setHasFocus(true)}
                required
              />
              <div className={styles.results}>{hasFocus && listResults()}</div>
            </div>
          </div>
          <div className={styles.field}>
            <h4>Valor (R$):</h4>
            <input
              type="number"
              placeholder="Preço"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <h4>Quantidade</h4>
            <input
              type="number"
              placeholder="Unidades"
              onChange={(e) => setUnits(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <h4>Total (R$):</h4>
            <p>{price && units ? price * units : 0}</p>
          </div>
          <div className={styles.field}>
            <h4>Latitude:</h4>
            <p>{latitude}</p>
          </div>
          <div className={styles.field}>
            <h4>Longitude:</h4>
            <p>{longitude}</p>
          </div>
          <button onClick={handleSubmit}>Adicionar compra</button>
        </form>
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
