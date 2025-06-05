import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({ rating = 0, totalStars = 5, size = 20, onRate, className }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "transition-colors",
              onRate ? 'cursor-pointer' : '',
              rating >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            )}
            onClick={() => onRate?.(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;