import { useState } from 'react';

const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder = ({ color = '#5227FF', size = 1, items = [], className = '' }) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor('#ffffff', 0.1);
  const paper2 = darkenColor('#ffffff', 0.05);
  const paper3 = '#ffffff';

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
  };

  const handlePaperMouseMove = (e, index) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const scaleStyle = { transform: `scale(${size})` };

  const getOpenTransform = index => {
    if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)';
    if (index === 1) return 'translate(10%, -70%) rotate(15deg)';
    if (index === 2) return 'translate(-50%, -100%) rotate(5deg)';
    return '';
  };

  return (
    <div style={scaleStyle} className={className}>
      <div
        className="group relative cursor-pointer"
        style={{
          transition: 'all 0.3s ease',
          transform: open ? 'translateY(-8px)' : 'translateY(0)'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{ 
            backgroundColor: folderBackColor,
            width: '100px',
            height: '80px',
            borderRadius: '0 10px 10px 10px',
            position: 'relative'
          }}
        >
          {/* Tab */}
          <span
            style={{ 
              backgroundColor: folderBackColor,
              position: 'absolute',
              bottom: '98%',
              left: 0,
              width: '30px',
              height: '10px',
              borderRadius: '5px 5px 0 0'
            }}
          />
          
          {/* Papers */}
          {papers.map((item, i) => {
            let width, height;
            if (i === 0) {
              width = '70%';
              height = '80%';
            }
            if (i === 1) {
              width = '80%';
              height = open ? '80%' : '70%';
            }
            if (i === 2) {
              width = '90%';
              height = open ? '80%' : '60%';
            }

            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : 'translateX(-50%) translateY(10%)';

            return (
              <div
                key={i}
                onMouseMove={e => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
                style={{
                  position: 'absolute',
                  zIndex: 20 + i,
                  bottom: '10%',
                  left: '50%',
                  transition: 'all 0.3s ease-in-out',
                  transform: transformStyle,
                  width,
                  height,
                  backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                  borderRadius: '10px'
                }}
              >
                {item}
              </div>
            );
          })}
          
          {/* Folder Front - Left panel */}
          <div
            style={{
              position: 'absolute',
              zIndex: 30,
              width: '100%',
              height: '100%',
              transformOrigin: 'bottom',
              transition: 'all 0.3s ease-in-out',
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              transform: open ? 'skewX(15deg) scaleY(0.6)' : 'skewX(0deg) scaleY(1)'
            }}
          />
          
          {/* Folder Front - Right panel */}
          <div
            style={{
              position: 'absolute',
              zIndex: 30,
              width: '100%',
              height: '100%',
              transformOrigin: 'bottom',
              transition: 'all 0.3s ease-in-out',
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              transform: open ? 'skewX(-15deg) scaleY(0.6)' : 'skewX(0deg) scaleY(1)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Folder;
