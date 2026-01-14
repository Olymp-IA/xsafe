"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

const morphTime = 1.0;
const cooldownTime = 0.25;

const useMorphingText = (texts: string[], selectedIndex: number) => {
    const morphRef = useRef(0);
    const cooldownRef = useRef(0);
    const timeRef = useRef(new Date());

    const text1Ref = useRef<HTMLSpanElement>(null);
    const text2Ref = useRef<HTMLSpanElement>(null);

    // Keep track of previous index to know what to morph FROM
    const prevIndexRef = useRef(selectedIndex);
    const isMorphingRef = useRef(false);

    const setStyles = useCallback(
        (fraction: number) => {
            const [current1, current2] = [text1Ref.current, text2Ref.current];
            if (!current1 || !current2) return;

            // Text 2 (Available/Incoming) starts blurred/invisible and becomes clear
            // Text 1 (Current/Outgoing) starts clear and becomes blurred/invisible

            // Adjust calculations to smoother fade
            current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            const invertedFraction = 1 - fraction;
            current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
            current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

            // Setup content: 
            // text1 is the OLD text (prevIndex)
            // text2 is the NEW text (selectedIndex)
            current1.textContent = texts[prevIndexRef.current % texts.length];
            current2.textContent = texts[selectedIndex % texts.length];
        },
        [texts, selectedIndex],
    );

    const doMorph = useCallback(() => {
        morphRef.current -= cooldownRef.current;
        cooldownRef.current = 0;

        let fraction = morphRef.current / morphTime;

        if (fraction > 1) {
            cooldownRef.current = cooldownTime;
            fraction = 1;
        }

        setStyles(fraction);

        if (fraction === 1) {
            // Animation done.
            isMorphingRef.current = false;
            prevIndexRef.current = selectedIndex; // Update previous to current
        }
    }, [setStyles, selectedIndex]);

    const doCooldown = useCallback(() => {
        morphRef.current = 0;
        const [current1, current2] = [text1Ref.current, text2Ref.current];
        if (current1 && current2) {
            // Reset to clean state showing Selected
            current2.style.filter = "none";
            current2.style.opacity = "100%";
            current1.style.filter = "none";
            current1.style.opacity = "0%";

            current2.textContent = texts[selectedIndex % texts.length];
        }
    }, [selectedIndex, texts]);

    // Trigger animation when selectedIndex changes
    useEffect(() => {
        if (selectedIndex !== prevIndexRef.current) {
            isMorphingRef.current = true;
            morphRef.current = 0; // Start morph
            cooldownRef.current = 0;
        }
    }, [selectedIndex]);

    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const newTime = new Date();
            const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
            timeRef.current = newTime;

            cooldownRef.current -= dt;

            // Only run morph logic if we are actively morphing
            if (isMorphingRef.current) {
                // If cooldown < 0, it means we are in the active morph phase (cooldown is used inversely here by original code logic, 
                // but let's stick to the "doMorph" increasing fraction logic)
                // Actually the original code logic was: morphRef starts at 0, increases by dt (subtracted from cooldownRef which is negative?)
                // Let's simplify: increment morphRef by dt.

                morphRef.current += dt;

                let fraction = morphRef.current / morphTime;
                if (fraction > 1) fraction = 1;

                setStyles(fraction);

                if (fraction >= 1) {
                    isMorphingRef.current = false;
                    prevIndexRef.current = selectedIndex;
                    doCooldown(); // Finalize state
                }
            } else {
                doCooldown(); // Ensure steady state
                morphRef.current = 0;
            }
        };

        animate();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [doMorph, doCooldown, selectedIndex]);

    return { text1Ref, text2Ref };
};

interface MorphingTextProps {
    className?: string;
    texts: string[];
    selectedIndex: number;
    onClick?: () => void;
}

const Texts: React.FC<Pick<MorphingTextProps, "texts" | "selectedIndex">> = ({ texts, selectedIndex }) => {
    const { text1Ref, text2Ref } = useMorphingText(texts, selectedIndex);
    return (
        <>
            <span
                className="absolute inset-x-0 top-0 m-auto inline-block w-full"
                ref={text1Ref}
            />
            <span
                className="absolute inset-x-0 top-0 m-auto inline-block w-full"
                ref={text2Ref}
            />
        </>
    );
};

const SvgFilters: React.FC = () => (
    <svg id="filters" className="hidden" preserveAspectRatio="xMidYMid slice">
        <defs>
            <filter id="threshold">
                <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
                />
            </filter>
        </defs>
    </svg>
);

const MorphingText: React.FC<MorphingTextProps> = ({ texts, className, selectedIndex, onClick }) => (
    <div
        onClick={onClick}
        className={cn(
            "relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] md:h-24 lg:text-[6rem] cursor-pointer select-none",
            className,
        )}
    >
        <Texts texts={texts} selectedIndex={selectedIndex} />
        <SvgFilters />
    </div>
);

export { MorphingText };
