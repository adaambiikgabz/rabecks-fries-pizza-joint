// Fallback content used until the client's Sanity Studio is connected.
// See getSiteSettings() / getMenuItems() in ./sanity.js — Sanity data overrides this when present.

export const staticSettings = {
  whatsapp: '233548960695',
  phoneDisplay: '0548 960 695',
  addressArea: 'Pantang West, Accra',
  addressDetail: '[exact street address — add here]',
  hoursLabel: 'Monday – Sunday',
  hoursValue: '12:00pm – 11:30pm',
  rating: '4.9',
};

export const waLink = (text) =>
  `https://wa.me/${staticSettings.whatsapp}?text=${encodeURIComponent(text)}`;

export const telLink = () => `tel:+${staticSettings.whatsapp}`;

export const staticMenu = [
  {
    category: 'Fries',
    items: [
      { name: 'Classic Salted Fries', price: 'GHS 20', description: "Crispy cut, salted hot. The one that started it all.", image: '/images/fries-classic.png' },
      { name: 'Loaded Cheese Fries', price: 'GHS 35', description: 'Buried in melted cheese sauce. Bring napkins.', image: '/images/fries-loaded-cheese.png' },
      { name: 'Spicy Pepper Fries', price: 'GHS 30', description: 'Tossed in our hot pepper sauce. Not for the faint-hearted.', image: '/images/fries-spicy.png' },
      { name: 'Chicken & Fries Combo', price: 'GHS 45', description: 'Fried chicken, full portion of fries. The whole meal.', image: '/images/chicken-fries-combo.png' },
    ],
  },
  {
    category: 'Pizza',
    items: [
      { name: 'Margherita (10")', price: 'GHS 60', description: 'Tomato, mozzarella, basil. Simple, done right.', image: '/images/pizza-margherita.png' },
      { name: 'Pepperoni Feast', price: 'GHS 85', description: 'Loaded with pepperoni, extra cheese. Our bestseller.', image: '/images/pizza-pepperoni-whole.png' },
      { name: 'BBQ Chicken', price: 'GHS 90', description: 'Smoky BBQ sauce, grilled chicken, red onion.', image: '/images/pizza-bbq-chicken.png' },
      { name: 'Veggie Supreme', price: 'GHS 75', description: 'Peppers, mushroom, olives, sweet corn.', image: '/images/pizza-margherita.png' },
    ],
  },
  {
    category: 'Sides',
    items: [
      { name: 'Chicken Wings (6pc)', price: 'GHS 40', description: 'Fried crisp, tossed in your choice of sauce.', image: '/images/wings-basket.png' },
      { name: 'Onion Rings', price: 'GHS 25', description: 'Battered, golden, crunchy through and through.', image: '/images/onion-rings.png' },
    ],
  },
  {
    category: 'Drinks',
    items: [
      { name: 'Coke / Fanta / Sprite', price: 'GHS 10', description: 'Chilled can. Pick your flavor.', image: '/images/drinks-lineup.png' },
      { name: 'Sobolo', price: 'GHS 15', description: 'House-made hibiscus drink, served cold.', image: null },
      { name: 'Bottled Water', price: 'GHS 5', description: 'Cold, still.', image: '/images/water-voltic.jpg' },
    ],
  },
];

export const homeTeaser = [
  { name: 'Loaded Cheese Fries', price: 'GHS 35 · sample price', image: '/images/fries-loaded-cheese.png' },
  { name: 'Pepperoni Feast', price: 'GHS 85 · sample price', image: '/images/pizza-pepperoni-pull.png' },
  { name: 'Chicken Wings (6pc)', price: 'GHS 40 · sample price', image: '/images/wings-basket.png' },
  { name: 'Bottled Water', price: 'GHS 5 · sample price', image: '/images/water-voltic.jpg' },
];
