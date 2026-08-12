/**
 * NSVAIR Diagnosis Store & Medical Marketplace Data Engine
 * Powered by NSVAIR GROUP OF INDUSTRY
 * Generates 500+ SEO-indexed clinical diagnostic products, medical devices, home lab test kits, and wellness supplies.
 */

export type ProductCategory =
  | 'ai-diagnostic-passes'
  | 'medical-imaging-devices'
  | 'home-lab-kits'
  | 'clinical-wellness-supplies'
  | 'nutraceuticals-supplements'

export interface Product {
  id: string
  slug: string
  name: string
  sku: string
  category: ProductCategory
  categoryLabel: string
  subCategory: string
  price: number
  originalPrice: number
  discountPercent: number
  rating: number
  reviewCount: number
  inStock: boolean
  stockCount: number
  badge?: 'Best Seller' | 'AI Powered' | 'Clinical Grade' | 'FDA Registered' | 'CE Certified' | 'New Release' | 'Popular'
  shortDescription: string
  fullDescription: string
  features: string[]
  specifications: Record<string, string>
  inTheBox: string[]
  iconType: string
  imageGradient: string
  brand: string
  parentCompany: string
  tags: string[]
}

export const CATEGORY_DEFINITIONS: Record<
  ProductCategory,
  { label: string; icon: string; description: string; gradient: string }
> = {
  'ai-diagnostic-passes': {
    label: 'AI Diagnostic Passes & Credits',
    icon: 'Sparkles',
    description: 'Instant multi-modal AI screening credits, radiology film analysis, and OCR lab report interpretation.',
    gradient: 'from-emerald-600 to-teal-700',
  },
  'medical-imaging-devices': {
    label: 'Medical Imaging & Clinical Devices',
    icon: 'Activity',
    description: 'Handheld ultrasound probes, smart dermatoscopes, digital otoscopes, and wireless 12-lead ECG monitors.',
    gradient: 'from-sky-600 to-indigo-700',
  },
  'home-lab-kits': {
    label: 'Home Blood & Lab Test Kits',
    icon: 'TestTube',
    description: 'Self-collection blood spot kits, lipid panels, HbA1c, thyroid profiles, and food allergy 120-marker panels.',
    gradient: 'from-amber-600 to-rose-700',
  },
  'clinical-wellness-supplies': {
    label: 'Clinical Wellness & Supplies',
    icon: 'ShieldCheck',
    description: 'N95 respirators, infrared clinical thermometers, posture correctors, trauma kits, and sterile supplies.',
    gradient: 'from-teal-600 to-cyan-700',
  },
  'nutraceuticals-supplements': {
    label: 'Clinical Grade Nutraceuticals',
    icon: 'Heart',
    description: 'Bio-enhanced Omega-3, CoQ10 200mg, circadian sleep rest, and chelated daily micronutrient complexes.',
    gradient: 'from-emerald-700 to-green-800',
  },
}

// -------------------------------------------------------------
// Scalable Catalog Templates for Generating 500+ Verified Products
// -------------------------------------------------------------

interface CategoryTemplate {
  category: ProductCategory
  categoryLabel: string
  subCategories: string[]
  items: Array<{
    baseName: string
    baseSlug: string
    shortDesc: string
    fullDesc: string
    basePrice: number
    origPrice: number
    features: string[]
    specifications: Record<string, string>
    inTheBox: string[]
    iconType: string
    gradient: string
    badge: Product['badge']
    tags: string[]
  }>
}

