// src/data/index.js — SymptoCare Centralized Data

export const CHAT_RESPONSES = [
  "Based on your symptoms, I recommend consulting a licensed doctor. Would you like to book a telemedicine consultation right now?",
  "Staying hydrated (8+ glasses/day), sleeping 7–8 hours, and eating a balanced diet are key pillars of good health.",
  "I provide general health guidance only — for specific medical advice, always consult a qualified healthcare professional.",
  "Persistent symptoms should always be evaluated by a doctor. I can help you book a telemedicine consultation instantly.",
  "Regular health check-ups are important. Check our Diagnostic Lab section to schedule your tests today.",
  "For emergencies, please call 108 immediately or visit the Emergency section in the app.",
  "Pain that is persistent or worsening should be evaluated by a doctor as soon as possible.",
  "Use our Health Tracker to log your daily metrics — water intake, steps, sleep, and vitals.",
  "Your medications can be delivered to your door. Check the Pharmacy section for personalized recommendations.",
  "Preventive care is the best care. Schedule a routine check-up with one of our 500+ verified doctors.",
];

export const PRODUCTS = [
  { id: 1,  name: 'Paracetamol 650mg',       brand: 'Crocin',       price: 65,   originalPrice: 80,   rating: 4.8, cat: 'medicine',  icon: '💊', desc: 'Fast relief from fever & mild pain',            inStock: true  },
  { id: 2,  name: 'Cetirizine 10mg',          brand: 'Zyrtec',       price: 120,  originalPrice: 145,  rating: 4.7, cat: 'medicine',  icon: '💊', desc: 'Antihistamine for 24-hour allergy relief',      inStock: true  },
  { id: 3,  name: 'Vitamin C 1000mg',         brand: 'Limcee',       price: 199,  originalPrice: 249,  rating: 4.9, cat: 'wellness',  icon: '🌿', desc: 'Immune support & powerful antioxidant',         inStock: true  },
  { id: 4,  name: 'Omega-3 Fish Oil',         brand: 'NutraLife',    price: 599,  originalPrice: 749,  rating: 4.8, cat: 'wellness',  icon: '🌿', desc: 'Heart & brain health support',                  inStock: true  },
  { id: 5,  name: 'Niacinamide 10% Serum',   brand: 'The Ordinary', price: 549,  originalPrice: 699,  rating: 4.9, cat: 'skincare',  icon: '🧴', desc: 'Reduces pores & brightens skin tone',           inStock: true  },
  { id: 6,  name: 'Vitamin C Serum 20%',     brand: 'Minimalist',   price: 799,  originalPrice: 999,  rating: 4.9, cat: 'skincare',  icon: '🧴', desc: 'Brightening & anti-aging serum',                inStock: true  },
  { id: 7,  name: 'SPF 50+ Sunscreen',        brand: 'Neutrogena',   price: 499,  originalPrice: 599,  rating: 4.9, cat: 'skincare',  icon: '🧴', desc: 'Broad spectrum UV protection',                  inStock: true  },
  { id: 8,  name: 'Colgate Sensitive',        brand: 'Colgate',      price: 189,  originalPrice: 220,  rating: 4.7, cat: 'dental',    icon: '🦷', desc: 'Sensitivity relief toothpaste',                 inStock: true  },
  { id: 9,  name: 'Electric Toothbrush Pro',  brand: 'Oral-B',       price: 2499, originalPrice: 3199, rating: 4.8, cat: 'dental',    icon: '🦷', desc: '360° plaque removal technology',                inStock: true  },
  { id: 10, name: 'Mouthwash Antiseptic',     brand: 'Listerine',    price: 239,  originalPrice: 280,  rating: 4.6, cat: 'dental',    icon: '🦷', desc: 'Kills 99.9% of oral bacteria',                 inStock: true  },
  { id: 11, name: 'Ashwagandha Extract',      brand: 'Himalaya',     price: 349,  originalPrice: 429,  rating: 4.7, cat: 'wellness',  icon: '🌿', desc: 'Stress relief & natural energy booster',        inStock: true  },
  { id: 12, name: 'Multivitamin Daily',       brand: 'Centrum',      price: 449,  originalPrice: 549,  rating: 4.8, cat: 'wellness',  icon: '🌿', desc: 'Complete daily nutrition support',              inStock: true  },
  { id: 13, name: 'Ibuprofen 400mg',          brand: 'Brufen',       price: 89,   originalPrice: 110,  rating: 4.6, cat: 'medicine',  icon: '💊', desc: 'Anti-inflammatory pain relief',                 inStock: true  },
  { id: 14, name: 'Hyaluronic Acid Serum',    brand: 'CeraVe',       price: 699,  originalPrice: 899,  rating: 4.8, cat: 'skincare',  icon: '🧴', desc: 'Deep hydration & plumping effect',              inStock: false },
  { id: 15, name: 'Probiotic Complex',        brand: 'Culturelle',   price: 899,  originalPrice: 1099, rating: 4.7, cat: 'wellness',  icon: '🌿', desc: 'Gut health & digestive support',                inStock: true  },
  { id: 16, name: 'Dental Floss Threaders',   brand: 'Oral-B',       price: 149,  originalPrice: 180,  rating: 4.5, cat: 'dental',    icon: '🦷', desc: 'Easy interdental cleaning',                     inStock: true  },
];

