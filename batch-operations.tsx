import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Archive, 
  Download, 
  Star,
  Filter,
  RotateCcw,
  Zap,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";

interface BatchItem {
  id: string;
  name: string;
  type: "photo" | "file" | "app" | "email";
  size: string;
  category: string;
  selected: boolean;
  metadata: any;
}

interface BatchOperationsProps {
  items: any[];
  type: "photo" | "file" | "app" | "email";
  onBatchAction: (action: string, items: any[]) => void;
}

export default function BatchOperations({ items, type, onBatchAction }: BatchOperationsProps) {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [smartFilter, setSmartFilter] = useState<string>("");
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    const mappedItems = items.map(item => ({
      id: item.id.toString(),
      name: item.name || item.subject || `${type}_${item.id}`,
      type,
      size: item.size || "Unknown",
      category: type,
      selected: false,
      metadata: item
    }));
    setBatchItems(mappedItems);
  }, [items, type]);

  const selectedItems = batchItems.filter(item => item.selected);
  const selectedCount = selectedItems.length;

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setBatchItems(prev => prev.map(item => ({ ...item, selected: newSelectAll })));
  };

  const handleItemSelect = (itemId: string) => {
    setBatchItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSmartSelect = (filterType: string) => {
    setBatchItems(prev => prev.map(item => {
      let shouldSelect = false;
      
      switch (filterType) {
        case "duplicates":
          shouldSelect = type === "photo" && item.metadata.isDuplicate;
          break;
        case "large":
          shouldSelect = type === "file" && item.metadata.isLarge;
          break;
        case "unused":
          shouldSelect = type === "app" && item.metadata.isUnused;
          break;
        case "unread":
          shouldSelect = type === "email" && item.metadata.isUnread;
          break;
        case "old":
          const cutoffDate = new Date();
          cutoffDate.setMonth(cutoffDate.getMonth() - 6);
          shouldSelect = item.metadata.dateCreated && new Date(item.metadata.dateCreated) < cutoffDate;
          break;
      }
      
      return { ...item, selected: shouldSelect };
    }));
    
    setSmartFilter(filterType);
  };

  const handleBatchAction = (action: string) => {
    if (selectedItems.length === 0) return;

    // Save current state for undo
    const undoData = {
      action,
      items: selectedItems.map(item => ({ ...item.metadata })),
      timestamp: new Date().toISOString()
    };
    setUndoStack(prev => [...prev, undoData]);

    // Execute batch action
    onBatchAction(action, selectedItems.map(item => item.metadata));

    // Clear selection
    setBatchItems(prev => prev.filter(item => !item.selected));
    setSelectAll(false);
    
    // Show undo option
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 10000); // Hide after 10 seconds
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    // Restore items (in real implementation, this would call an API)
    // Undo last action
    setShowUndo(false);
  };

  const getSmartFilters = () => {
    switch (type) {
      case "photo":
        return [
          { key: "duplicates", label: "Duplicates", count: items.filter(i => i.isDuplicate).length },
          { key: "large", label: "Large (>5MB)", count: items.filter(i => parseFloat(i.size) > 5).length },
          { key: "old", label: "Old (6+ months)", count: Math.floor(items.length * 0.3) }
        ];
      case "file":
        return [
          { key: "large", label: "Large Files", count: items.filter(i => i.isLarge).length },
          { key: "old", label: "Old Files", count: Math.floor(items.length * 0.4) }
        ];
      case "app":
        return [
          { key: "unused", label: "Unused Apps", count: items.filter(i => i.isUnused).length },
          { key: "large", label: "Large Apps", count: Math.floor(items.length * 0.2) }
        ];
      case "email":
        return [
          { key: "unread", label: "Unread", count: items.filter(i => i.isUnread).length },
          { key: "old", label: "Old Emails", count: Math.floor(items.length * 0.6) }
        ];
      default:
        return [];
    }
  };

  const getActionButtons = () => {
    const buttons = [];
    
    if (type === "photo") {
      buttons.push(
        { action: "delete", label: "Delete", icon: <Trash2 className="w-4 h-4" />, color: "bg-ios-red hover:bg-ios-red/90" },
        { action: "star", label: "Star", icon: <Star className="w-4 h-4" />, color: "bg-ios-orange hover:bg-ios-orange/90" }
      );
    } else if (type === "file") {
      buttons.push(
        { action: "archive", label: "Archive", icon: <Archive className="w-4 h-4" />, color: "bg-ios-blue hover:bg-ios-blue/90" },
        { action: "download", label: "Download", icon: <Download className="w-4 h-4" />, color: "bg-ios-green hover:bg-ios-green/90" },
        { action: "delete", label: "Delete", icon: <Trash2 className="w-4 h-4" />, color: "bg-ios-red hover:bg-ios-red/90" }
      );
    } else if (type === "app") {
      buttons.push(
        { action: "uninstall", label: "Uninstall", icon: <Trash2 className="w-4 h-4" />, color: "bg-ios-red hover:bg-ios-red/90" }
      );
    } else if (type === "email") {
      buttons.push(
        { action: "delete", label: "Delete", icon: <Trash2 className="w-4 h-4" />, color: "bg-ios-red hover:bg-ios-red/90" },
        { action: "archive", label: "Archive", icon: <Archive className="w-4 h-4" />, color: "bg-ios-blue hover:bg-ios-blue/90" }
      );
    }
    
    return buttons;
  };

  const filteredItems = batchItems.filter(item => 
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Undo Banner */}
      {showUndo && undoStack.length > 0 && (
        <div className="bg-ios-orange/10 border border-ios-orange/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-ios-orange" />
            <span className="text-sm text-ios-orange">
              Action completed on {selectedCount} items
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleUndo}
              className="text-ios-orange border-ios-orange hover:bg-ios-orange/10"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Undo
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowUndo(false)}
              className="text-ios-orange hover:bg-ios-orange/10"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
          Batch Operations
        </h3>
        <Badge variant="outline" className="text-ios-blue border-ios-blue">
          <CheckSquare className="w-3 h-3 mr-1" />
          {selectedCount} selected
        </Badge>
      </div>

      {/* Selection Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              id="select-all"
            />
            <label 
              htmlFor="select-all" 
              className="text-sm font-medium text-ios-dark dark:text-white cursor-pointer"
            >
              Select All ({batchItems.length} items)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Filter items..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-32"
            />
            <Filter className="w-4 h-4 text-ios-gray-3" />
          </div>
        </div>

        {/* Smart Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getSmartFilters().map(filter => (
            <Button
              key={filter.key}
              size="sm"
              variant={smartFilter === filter.key ? "default" : "outline"}
              onClick={() => handleSmartSelect(filter.key)}
              className={smartFilter === filter.key ? "bg-ios-blue text-white" : ""}
            >
              <Zap className="w-3 h-3 mr-1" />
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        {selectedCount > 0 && (
          <div className="flex space-x-3">
            {getActionButtons().map(button => (
              <Button
                key={button.action}
                size="sm"
                onClick={() => handleBatchAction(button.action)}
                className={`${button.color} text-white`}
              >
                {button.icon}
                <span className="ml-1">{button.label} ({selectedCount})</span>
              </Button>
            ))}
          </div>
        )}
      </Card>

      {/* Items List */}
      <Card className="p-4">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-ios-gray dark:hover:bg-gray-800 cursor-pointer ${
                item.selected ? 'bg-ios-blue/10 border border-ios-blue/20' : ''
              }`}
              onClick={() => handleItemSelect(item.id)}
            >
              <Checkbox
                checked={item.selected}
                onCheckedChange={() => handleItemSelect(item.id)}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-ios-dark dark:text-white">
                  {item.name}
                </div>
                <div className="text-xs text-ios-gray-3 dark:text-gray-400">
                  {item.size}
                </div>
              </div>
              {item.selected && (
                <CheckCircle className="w-4 h-4 text-ios-blue" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}