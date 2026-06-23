// frontend/src/lib/recommendationEngine.ts

export type FlavorCategory = 'Tea' | 'Fruit' | 'Chocolate' | 'Coffee';
export type SubFlavor = 
  | 'Strong & Authentic' | 'Sweet Yam (Taro)' | 'Earthy (Matcha)' // Tea
  | 'Blueberry' | 'Mango' | 'Melon (Honeydew)' // Fruit
  | 'Ferrero Rocher' | 'Nutella' | 'Choco Fantasy' // Chocolate
  | 'Mocha' | 'Hazelnut'; // Coffee
export type ToppingPreference = 'Tapioca (Chewy)' | 'Popping Bubbles' | 'Jellies' | 'Recommend for me';

export interface RecommendationResult {
  productId: string;
  reason: string;
}

export const getLocalRecommendation = (
  _category: FlavorCategory,
  subFlavor: SubFlavor,
  topping: ToppingPreference
): RecommendationResult => {
  let productId = 'p-authentic-milk-tea'; // Default fallback
  let reason = '';

  // 1. Map to exact product ID based on sub-flavor
  switch (subFlavor) {
    case 'Strong & Authentic':
      productId = 'p-authentic-milk-tea';
      reason = "Our Authentic Boba Tea features a strong Thai tea base. It's incredibly rich and pairs perfectly with chewy Tapioca Boba and our signature Cheese Foam!";
      break;
    case 'Sweet Yam (Taro)':
      productId = 'p-taro-milk-tea';
      reason = "Taro Boba Tea is a fan favorite! It has a delicious, earthy yam flavor that tastes amazing with Tapioca and Cheese Foam.";
      break;
    case 'Earthy (Matcha)':
      productId = 'p-matcha-green-tea';
      reason = "If you like a hint of authentic bitterness, our Matcha Boba Tea is perfect. We recommend it with Tapioca and a layer of rich Cheese Foam.";
      break;
    case 'Blueberry':
      productId = 'p-blueberry-milk-tea';
      reason = "Blueberry Milk Tea is bursting with fresh berry flavor! It's fantastic with Lychee or Blueberry popping bubbles, or classic Tapioca.";
      break;
    case 'Mango':
      productId = 'p-mango-milk-tea';
      reason = "Our Mango Milk Tea is a tropical delight! Try it with Strawberry popping bubbles or classic Tapioca for the ultimate treat.";
      break;
    case 'Melon (Honeydew)':
      productId = 'p-honeydew-milk-tea';
      reason = "Honeydew is one of our absolute best sellers! It has a refreshing muskmelon flavor. We highly recommend pairing it with Blueberry popping boba and Tapioca!";
      break;
    case 'Ferrero Rocher':
      productId = 'p-ferrero-rocher-boba-tea';
      reason = "Decadent and nutty! The Ferrero Rocher Boba Tea is a rich chocolate hazelnut dream. It goes beautifully with Tapioca and chocolate boba.";
      break;
    case 'Nutella':
      productId = 'p-nutella-boba-tea';
      reason = "Our Nutella Boba Tea is pure chocolate joy. Perfect for satisfying sweet cravings, especially with Tapioca and chocolate boba!";
      break;
    case 'Choco Fantasy':
      productId = 'p-choco-fantasy-boba-tea';
      reason = "Welcome to chocolate heaven! The Choco Fantasy is rich and intense. We recommend adding Tapioca and chocolate boba.";
      break;
    case 'Mocha':
      productId = 'p-mocha-milk-tea';
      reason = "The perfect mix of rich chocolate and bold coffee! Our Mocha Boba Tea gives you a great energy boost. Best enjoyed with Tapioca and chocolate bubbles.";
      break;
    case 'Hazelnut':
      productId = 'p-hazelnut-milk-tea';
      reason = "Smooth coffee paired with nutty hazelnut. A classic combination that tastes incredible with Tapioca and chocolate bubbles.";
      break;
    default:
      productId = 'p-authentic-milk-tea';
      reason = "Based on your choices, this is our perfect match for you!";
  }

  // 2. Personalize reason based on topping choice
  if (topping === 'Tapioca (Chewy)') {
    reason += " We'll make sure to load it up with our classic chewy Tapioca pearls!";
  } else if (topping === 'Popping Bubbles') {
    reason += " The popping bubbles will add a fantastic, juicy burst to every sip!";
  } else if (topping === 'Jellies') {
    reason += " We'll add our delicious textured jellies for that extra fun bite.";
  }

  return { productId, reason };
};

export const getLlmRecommendation = async (craving: string): Promise<RecommendationResult> => {
  const response = await fetch('http://127.0.0.1:8080/api/ai/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ craving })
  });

  if (!response.ok) {
    throw new Error('Failed to get recommendation from AI');
  }

  return response.json();
};
