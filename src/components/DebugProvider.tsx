import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface DebugContextType {
  debugMode: boolean;
  toggleDebug: () => void;
}

const DebugContext = createContext<DebugContextType>({
  debugMode: false,
  toggleDebug: () => {}
});

export const useDebug = () => useContext(DebugContext);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [debugMode, setDebugMode] = useState(false);

  const toggleDebug = () => {
    setDebugMode(!debugMode);
  };

  useEffect(() => {
    if (debugMode) {
      document.body.classList.add('debug-mode');
    } else {
      document.body.classList.remove('debug-mode');
    }
  }, [debugMode]);

  return (
    <DebugContext.Provider value={{ debugMode, toggleDebug }}>
      {children}
      {debugMode && (
        <>
          <DebugOverlay />
          <DebugLegend />
        </>
      )}
      <DebugToggle />
    </DebugContext.Provider>
  );
};

const DebugToggle: React.FC = () => {
  const { debugMode, toggleDebug } = useDebug();

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <Button
        onClick={toggleDebug}
        variant={debugMode ? "destructive" : "outline"}
        size="sm"
        className="shadow-lg"
      >
        {debugMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
        Debug {debugMode ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
};

const DebugOverlay: React.FC = () => {
  const [elements, setElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const updateElements = () => {
      // Get all elements with padding, margin, or specific classes
      const allElements = Array.from(document.querySelectorAll('*')) as HTMLElement[];
      const debugElements = allElements.filter(el => {
        const computedStyle = window.getComputedStyle(el);
        const hasSignificantPadding = 
          parseInt(computedStyle.paddingTop) > 0 ||
          parseInt(computedStyle.paddingRight) > 0 ||
          parseInt(computedStyle.paddingBottom) > 0 ||
          parseInt(computedStyle.paddingLeft) > 0;
        
        const hasSignificantMargin =
          parseInt(computedStyle.marginTop) > 0 ||
          parseInt(computedStyle.marginRight) > 0 ||
          parseInt(computedStyle.marginBottom) > 0 ||
          parseInt(computedStyle.marginLeft) > 0;

        const isContainer = 
          computedStyle.display === 'flex' ||
          computedStyle.display === 'grid' ||
          el.classList.contains('container') ||
          el.classList.contains('flex') ||
          el.classList.contains('grid');

        return hasSignificantPadding || hasSignificantMargin || isContainer;
      });

      setElements(debugElements);
    };

    updateElements();
    const interval = setInterval(updateElements, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {elements.map((element, index) => (
        <DebugElementOverlay key={index} element={element} />
      ))}
    </>
  );
};

const DebugElementOverlay: React.FC<{ element: HTMLElement }> = ({ element }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [styles, setStyles] = useState<CSSStyleDeclaration | null>(null);

  useEffect(() => {
    const updateRect = () => {
      setRect(element.getBoundingClientRect());
      setStyles(window.getComputedStyle(element));
    };

    updateRect();
    const observer = new ResizeObserver(updateRect);
    observer.observe(element);

    window.addEventListener('scroll', updateRect);
    window.addEventListener('resize', updateRect);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [element]);

  if (!rect || !styles || rect.width === 0 || rect.height === 0) return null;

  const padding = {
    top: parseInt(styles.paddingTop),
    right: parseInt(styles.paddingRight),
    bottom: parseInt(styles.paddingBottom),
    left: parseInt(styles.paddingLeft)
  };

  const margin = {
    top: parseInt(styles.marginTop),
    right: parseInt(styles.marginRight),
    bottom: parseInt(styles.marginBottom),
    left: parseInt(styles.marginLeft)
  };

  const isContainer = 
    styles.display === 'flex' ||
    styles.display === 'grid' ||
    element.classList.contains('container') ||
    element.classList.contains('flex') ||
    element.classList.contains('grid');

  const hasSignificantPadding = Object.values(padding).some(p => p > 0);
  const hasSignificantMargin = Object.values(margin).some(m => m > 0);

  return (
    <div
      className="pointer-events-none fixed z-[9998]"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }}
    >
      {/* Container Outline */}
      {isContainer && (
        <div 
          className="absolute inset-0 border-2 border-red-500"
          style={{ 
            borderStyle: 'dashed',
            backgroundColor: 'rgba(255, 0, 0, 0.05)'
          }}
        />
      )}

      {/* Padding Visualization */}
      {hasSignificantPadding && (
        <>
          {/* Padding Areas */}
          {padding.top > 0 && (
            <div 
              className="absolute top-0 left-0 right-0 bg-blue-200 border border-blue-400"
              style={{ height: padding.top }}
            />
          )}
          {padding.bottom > 0 && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-200 border border-blue-400"
              style={{ height: padding.bottom }}
            />
          )}
          {padding.left > 0 && (
            <div 
              className="absolute top-0 bottom-0 left-0 bg-blue-200 border border-blue-400"
              style={{ width: padding.left }}
            />
          )}
          {padding.right > 0 && (
            <div 
              className="absolute top-0 bottom-0 right-0 bg-blue-200 border border-blue-400"
              style={{ width: padding.right }}
            />
          )}
        </>
      )}

      {/* Margin Visualization */}
      {hasSignificantMargin && (
        <>
          {margin.top > 0 && (
            <div 
              className="absolute left-0 right-0 bg-orange-200 border border-orange-400"
              style={{ 
                height: margin.top,
                top: -margin.top
              }}
            />
          )}
          {margin.bottom > 0 && (
            <div 
              className="absolute left-0 right-0 bg-orange-200 border border-orange-400"
              style={{ 
                height: margin.bottom,
                bottom: -margin.bottom
              }}
            />
          )}
          {margin.left > 0 && (
            <div 
              className="absolute top-0 bottom-0 bg-orange-200 border border-orange-400"
              style={{ 
                width: margin.left,
                left: -margin.left
              }}
            />
          )}
          {margin.right > 0 && (
            <div 
              className="absolute top-0 bottom-0 bg-orange-200 border border-orange-400"
              style={{ 
                width: margin.right,
                right: -margin.right
              }}
            />
          )}
        </>
      )}

      {/* Labels */}
      {(hasSignificantPadding || hasSignificantMargin || isContainer) && rect.width > 100 && rect.height > 40 && (
        <div className="absolute top-2 left-2 space-y-1">
          {isContainer && (
            <Badge variant="destructive" className="text-xs pointer-events-auto">
              {styles.display.toUpperCase()}
            </Badge>
          )}
          {hasSignificantPadding && (
            <Badge variant="secondary" className="text-xs pointer-events-auto bg-blue-100 text-blue-800">
              P: {padding.top}|{padding.right}|{padding.bottom}|{padding.left}
            </Badge>
          )}
          {hasSignificantMargin && (
            <Badge variant="secondary" className="text-xs pointer-events-auto bg-orange-100 text-orange-800">
              M: {margin.top}|{margin.right}|{margin.bottom}|{margin.left}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

const DebugLegend: React.FC = () => {
  return (
    <div className="debug-legend">
      <h4 className="font-bold mb-2 text-sm">Debug Mode Legend</h4>
      <div className="debug-legend-item">
        <div className="debug-legend-color bg-red-200 border-red-400"></div>
        <span>Containers (Flex/Grid)</span>
      </div>
      <div className="debug-legend-item">
        <div className="debug-legend-color bg-blue-200 border-blue-400"></div>
        <span>Padding Areas</span>
      </div>
      <div className="debug-legend-item">
        <div className="debug-legend-color bg-orange-200 border-orange-400"></div>
        <span>Margin Areas</span>
      </div>
      <div className="text-xs mt-2 text-gray-600">
        <div>P: padding (top|right|bottom|left)</div>
        <div>M: margin (top|right|bottom|left)</div>
      </div>
    </div>
  );
};

export default DebugProvider;