const TEMPLATES: CategoryTemplate[] = [
  {
    category: 'ai-diagnostic-passes',
    categoryLabel: 'AI Diagnostic Passes & Credits',
    subCategories: ['Radiology AI Credits', 'Lab Report OCR Passes', 'Full Body Screenings', 'Dermatology AI Packs', 'Cardiology rPPG Access'],
    items: [
      {
        baseName: 'NSVAIR Full Body Multi-Modal AI Screening Pass',
        baseSlug: 'nsvair-full-body-multimodal-ai-screening-pass',
        shortDesc: 'Comprehensive 18-module agentic AI health screening pass with instant official PDF medical diagnostic report.',
        fullDesc: 'The NSVAIR Full Body Multi-Modal AI Screening Pass unlocks full access to all 18 clinical diagnostic modules, including chest X-Ray analysis, blood biomarker OCR, camera-based rPPG heart rate monitoring, skin dermatology scanning, and Ishihara vision acuity. Synthesizes a unified health literacy report powered by NSVAIR GROUP OF INDUSTRY AI architecture.',
        basePrice: 19.99,
        origPrice: 49.99,
        features: ['Access to all 18 AI Diagnostic Modules', 'High-Resolution Clinical PDF Export', 'Instant WhatsApp & Gmail Report Dispatch', 'Doctor Discussion Guide Included', 'Valid for 12 months with cloud history'],
        specifications: { 'Format': 'Digital Instant Activation', 'Platform': 'Web, iOS, Android, Desktop', 'Report Format': 'A4 Medical PDF & JSON', 'Accuracy Rate': '98.4% Benchmark Validation', 'Issuer': 'NSVAIR GROUP OF INDUSTRY' },
        inTheBox: ['1x Digital License Key', 'Direct Portal Access Link', 'Clinical User Guide (PDF)', '24/7 AI Health Support'],
        iconType: 'Sparkles',
        gradient: 'from-emerald-500 to-teal-700',
        badge: 'Best Seller',
        tags: ['full-body', 'ai-pass', 'screening', 'pdf-report', 'health-check'],
      },
      {
        baseName: 'NSVAIR Chest X-Ray & Radiology AI Interpretation Credit',
        baseSlug: 'nsvair-chest-xray-radiology-ai-interpretation-credit',
        shortDesc: 'Multi-film medical imaging analysis credit for Chest X-Rays, Bone Orthopedics, Ultrasound, and MRI films.',
        fullDesc: 'Upload raw DICOM exports, film scans, or camera photos of X-Ray, MRI, or ultrasound films to receive an instant deep-learning radiological density inspection, parenchymal opacity assessment, and specialist referral recommendation.',
        basePrice: 14.99,
        origPrice: 29.99,
        features: ['Supports Chest X-Ray, Bone Orthopedics & MRI', 'Invert Negative Film Inspection Viewport', 'Radiological Density & ROI Grid Analysis', 'Specialist Referral Guidance', 'Printable Radiology Certificate'],
        specifications: { 'Supported Modalities': 'X-Ray, Ultrasound, MRI, CT, OPG', 'File Formats': 'DICOM, PNG, JPG, PDF', 'Processing Time': '< 3.5 seconds', 'Security': 'HIPAA-compliant encrypted transit' },
        inTheBox: ['Digital Interpretation Credits', 'Radiologist Film Inspection Tool', 'Doctor Review Guide'],
        iconType: 'Activity',
        gradient: 'from-blue-600 to-cyan-700',
        badge: 'AI Powered',
        tags: ['radiology', 'x-ray', 'mri', 'ultrasound', 'medical-imaging'],
      },
      {
        baseName: 'NSVAIR Medical Lab Report OCR & Biomarker Analyzer Pass',
        baseSlug: 'nsvair-medical-lab-report-ocr-biomarker-analyzer-pass',
        shortDesc: 'Automated OCR extraction of 50+ blood, lipid, metabolic, and liver/kidney biomarkers with reference range tracking.',
        fullDesc: 'Transforms paper or PDF lab test sheets into an interactive digital biomarker matrix. Automatically flags normal, elevated, low, and critical biomarker values with plain-English medical explanations and targeted physician discussion questions.',
        basePrice: 12.99,
        origPrice: 24.99,
        features: ['Instant OCR Table Extraction for CBC, LFT, KFT, Lipids', 'Reference Interval High/Low Flagging', 'Doctor Question Generator', 'Personalized Nutrition & Lifestyle Advice', 'Formatted WhatsApp/Gmail Sharing'],
        specifications: { 'Supported Panels': 'CBC, Lipid, Metabolic, KFT, LFT, Thyroid', 'OCR Engine': 'NSVAIR Neural OCR v4.2', 'Languages': 'English, Multi-lingual', 'Export': 'PDF, CSV, JSON' },
        inTheBox: ['1x Digital OCR Access License', 'Biomarker Reference Handbook', 'Doctor Consultation Sheet'],
        iconType: 'FileText',
        gradient: 'from-amber-500 to-orange-700',
        badge: 'Clinical Grade',
        tags: ['lab-report', 'ocr', 'blood-test', 'biomarkers', 'cbc-panel'],
      },
      {
        baseName: 'NSVAIR Dermatology & Skin Lesion AI Screening Pack',
        baseSlug: 'nsvair-dermatology-skin-lesion-ai-screening-pack',
        shortDesc: 'Multi-scan dermatology pass evaluating ABCDE mole symmetry, acne severity, and epidermal barrier health.',
        fullDesc: 'Allows users to run advanced dermatological computer vision screenings on moles, skin spots, rashes, eczema, and scalp conditions with asymmetrical border tracking, color variegation analysis, and diameter estimation.',
        basePrice: 9.99,
        origPrice: 19.99,
        features: ['ABCDE Mole Asymmetry Assessment', 'Acne & Rash Severity Grading', 'Hydration & Barrier Score', 'Dermatologist Follow-Up Guide', 'Before/After Progression Tracker'],
        specifications: { 'Detection Resolution': 'Micro-pixel Edge Classification', 'Camera Requirement': 'Standard Smartphone HD', 'Analysis Time': '< 2.0 seconds' },
        inTheBox: ['Dermatology AI Screening License', 'Skin Tracking Diary (Digital)', 'Dermatologist Prep Guide'],
        iconType: 'Eye',
        gradient: 'from-rose-500 to-pink-700',
        badge: 'Popular',
        tags: ['skin', 'dermatology', 'mole-checker', 'abcde', 'acne'],
      },
      {
        baseName: 'NSVAIR Camera rPPG Vital Signs & Heart Rate Pass',
        baseSlug: 'nsvair-camera-rppg-vital-signs-heart-rate-pass',
        shortDesc: 'Contactless photoplethysmography heart rate, HRV, and respiratory frequency measurement via smartphone camera.',
        fullDesc: 'Utilizes sub-dermal capillary color pulsation algorithms (rPPG) through facial video to compute real-time resting heart rate, pulse rate variability (HRV), and respiration frequency without wearable hardware.',
        basePrice: 8.99,
        origPrice: 18.99,
        features: ['Contactless Face Camera rPPG Pulse Measurement', 'Heart Rate Variability (HRV) Analysis', 'Respiratory Rate Detection', 'Trend Graphing & Historical Logs', '1-Click Medical PDF Export'],
        specifications: { 'Technology': 'Remote Photoplethysmography (rPPG)', 'Sensor': 'Front/Rear Smartphone Camera', 'Sampling Rate': '30 fps optical analysis' },
        inTheBox: ['Vital Signs Digital License', 'rPPG Calibration Guide', 'Cardio Wellness Tracker'],
        iconType: 'HeartPulse',
        gradient: 'from-red-500 to-rose-700',
        badge: 'New Release',
        tags: ['vitals', 'rppg', 'heart-rate', 'hrv', 'pulse'],
      },
    ],
  },
  {
    category: 'medical-imaging-devices',
    categoryLabel: 'Medical Imaging & Clinical Devices',
    subCategories: ['Handheld Ultrasounds', 'Smart Dermatoscopes', 'Digital Otoscopes', 'Wireless ECG Monitors', 'Pulse Oximeters & BP'],
    items: [
      {
        baseName: 'NSVAIR Wireless Handheld Ultrasound Probe Pro',
        baseSlug: 'nsvair-wireless-handheld-ultrasound-probe-pro',
        shortDesc: 'Clinical-grade dual-head phased & linear wireless ultrasound probe compatible with iOS, Android, and Windows.',
        fullDesc: 'The NSVAIR Wireless Handheld Ultrasound Probe Pro provides real-time B-mode, M-mode, Color Doppler, and Power Doppler imaging directly to your tablet or smartphone. Ideal for point-of-care abdominal, cardiac, vascular, and musculoskeletal examinations with built-in AI edge enhancement.',
        basePrice: 1299.0,
        origPrice: 1899.0,
        features: ['Dual Head: Phased Array & Linear Transducer', 'Color Doppler, B-Mode, M-Mode & PDI', 'Wireless Wi-Fi 5G & USB-C Direct Connect', 'IPX7 Waterproof & Disinfectable Body', 'Integrated NSVAIR AI Diagnostic Assistant'],
        specifications: { 'Frequency Range': '3.2 MHz – 10.0 MHz', 'Max Scan Depth': '20mm – 305mm', 'Battery Life': '4.5 Hours Continuous Scan', 'Weight': '210g Ultra-lightweight', 'Certifications': 'CE 0123, FDA Registered, ISO 13485' },
        inTheBox: ['1x NSVAIR Wireless Ultrasound Probe', '1x Wireless Inductive Charging Dock', '1x USB-C Data/Charge Cable', '1x Hard-shell Aluminum Carrying Case', '1x 250ml Sterile Ultrasound Gel', '1-Year Full Clinical Warranty'],
        iconType: 'Activity',
        gradient: 'from-sky-600 to-blue-800',
        badge: 'Clinical Grade',
        tags: ['ultrasound', 'handheld-probe', 'point-of-care', 'imaging', 'doppler'],
      },
      {
        baseName: 'NSVAIR Smart Dermatoscope Lens for Smartphone with Polarized LED',
        baseSlug: 'nsvair-smart-dermatoscope-lens-smartphone-polarized-led',
        shortDesc: 'Universal optical clip-on dermatoscope with cross-polarized LED illumination and 10x optical magnification.',
        fullDesc: 'Engineered for clinicians, dermatologists, and preventative home health. High-precision 10x achromatic optical lens with 8 cross-polarized LEDs eliminates skin surface glare to reveal deep epidermal pigment structures, vascular patterns, and hair follicle health.',
        basePrice: 149.0,
        origPrice: 229.0,
        features: ['Cross-Polarized & Non-Polarized Dual Lighting', '10x Distortion-Free Achromatic Optical Lens', 'Universal Precision Phone Clamp (All Smartphones)', 'Rechargeable Lithium Battery (3 Hours Run Time)', 'Seamless NSVAIR AI Skin Scanner App Integration'],
        specifications: { 'Optical Diameter': '28mm Wide Field of View', 'LED Count': '8 Polarized + 4 Natural Light LEDs', 'Battery': '500mAh Li-ion Type-C Fast Charge', 'Lens Coating': 'Multi-layer Anti-reflective Glass' },
        inTheBox: ['1x NSVAIR Smart Dermatoscope Optical Head', '1x Universal Precision Smartphone Clamp', '1x Protective Magnetic Lens Cover', '1x Type-C Charging Cable', '1x Microfiber Optical Cleaning Cloth', '1x Travel Pouch'],
        iconType: 'Eye',
        gradient: 'from-indigo-600 to-purple-800',
        badge: 'Best Seller',
        tags: ['dermatoscope', 'skin-lens', 'dermatology', 'polarized-led', 'mole-scope'],
      },
      {
        baseName: 'NSVAIR Smart Digital Otoscope with 4K HD Camera & Speculum Set',
        baseSlug: 'nsvair-smart-digital-otoscope-4k-camera-speculum-set',
        shortDesc: 'Ultra-thin 3.5mm ear inspection otoscope with 6-axis gyroscope and 4K ultra-clarity video feed.',
        fullDesc: 'Safe, high-definition ear canal, throat, and nasal examination device. Features a micro 3.5mm camera tip, 6 shadowless cold LEDs, anti-fog lens coating, and temperature regulation for comfortable clinical screening.',
        basePrice: 69.0,
        origPrice: 119.0,
        features: ['3.5mm Micro Probe for Child & Adult Comfort', '4K High-Definition Optical Sensor', '6-Axis Intelligent Orientation Gyroscope', 'Constant Non-Heating Temperature Control', 'Direct Wi-Fi Streaming to Smartphone'],
        specifications: { 'Focal Length': '1.5cm – 2.0cm Ideal Focus', 'Waterproof Rating': 'IP67 Lens Washable', 'Operating System': 'iOS, Android Compatible', 'Battery': '350mAh (90 Minutes Continuous)' },
        inTheBox: ['1x NSVAIR Smart Digital Otoscope', '6x Medical-Grade Soft Silicone Ear Spoons', '4x Protective Ear Specula', '1x Type-C Fast Charging Cable', '1x User Manual & Sanitizing Wipes'],
        iconType: 'Ear',
        gradient: 'from-cyan-600 to-teal-800',
        badge: 'FDA Registered',
        tags: ['otoscope', 'ear-camera', 'digital-scope', '4k-video', 'throat-check'],
      },
      {
        baseName: 'NSVAIR 12-Lead Wireless Tele-ECG Monitor with AI Arrhythmia Detection',
        baseSlug: 'nsvair-12-lead-wireless-tele-ecg-monitor-ai-arrhythmia',
        shortDesc: 'Pocket-sized clinical 12-lead electrocardiograph with real-time AI rhythm classification and PDF report generator.',
        fullDesc: 'Enables hospital-quality 12-lead ECG monitoring at home or in ambulatory care. Built-in AI arrhythmia classification detects Atrial Fibrillation (AFib), Bradycardia, Tachycardia, and ST-segment elevations with instant doctor dispatch via WhatsApp and Gmail.',
        basePrice: 349.0,
        origPrice: 499.0,
        features: ['Full 12-Lead Simultaneous Clinical ECG Recording', 'AI Arrhythmia & AFib Instant Classification', 'Lead-off Automatic Detection & Filtering', 'Standard Medical 25mm/s & 10mm/mV Grid PDF Export', 'Bluetooth 5.2 Low Energy Telemetry'],
        specifications: { 'Frequency Response': '0.05 Hz – 150 Hz', 'Input Impedance': '> 50 MΩ', 'Sampling Rate': '1000 Hz / Lead', 'Dimensions': '98mm x 62mm x 14mm', 'Weight': '85g' },
        inTheBox: ['1x NSVAIR 12-Lead ECG Device', '1x 10-Lead Snap Cable Harness', '50x Disposable Ag/AgCl ECG Electrodes', '1x USB-C Charging Cable', '1x Protective Hard Case', '1x Clinical Calibration Certificate'],
        iconType: 'HeartPulse',
        gradient: 'from-red-600 to-rose-800',
        badge: 'CE Certified',
        tags: ['ecg', '12-lead-ecg', 'cardiology', 'arrhythmia', 'afib'],
      },
      {
        baseName: 'NSVAIR Smart Digital Stethoscope with AI Heart & Lung Sound Filter',
        baseSlug: 'nsvair-smart-digital-stethoscope-ai-heart-lung-filter',
        shortDesc: 'Electronic acoustic stethoscope with 40x sound amplification, ambient noise cancellation, and phonocardiogram.',
        fullDesc: 'Amplifies cardiac murmurs, pulmonary wheezing, crackles, and vascular bruits up to 40 times with active ambient noise cancellation. Visualizes phonocardiogram (PCG) waveforms and transmits sound recordings directly into NSVAIR AI Voice & Respiratory Analyzer.',
        basePrice: 199.0,
        origPrice: 289.0,
        features: ['40x Acoustic Amplification with 7 Volume Levels', 'Dual Mode: Cardiac (Bell) & Pulmonary (Diaphragm) Filters', 'Active Ambient Noise Cancellation (ANC)', 'Real-time Phonocardiogram Visualizer', 'Bluetooth Audio Streaming to Headphones/App'],
        specifications: { 'Frequency Bell Mode': '20 Hz – 200 Hz', 'Frequency Diaphragm Mode': '100 Hz – 500 Hz', 'Battery': 'Rechargeable Li-ion (8 Hours Continuous)', 'Chestpiece': 'Surgical Grade Stainless Steel' },
        inTheBox: ['1x NSVAIR Smart Digital Stethoscope', '1x Wireless Over-Ear Clinical Headphones', '1x Silicone Eartip Replacement Set (S/M/L)', '1x Charging Cable', '1x Storage Case'],
        iconType: 'Stethoscope',
        gradient: 'from-emerald-600 to-teal-900',
        badge: 'Clinical Grade',
        tags: ['stethoscope', 'digital-stethoscope', 'lung-sound', 'heart-murmur', 'auscultation'],
      },
    ],
  },
  {
    category: 'home-lab-kits',
    categoryLabel: 'Home Blood & Lab Test Kits',
    subCategories: ['Blood & Lipid Panels', 'Hormone & Thyroid Kits', 'Micronutrient & Vitamin Panels', 'Organ Function Tests', 'Allergy & Sensitivity'],
    items: [
      {
        baseName: 'NSVAIR Complete Blood Count (CBC) & Anemia Self-Collect Kit',
        baseSlug: 'nsvair-complete-blood-count-cbc-anemia-self-collect-kit',
        shortDesc: 'CLIA-certified dry blood spot panel measuring Hemoglobin, RBC, WBC, Platelets, Hematocrit, and Ferritin.',
        fullDesc: 'Pain-free fingertip micro-sample collection kit. Shipped directly to your door with prepaid return packaging to accredited CLIA/CAP laboratories. Generates full 18-marker CBC analysis with instant integration into NSVAIR Lab Report Analyzer.',
        basePrice: 59.0,
        origPrice: 89.0,
        features: ['18 Essential Blood & Hematology Markers', 'Painless Micro-Lancet Collection (< 5 drops blood)', 'Prepaid Overnight Laboratory Return Mailer', 'Digital Results within 48 Hours', '1-Click NSVAIR Lab Report AI Interpretation'],
        specifications: { 'Sample Type': 'Capillary Blood Spot', 'Lab Accreditation': 'CLIA & CAP Certified', 'Markers': 'Hb, RBC, WBC, Platelets, MCV, MCH, Ferritin', 'Turnaround': '24-48 Hours Post Lab Receipt' },
        inTheBox: ['2x Sterile Safety Micro-Lancets', '1x Blood Collection Micro-Card', '2x Alcohol Prep Pads', '1x Sterile Gauze & Bandage', '1x Biohazard Specimen Bag', '1x Prepaid Return Courier Box'],
        iconType: 'TestTube',
        gradient: 'from-red-500 to-amber-700',
        badge: 'Best Seller',
        tags: ['cbc-kit', 'blood-test', 'anemia', 'hemoglobin', 'lab-test'],
      },
      {
        baseName: 'NSVAIR Comprehensive Lipid Profile & Fasting Glucose HbA1c Panel',
        baseSlug: 'nsvair-comprehensive-lipid-profile-fasting-glucose-hba1c',
        shortDesc: 'Cardiovascular risk kit assessing Total Cholesterol, HDL, LDL, Triglycerides, and 90-day average HbA1c.',
        fullDesc: 'Evaluates full lipid sub-fractions and 3-month glycemic control. Includes total cholesterol, HDL good cholesterol, LDL bad cholesterol, VLDL, triglycerides, and HbA1c with cardiovascular risk index calculation.',
        basePrice: 69.0,
        origPrice: 99.0,
        features: ['Complete Lipid Fractionation + HbA1c Blood Sugar', 'Cardiovascular Risk Stratification Score', 'Simple At-Home Fingertip Collection', 'Doctor-Reviewed Certified Lab PDF', 'Actionable Dietary & Lifestyle Action Plan'],
        specifications: { 'Markers Tested': 'Total Chol, HDL, LDL, Triglycerides, HbA1c, Glucose', 'Accuracy': 'Clinical Spectrophotometry Gold Standard', 'Fasting Required': '10-12 Hours Recommended' },
        inTheBox: ['2x Single-Use Pressure Lancets', '1x Blood Microtainer Tube', '1x Desiccant Specimen Pouch', '1x Prepaid Return Mailer', 'Step-by-Step Collection Manual'],
        iconType: 'Activity',
        gradient: 'from-amber-600 to-rose-700',
        badge: 'Clinical Grade',
        tags: ['lipid-panel', 'cholesterol', 'hba1c', 'diabetes', 'cardio-health'],
      },
      {
        baseName: 'NSVAIR Complete Thyroid Health Panel (TSH, Free T3, Free T4, TPO Antibodies)',
        baseSlug: 'nsvair-complete-thyroid-health-panel-tsh-ft3-ft4-tpo',
        shortDesc: 'Full 4-marker thyroid function and autoimmune Hashimoto panel with clinical endocrine interpretation.',
        fullDesc: 'Diagnoses hypo- and hyper-thyroidism, sluggish metabolism, and autoimmune thyroiditis. Measures Thyroid Stimulating Hormone (TSH), Free Triiodothyronine (FT3), Free Thyroxine (FT4), and Thyroid Peroxidase Antibodies (TPOAb).',
        basePrice: 79.0,
        origPrice: 129.0,
        features: ['4 Comprehensive Thyroid Hormones & Antibodies', 'Identifies Subclinical Hypothyroidism & Hashimoto', 'High-Sensitivity Immunoassay Lab Testing', 'Endocrinology Insights & Doctor Questions', 'Automatic Sync with NSVAIR Health Profile'],
        specifications: { 'Markers': 'TSH, FT3, FT4, TPOAb', 'Methodology': 'Chemiluminescent Immunoassay (CLIA)', 'Sample': 'Dry Blood Spot' },
        inTheBox: ['Complete Fingerprick Collection Kit', 'Sterile Desiccated Collection Card', 'Prepaid Return Packaging', 'Collection Instruction Guide'],
        iconType: 'ShieldCheck',
        gradient: 'from-purple-600 to-indigo-800',
        badge: 'Popular',
        tags: ['thyroid', 'tsh', 'free-t3', 'free-t4', 'hashimotos'],
      },
      {
        baseName: 'NSVAIR Vitamin D3, B12, Iron & Micronutrient Deficiency Panel',
        baseSlug: 'nsvair-vitamin-d3-b12-iron-micronutrient-deficiency-panel',
        shortDesc: 'Measures 25-OH Vitamin D, Active B12 Cobalamin, Serum Iron, Ferritin, and Zinc levels.',
        fullDesc: 'Pinpoints fatigue, immunity gaps, and metabolic sluggishness. Measures active bioavailable Vitamin D3, Vitamin B12, serum Ferritin iron stores, Magnesium, and Zinc to provide personalized dosage recommendations.',
        basePrice: 89.0,
        origPrice: 139.0,
        features: ['5 Essential Micronutrients & Energy Biomarkers', 'Eliminates Guesswork from Supplement Dosing', 'Quick 5-Minute At-Home Sample Collection', 'Personalized Dosage & Nutrition Algorithm', 'Full PDF Lab Certificate Included'],
        specifications: { 'Markers': '25-OH Vit D3, Vit B12, Ferritin, Zinc, Magnesium', 'Lab Standard': 'LC-MS/MS & Immunoassay' },
        inTheBox: ['1x Micronutrient Collection Kit', 'Lancets & Collection Strip', 'Prepaid Mailer', 'Nutritional Action Guide'],
        iconType: 'Sparkles',
        gradient: 'from-teal-500 to-emerald-700',
        badge: 'Best Seller',
        tags: ['vitamin-d', 'vitamin-b12', 'iron', 'micronutrients', 'deficiency'],
      },
      {
        baseName: 'NSVAIR Food Allergy & Intolerance 120-Marker IgG Immuno-Panel',
        baseSlug: 'nsvair-food-allergy-intolerance-120-marker-igg-panel',
        shortDesc: 'Comprehensive IgG antibody test screening 120 foods across dairy, gluten, nuts, seafood, meats, and spices.',
        fullDesc: 'Uncovers hidden dietary triggers behind gut bloating, skin inflammation, fatigue, and brain fog. Screens specific IgG reactivities against 120 common foods and provides a customized 4-phase elimination and reintroduction protocol.',
        basePrice: 149.0,
        origPrice: 229.0,
        features: ['120 Food Antigens Tested (Dairy, Gluten, Meat, Seafood, Spices)', 'Severity Color-Coded Reactivity Scale (0 to 100)', '4-Phase Elimination & Gut Healing Guide', 'Dietary Substitution Matrix', 'Direct Integration with NSVAIR Nutrition Module'],
        specifications: { 'Methodology': 'Microarray ELISA Quantitative Assay', 'Sample': 'Capillary Blood Spot', 'Turnaround': '3-5 Business Days' },
        inTheBox: ['1x Food Intolerance Blood Collection Kit', 'Sterile Lancets & Collection Card', 'Prepaid Return Packaging', '120-Food Pocket Guide'],
        iconType: 'FileText',
        gradient: 'from-orange-500 to-red-700',
        badge: 'FDA Registered',
        tags: ['food-allergy', 'food-intolerance', 'igg-panel', 'gut-health', 'gluten-dairy'],
      },
    ],
  },
  {
    category: 'clinical-wellness-supplies',
    categoryLabel: 'Clinical Wellness & Supplies',
    subCategories: ['Medical Diagnostics & Sensors', 'Protective Medical Gear', 'Orthopedic & Ergonomics', 'First Aid & Trauma Supplies'],
    items: [
      {
        baseName: 'NSVAIR Non-Contact Clinical Infrared Forehead Thermometer Pro',
        baseSlug: 'nsvair-non-contact-clinical-infrared-thermometer-pro',
        shortDesc: 'Medical-grade 0.5-second infrared body thermometer with fever alert backlight and 32 memory recalls.',
        fullDesc: 'Features dual medical optical sensors for ultra-accurate non-contact temperature measurement within 0.5 seconds at a distance of 1 to 5 cm. Equipped with 3-color backlight fever indicators (Green/Yellow/Red) and silent night mode.',
        basePrice: 29.99,
        origPrice: 49.99,
        features: ['0.5s Fast & Accurate Non-Contact Reading (±0.2°C)', '3-Color Fever Alarm Backlight (Normal, Low Fever, High Fever)', 'Dual Mode: Body & Object/Room Temperature', '32 Past Measurement Memory Recall', 'Auto-Shutdown & Battery Saver'],
        specifications: { 'Accuracy': '±0.2°C (35.0°C – 42.0°C)', 'Measuring Distance': '1cm – 5cm', 'Battery': '2x AAA Batteries (Included)', 'Certifications': 'FDA 510(k), CE, ISO 13485' },
        inTheBox: ['1x NSVAIR Infrared Thermometer', '2x AAA Alkaline Batteries', '1x Velvet Storage Pouch', '1x User Manual & Calibration Certificate'],
        iconType: 'Activity',
        gradient: 'from-teal-600 to-cyan-800',
        badge: 'Best Seller',
        tags: ['thermometer', 'infrared', 'fever-detector', 'temperature', 'medical-device'],
      },
      {
        baseName: 'NSVAIR Fingertip Pulse Oximeter Pro with Plethysmograph Waveform',
        baseSlug: 'nsvair-fingertip-pulse-oximeter-pro-plethysmograph',
        shortDesc: 'Measures SpO2 blood oxygen saturation, pulse rate, perfusion index (PI%), and respiratory rate.',
        fullDesc: 'OLED multi-directional display showcasing arterial blood oxygen saturation (SpO2), pulse rate, Perfusion Index (PI%), and real-time plethysmographic pulse waveform with customizable audio alarms.',
        basePrice: 24.99,
        origPrice: 39.99,
        features: ['Accurate SpO2 (70% – 100%) & Pulse Rate (25 – 250 BPM)', 'Continuous Plethysmograph & Perfusion Index (PI)', 'Four-Direction Dual-Color OLED Display', 'Audible & Visual Hypoxia Alarm Thresholds', 'Soft Silicone Chamber Fits Adults & Children'],
        specifications: { 'SpO2 Accuracy': '±2% (80% – 100%)', 'Display': '0.96-inch OLED Multi-directional', 'Battery': '2x AAA (Up to 30 Hours Continuous)' },
        inTheBox: ['1x NSVAIR Pulse Oximeter', '1x Lanyard Strap', '2x AAA Batteries', '1x Protective Silicone Case', '1x User Manual'],
        iconType: 'HeartPulse',
        gradient: 'from-sky-600 to-indigo-800',
        badge: 'Clinical Grade',
        tags: ['pulse-oximeter', 'spo2', 'oxygen-saturation', 'pulse-rate', 'plethysmograph'],
      },
      {
        baseName: 'NSVAIR Ergonomic Spinal Posture Corrector & Sensor Harness',
        baseSlug: 'nsvair-ergonomic-spinal-posture-corrector-sensor-harness',
        shortDesc: 'Breathable orthopedic clavicle brace with smart vibration angle sensor for real-time slouch alerts.',
        fullDesc: 'Combines orthopedic clavicle alignment support with an embedded intelligent angle gyroscope. Gently vibrates when your upper spine slouches past 15 degrees to retrain neuromuscular memory and relieve neck/back strain.',
        basePrice: 34.99,
        origPrice: 59.99,
        features: ['Smart Micro-Vibration Slouch Sensor (15° Angle Alert)', 'Breathable High-Elastic Ergonomic Honeycomb Fabric', 'Relieves Cervical Neck & Lumbar Strain', 'Discreet Under-Clothing Fit for Office & Driving', 'Rechargeable USB-C Sensor Module'],
        specifications: { 'Size Range': 'Adjustable Chest 28" – 48"', 'Battery': '500mAh (Up to 15 Days per Charge)', 'Material': 'Hypoallergenic Breathable Mesh' },
        inTheBox: ['1x NSVAIR Posture Harness', '1x Smart Sensor Module', '1x USB-C Charging Cable', '1x Posture Exercise Guide'],
        iconType: 'PersonStanding',
        gradient: 'from-emerald-600 to-teal-800',
        badge: 'Popular',
        tags: ['posture-corrector', 'ergonomics', 'back-support', 'slouch-sensor', 'spine'],
      },
      {
        baseName: 'NSVAIR Medical Grade N95 Respirator Masks (Pack of 50)',
        baseSlug: 'nsvair-medical-grade-n95-respirator-masks-pack-50',
        shortDesc: 'NIOSH & CE certified 5-layer electrostatic filtration masks filtering ≥99% airborne particulates.',
        fullDesc: 'Five-layer spunbond and meltblown electrostatic micro-fiber filtration blocking viral aerosols, bacteria, PM2.5 particulate matter, dust, and pathogens. Features reinforced headbands and adjustable padded aluminum nose clips for airtight facial seal.',
        basePrice: 39.99,
        origPrice: 69.99,
        features: ['≥99% Bacterial & Particulate Filtration Efficiency (BFE/PFE)', '5-Layer Electrostatic Meltblown Micro-Filter', 'Padded Foam Nose Bridge for Zero Fog on Eyeglasses', 'Individually Foil Sealed for Sterile Storage', 'Latex-Free Hypoallergenic Skin Contact Layer'],
        specifications: { 'Standard': 'NIOSH N95 / EN 149:2001+A1:2009 FFP2', 'Quantity': '50 Individually Wrapped Masks', 'Shelf Life': '5 Years' },
        inTheBox: ['50x Individually Sealed NSVAIR N95 Masks', 'Quality Certification Leaflet'],
        iconType: 'ShieldCheck',
        gradient: 'from-cyan-600 to-blue-800',
        badge: 'FDA Registered',
        tags: ['n95-masks', 'respirator', 'protective-gear', 'filtration', 'ppe'],
      },
      {
        baseName: 'NSVAIR Professional Medical First Aid & Trauma Emergency Response Kit',
        baseSlug: 'nsvair-professional-medical-first-aid-trauma-emergency-kit',
        shortDesc: 'Comprehensive 250-piece clinical emergency bag with tactical tourniquet, splints, burn dressings, and CPR mask.',
        fullDesc: 'Equipped for clinical clinics, home emergencies, travel, and disaster response. Contains 250 hospital-grade components including Israeli pressure trauma bandages, military tourniquet, aluminum padded emergency splint, burn dressings, sterile eye wash, and surgical instruments.',
        basePrice: 89.0,
        origPrice: 139.0,
        features: ['250 Hospital & Trauma-Grade Medical Components', 'Includes Combat Application Tourniquet (CAT) & Padded Splint', 'Heavy-Duty Waterproof 1000D Ballistic Nylon Bag', 'Color-Coded Modular Compartments for Quick Access', 'OSHA & ANSI Compliant for Home, Office, and Clinic'],
        specifications: { 'Bag Material': 'Waterproof 1000D Cordura Nylon', 'Weight': '1.6 kg', 'Dimensions': '28cm x 20cm x 15cm' },
        inTheBox: ['1x Heavy Duty Tactical Trauma Bag', '250x Medical Components (Dressings, Tourniquet, Splint, Instruments, CPR Shield, Antiseptics)', '1x Clinical Emergency First Aid Manual'],
        iconType: 'ShieldCheck',
        gradient: 'from-red-600 to-rose-900',
        badge: 'Clinical Grade',
        tags: ['first-aid', 'trauma-kit', 'emergency', 'tourniquet', 'medical-supplies'],
      },
    ],
  },
  {
    category: 'nutraceuticals-supplements',
    categoryLabel: 'Clinical Grade Nutraceuticals',
    subCategories: ['Cardiovascular & Omega-3', 'Cellular Energy & CoQ10', 'Daily Multivitamins & Minerals', 'Circadian Sleep & Brain Health', 'Joint & Bone Health'],
    items: [
      {
        baseName: 'NSVAIR Pure Clinical Omega-3 Triple Strength (1500mg EPA/DHA)',
        baseSlug: 'nsvair-pure-clinical-omega-3-triple-strength-1500mg-epa-dha',
        shortDesc: 'Ultra-pure molecularly distilled wild fish oil triglyceride form with 1000mg EPA and 500mg DHA per serving.',
        fullDesc: 'Pharmaceutical grade wild-caught deep-sea fish oil in natural triglyceride (rTG) form for 70% superior bioavailability. IFOS 5-Star certified for zero heavy metals, mercury, or oxidation with burp-free enteric coating and natural lemon essence.',
        basePrice: 34.99,
        origPrice: 49.99,
        features: ['1500mg Active Omega-3 Fatty Acids (1000mg EPA + 500mg DHA)', 'Natural Re-esterified Triglyceride (rTG) Form', 'IFOS 5-Star Certified: Zero Mercury, PCBs, or Heavy Metals', 'Supports Cardiovascular, Brain, Eye, and Joint Longevity', 'Burp-Free Enteric Coating with Natural Citrus Essence'],
        specifications: { 'Count': '120 Softgels (60-Day Supply)', 'Serving Size': '2 Softgels Daily', 'Origin': 'Wild Alaskan Deep-Sea Fish', 'Formulation': 'Non-GMO, Gluten-Free, Soy-Free' },
        inTheBox: ['1x Bottle 120 Enteric Softgels', 'Batch Third-Party Certificate of Analysis (COA)'],
        iconType: 'Heart',
        gradient: 'from-amber-500 to-yellow-700',
        badge: 'Best Seller',
        tags: ['omega-3', 'fish-oil', 'epa-dha', 'cardio-health', 'brain-longevity'],
      },
      {
        baseName: 'NSVAIR Bio-Enhanced CoQ10 Ubiquinol 200mg with PQQ & BioPerine',
        baseSlug: 'nsvair-bio-enhanced-coq10-ubiquinol-200mg-pqq-bioperine',
        shortDesc: 'Active antioxidant Ubiquinol with Pyrroloquinoline Quinone for mitochondrial energy and heart vitality.',
        fullDesc: 'Provides active reduced Ubiquinol CoQ10 (8x more bioavailable than conventional Ubiquinone) combined with 20mg PQQ (Pyrroloquinoline Quinone) for mitochondrial biogenesis, cellular ATP production, and cardiovascular antioxidant defense.',
        basePrice: 44.99,
        origPrice: 64.99,
        features: ['200mg Kaneka Ubiquinol Active Antioxidant CoQ10', '20mg PQQ for Mitochondrial Regeneration & Brain Focus', '5mg BioPerine Black Pepper Extract for 30% Enhanced Absorption', 'Replenishes Statin-Depleted CoQ10 Levels', 'Formulated in Cold-Pressed Olive Oil Matrix'],
        specifications: { 'Count': '60 Liquid Softgels (2-Month Supply)', 'Serving Size': '1 Softgel Daily with Meals', 'Quality': 'Kaneka Ubiquinol Clinical Standard' },
        inTheBox: ['1x Bottle 60 Liquid Softgels', 'Mitochondrial Health Guide'],
        iconType: 'Sparkles',
        gradient: 'from-rose-500 to-red-700',
        badge: 'Clinical Grade',
        tags: ['coq10', 'ubiquinol', 'mitochondria', 'cellular-energy', 'heart-health'],
      },
      {
        baseName: 'NSVAIR Circadian Rest & Deep Sleep Matrix (Melatonin, L-Theanine, Magnesium)',
        baseSlug: 'nsvair-circadian-rest-deep-sleep-matrix-melatonin-theanine',
        shortDesc: 'Clinically formulated non-habit forming sleep architecture optimizer for restorative REM & deep sleep.',
        fullDesc: 'Calms nighttime nervous system overactivity and optimizes circadian sleep phases. Features sustained-release micro-dose Melatonin (3mg), Suntheanine L-Theanine (200mg), GABA (100mg), and high-absorption Magnesium Bisglycinate (200mg).',
        basePrice: 28.99,
        origPrice: 42.99,
        features: ['Optimizes Deep REM & Restorative Stage 3 Slow-Wave Sleep', 'Non-Habit Forming & Zero Next-Day Morning Groggy Feeling', 'Sustained Biphasic Micro-Dose Melatonin (Quick & Steady Release)', 'Suntheanine L-Theanine + GABA for Neurotransmitter Calm', 'Direct Integration with NSVAIR Sleep Quality Module'],
        specifications: { 'Count': '60 Vegetarian Capsules (30-60 Day Supply)', 'Serving Size': '1-2 Capsules 30 Mins Before Sleep', 'Form': 'Vegetarian Plant Capsule' },
        inTheBox: ['1x Bottle 60 Vegetarian Capsules', 'Circadian Sleep Hygiene Handbook (Digital)'],
        iconType: 'Moon',
        gradient: 'from-indigo-600 to-purple-800',
        badge: 'Popular',
        tags: ['sleep', 'melatonin', 'l-theanine', 'magnesium', 'circadian-rest'],
      },
      {
        baseName: 'NSVAIR High-Potency Vitamin D3 5000 IU + Vitamin K2 (MK-7) Liquid Drops',
        baseSlug: 'nsvair-vitamin-d3-5000-iu-vitamin-k2-mk7-liquid-drops',
        shortDesc: 'Synergistic D3 + K2 in organic MCT oil base for optimal calcium arterial distribution and bone density.',
        fullDesc: 'Pairs 5000 IU of bio-identical Cholecalciferol Vitamin D3 with 100mcg of all-trans Vitamin K2 (MenaQ7 MK-7) in organic coconut MCT oil. Directs calcium straight into bones and teeth while preventing vascular arterial calcification.',
        basePrice: 26.99,
        origPrice: 38.99,
        features: ['5000 IU Bio-Identical Vitamin D3 + 100mcg Vitamin K2 (MK-7)', 'Organic Coconut MCT Oil Base for Instant Sublingual Absorption', 'Prevents Arterial Calcification & Enhances Bone Mineral Density', 'Supports Immune White Blood Cell Function & Mood', 'Over 360 Measured Dropper Servings (1-Year Supply)'],
        specifications: { 'Volume': '60 ml / 2 fl oz (360 Servings)', 'Serving Size': '5 Drops Daily', 'Purity': '100% Vegan D3 from Lichen & K2 from Fermented Chickpea' },
        inTheBox: ['1x 60ml Amber Glass Dropper Bottle', 'Precision Measured Pipette', 'Immunity Guide'],
        iconType: 'Sun',
        gradient: 'from-amber-500 to-orange-700',
        badge: 'Best Seller',
        tags: ['vitamin-d3', 'vitamin-k2', 'mct-oil', 'immunity', 'bone-health'],
      },
      {
        baseName: 'NSVAIR Complete Organic Daily Multivitamin with Chelated Minerals',
        baseSlug: 'nsvair-complete-organic-daily-multivitamin-chelated-minerals',
        shortDesc: 'Whole-food fermented multivitamin with methylated B-complex, bioactive antioxidants, and digestive enzymes.',
        fullDesc: 'Contains 32 essential bioavailable nutrients sourced from certified organic whole foods. Features methylated folate (L-Methylfolate, NOT synthetic folic acid), Methylcobalamin B12, Albion chelated zinc, selenium, chromium, and plant digestive enzymes.',
        basePrice: 32.99,
        origPrice: 48.99,
        features: ['32 Bioavailable Whole-Food Vitamins & Albion Chelated Minerals', 'Methylated Active B-Complex (L-5-MTHF + Methyl-B12)', 'Organic Spectra Botanical Antioxidant Blend', 'Plant-Derived Digestive Enzyme & Probiotic Complex', 'Gentle on Empty Stomach & Easy to Swallow'],
        specifications: { 'Count': '90 Veggie Tablets (45-Day Supply)', 'Serving Size': '2 Tablets Daily', 'Certifications': 'USDA Organic, Non-GMO Project Verified, Vegan' },
        inTheBox: ['1x Bottle 90 Organic Tablets', 'Nutritional Micronutrient Matrix Sheet'],
        iconType: 'Apple',
        gradient: 'from-emerald-600 to-teal-800',
        badge: 'Clinical Grade',
        tags: ['multivitamin', 'chelated-minerals', 'methylated-folate', 'organic', 'wellness'],
      },
    ],
  },
]

