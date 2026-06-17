import { drinksDatabase, type DrinkMetadata } from '../data/drinks';

export interface UserPreferences {
  flavors: string[]; // 'Chocolate', 'Coffee', 'Fruity', 'Tea', 'Creamy', 'Healthy'
  sweetness: string; // 'Very Sweet', 'Medium Sweet', 'Light Sweet', 'No Sugar'
  milk: boolean | null; // true, false
  mood: string; // 'Refreshing', 'Comfort', 'Energy Boost', 'Dessert Treat', 'Healthy Choice', 'Coffee Craving'
  ingredients: string[]; // 'Mango', 'Lychee', etc.
}

export interface RecommendationResult {
  drink: DrinkMetadata;
  matchPercentage: number;
  matchReasons: string[];
}

export type PersonalityType = 
  | 'Tropical Explorer'
  | 'Dessert Lover'
  | 'Coffee Addict'
  | 'Wellness Seeker'
  | 'Classic Tea Enthusiast'
  | 'Sweet Tooth'
  | 'Adventurous Sipper';

export interface PersonalityResult {
  type: PersonalityType;
  description: string;
}

export function determinePersonality(prefs: UserPreferences): PersonalityResult {
  if (prefs.mood === 'Healthy Choice' || prefs.flavors.includes('Healthy')) {
    return { type: 'Wellness Seeker', description: 'You treat your body like a temple. You love light, refreshing drinks packed with goodness.' };
  }
  if (prefs.flavors.includes('Coffee') || prefs.mood === 'Coffee Craving') {
    return { type: 'Coffee Addict', description: 'You run on caffeine and good vibes. Bold flavours are your love language.' };
  }
  if (prefs.flavors.includes('Chocolate') || prefs.mood === 'Dessert Treat') {
    return { type: 'Dessert Lover', description: 'Why choose between a drink and dessert when you can have both? Indulgence is key.' };
  }
  if (prefs.flavors.includes('Fruity') && prefs.milk === false) {
    return { type: 'Tropical Explorer', description: 'You love refreshing fruity drinks and exciting flavours that transport you to a beach.' };
  }
  if (prefs.sweetness === 'Very Sweet') {
    return { type: 'Sweet Tooth', description: 'You like your life and your drinks extra sweet! Sugar is your best friend.' };
  }
  if (prefs.flavors.includes('Tea') && prefs.milk === true) {
    return { type: 'Classic Tea Enthusiast', description: 'You appreciate the classics. A perfectly brewed milk tea is all you need.' };
  }
  return { type: 'Adventurous Sipper', description: 'You love trying new things and mixing flavours. Every drink is a new journey!' };
}

export function getRecommendations(prefs: UserPreferences): RecommendationResult[] {
  const scoredDrinks = drinksDatabase.map(drink => {
    let score = 0;
    let maxPossibleScore = 0;
    const reasons: string[] = [];

    // 1. Milk Preference (High Weight)
    maxPossibleScore += 20;
    if (prefs.milk !== null) {
      if (drink.milk === prefs.milk) {
        score += 20;
        reasons.push(`Perfect match for ${prefs.milk ? 'Milk-based' : 'Non-Milk'} preference`);
      } else {
        score -= 10; // Penalty for wrong milk type
      }
    }

    // 2. Sweetness (Medium Weight)
    maxPossibleScore += 15;
    let targetSweetness = 5;
    if (prefs.sweetness === 'Very Sweet') targetSweetness = 9;
    if (prefs.sweetness === 'Medium Sweet') targetSweetness = 6;
    if (prefs.sweetness === 'Light Sweet') targetSweetness = 3;
    if (prefs.sweetness === 'No Sugar') targetSweetness = 0;

    const sweetDiff = Math.abs(drink.sweetness - targetSweetness);
    if (sweetDiff <= 2) {
      score += 15;
      reasons.push(`Hits your ${prefs.sweetness} preference`);
    } else if (sweetDiff <= 4) {
      score += 5;
    }

    // 3. Flavors (High Weight)
    maxPossibleScore += 25;
    if (prefs.flavors.includes('Fruity') && drink.fruity) { score += 10; reasons.push('Fruity flavour profile'); }
    if (prefs.flavors.includes('Chocolate') && drink.chocolate) { score += 10; reasons.push('Rich chocolate notes'); }
    if (prefs.flavors.includes('Coffee') && drink.coffee) { score += 10; reasons.push('Coffee blend'); }
    if (prefs.flavors.includes('Creamy') && drink.creamy) { score += 5; reasons.push('Creamy texture'); }
    if (prefs.flavors.includes('Healthy') && drink.healthy) { score += 5; reasons.push('Healthy choice'); }
    
    // 4. Mood (Medium Weight)
    maxPossibleScore += 20;
    if (prefs.mood === 'Refreshing' && drink.refreshing) { score += 20; reasons.push('Refreshing for your mood'); }
    if (prefs.mood === 'Energy Boost' && drink.energyBoost) { score += 20; reasons.push('Gives you an energy boost'); }
    if (prefs.mood === 'Dessert Treat' && drink.dessert) { score += 20; reasons.push('Perfect dessert treat'); }
    if (prefs.mood === 'Coffee Craving' && drink.coffee) { score += 20; reasons.push('Satisfies your coffee craving'); }
    
    // 5. Ingredients
    if (prefs.ingredients.length > 0) {
      maxPossibleScore += 10;
      const nameLower = drink.name.toLowerCase();
      const hasIngredient = prefs.ingredients.some(ing => nameLower.includes(ing.toLowerCase()));
      if (hasIngredient) {
        score += 10;
        reasons.push('Contains your favourite ingredients');
      }
    }

    // Normalize match percentage
    let matchPercentage = Math.round((score / maxPossibleScore) * 100);
    // Add some random fuzziness so it's not always 100% or round numbers, feels more organic (like 96%, 98%)
    if (matchPercentage > 90) {
       matchPercentage = Math.min(99, matchPercentage - Math.floor(Math.random() * 4));
    }
    
    // Ensure it doesn't go below 40% for visual purposes
    matchPercentage = Math.max(40, matchPercentage);

    // Keep top 4 unique reasons
    const uniqueReasons = Array.from(new Set(reasons)).slice(0, 4);

    return {
      drink,
      matchPercentage,
      matchReasons: uniqueReasons
    };
  });

  // Sort by highest match percentage
  scoredDrinks.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Return top 3
  return scoredDrinks.slice(0, 3);
}
