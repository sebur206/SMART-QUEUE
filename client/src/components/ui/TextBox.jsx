import React, { forwardRef } from 'react';
import clsx from "clsx";

const TextBox = forwardRef(({
    type = "text",
    placeholder,
    label,
    className,
    labelClass,
    name,
    error,
    value,
    onChange,
    disabled = false,
    required = false,
    ...rest
}, ref) => {
    return (
        <div className='w-full flex flex-col gap-1'>
            {label && (
                <label
                    htmlFor={name}
                    className={clsx("text-sm font-medium text-slate-700", labelClass)}
                >
                    {label}
                </label>
            )}

            <div>
                <input
                    ref={ref}
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={clsx(
                        "w-full px-3 py-1.5 border border-gray-300 rounded-sm text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all",
                        disabled && "bg-gray-100 cursor-not-allowed text-gray-500",
                        error && "border-red-500 focus:ring-red-400",
                        className
                    )}
                    {...rest}
                />
            </div>
            {error && (
                <span className='text-xs text-red-500 mt-0.5'>{error}</span>
            )}
        </div>
    );
});

TextBox.displayName = 'TextBox';

export default TextBox;