// -------------------------------------------------------------
// Programmatic Deterministic Product Generator (500+ Items)
// -------------------------------------------------------------

const VARIANT_MODIFIERS = [
  { prefix: 'Standard Clinic', suffix: 'v1.0 Edition', priceMod: 1.0, disc: 30, stock: 85, badge: 'Popular' as const },
  { prefix: 'Pro Enterprise', suffix: 'Clinical Plus', priceMod: 1.45, disc: 35, stock: 120, badge: 'Clinical Grade' as const },
  { prefix: 'Home Care', suffix: 'Family Pack', priceMod: 1.25, disc: 25, stock: 95, badge: 'Best Seller' as const },
  { prefix: 'Diagnostic AI', suffix: 'Elite Tier', priceMod: 1.8, disc: 40, stock: 65, badge: 'AI Powered' as const },
  { prefix: 'Ultra Precision', suffix: '2026 Gold Standard', priceMod: 1.6, disc: 30, stock: 110, badge: 'FDA Registered' as const },
  { prefix: 'Hospital Grade', suffix: 'Master Suite', priceMod: 2.1, disc: 45, stock: 40, badge: 'CE Certified' as const },
  { prefix: 'Smart Telehealth', suffix: 'Wireless Edition', priceMod: 1.35, disc: 20, stock: 75, badge: 'New Release' as const },
  { prefix: 'Pediatric & Adult', suffix: 'Universal Kit', priceMod: 1.15, disc: 28, stock: 90, badge: 'Popular' as const },
  { prefix: 'Rapid Diagnostic', suffix: 'Instant Sync', priceMod: 1.1, disc: 22, stock: 150, badge: 'Best Seller' as const },
  { prefix: 'Physician Grade', suffix: 'Laboratory Series', priceMod: 1.75, disc: 38, stock: 55, badge: 'Clinical Grade' as const },
  { prefix: 'Compact Portable', suffix: 'Field Trauma Pack', priceMod: 1.05, disc: 18, stock: 80, badge: 'Popular' as const },
  { prefix: 'Advanced Multi-Spectral', suffix: 'Sensor Matrix', priceMod: 1.9, disc: 33, stock: 45, badge: 'AI Powered' as const },
  { prefix: 'Cardio Vascular', suffix: 'Arterial Suite', priceMod: 1.5, disc: 27, stock: 70, badge: 'Clinical Grade' as const },
  { prefix: 'Endocrine & Metabolic', suffix: 'Complete Panel', priceMod: 1.4, disc: 24, stock: 60, badge: 'Best Seller' as const },
  { prefix: 'Bio-Enhanced', suffix: 'Micro-Encapsulated', priceMod: 1.3, disc: 26, stock: 100, badge: 'Popular' as const },
  { prefix: 'Zero-Latency', suffix: 'Real-Time Edge', priceMod: 1.65, disc: 32, stock: 50, badge: 'AI Powered' as const },
  { prefix: 'Executive Health', suffix: 'Annual Pass', priceMod: 2.5, disc: 50, stock: 35, badge: 'Best Seller' as const },
  { prefix: 'Preventative Wellness', suffix: 'Screening Box', priceMod: 1.2, disc: 20, stock: 130, badge: 'New Release' as const },
  { prefix: 'Dermatological Optical', suffix: 'HD Zoom Lens', priceMod: 1.55, disc: 29, stock: 65, badge: 'Clinical Grade' as const },
  { prefix: 'Comprehensive Bio-Metric', suffix: 'Tele-Health Package', priceMod: 2.2, disc: 42, stock: 30, badge: 'FDA Registered' as const },
  { prefix: 'Continuous Monitoring', suffix: 'Bluetooth LE', priceMod: 1.7, disc: 31, stock: 80, badge: 'New Release' as const },
]

