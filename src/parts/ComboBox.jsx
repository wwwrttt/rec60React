import {
    useState,
    useMemo,
    useRef,
    useEffect,
    forwardRef,
} from 'react';

const ComboBox = forwardRef(function ComboBox(
    {
        value,
        onChange,
        options = [],
        placeholder = '',
        className = '',
        style = {},
        allowCustom = true,
        typeAhead = false
    },
    ref
) {
    const [input, setInput] = useState(value || '');
    const [open, setOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);

    const rootRef = useRef(null);
    const listRef = useRef(null);
    const itemRefs = useRef([]);

    // Sync external value
    useEffect(() => {
        setInput(value || '');
    }, [value]);

    // Filter + prioritize exact match
    const filtered = useMemo(() => {
        if (!typeAhead) return options;

        const q = input.toLowerCase();

        const starts = [];
        const contains = [];

        for (const opt of options) {
            const lower = opt.toLowerCase();
            if (lower.startsWith(q)) starts.push(opt);
            else if (lower.includes(q)) contains.push(opt);
        }

        return [...starts, ...contains];
    }, [input, options]);

    // Reset highlight when list changes
    useEffect(() => {
        setHighlightIndex(0);
    }, [input]);

    // Click outside
    useEffect(() => {
        const handleClick = (e) => {
            if (!rootRef.current?.contains(e.target)) {
                commitValue();
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [input]);

    // Scroll highlighted item into view
    useEffect(() => {
        const el = itemRefs.current[highlightIndex];
        const list = listRef.current;

        if (!el || !list) return;

        const elTop = el.offsetTop;
        const elBottom = elTop + el.offsetHeight;

        const viewTop = list.scrollTop;
        const viewBottom = viewTop + list.clientHeight;

        if (elTop < viewTop) {
            list.scrollTop = elTop;
        } else if (elBottom > viewBottom) {
            list.scrollTop = elBottom - list.clientHeight;
        }
    }, [highlightIndex]);

    const select = (val) => {
        onChange(val);
        setInput(val);
        setOpen(false);
    };

    const commitValue = () => {
        const trimmed = input.trim();

        if (!allowCustom) {
            const match = options.find(
                (o) => o.toLowerCase() === trimmed.toLowerCase()
            );
            if (match) {
                onChange(match);
                setInput(match);
            } else {
                setInput(value || '');
            }
            return;
        }

        onChange(trimmed);
        setInput(trimmed);
    };

    const handleKeyDown = (e) => {
        if (!open && e.key === 'ArrowDown') {
            setOpen(true);
            return;
        }

        if (!open) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightIndex((i) =>
                    Math.min(i + 1, filtered.length - 1)
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setHighlightIndex((i) =>
                    Math.max(i - 1, 0)
                );
                break;

            case 'Enter':
                e.preventDefault();
                if (filtered[highlightIndex]) {
                    select(filtered[highlightIndex]);
                } else {
                    commitValue();
                }
                break;

            case 'Escape':
                setOpen(false);
                setInput(value || '');
                break;

            case 'Tab':
                commitValue();
                setOpen(false);
                break;
        }
    };

    return (
        <div ref={rootRef} className={`relative ${className}`} style={style}>
            <input
                ref={ref}
                className="w-full"
                value={input}
                placeholder={placeholder}
                role="combobox"
                aria-expanded={open}
                aria-autocomplete="list"
                onChange={(e) => {
                    setInput(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
            />

            {open && filtered.length > 0 && (
                <ul
                    ref={listRef}
                    className="absolute left-0 top-full z-10 -mt-[1px] max-h-48 min-w-[100%] overflow-hidden overflow-y-auto form-input border rounded-b shadow-gray-400 bg-inherit whitespace-nowrap"
                    role="listbox"
                >
                    {filtered.map((opt, i) => (
                        <li
                            key={opt}
                            ref={(el) => (itemRefs.current[i] = el)}
                            role="option"
                            aria-selected={i === highlightIndex}
                            className={`px-2 py-1 cursor-pointer ${i === highlightIndex
                                ? 'bg-blue-600 text-white'
                                : ""
                                }`}
                            onMouseEnter={() => setHighlightIndex(i)}
                            onMouseDown={() => select(opt)} // critical
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default ComboBox;