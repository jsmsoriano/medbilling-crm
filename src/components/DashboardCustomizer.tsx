
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  GripVertical,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DashboardTile {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  description?: string;
  size: 'small' | 'medium' | 'large';
}

interface DashboardCustomizerProps {
  tiles: DashboardTile[];
  onTilesChange: (tiles: DashboardTile[]) => void;
}

const availableIcons = {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle
};

const availableColors = [
  'green', 'blue', 'purple', 'emerald', 'orange', 'red', 'indigo'
];

const SortableTile: React.FC<{ tile: DashboardTile; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ 
  tile, 
  onEdit, 
  onDelete 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = availableIcons[tile.icon as keyof typeof availableIcons] || DollarSign;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <IconComponent className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-sm">{tile.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(tile.id)}>
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(tile.id)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="text-lg font-bold">{tile.value}</div>
      <div className="text-sm text-gray-600">{tile.change}</div>
    </div>
  );
};

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ tiles, onTilesChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTile, setEditingTile] = useState<DashboardTile | null>(null);
  const [isAddingTile, setIsAddingTile] = useState(false);
  const [localTiles, setLocalTiles] = useState<DashboardTile[]>(tiles);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setLocalTiles(tiles);
  }, [tiles]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLocalTiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    onTilesChange(localTiles);
    setIsEditing(false);
    localStorage.setItem('dashboard-tiles', JSON.stringify(localTiles));
  };

  const handleReset = () => {
    setLocalTiles(tiles);
    localStorage.removeItem('dashboard-tiles');
  };

  const handleAddTile = () => {
    const newTile: DashboardTile = {
      id: `tile-${Date.now()}`,
      title: 'New Metric',
      value: '$0',
      change: '+0%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'blue',
      description: 'Custom metric',
      size: 'medium'
    };
    setLocalTiles([...localTiles, newTile]);
    setEditingTile(newTile);
    setIsAddingTile(true);
  };

  const handleEditTile = (id: string) => {
    const tile = localTiles.find(t => t.id === id);
    if (tile) {
      setEditingTile(tile);
    }
  };

  const handleSaveTile = (updatedTile: DashboardTile) => {
    setLocalTiles(localTiles.map(tile => 
      tile.id === updatedTile.id ? updatedTile : tile
    ));
    setEditingTile(null);
    setIsAddingTile(false);
  };

  const handleDeleteTile = (id: string) => {
    setLocalTiles(localTiles.filter(tile => tile.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard Layout</h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Dashboard
            </Button>
          )}
        </div>
      </div>

      {isEditing && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Drag tiles to reorder, click edit to modify, or add new tiles</span>
            <Button onClick={handleAddTile} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Tile
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={localTiles.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localTiles.map((tile) => (
                  <SortableTile
                    key={tile.id}
                    tile={tile}
                    onEdit={handleEditTile}
                    onDelete={handleDeleteTile}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Card>
      )}

      {/* Tile Edit Dialog */}
      <Dialog open={!!editingTile} onOpenChange={() => setEditingTile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isAddingTile ? 'Add New Tile' : 'Edit Tile'}</DialogTitle>
          </DialogHeader>
          {editingTile && (
            <TileEditForm
              tile={editingTile}
              onSave={handleSaveTile}
              onCancel={() => {
                setEditingTile(null);
                if (isAddingTile) {
                  setLocalTiles(localTiles.filter(t => t.id !== editingTile.id));
                  setIsAddingTile(false);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TileEditForm: React.FC<{
  tile: DashboardTile;
  onSave: (tile: DashboardTile) => void;
  onCancel: () => void;
}> = ({ tile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(tile);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Value</Label>
        <Input
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Change</Label>
        <Input
          value={formData.change}
          onChange={(e) => setFormData({ ...formData, change: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(availableIcons).map((iconName) => (
              <SelectItem key={iconName} value={iconName}>
                {iconName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableColors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default DashboardCustomizer;
