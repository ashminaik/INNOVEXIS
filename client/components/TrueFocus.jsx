import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  fontSize = '2rem'
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => {
            // Bounce back and forth between first and last word
            if (prev >= words.length - 1) {
              setDirection(-1);
              return prev - 1;
            } else if (prev <= 0) {
              setDirection(1);
              return prev + 1;
            }
            return prev + direction;
          });
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length, direction]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = index => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  const containerStyle = {
    position: 'relative',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    outline: 'none',
    userSelect: 'none'
  };

  const wordStyle = (isActive) => ({
    position: 'relative',
    fontSize: fontSize,
    fontWeight: 800,
    cursor: 'pointer',
    filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
    transition: `filter ${animationDuration}s ease`,
    outline: 'none',
    userSelect: 'none',
    color: '#fff'
  });

  const cornerBaseStyle = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '2px',
    borderColor: borderColor,
    filter: `drop-shadow(0 0 4px ${borderColor})`
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => (wordRefs.current[index] = el)}
            style={wordStyle(isActive)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          border: 0
        }}
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration
        }}
      >
        {/* Top Left Corner */}
        <span
          style={{
            ...cornerBaseStyle,
            top: '-8px',
            left: '-8px',
            borderRight: 'none',
            borderBottom: 'none'
          }}
        />
        {/* Top Right Corner */}
        <span
          style={{
            ...cornerBaseStyle,
            top: '-8px',
            right: '-8px',
            borderLeft: 'none',
            borderBottom: 'none'
          }}
        />
        {/* Bottom Left Corner */}
        <span
          style={{
            ...cornerBaseStyle,
            bottom: '-8px',
            left: '-8px',
            borderRight: 'none',
            borderTop: 'none'
          }}
        />
        {/* Bottom Right Corner */}
        <span
          style={{
            ...cornerBaseStyle,
            bottom: '-8px',
            right: '-8px',
            borderLeft: 'none',
            borderTop: 'none'
          }}
        />
      </motion.div>
    </div>
  );
};

export default TrueFocus;
