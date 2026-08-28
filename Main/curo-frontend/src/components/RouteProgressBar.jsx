import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteProgressBar() {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(0);

    const t1 = setTimeout(() => setProgress(80), 20);
    const t2 = setTimeout(() => setProgress(100), 250);
    const t3 = setTimeout(() => setVisible(false), 450);
    const t4 = setTimeout(() => setProgress(0), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-teal-500 transition-all duration-300 ease-out pointer-events-none"
      style={{
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
