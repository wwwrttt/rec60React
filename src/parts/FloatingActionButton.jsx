export default function FloatingActionButton({ onClick, title = "Add item", }) {
    return (
        <button
            onClick={onClick}
            title={title}
            aria-label={title}
            className="
                fixed bottom-5
                left-[min(26rem,calc(100vw-4.3rem))]
                z-50
                h-14 w-14
                rounded-full
                bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600
                text-white
                flex items-center justify-center
                shadow-[0_4px_12px_rgba(0,0,0,0.6)]
                hover:shadow-[0_6px_16px_rgba(0,0,0,0.7)]
                active:shadow-[0_2px_8px_rgba(0,0,0,0.5)]
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-zinc-500
            "
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>

        </button>
    );
}