"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const TextHoverEffect = ({
    svgPath,
    duration,
    className,
}: {
    svgPath: string;
    duration?: number;
    className?: string;
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
    const [svgContent, setSvgContent] = useState<string>("");

    // Cargar el SVG
    useEffect(() => {
        fetch(svgPath)
            .then((response) => response.text())
            .then((data) => setSvgContent(data))
            .catch((error) => console.error("Error loading SVG:", error));
    }, [svgPath]);

    useEffect(() => {
        if (svgRef.current && cursor.x !== null && cursor.y !== null) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
            const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
            setMaskPosition({
                cx: `${cxPercentage}%`,
                cy: `${cyPercentage}%`,
            });
        }
    }, [cursor]);

    return (
        <div className="relative w-full h-full">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 300 100" // You might want to make this dynamic if possible, or matches the SVG
                xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
                className={cn("select-none cursor-pointer", className)}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient
                        id="textGradient"
                        gradientUnits="userSpaceOnUse"
                        cx="50%"
                        cy="50%"
                        r="25%"
                    >
                        {hovered && (
                            <>
                                <stop offset="0%" stopColor="#eab308" />
                                <stop offset="25%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#80eeb4" />
                                <stop offset="75%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </>
                        )}
                    </linearGradient>
                    <motion.radialGradient
                        id="revealMask"
                        gradientUnits="userSpaceOnUse"
                        r="20%"
                        initial={{ cx: "50%", cy: "50%" }}
                        animate={maskPosition}
                        transition={{ duration: duration ?? 0, ease: "easeOut" }}
                    >
                        <stop offset="0%" stopColor="white" />
                        <stop offset="100%" stopColor="black" />
                    </motion.radialGradient>
                    <mask id="textMask">
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="url(#revealMask)"
                        />
                    </mask>
                </defs>

                {/* SVG externo con efecto de hover */}
                <g
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    className="stroke-neutral-200 dark:stroke-neutral-800"
                    style={{
                        opacity: hovered ? 0.7 : 0,
                        fill: 'transparent',
                        strokeWidth: '0.3'
                    }}
                />

                {/* SVG con animación de trazo */}
                <motion.g
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    // Adapted to XSAFE Red
                    className="fill-transparent stroke-[#FF4D4D] dark:stroke-[#FF4D4D99]"
                    initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
                    animate={{
                        strokeDashoffset: 0,
                        strokeDasharray: 1000,
                    }}
                    transition={{
                        duration: 4,
                        ease: "easeInOut",
                    }}
                    style={{ strokeWidth: '0.3' }}
                />

                {/* SVG con gradiente y máscara */}
                <g
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    stroke="url(#textGradient)"
                    mask="url(#textMask)"
                    className="fill-transparent"
                    style={{ strokeWidth: '0.3' }}
                />
            </svg>
        </div>
    );
};

export const FooterBackgroundGradient = () => {
    return (
        <div
            className="absolute inset-0 z-0"
            style={{
                background:
                    "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #FF4D4D33 100%)",
            }}
        />
    );
};