let cachedProducts: Product[] | null = null

export function getAllProducts(): Product[] {
  if (cachedProducts) return cachedProducts

  const products: Product[] = []
  let globalCounter = 1

  // Loop through all 5 categories
  for (const template of TEMPLATES) {
    let itemIdx = 0
    for (const item of template.items) {
      // Create primary item
      const primarySku = `NSV-${template.category.substring(0, 3).toUpperCase()}-${String(globalCounter).padStart(4, '0')}`
      products.push({
        id: `prod-${globalCounter}`,
        slug: item.baseSlug,
        name: item.baseName,
        sku: primarySku,
        category: template.category,
        categoryLabel: template.categoryLabel,
        subCategory: template.subCategories[itemIdx % template.subCategories.length],
        price: item.basePrice,
        originalPrice: item.origPrice,
        discountPercent: Math.round(((item.origPrice - item.basePrice) / item.origPrice) * 100),
        rating: 4.85 + (globalCounter % 15) * 0.01,
        reviewCount: 48 + (globalCounter % 280),
        inStock: true,
        stockCount: 140 - (globalCounter % 50),
        badge: item.badge,
        shortDescription: item.shortDesc,
        fullDescription: item.fullDesc,
        features: item.features,
        specifications: item.specifications,
        inTheBox: item.inTheBox,
        iconType: item.iconType,
        imageGradient: item.gradient,
        brand: 'NSVAIR Diagnosis',
        parentCompany: 'NSVAIR GROUP OF INDUSTRY',
        tags: [...item.tags, template.category],
      })
      globalCounter++
      itemIdx++

      // Generate systematic variants across modifiers to build 500+ products
      for (let v = 0; v < VARIANT_MODIFIERS.length; v++) {
        const mod = VARIANT_MODIFIERS[v]
        const sku = `NSV-${template.category.substring(0, 3).toUpperCase()}-${String(globalCounter).padStart(4, '0')}`
        const vSlug = `${item.baseSlug}-${mod.prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${mod.suffix.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${v + 1}`
        const vName = `${item.baseName} (${mod.prefix} • ${mod.suffix})`
        const price = Math.round(item.basePrice * mod.priceMod * 100) / 100
        const origPrice = Math.round(price * (1 + mod.disc / 100) * 100) / 100

        products.push({
          id: `prod-${globalCounter}`,
          slug: vSlug,
          name: vName,
          sku,
          category: template.category,
          categoryLabel: template.categoryLabel,
          subCategory: template.subCategories[(itemIdx + v) % template.subCategories.length],
          price,
          originalPrice: origPrice,
          discountPercent: mod.disc,
          rating: Number((4.7 + ((globalCounter * 7) % 30) * 0.01).toFixed(1)),
          reviewCount: 25 + (globalCounter * 3) % 240,
          inStock: true,
          stockCount: mod.stock,
          badge: mod.badge,
          shortDescription: `${mod.prefix} edition: ${item.shortDesc}`,
          fullDescription: `${item.fullDesc}\n\nThis ${mod.prefix} (${mod.suffix}) configuration provides expanded clinical accuracy, automated calibration, and priority reporting pipeline on NSVAIR Diagnosis.`,
          features: [
            ...item.features,
            `${mod.prefix} Enhanced Firmware & Precision Calibration`,
            `Direct Support via WhatsApp (+91 9599497690)`,
          ],
          specifications: {
            ...item.specifications,
            'Edition': `${mod.prefix} ${mod.suffix}`,
            'SKU Reference': sku,
          },
          inTheBox: item.inTheBox,
          iconType: item.iconType,
          imageGradient: item.gradient,
          brand: 'NSVAIR Diagnosis',
          parentCompany: 'NSVAIR GROUP OF INDUSTRY',
          tags: [...item.tags, template.category, mod.prefix.toLowerCase()],
        })
        globalCounter++
      }
    }
  }

  cachedProducts = products
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  const all = getAllProducts()
  return all.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  const all = getAllProducts()
  return all.filter((p) => p.category === category)
}

export function getFeaturedProducts(limit = 12): Product[] {
  const all = getAllProducts()
  return all.filter((p) => p.badge === 'Best Seller' || p.badge === 'Clinical Grade' || p.badge === 'AI Powered').slice(0, limit)
}

export function searchProducts(
  query = '',
  category: ProductCategory | 'all' = 'all',
  sort: 'popular' | 'price-asc' | 'price-desc' | 'rating' = 'popular'
): Product[] {
  let list = getAllProducts()

  if (category !== 'all') {
    list = list.filter((p) => p.category === category)
  }

  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'popular':
    default:
      list.sort((a, b) => b.reviewCount - a.reviewCount)
      break
  }

  return list
}
