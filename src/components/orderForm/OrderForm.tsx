import { useState } from "react";
import styles from "./OrderForm.module.css";

type OrderFormProps = {
  productName: string;
};

export default function OrderForm({ productName }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    postOffice: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name.trim()) return "Введіть імʼя";
    if (!/^\+?\d{10,13}$/.test(formData.phone))
      return "Введіть правильний номер телефону";
    if (!formData.city.trim()) return "Вкажіть місто";
    if (!formData.postOffice.trim()) return "Вкажіть відділення Нової пошти";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = { product: productName, ...formData };

    try {
      const res = await fetch("/api/sendOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json(); // 👈 читаем ответ

      if (res.ok && result.success) {
        alert("✅ Замовлення відправлено!");
      } else {
        console.error("❌ Відповідь з сервера:", result); // 👈 логим ошибку
        alert(
          "❌ Помилка при відправці: " + (result?.error || "невідома помилка")
        );
      }
    } catch (err) {
      console.error("Сервер недоступен, ошибка:", err);
      alert("⚠️ Сервер недоступний: " + String(err));
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Замовлення: {productName}</h2>
      {error && <p className={styles.errorText}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          placeholder="Імʼя"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="phone"
          placeholder="+380XXXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="city"
          placeholder="Місто"
          value={formData.city}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="postOffice"
          placeholder="Відділення Нової пошти"
          value={formData.postOffice}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Відправити
        </button>
      </form>
    </div>
  );
}
