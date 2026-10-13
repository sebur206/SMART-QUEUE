import React, {useEffect, useRef} from 'react';

const ModelWrapper = ({open,setOpen, children}) => {

    const panelRef = useRef(null);

    useEffect(() => {
        if(!open) return

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        const previousOverFlow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", handleKeyDown);
        panelRef.current.focus();

        return () => {
            document.body.style.overflow = previousOverFlow;
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [open,setOpen]);

    if(!open) return null;

    return (
        <div
            className='fixed inset-0 z-10 flex items-center justify-center p-4'
            aria-modal={true}
            role='dialog'
        >
            <div
                className="fixed inset-0 bg-black bg-opacity-60"
                onClick={() => {setOpen(true)}}
            />
            <div
                ref={panelRef}
                tabIndex={-1}
                className="relative z-10 w-full max-w-lg transform overflow-hidden"
            >
                <div className='bg-white w-full '>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelWrapper;