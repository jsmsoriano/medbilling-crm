import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Grid, 
  Move3D, 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Eye, 
  EyeOff,
  Settings,
  X,
  MousePointer2,
  Maximize2,
  RotateCcw
} from 'lucide-react';

interface DevModeControlsProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onGridToggle: (showGrid: boolean) => void;
  showGrid: boolean;
}

const DevModeControls = ({ isEnabled, onToggle, onGridToggle, showGrid }: DevModeControlsProps) => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementStyles, setElementStyles] = useState<any>({});

  useEffect(() => {
    if (!isEnabled) {
      setSelectedElement(null);
      return;
    }

    const handleElementClick = (e: MouseEvent) => {
      if (!isEnabled) return;
      
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
  }, [isEnabled]);

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

  if (!isEnabled) return null;

  return (
    <>
      {/* Grid Overlay */}
      {showGrid && (
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
      )}

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
            onClick={() => onToggle(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-4 min-w-[200px]">
          {/* Grid Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show Grid</label>
            <Switch
              checked={showGrid}
              onCheckedChange={onGridToggle}
            />
          </div>

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
      <Card className="fixed bottom-4 right-4 z-[10000] p-3 bg-card/95 backdrop-blur-md border dev-mode-controls">
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

export default DevModeControls;