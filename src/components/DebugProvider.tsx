import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Grid, 
  Settings, 
  X, 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  MousePointer2, 
  RotateCcw,
  Move3D 
} from 'lucide-react';

interface DebugContextType {
  debugMode: boolean;
  toggleDebug: () => void;
  showGrid: boolean;
  toggleGrid: () => void;
  devMode: boolean;
  toggleDevMode: () => void;
  visibilitySettings: {
    containers: boolean;
    padding: boolean;
    margins: boolean;
  };
  updateVisibility: (type: 'containers' | 'padding' | 'margins', visible: boolean) => void;
}

const DebugContext = createContext<DebugContextType>({
  debugMode: false,
  toggleDebug: () => {},
  showGrid: false,
  toggleGrid: () => {},
  devMode: false,
  toggleDevMode: () => {},
  visibilitySettings: {
    containers: true,
    padding: true,
    margins: true,
  },
  updateVisibility: () => {}
});

export const useDebug = () => useContext(DebugContext);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [debugMode, setDebugMode] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [visibilitySettings, setVisibilitySettings] = useState({
    containers: true,
    padding: true,
    margins: true,
  });

  const toggleDebug = () => {
    setDebugMode(!debugMode);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const toggleDevMode = () => {
    setDevMode(!devMode);
  };

  const updateVisibility = (type: 'containers' | 'padding' | 'margins', visible: boolean) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [type]: visible
    }));
  };

  useEffect(() => {
    if (debugMode) {
      document.body.classList.add('debug-mode');
    } else {
      document.body.classList.remove('debug-mode');
    }
  }, [debugMode]);

  return (
    <DebugContext.Provider value={{ 
      debugMode, 
      toggleDebug, 
      showGrid, 
      toggleGrid, 
      devMode, 
      toggleDevMode, 
      visibilitySettings, 
      updateVisibility 
    }}>
      {children}
      {debugMode && (
        <>
          <DebugOverlay />
          <DebugLegend />
        </>
      )}
      {devMode && <DevModeControls />}
      {showGrid && <GridOverlay />}
      <DebugToggle />
    </DebugContext.Provider>
  );
};