export const PHARM_MEDS = {
  'Fever/Temperature':      { id: 101, name: 'Paracetamol 650mg',          brand: 'Crocin Advance',        price: 65,  note: 'Take 1 tablet every 4–6 hours. Max 4 tablets/day. Consult doctor if fever persists over 3 days.'               },
  'Headache/Migraine':      { id: 102, name: 'Ibuprofen 400mg',            brand: 'Brufen',                price: 89,  note: 'Take after food. Avoid on empty stomach. Not recommended for asthma patients.'                                },
  'Cold/Cough':             { id: 103, name: 'Cetirizine 10mg + Ambroxol', brand: 'Alex Syrup',            price: 145, note: 'Antihistamine + expectorant. May cause drowsiness — take at night.'                                           },
  'Stomach/Acidity':        { id: 104, name: 'Omeprazole 20mg',            brand: 'Omez',                  price: 110, note: 'Take 30 minutes before meals. Effectively reduces stomach acid.'                                               },
  'Muscle Pain/Sprain':     { id: 105, name: 'Diclofenac Gel 1%',          brand: 'Voveran',               price: 129, note: 'Apply 3–4 times daily on affected area. For external use only.'                                               },
  'Allergy/Skin Rash':      { id: 106, name: 'Cetirizine 10mg',            brand: 'Zyrtec',                price: 120, note: '1 tablet daily. Best taken at night. Provides 24-hour relief.'                                               },
  'Diarrhoea/Loose Stools': { id: 107, name: 'ORS + Loperamide',           brand: 'Electral + Lopamide',   price: 95,  note: 'Rehydrate with ORS. Consult doctor if blood in stool.'                                                       },
  'Anxiety/Stress':         { id: 108, name: 'Ashwagandha 300mg',          brand: 'Himalaya StressCare',   price: 349, note: 'Adaptogen herb. Take with warm milk. Consult psychiatrist for severe anxiety.'                               },
  'Constipation':           { id: 109, name: 'Isabgol Husk',               brand: 'Metamucil',             price: 175, note: 'Mix 1 tsp in water and drink immediately. Take at bedtime.'                                                  },
  'Diabetes/Blood Sugar':   { id: 110, name: 'Metformin 500mg',            brand: 'Glycomet',              price: 85,  note: 'Prescription required. Take with meals to reduce GI side effects.'                                           },
  'Hypertension/BP':        { id: 111, name: 'Amlodipine 5mg',             brand: 'Amlong',                price: 99,  note: 'Prescription required. Take once daily. Monitor BP regularly.'                                               },
  'Vitamin Deficiency':     { id: 112, name: 'Multivitamin + Zinc',        brand: 'Centrum Silver',        price: 449, note: 'Take once daily after breakfast. Comprehensive micronutrient support.'                                       },
};

export const DENTAL_CONDITIONS = [
  { name: 'Cavity Detected',  severity: 'High',   urgency: 'See Dentist Soon',    specialist: 'General Dentist',    diag: 'One or more areas of tooth decay detected. Early intervention recommended.',                  prods: [{ n: 'Colgate Cavity Protection', p: 189, icon: '🦷' }, { n: 'Sensodyne Repair & Protect', p: 259, icon: '🦷' }, { n: 'Fluoride Mouthwash', p: 199, icon: '🧴' }] },
  { name: 'Plaque Buildup',   severity: 'Medium', urgency: 'Routine Care',         specialist: 'Dental Hygienist',   diag: 'Significant plaque accumulation on tooth surfaces. Professional cleaning recommended.',       prods: [{ n: 'Electric Toothbrush Pro', p: 2499, icon: '🦷' }, { n: 'Tartar Control Toothpaste', p: 210, icon: '🦷' }, { n: 'Interdental Floss Picks', p: 149, icon: '🧴' }] },
  { name: 'Gingivitis',       severity: 'Medium', urgency: 'See Dentist Soon',    specialist: 'Periodontist',       diag: 'Early-stage gum inflammation detected. Consistent oral hygiene can reverse this.',           prods: [{ n: 'Listerine Total Care', p: 299, icon: '🧴' }, { n: 'Parodontax Toothpaste', p: 239, icon: '🦷' }, { n: 'Gum Massager Tool', p: 399, icon: '🦷' }] },
  { name: 'Healthy Teeth',    severity: 'Low',    urgency: 'Routine Maintenance', specialist: 'General Dentist',    diag: 'No significant dental issues detected. Continue your current oral hygiene routine.',          prods: [{ n: 'Whitening Toothpaste', p: 199, icon: '🦷' }, { n: 'Dental Floss Threaders', p: 99, icon: '🦷' }, { n: 'Teeth Whitening Strips', p: 599, icon: '✨' }] },
];

