import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Filter, 
  Search, 
  Calendar as CalendarIcon, 
  HardDrive, 
  FileType,
  Clock,
  Star,
  Trash2,
  Save,
  X,
  Plus,
  Zap,
  Settings
} from "lucide-react";

interface FilterCriteria {
  name: string;
  type: "text" | "size" | "date" | "category" | "status";
  operator: "equals" | "contains" | "greater_than" | "less_than" | "between" | "in";
  value: any;
  enabled: boolean;
}

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  criteria: FilterCriteria[];
  isDefault: boolean;
}

interface AdvancedFilteringProps {
  items: any[];
  type: "photo" | "file" | "app" | "email";
  onFilterChange: (filteredItems: any[]) => void;
}

export default function AdvancedFiltering({ items, type, onFilterChange }: AdvancedFilteringProps) {
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [activePreset, setActivePreset] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    initializeDefaultPresets();
  }, [type]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, items]);

  const initializeDefaultPresets = () => {
    let defaultPresets: FilterPreset[] = [];
    
    if (type === "photo") {
      defaultPresets = [
        {
          id: "large-photos",
          name: "Large Photos",
          description: "Photos larger than 5MB",
          criteria: [
            { name: "size", type: "size", operator: "greater_than", value: 5, enabled: true }
          ],
          isDefault: true
        },
        {
          id: "recent-photos",
          name: "Recent Photos",
          description: "Photos from last 30 days",
          criteria: [
            { name: "date", type: "date", operator: "greater_than", value: 30, enabled: true }
          ],
          isDefault: true
        },
        {
          id: "duplicates",
          name: "Duplicates",
          description: "Potential duplicate photos",
          criteria: [
            { name: "isDuplicate", type: "status", operator: "equals", value: true, enabled: true }
          ],
          isDefault: true
        }
      ];
    } else if (type === "file") {
      defaultPresets = [
        {
          id: "large-files",
          name: "Large Files",
          description: "Files larger than 10MB",
          criteria: [
            { name: "size", type: "size", operator: "greater_than", value: 10, enabled: true }
          ],
          isDefault: true
        },
        {
          id: "old-files",
          name: "Old Files",
          description: "Files older than 6 months",
          criteria: [
            { name: "date", type: "date", operator: "less_than", value: 180, enabled: true }
          ],
          isDefault: true
        },
        {
          id: "documents",
          name: "Documents",
          description: "Document files only",
          criteria: [
            { name: "type", type: "category", operator: "in", value: ["pdf", "doc", "docx", "txt"], enabled: true }
          ],
          isDefault: true
        }
      ];
    } else if (type === "app") {
      defaultPresets = [
        {
          id: "unused-apps",
          name: "Unused Apps",
          description: "Apps not used in 30+ days",
          criteria: [
            { name: "isUnused", type: "status", operator: "equals", value: true, enabled: true }
          ],
          isDefault: true
        },
        {
          id: "large-apps",
          name: "Large Apps",
          description: "Apps larger than 100MB",
          criteria: [
            { name: "size", type: "size", operator: "greater_than", value: 100, enabled: true }
          ],
          isDefault: true
        }
      ];
    } else if (type === "email") {
      defaultPresets = [
        {
          id: "unread-emails",
          name: "Unread Emails",
          description: "All unread emails",
          criteria: [
            { name: "isUnread", type: "status", operator: "equals", value: true, enabled: true }
          ],
          isDefault: true
        },
        {
          id: "old-emails",
          name: "Old Emails",
          description: "Emails older than 1 year",
          criteria: [
            { name: "date", type: "date", operator: "less_than", value: 365, enabled: true }
          ],
          isDefault: true
        }
      ];
    }
    
    setPresets(defaultPresets);
  };

  const applyFilters = () => {
    let filtered = [...items];
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        (item.name || item.subject || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filter criteria
    filters.forEach(filter => {
      if (!filter.enabled) return;
      
      filtered = filtered.filter(item => {
        const itemValue = getItemValue(item, filter.name);
        return matchesCriteria(itemValue, filter);
      });
    });
    
    setFilteredItems(filtered);
    onFilterChange(filtered);
  };

  const getItemValue = (item: any, fieldName: string) => {
    switch (fieldName) {
      case "size":
        return parseFloat(item.size) || 0;
      case "date":
        return item.dateCreated ? new Date(item.dateCreated) : new Date();
      case "type":
        return item.type || item.category || "";
      case "name":
        return item.name || item.subject || "";
      default:
        return item[fieldName];
    }
  };

  const matchesCriteria = (itemValue: any, criteria: FilterCriteria) => {
    switch (criteria.operator) {
      case "equals":
        return itemValue === criteria.value;
      case "contains":
        return itemValue.toString().toLowerCase().includes(criteria.value.toLowerCase());
      case "greater_than":
        if (criteria.type === "date") {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - criteria.value);
          return itemValue > cutoff;
        }
        return itemValue > criteria.value;
      case "less_than":
        if (criteria.type === "date") {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - criteria.value);
          return itemValue < cutoff;
        }
        return itemValue < criteria.value;
      case "in":
        return Array.isArray(criteria.value) && criteria.value.includes(itemValue);
      default:
        return true;
    }
  };

  const addFilter = () => {
    const newFilter: FilterCriteria = {
      name: "name",
      type: "text",
      operator: "contains",
      value: "",
      enabled: true
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (index: number, updates: Partial<FilterCriteria>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const applyPreset = (preset: FilterPreset) => {
    setFilters(preset.criteria);
    setActivePreset(preset.id);
    setSearchQuery("");
  };

  const saveCustomPreset = () => {
    const name = prompt("Enter preset name:");
    if (!name) return;
    
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name,
      description: "Custom filter preset",
      criteria: [...filters],
      isDefault: false
    };
    
    setPresets([...presets, newPreset]);
  };

  const clearAllFilters = () => {
    setFilters([]);
    setSearchQuery("");
    setActivePreset("");
  };

  const getFieldOptions = () => {
    switch (type) {
      case "photo":
        return [
          { value: "name", label: "Name" },
          { value: "size", label: "Size" },
          { value: "date", label: "Date" },
          { value: "isDuplicate", label: "Duplicate Status" }
        ];
      case "file":
        return [
          { value: "name", label: "Name" },
          { value: "size", label: "Size" },
          { value: "date", label: "Date" },
          { value: "type", label: "File Type" },
          { value: "isLarge", label: "Large File" }
        ];
      case "app":
        return [
          { value: "name", label: "Name" },
          { value: "size", label: "Size" },
          { value: "isUnused", label: "Unused Status" }
        ];
      case "email":
        return [
          { value: "subject", label: "Subject" },
          { value: "sender", label: "Sender" },
          { value: "date", label: "Date" },
          { value: "isUnread", label: "Read Status" }
        ];
      default:
        return [];
    }
  };

  const getOperatorOptions = (fieldType: string) => {
    switch (fieldType) {
      case "text":
        return [
          { value: "contains", label: "Contains" },
          { value: "equals", label: "Equals" }
        ];
      case "size":
        return [
          { value: "greater_than", label: "Greater than" },
          { value: "less_than", label: "Less than" },
          { value: "equals", label: "Equals" }
        ];
      case "date":
        return [
          { value: "greater_than", label: "Newer than (days)" },
          { value: "less_than", label: "Older than (days)" }
        ];
      case "status":
        return [
          { value: "equals", label: "Is" }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
          Advanced Filtering
        </h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-ios-blue border-ios-blue">
            <Filter className="w-3 h-3 mr-1" />
            {filteredItems.length} of {items.length}
          </Badge>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="w-4 h-4 mr-1" />
            {showAdvanced ? "Simple" : "Advanced"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">Quick</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          {/* Search Bar */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ios-gray-3 w-4 h-4" />
              <Input
                placeholder={`Search ${type}s...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 gap-3">
            {presets.slice(0, 4).map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset === preset.id ? "default" : "outline"}
                onClick={() => applyPreset(preset)}
                className={`h-auto p-3 ${
                  activePreset === preset.id 
                    ? "bg-ios-blue text-white" 
                    : "hover:bg-ios-gray dark:hover:bg-gray-800"
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs opacity-70">{preset.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Active Filters */}
          {(filters.length > 0 || searchQuery) && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-ios-dark dark:text-white">Active Filters</h4>
                <Button size="sm" variant="outline" onClick={clearAllFilters}>
                  <X className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Search className="w-3 h-3" />
                    <span>Search: {searchQuery}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSearchQuery("")}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {filters.filter(f => f.enabled).map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{filter.name} {filter.operator} {filter.value}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFilter(index)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid gap-3">
            {presets.map((preset) => (
              <Card key={preset.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-ios-blue/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-ios-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ios-dark dark:text-white">{preset.name}</h4>
                      <p className="text-sm text-ios-gray-3 dark:text-gray-400">{preset.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {preset.isDefault && (
                      <Badge variant="outline" className="text-xs">Default</Badge>
                    )}
                    <Button
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className={activePreset === preset.id ? "bg-ios-blue text-white" : ""}
                    >
                      {activePreset === preset.id ? "Applied" : "Apply"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-ios-dark dark:text-white">Custom Filters</h4>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={addFilter}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add Filter
                </Button>
                {filters.length > 0 && (
                  <Button size="sm" onClick={saveCustomPreset}>
                    <Save className="w-3 h-3 mr-1" />
                    Save Preset
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {filters.map((filter, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filter.enabled}
                      onCheckedChange={(enabled) => updateFilter(index, { enabled })}
                    />
                    <Select
                      value={filter.name}
                      onValueChange={(name) => updateFilter(index, { name })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getFieldOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Select
                    value={filter.operator}
                    onValueChange={(operator) => updateFilter(index, { operator })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperatorOptions(filter.type).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    placeholder="Value"
                  />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFilter(index)}
                    className="text-ios-red hover:bg-ios-red/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}