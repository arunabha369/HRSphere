import React from 'react';
import { motion } from 'framer-motion';

const TypewriterText = ({ text, className = "", delay = 0 }) => {
    // Variants for container to stagger children
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: delay
            }
        }
    };

    // Variants for each letter
    const child = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200
            }
        }
    };

    return (
        <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className={`inline-block ${className}`}
        >
            {text.split("").map((letter, index) => (
                <motion.span variants={child} key={index} className="inline-block whitespace-pre">
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default TypewriterText;
