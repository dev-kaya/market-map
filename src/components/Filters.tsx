import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Company, Category } from '@/types';

interface FiltersProps {
  companies: Company[];
  categories: Category[];
  selectedStages: string[];
  selectedGeographies: string[];
  selectedCategories: string[];
  onStageChange: (stages: string[]) => void;
  onGeographyChange: (geographies: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  className?: string;
}

const STAGES = [
  { value: 'SEED', label: 'Seed' },
  { value: 'SERIES_A', label: 'Series A' },
  { value: 'SERIES_B', label: 'Series B' },
  { value: 'SERIES_C', label: 'Series C' },
  { value: 'SERIES_D', label: 'Series D' },
  { value: 'GROWTH', label: 'Growth' },
  { value: 'PUBLIC', label: 'Public' },
];

export default function Filters({
  companies,
  categories,
  selectedStages,
  selectedGeographies,
  selectedCategories,
  onStageChange,
  onGeographyChange,
  onCategoryChange,
  className,
}: FiltersProps) {
  const uniqueGeographies = Array.from(
    new Set(companies.map(c => c.geography).filter(Boolean) as string[]),
  ).sort();

  const toggleStage = (stage: string) => {
    if (selectedStages.includes(stage)) {
      onStageChange(selectedStages.filter(s => s !== stage));
    } else {
      onStageChange([...selectedStages, stage]);
    }
  };

  const toggleGeography = (geography: string) => {
    if (selectedGeographies.includes(geography)) {
      onGeographyChange(selectedGeographies.filter(g => g !== geography));
    } else {
      onGeographyChange([...selectedGeographies, geography]);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(c => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const clearAllFilters = () => {
    onStageChange([]);
    onGeographyChange([]);
    onCategoryChange([]);
  };

  const hasActiveFilters = selectedStages.length > 0 || selectedGeographies.length > 0 || selectedCategories.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Stages */}
        <div>
          <h4 className="text-sm font-medium mb-2">Stage</h4>
          <div className="flex flex-wrap gap-2">
            {STAGES.map(stage => (
              <Badge
                key={stage.value}
                variant={selectedStages.includes(stage.value) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleStage(stage.value)}
              >
                {stage.label}
                {selectedStages.includes(stage.value) && (
                  <X className="ml-1 w-3 h-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Geography */}
        {uniqueGeographies.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Geography</h4>
            <div className="flex flex-wrap gap-2">
              {uniqueGeographies.map(geography => (
                <Badge
                  key={geography}
                  variant={selectedGeographies.includes(geography) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleGeography(geography)}
                >
                  {geography}
                  {selectedGeographies.includes(geography) && (
                    <X className="ml-1 w-3 h-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium mb-2">Category</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleCategory(category.id)}
                style={{
                  backgroundColor: selectedCategories.includes(category.id) ? category.color : undefined,
                  borderColor: category.color,
                }}
              >
                {category.name}
                {selectedCategories.includes(category.id) && (
                  <X className="ml-1 w-3 h-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}