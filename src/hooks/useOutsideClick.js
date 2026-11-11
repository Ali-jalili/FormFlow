import { useEffect } from "react";

function useOutsideClick(ref, onOutside) {
  useEffect(() => {
    function handle(event) {
      if (ref.current && !ref.current.contains(event.target)) onOutside();
    }

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

export default useOutsideClick;
