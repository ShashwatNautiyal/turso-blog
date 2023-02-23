import React, { ReactNode } from "react";

const Button = ({
	children,
	onClick,
	className,
	isLoading = false,
}: {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	isLoading?: boolean;
}) => {
	const defaultButtonClass = className ?? "text-black bg-transparent border border-black";

	return (
		<button
			disabled={isLoading}
			onClick={onClick}
			className={`${
				isLoading ? "opacity-50" : ""
			} rounded-lg py-2.5 px-7 text-sm font-medium leading-5 ${defaultButtonClass}`}
		>
			{children}
		</button>
	);
};

export default Button;
