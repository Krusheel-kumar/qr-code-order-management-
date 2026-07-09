import { useState, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────────

export interface RecommendationCard {
  id: string;
  name: string;
  image?: string;
  price: number;
  tag: string;
  reason: string;
  emoji: string;
}

export interface MissionCardData {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  total: number;
  emoji: string;
  completed: boolean;
}

export interface RewardCardData {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  type: string;
  emoji: string;
  unlocked: boolean;
  expiresAt: string;
}

export interface FunFact {
  text: string;
  emoji: string;
  source: string;
}

export interface AIContextData {
  customer: {
    name: string;
    guest: boolean;
    loyaltyTier: string | null;
    greeting: string;
  };
  wallet: {
    points: number;
    pointsValue: number;
    nextTierPoints: number;
    tier: string;
    tierColor: string;
  };
  order: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    orderType: string;
  };
  recommendations: RecommendationCard[];
  trending: RecommendationCard[];
  missions: MissionCardData[];
  rewards: RewardCardData[];
  funFact: FunFact;
}

// ── Fallback mocked data (frontend) ───────────────────────────────────
// This runs if the backend /api/ai/context endpoint is unavailable.
// The user experience is identical — tracking always continues working.

const FALLBACK_DATA: AIContextData = {
  customer: {
    name: 'Friend',
    guest: true,
    loyaltyTier: null,
    greeting: 'Hey there! 👋',
  },
  wallet: {
    points: 0,
    pointsValue: 0,
    nextTierPoints: 100,
    tier: 'Guest',
    tierColor: '#AAAAAA',
  },
  order: {
    id: '',
    orderNumber: 'POB-1025',
    status: 'PREPARING',
    total: 0,
    orderType: 'DINE_IN',
  },
  recommendations: [
    { id: 'taro-milk-tea',     name: 'Taro Milk Tea',            price: 189, tag: 'Most Popular',  reason: 'Creamy, sweet, and perfectly purple!',                       emoji: '🍠' },
    { id: 'mango-popping',     name: 'Mango Popping Boba',       price: 199, tag: 'Summer Special', reason: 'Tropical mango with exploding fruit pearls!',                emoji: '🥭' },
    { id: 'matcha-latte',      name: 'Matcha Brown Sugar Latte', price: 219, tag: 'New Arrival',    reason: 'Earthy premium matcha with caramel brown sugar swirls.',     emoji: '🍵' },
    { id: 'honeydew-milk',     name: 'Honeydew Milk Tea',        price: 179, tag: 'Staff Pick',     reason: 'Light, refreshing melon milk tea.',                          emoji: '🍈' },
  ],
  trending: [
    { id: 'brown-sugar-boba',  name: 'Brown Sugar Tiger Milk',   price: 229, tag: '🔥 Trending #1', reason: 'Instagram-famous tiger stripes with rich brown sugar.',      emoji: '🐯' },
    { id: 'strawberry-jasmine',name: 'Strawberry Jasmine Tea',   price: 189, tag: '🔥 Trending #2', reason: 'Floral jasmine tea with fresh strawberry pearls.',           emoji: '🍓' },
    { id: 'coconut-jelly',     name: 'Coconut Jelly Milk Tea',   price: 209, tag: '🔥 Trending #3', reason: 'Tropical coconut with silky smooth milk tea.',               emoji: '🥥' },
  ],
  missions: [
    {
      id: 'mission-join', title: 'Join POP Club',
      description: 'Create a free account to unlock missions & rewards',
      reward: '🎁 Unlock All Rewards', progress: 0, total: 1, emoji: '🌟', completed: false,
    },
  ],
  rewards: [
    { id: 'reward-free-drink', title: 'Free Signature Drink',   description: 'Redeem any drink up to ₹220',               pointsRequired: 500, type: 'DRINK',    emoji: '🧋', unlocked: false, expiresAt: '2026-07-31' },
    { id: 'reward-birthday',   title: 'Birthday Special',       description: '50% off on your birthday month',             pointsRequired: 0,   type: 'DISCOUNT', emoji: '🎂', unlocked: false, expiresAt: '2026-07-31' },
    { id: 'reward-secret',     title: 'Secret Menu Access',     description: 'Unlock our hidden off-menu creations',       pointsRequired: 200, type: 'GIFT',     emoji: '🎁', unlocked: false, expiresAt: '2026-07-31' },
  ],
  funFact: {
    text: 'Bubble tea was invented in Taiwan in the 1980s. The "bubbles" originally referred to the frothy top from shaking — not the tapioca pearls!',
    emoji: '🧋',
    source: 'Bubble Tea History',
  },
};

// ── Hook ───────────────────────────────────────────────────────────────

interface UseAIContextParams {
  orderId?: string;
  customerName?: string;
  isGuest?: boolean;
}

export function useAIContext({ orderId, customerName, isGuest = true }: UseAIContextParams) {
  const [data, setData] = useState<AIContextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchContext = async () => {
      setLoading(true);
      try {
        const isLocalhost =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        const API_URL = isLocalhost
          ? `http://${window.location.hostname}:8080/api`
          : import.meta.env.VITE_API_URL || 'https://qr-code-order-management-production.up.railway.app/api';

        const params = new URLSearchParams();
        if (orderId)      params.set('orderId', orderId);
        if (customerName) params.set('customerName', customerName);
        params.set('guest', String(isGuest));

        const response = await fetch(`${API_URL}/ai/context?${params.toString()}`);

        if (!response.ok) throw new Error(`API returned ${response.status}`);

        const json: AIContextData = await response.json();
        if (!cancelled) setData(json);
      } catch (err) {
        // Silently fall back to frontend mock — tracking is unaffected
        console.warn('[POP Buddy] AI context unavailable, using fallback data.', err);
        if (!cancelled) {
          // Enrich fallback with actual params
          const fallback = { ...FALLBACK_DATA };
          fallback.customer = {
            ...fallback.customer,
            name: customerName || (isGuest ? 'there' : 'Friend'),
            guest: isGuest,
            greeting: isGuest ? 'Hey there! 👋' : `Hey ${customerName || 'Friend'}! 👋`,
          };
          if (orderId) {
            fallback.order = { ...fallback.order, id: orderId };
          }
          if (!isGuest) {
            fallback.wallet = { points: 420, pointsValue: 42, nextTierPoints: 500, tier: 'Bronze Boba', tierColor: '#CD7F32' };
            fallback.rewards = fallback.rewards.map(r => ({ ...r, unlocked: true }));
            fallback.missions = [
              { id: 'mission-3orders', title: 'Boba Adventurer', description: 'Order 3 different drinks this week', reward: '50 POP Points + Secret Drink', progress: 1, total: 3, emoji: '🧭', completed: false },
              { id: 'mission-weekend', title: 'Weekend Warrior', description: 'Visit us on a weekend', reward: 'Double Points on next order', progress: 0, total: 1, emoji: '🎉', completed: false },
            ];
          }
          setData(fallback);
          setError('fallback');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContext();
    return () => { cancelled = true; };
  }, [orderId, customerName, isGuest]);

  return { data, loading, error };
}
