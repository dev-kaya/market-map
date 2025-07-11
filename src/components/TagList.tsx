import { useState } from 'react';
import { TagLabel } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Users, Zap, TrendingUp, Star, Hash } from 'lucide-react';

interface TagListProps {
  companyName: string;
  userTag: TagLabel | null;
  counts: Record<TagLabel, number>;
  onEndorse: (tag: TagLabel) => void;
  isLoading?: boolean;
}

const TAG_CONFIG = {
  GREAT_TEAM: {
    label: 'Great Team',
    icon: Users,
    description: 'Exceptional leadership and talent',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    hoverColor: 'hover:bg-blue-100',
  },
  STRONG_TECH: {
    label: 'Strong Tech',
    icon: Zap,
    description: 'Impressive technical capabilities',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    hoverColor: 'hover:bg-purple-100',
  },
  FAST_GROWTH: {
    label: 'Fast Growth',
    icon: TrendingUp,
    description: 'Rapidly scaling business',
    color: 'bg-green-50 text-green-700 border-green-200',
    hoverColor: 'hover:bg-green-100',
  },
  MARKET_LEADER: {
    label: 'Market Leader',
    icon: Star,
    description: 'Leading position in their sector',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    hoverColor: 'hover:bg-orange-100',
  },
  OTHER: {
    label: 'Other',
    icon: Hash,
    description: 'Other positive qualities',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    hoverColor: 'hover:bg-gray-100',
  },
};

export default function TagList({ companyName, userTag, counts, onEndorse, isLoading }: TagListProps) {
  const [selectedTag, setSelectedTag] = useState<TagLabel | null>(userTag);

  const handleTagSelect = (tag: TagLabel) => {
    if (userTag || isLoading) return; // Disabled if already endorsed or loading
    
    setSelectedTag(tag);
    onEndorse(tag);
  };

  const isDisabled = !!userTag || isLoading;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Thumbs className="w-5 h-5 text-blue-600" />
          Endorse {companyName}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {userTag ? 'You\'ve already endorsed this company' : 'Choose one tag that best describes this company'}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {(Object.keys(TAG_CONFIG) as TagLabel[]).map((tag) => {
          const config = TAG_CONFIG[tag];
          const Icon = config.icon;
          const count = counts[tag] || 0;
          const isSelected = selectedTag === tag;
          const isUserTag = userTag === tag;
          
          return (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              disabled={isDisabled}
              className={`
                w-full p-3 rounded-lg border-2 text-left transition-all duration-200
                ${isUserTag 
                  ? `${config.color} border-current` 
                  : isDisabled 
                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                    : `${config.color} border-transparent ${config.hoverColor} cursor-pointer hover:border-current hover:scale-[1.02]`
                }
                ${isLoading && selectedTag === tag ? 'animate-pulse' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{config.label}</div>
                    <div className="text-xs opacity-75 mt-1">{config.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  )}
                  {isUserTag && (
                    <Badge className="text-xs bg-blue-600 text-white">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        
        {userTag && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Thanks for your endorsement!</strong> You endorsed this company as "{TAG_CONFIG[userTag].label}".
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}