export const SKIN_CONDITIONS = [
  { name: 'Acne Vulgaris',           severity: 'Medium', urgency: 'Dermatologist Visit', specialist: 'Dermatologist', diag: 'Inflammatory acne with multiple active lesions. Hormonal or bacterial factors may be involved.',    prods: [{ n: 'Niacinamide 10% Serum', p: 549, icon: '🧴' }, { n: 'Salicylic Acid Cleanser', p: 349, icon: '🧴' }, { n: 'Benzoyl Peroxide Cream', p: 299, icon: '🧴' }] },
  { name: 'Dry/Dehydrated Skin',     severity: 'Low',    urgency: 'Routine Care',        specialist: 'Dermatologist', diag: 'Skin shows dehydration and impaired moisture barrier. Increased hydration required.',                prods: [{ n: 'CeraVe Moisturising Cream', p: 899, icon: '🧴' }, { n: 'Hyaluronic Acid Serum', p: 699, icon: '🧴' }, { n: 'Hydrating Face Mist', p: 449, icon: '🧴' }] },
  { name: 'Hyperpigmentation',       severity: 'Low',    urgency: 'Routine Care',        specialist: 'Dermatologist', diag: 'Uneven skin tone and dark spots. Sun damage and post-inflammatory marks are likely causes.',        prods: [{ n: 'Vitamin C Serum 20%', p: 799, icon: '🧴' }, { n: 'SPF 50+ Sunscreen', p: 499, icon: '🧴' }, { n: 'Alpha Arbutin Serum', p: 649, icon: '🧴' }] },
  { name: 'Oily Skin / Large Pores', severity: 'Low',    urgency: 'Routine Care',        specialist: 'Dermatologist', diag: 'Excess sebum production and enlarged pores. Non-comedogenic products recommended.',                 prods: [{ n: 'Niacinamide 10% Serum', p: 549, icon: '🧴' }, { n: 'Oil-free Moisturiser SPF 30', p: 599, icon: '🧴' }, { n: 'Clay Detox Mask', p: 399, icon: '🧴' }] },
  { name: 'Eczema/Dermatitis',       severity: 'High',   urgency: 'Dermatologist Visit', specialist: 'Dermatologist', diag: 'Signs of eczema detected. Inflamed, itchy patches visible. Prescription treatment may be needed.', prods: [{ n: 'CeraVe Eczema Relief Cream', p: 1199, icon: '🧴' }, { n: 'Colloidal Oatmeal Bath', p: 349, icon: '🛁' }, { n: 'Fragrance-free Moisturiser', p: 699, icon: '🧴' }] },
];

export const VISION_DATA = {
  facialHealth: [
    { metric: 'Skin Hydration',     score: 72, status: 'Good'     },
    { metric: 'Pore Size',          score: 55, status: 'Average'  },
    { metric: 'Skin Tone Evenness', score: 80, status: 'Good'     },
    { metric: 'Fine Lines',         score: 65, status: 'Moderate' },
  ],
};

export const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', spec: 'General Physician', img: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah',   rating: 4.9, rate: 8  },
  { id: 2, name: 'Dr. Michael Chen',  spec: 'Cardiologist',      img: 'https://api.dicebear.com/7.x/personas/svg?seed=michael', rating: 4.8, rate: 13 },
  { id: 3, name: 'Dr. Emily Parker',  spec: 'Dermatologist',     img: 'https://api.dicebear.com/7.x/personas/svg?seed=emily',   rating: 4.7, rate: 10 },
  { id: 4, name: 'Dr. Robert Kumar',  spec: 'Neurologist',       img: 'https://api.dicebear.com/7.x/personas/svg?seed=robert',  rating: 4.6, rate: 15 },
  { id: 5, name: 'Dr. Priya Nair',    spec: 'Pediatrician',      img: 'https://api.dicebear.com/7.x/personas/svg?seed=priya',   rating: 4.9, rate: 9  },
];