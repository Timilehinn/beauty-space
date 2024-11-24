import { useEffect } from "react";

/* Action is a function */
const useOnClickOutside = (ref, action) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        () => action();
      }
    };

    document.addEventListener("mousedown", handleClickOutside); 

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [action, ref]);
};

export default useOnClickOutside;
