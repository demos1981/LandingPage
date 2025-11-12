import { dataProduct } from "../../data/dataProduct";
import styles from "./ProductList.module.css";

export default function ProductList() {
  return (
    <section className={styles.productSection}>
      <h2 className={styles.productTitle}>Термобілизна</h2>
      <div className={styles.productContainer}>
        {dataProduct.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <img
              className={styles.productImage}
              src={product.img.src}
              alt={product.name}
            />
            <p className={styles.productName}>{product.name}</p>
            <p className={styles.productDescription}>{product.description}</p>

            {/* Ссылка ведёт на страницу по id */}
            <a href={`/${product.id}`} className={styles.addToCartButton}>
              ПРИДБАТИ
            </a>
          </li>
        ))}
      </div>
    </section>
  );
}
