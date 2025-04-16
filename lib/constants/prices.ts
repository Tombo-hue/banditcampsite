export interface ProductPrice {
  basePrice: number;
  extras: {
    [key: string]: number;
  };
}

export const PRODUCT_PRICES: { [key: string]: ProductPrice } = {
  'nafl-bumper': {
    basePrice: 250,
    extras: {
      primed: 20,
      painted: 50,
    }
  },
  'reinforced-differentials': {
    basePrice: 300,
    extras: {
      welded: 350,
      torsen: 700,
      reinforcementWithDiff: 225,
      reinforcementOnly: 200,
      polybushing: 100,
      newSeals: 40,
      rustTreatment: 100,
      propShaft: 15,
    }
  }
};

export const SHIPPING_RATE_PER_MILE = 0.75;
export const FREE_SHIPPING_THRESHOLD = 500; // Free shipping for orders over £500 