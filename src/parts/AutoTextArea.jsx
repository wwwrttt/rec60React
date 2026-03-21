import { useEffect, useRef } from "react";

export default function AutoTextarea({
    value,
    onChange,
    className = "",
    ...props
}) {
    const ref = useRef(null);

    const resize = () => {
        const el = ref.current;
        if (!el) return;

        el.style.height = "auto";                 // reset
        el.style.height = el.scrollHeight + "px"; // grow
    };

    useEffect(() => {
        resize();
    }, [value]);

    return (
        <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
                onChange?.(e);
                resize();
            }}
            className={`resize-none overflow-hidden transition-all duration-100 ease-in-out ${className}`}
            {...props}
        />
    );
}
