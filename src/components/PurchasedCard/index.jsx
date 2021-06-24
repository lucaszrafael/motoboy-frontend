import styles from "./styles.module.scss";

export default function PurchasedCard(purchase) {
  const timestamp = Date.parse(purchase.purchasedAt);
  const date = new Date(timestamp);

  return (
    <div className={styles.card}>
      <div>
        <h4>Produto:</h4>
        <p>{purchase.productId.name}</p>
      </div>
      <div>
        <h4>Valor unitário (R$) :</h4>
        <p>{purchase.priceUnit}</p>
      </div>
      <div>
        <h4>Quantidade(s):</h4>
        <p>{purchase.units}</p>
      </div>
      <div>
        <h4>Valor final (R$):</h4>
        <p>R$ {purchase.total}</p>
      </div>
      <div>
        <h4>Comprado dia:</h4>
        <p>{`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}</p>
      </div>
      <div>
        <h4>Localização:</h4>
        <p>
          Latitude: {purchase.latitude} | Longitude: {purchase.longitude}
        </p>
      </div>
    </div>
  );
}
