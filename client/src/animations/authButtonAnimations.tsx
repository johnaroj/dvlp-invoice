import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AuthButtonAnimation({
  children,
  type,
}: {
  children: ReactNode;
  type: string;
}) {
  switch (type) {
    default:
      return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          {children}
        </motion.div>
      );
  }
}
