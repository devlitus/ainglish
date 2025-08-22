"use client";

interface CardProps {
  item: string;
  message: string;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "white" | "gray";
  className?: string;
  difficult?: string;
  feature?: string;
  icon?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Card({
  item,
  message,
  difficult,
  feature,
  size = "md",
  color = "blue",
  className,
  icon,
  isSelected,
  onClick,
}: CardProps) {
  const sizeClasses = {
    sm: "p-4 min-h-[120px]",
    md: "p-6 min-h-[160px]",
    lg: "p-8 min-h-[200px]",
  };

  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400/50",
    white:
      "from-gray-100/20 to-gray-200/10 border-gray-300/30 hover:border-gray-200/50",
    gray: "from-gray-500/20 to-gray-600/10 border-gray-500/30 hover:border-gray-400/50",
  };

  return (
    <div
      className={`
        group relative cursor-pointer transition-all duration-300 ease-out
        bg-gradient-to-br ${colorClasses[color]}
        backdrop-blur-sm border rounded-xl
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20
        transform-gpu
        ${sizeClasses[size]}
        ${className || ""}
      `}
      onClick={onClick}
    >
      <div className="relative z-10 h-full flex flex-col justify-between">
        <header className="mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <span>{item}</span>
              {difficult ? (
                <span className="inline-flex items-end px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  {difficult}
                </span>
              ) : (
                icon && <span>{icon}</span>
              )}
              
            </div>
          </h3>
        </header>

        <section className="flex-1 mb-4">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
            {feature ? feature : message}
          </p>
        </section>

        <footer className="mt-auto">
          <button
            className="
            w-full py-2.5 px-4 rounded-lg font-medium text-sm
            bg-gradient-to-r from-blue-600/80 to-purple-600/80
            hover:from-blue-500 hover:to-purple-500
            text-white border border-blue-500/50
            transition-all duration-300
            group-hover:shadow-lg group-hover:shadow-blue-500/30
            transform active:scale-95
          "
          >
            {isSelected ? 'Selected' : 'Select Level'}
          </button>
        </footer>
      </div>
    </div>
  );
}
