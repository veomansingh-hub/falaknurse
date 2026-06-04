/**
 * FalakNurse Cloud Firestore Seeding Script
 * 
 * To run this script:
 * 1. Ensure your Firebase Project environment variables are set or configure a service account.
 * 2. Run: node scripts/seed_firestore.js
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection } = require("firebase/firestore");

// Replace with your project details or load from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const MEDICINES = [
  { "srNo": 1, "code": "1", "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets", "unit": "10's", "mrp": 9.38, "group": "Analgesic/Antipyretic/Anti-Inflammatory" },
  { "srNo": 2, "code": "2", "name": "Aceclofenac Tablets IP 100 mg", "unit": "10's", "mrp": 7.5, "group": "Analgesic/Antipyretic/Anti-Inflammatory" },
  { "srNo": 3, "code": "3", "name": "Pregabalin Capsules IP 75 mg", "unit": "10's", "mrp": 20.63, "group": "Central Nervous System (CNS)" },
  { "srNo": 4, "code": "5", "name": "Aspirin Gastro-resistant Tablets IP 150 mg", "unit": "14's", "mrp": 4.69, "group": "Analgesic/Antipyretic/Anti-Inflammatory" },
  { "srNo": 5, "code": "6", "name": "Chlorzoxazone 500mg, Diclofenac 50mg and Paracetamol 325mg Tablets", "unit": "10's", "mrp": 23.44, "group": "Analgesic/Antipyretic/Anti-Inflammatory" },
  { "srNo": 6, "code": "7", "name": "Diclofenac Gel IP 1.16%w/w (Diclofenac Diethylamine)", "unit": "15 g", "mrp": 11.25, "group": "Dermatology/Topical/External" },
  { "srNo": 7, "code": "8", "name": "Serratiopeptidase 10mg and Diclofenac Sodium 50mg Tablets", "unit": "10's", "mrp": 14.44, "group": "Analgesic/Antipyretic/Anti-Inflammatory" },
  { "srNo": 8, "code": "9", "name": "Diclofenac Sodium Prolonged Release Tablets IP 100 mg", "unit": "10's", "mrp": 11.35, "group": "Analgesic/Antipyretic/Anti-Inflammatory" },
  { "srNo": 9, "code": "10", "name": "Diclofenac Sodium Injection IP 25mg per ml", "unit": "3 ml", "mrp": 3.75, "group": "Analgesic/Antipyretic/Anti-Inflammatory" },
  { "srNo": 10, "code": "11", "name": "Diclofenac Gastro-Resistant Tablets IP 50 mg", "unit": "10's", "mrp": 5.16, "group": "Analgesic/Antipyretic/Anti-Inflammatory" }
  // (Full data available in localData.js and can be loaded dynamically)
];

const ARTICLES = [
  {
    id: "diabetes-management",
    title: "Managing Type 2 Diabetes in India",
    category: "Chronic Illness",
    readTime: "5 min read",
    author: "Dr. Rajesh Sharma, MD",
    date: "May 28, 2026",
    summary: "Practical tips on diet, exercise, and generic medicine alternatives for Indian diabetics."
  }
];

async function seed() {
  if (!firebaseConfig.projectId) {
    console.error("Error: Please set VITE_FIREBASE_PROJECT_ID and other config environment variables.");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Seeding Cloud Firestore...");

  // Seed Medicines
  for (const med of MEDICINES) {
    await setDoc(doc(db, "medicines", `med-${med.srNo}`), med);
    console.log(`Uploaded medicine: ${med.name}`);
  }

  // Seed Articles
  for (const art of ARTICLES) {
    await setDoc(doc(db, "articles", art.id), art);
    console.log(`Uploaded article: ${art.title}`);
  }

  console.log("Database seeding completed successfully!");
}

if (require.main === module) {
  seed().catch(console.error);
}
