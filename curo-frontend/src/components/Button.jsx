import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-teal-500 text-white hover:bg-teal-600 shadow-lift",
  secondary: "bg-white text-ink border border-line hover:border-teal-400 hover:text-teal-600",
  ghost: "text-teal-600 hover:bg-teal-50",
  pulse: "bg-pulse text-white hover:bg-pulse/90",
};

const SIZES = {
  sm: "text-sm px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3.5",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  const Comp = as || "button";
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}