const DebugToggle: React.FC = () => {
  const { debugMode, toggleDebug, devMode, toggleDevMode, showGrid, toggleGrid } = useDebug();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      <Button
        onClick={toggleDebug}
        variant={debugMode ? "destructive" : "outline"}
        size="sm"
        className="shadow-lg"
      >
        {debugMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
        Debug {debugMode ? 'ON' : 'OFF'}
      </Button>
      
      <Button
        onClick={toggleDevMode}
        variant={devMode ? "default" : "outline"}
        size="sm"
        className="shadow-lg"
      >
        <Settings className="w-4 h-4 mr-2" />
        Dev Mode
      </Button>

      <Button
        onClick={toggleGrid}
        variant={showGrid ? "default" : "outline"}
        size="sm"
        className="shadow-lg"
      >
        <Grid className="w-4 h-4 mr-2" />
        Grid
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
  const { visibilitySettings } = useDebug();

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
      {isContainer && visibilitySettings.containers && (
        <div 
          className="absolute inset-0 border-2 border-red-500"
          style={{ 
            borderStyle: 'dashed',
            backgroundColor: 'rgba(255, 0, 0, 0.05)'
          }}
        />
      )}

      {/* Padding Visualization */}
      {hasSignificantPadding && visibilitySettings.padding && (
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
      {hasSignificantMargin && visibilitySettings.margins && (
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
      {((isContainer && visibilitySettings.containers) || 
        (hasSignificantPadding && visibilitySettings.padding) || 
        (hasSignificantMargin && visibilitySettings.margins)) && 
        rect.width > 100 && rect.height > 40 && (
        <div className="absolute top-2 left-2 space-y-1">
          {isContainer && visibilitySettings.containers && (
            <Badge variant="destructive" className="text-xs pointer-events-auto">
              {styles.display.toUpperCase()}
            </Badge>
          )}
          {hasSignificantPadding && visibilitySettings.padding && (
            <Badge variant="secondary" className="text-xs pointer-events-auto bg-blue-100 text-blue-800">
              P: {padding.top}|{padding.right}|{padding.bottom}|{padding.left}
            </Badge>
          )}
          {hasSignificantMargin && visibilitySettings.margins && (
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
  const { visibilitySettings, updateVisibility } = useDebug();

  return (
    <div className="debug-legend">
      <h4 className="font-bold mb-3 text-sm">Debug Mode Legend</h4>
      <div className="space-y-2">
        <div className="debug-legend-item">
          <Checkbox 
            id="containers"
            checked={visibilitySettings.containers}
            onCheckedChange={(checked) => updateVisibility('containers', checked as boolean)}
            className="mr-2"
          />
          <div className="debug-legend-color bg-red-200 border-red-400"></div>
          <label htmlFor="containers" className="cursor-pointer">Containers (Flex/Grid)</label>
        </div>
        <div className="debug-legend-item">
          <Checkbox 
            id="padding"
            checked={visibilitySettings.padding}
            onCheckedChange={(checked) => updateVisibility('padding', checked as boolean)}
            className="mr-2"
          />
          <div className="debug-legend-color bg-blue-200 border-blue-400"></div>
          <label htmlFor="padding" className="cursor-pointer">Padding Areas</label>
        </div>
        <div className="debug-legend-item">
          <Checkbox 
            id="margins"
            checked={visibilitySettings.margins}
            onCheckedChange={(checked) => updateVisibility('margins', checked as boolean)}
            className="mr-2"
          />
          <div className="debug-legend-color bg-orange-200 border-orange-400"></div>
          <label htmlFor="margins" className="cursor-pointer">Margin Areas</label>
        </div>
      </div>
      <div className="text-xs mt-3 text-gray-600 border-t pt-2">
        <div>P: padding (top|right|bottom|left)</div>
        <div>M: margin (top|right|bottom|left)</div>
      </div>
    </div>
  );
};

// Grid Overlay Component
const GridOverlay: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    />
  );
};

// Dev Mode Controls Component
const DevModeControls: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementStyles, setElementStyles] = useState<any>({});
  const { devMode, toggleDevMode } = useDebug();

  useEffect(() => {
    if (!devMode) {
      setSelectedElement(null);
      return;
    }

    const handleElementClick = (e: MouseEvent) => {
      if (!devMode) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      
      // Skip if clicking on dev mode controls
      if (target.closest('.dev-mode-controls') || target.closest('.dev-mode-overlay')) {
        return;
      }
      
      setSelectedElement(target);
      
      // Get current styles
      const computedStyles = window.getComputedStyle(target);
      setElementStyles({
        display: computedStyles.display,
        justifyContent: computedStyles.justifyContent,
        alignItems: computedStyles.alignItems,
        textAlign: computedStyles.textAlign,
        margin: computedStyles.margin,
        padding: computedStyles.padding,
        width: computedStyles.width,
        height: computedStyles.height,
      });
    };

    document.addEventListener('click', handleElementClick, true);
    
    return () => {
      document.removeEventListener('click', handleElementClick, true);
    };
  }, [devMode]);

  const applyAlignment = (alignment: string) => {
    if (!selectedElement) return;
    
    // Remove existing alignment classes
    selectedElement.className = selectedElement.className
      .replace(/\b(text-left|text-center|text-right|justify-start|justify-center|justify-end|items-start|items-center|items-end)\b/g, '');
    
    // Apply new alignment
    switch (alignment) {
      case 'center':
        selectedElement.classList.add('text-center', 'justify-center', 'items-center');
        if (selectedElement.style.display === 'flex' || selectedElement.classList.contains('flex')) {
          selectedElement.classList.add('justify-center', 'items-center');
        }
        break;
      case 'left':
        selectedElement.classList.add('text-left', 'justify-start', 'items-start');
        break;
      case 'right':
        selectedElement.classList.add('text-right', 'justify-end', 'items-end');
        break;
    }
  };

  const makeFlexContainer = () => {
    if (!selectedElement) return;
    
    if (!selectedElement.classList.contains('flex')) {
      selectedElement.classList.add('flex');
    }
  };

  const resetElement = () => {
    if (!selectedElement) return;
    
    // Remove common utility classes
    const classesToRemove = [
      'text-left', 'text-center', 'text-right',
      'justify-start', 'justify-center', 'justify-end',
      'items-start', 'items-center', 'items-end',
      'flex', 'grid', 'block', 'inline-block'
    ];
    
    classesToRemove.forEach(cls => {
      selectedElement.classList.remove(cls);
    });
  };

  if (!devMode) return null;

  return (
    <>
      {/* Element Highlight */}
      {selectedElement && (
        <div
          className="fixed pointer-events-none z-[9999] border-2 border-blue-500 bg-blue-500/10"
          style={{
            left: selectedElement.getBoundingClientRect().left + window.scrollX,
            top: selectedElement.getBoundingClientRect().top + window.scrollY,
            width: selectedElement.getBoundingClientRect().width,
            height: selectedElement.getBoundingClientRect().height,
          }}
        />
      )}

      {/* Dev Controls Panel */}
      <Card className="fixed top-4 right-4 z-[10000] p-4 bg-card/95 backdrop-blur-md border dev-mode-controls">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="font-semibold text-sm">Dev Mode</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleDevMode()}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-4 min-w-[200px]">
          {/* Selected Element Info */}
          {selectedElement && (
            <div className="space-y-3 border-t pt-3">
              <div className="text-sm font-medium text-primary">
                Selected: {selectedElement.tagName.toLowerCase()}
                {selectedElement.className && (
                  <div className="text-xs text-muted-foreground mt-1 break-all">
                    .{selectedElement.className.split(' ').slice(0, 3).join(' .')}
                  </div>
                )}
              </div>

              {/* Alignment Controls */}
              <div>
                <label className="text-xs font-medium block mb-2">Alignment</label>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyAlignment('left')}
                    className="p-1 h-7 w-7"
                  >
                    <AlignLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyAlignment('center')}
                    className="p-1 h-7 w-7"
                  >
                    <AlignCenter className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyAlignment('right')}
                    className="p-1 h-7 w-7"
                  >
                    <AlignRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Layout Controls */}
              <div>
                <label className="text-xs font-medium block mb-2">Layout</label>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={makeFlexContainer}
                    className="p-1 h-7 text-xs"
                  >
                    Flex
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetElement}
                    className="p-1 h-7 w-7"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Display: {elementStyles.display}</div>
                {elementStyles.textAlign && (
                  <div>Text: {elementStyles.textAlign}</div>
                )}
              </div>
            </div>
          )}

          {!selectedElement && (
            <div className="text-xs text-muted-foreground text-center py-4">
              <MousePointer2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Click any element to select and modify it
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="fixed bottom-4 left-4 z-[10000] p-3 bg-card/95 backdrop-blur-md border dev-mode-controls">
        <div className="text-xs text-muted-foreground max-w-[200px]">
          <div className="font-medium mb-1">Dev Mode Active</div>
          <div>• Click elements to select</div>
          <div>• Use controls to modify layout</div>
          <div>• Grid helps with alignment</div>
        </div>
      </Card>
    </>
  );
};

export default DebugProvider;