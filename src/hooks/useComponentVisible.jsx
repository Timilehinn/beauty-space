import { useState, useEffect, useRef } from "react";

/**
 * useComponentVisible
 * Close element on click outside or click esc button
 * @param ref
 * @param {Boolean} isComponentVisible // use to wrap your toggle component or element
 * @param {Func} setIsComponentVisible // manuelly set the visibility
 * @param {Func} toggle //the toggle function toggle the app state
 * */
export default function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef();

  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      setIsComponentVisible(false);
    }
  };
  const toggle = () => setIsComponentVisible(!isComponentVisible);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, toggle, isComponentVisible, setIsComponentVisible };
}

// Usage
// const App = () => {

//     const { ref, isComponentVisible } = useComponentVisible(true);

//     return (
//        <div ref={ref}>
//           {isComponentVisible && (<p>Going into Hiding</p>)}
//        </div>
//     );

// }
