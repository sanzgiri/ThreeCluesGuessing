import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/peopleHelpers';

export default function CategoryPreview() {
  return (
    <div className="text-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
        Categories
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="text-sm"
            data-testid={`badge-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
