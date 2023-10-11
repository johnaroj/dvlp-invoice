import { useEffect, useState } from "react";

const useTitle = (title: string) => {
  useEffect(() => {
    const prevTItle = document.title;
    document.title = title;

    return () => {
      document.title = prevTItle;
    };
  }, [title]);
};

export default useTitle;
