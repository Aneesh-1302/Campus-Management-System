"use client";

import styles from "./Button.module.css";
import { motion } from "framer-motion";

export default function Button({ children, onClick, type = "button" }: any) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={styles.button}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  );
}
