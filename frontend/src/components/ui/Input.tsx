import styles from "./Input.module.css";

export default function Input(props: any) {
  return <input className={styles.input} {...props} />;
}
