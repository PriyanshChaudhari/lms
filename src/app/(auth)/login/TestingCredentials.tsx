import React, { useState, useRef, useEffect } from 'react';
import { LuX, LuGripVertical, LuMoveRight } from 'react-icons/lu';

interface TestCredentialsProps {
    onCredentialsSelect: (creds: { prn: string; password: string }) => void;
}

const TestCredentials: React.FC<TestCredentialsProps> = ({ onCredentialsSelect }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [position, setPosition] = useState({ x: 30, y: 0.25 * window.innerHeight });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const dragRef = useRef<HTMLDivElement>(null);

    const testCredentials = {
        admin: { prn: "8021000001", password: "12345678" },
        teacher: { prn: "8021000002", password: "12345678" },
        student: { prn: "8021000004", password: "12345678" }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && dragRef.current) {
                e.preventDefault(); // Prevent text selection while dragging
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // Get window dimensions
                const maxX = window.innerWidth - dragRef.current.offsetWidth;
                const maxY = window.innerHeight - dragRef.current.offsetHeight;

                // Constrain position within window bounds
                const constrainedX = Math.max(0, Math.min(newX, maxX));
                const constrainedY = Math.max(0, Math.min(newY, maxY));

                setPosition({ x: constrainedX, y: constrainedY });
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging && dragRef.current) {
                e.preventDefault(); // Prevent text selection while dragging
                const touch = e.touches[0];
                const newX = touch.clientX - dragOffset.x;
                const newY = touch.clientY - dragOffset.y;

                // Get window dimensions
                const maxX = window.innerWidth - dragRef.current.offsetWidth;
                const maxY = window.innerHeight - dragRef.current.offsetHeight;

                // Constrain position within window bounds
                const constrainedX = Math.max(0, Math.min(newX, maxX));
                const constrainedY = Math.max(0, Math.min(newY, maxY));

                setPosition({ x: constrainedX, y: constrainedY });
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        const handleTouchEnd = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent text selection
        if (!dragRef.current) return;
        const rect = dragRef.current.getBoundingClientRect();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent text selection
        if (!dragRef.current) return;
        const touch = e.touches[0];
        const rect = dragRef.current.getBoundingClientRect();
        setIsDragging(true);
        setDragOffset({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        });
    };

    if (!isVisible) return null;

    return (
        <div
            ref={dragRef}
            className="fixed bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm z-50 select-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.1s',
                touchAction: 'none' // Disable touch scrolling
            }}
        >
            <div
                className="flex justify-between items-center mb-3 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="flex items-center gap-2 ps-4 pe-4">
                    <LuGripVertical className="text-gray-400" size={16} />
                    <h3 className="font-bold text-gray-900 dark:text-gray-200 ps-2 pe-2">Credentials</h3>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                    <LuX size={20} />
                </button>
            </div>

            <div className="space-y-4 p-2">
                {Object.entries(testCredentials).map(([role, creds]) => (
                    <div key={role} className="space-y-1 relative group p-2" onClick={() => onCredentialsSelect(creds)}>
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 capitalize">
                                Login as {role}
                            </h4>
                            <button
                                onClick={() => onCredentialsSelect(creds)}
                                className="group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-600"
                                title="Click to autofill"
                            >
                                <LuMoveRight size={18} />
                            </button>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <div>PRN: {creds.prn}</div>
                            <div>Password: {creds.password}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestCredentials;