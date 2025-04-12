declare module 'react-tinder-card' {
  import { ReactElement } from 'react';

  interface TinderCardProps {
    onSwipe?: (direction: string) => void;
    onCardLeftScreen?: (direction: string) => void;
    preventSwipe?: string[];
    swipeRequirementType?: string;
    swipeThreshold?: number;
    flickOnSwipe?: boolean;
    children?: ReactElement | ReactElement[];
    className?: string;
  }

  const TinderCard: React.FC<TinderCardProps>;
  export default TinderCard;
} 