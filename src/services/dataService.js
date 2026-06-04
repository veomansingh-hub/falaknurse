import { db, isFirebaseConnected } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { 
  MEDICINES_DATA, 
  ARTICLES_DATA, 
  HELPLINES_DATA, 
  FAQS_DATA 
} from "./localData";

// Inquiry helper for offline storage persistence
const LOCAL_INQUIRIES_KEY = "falaknurse_inquiries";

// Default pre-populated nurse response for queries submitted locally
const MOCK_NURSE_RESPONSES = [
  "Thank you for contacting FalakNurse. A registered nurse is reviewing your query. Please maintain hydration and monitor your temperature. If this is an emergency, dial 108 immediately.",
  "Hello, this is Nurse Falak. For generic medicines, please ensure the chemical salt names match your doctor's prescription exactly. Always consume medicines after meals unless directed otherwise.",
  "Hi, thank you for reaching out. Based on your symptoms, we recommend resting and checking your blood pressure. Please do not self-medicate with strong antibiotics without a prescription.",
  "Greetings from Nurse Care. For child care, ensure vaccinations are up to date. Keep infant paracetamol dosages strictly scaled to body weight. Reach back if fever persists beyond 48 hours."
];

export const getMedicines = async () => {
  if (isFirebaseConnected && db) {
    try {
      const q = query(collection(db, "medicines"), orderBy("srNo"), limit(500));
      const querySnapshot = await getDocs(q);
      const medicines = [];
      querySnapshot.forEach((doc) => {
        medicines.push({ id: doc.id, ...doc.data() });
      });
      if (medicines.length > 0) return medicines;
    } catch (error) {
      console.warn("Firestore fetch error for medicines, using cached database.", error);
    }
  }
  return MEDICINES_DATA;
};

export const getArticles = async () => {
  if (isFirebaseConnected && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const articles = [];
      querySnapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...doc.data() });
      });
      if (articles.length > 0) return articles;
    } catch (error) {
      console.warn("Firestore fetch error for articles, using cached articles.", error);
    }
  }
  return ARTICLES_DATA;
};

export const getFAQs = async () => {
  if (isFirebaseConnected && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "faqs"));
      const faqs = [];
      querySnapshot.forEach((doc) => {
        faqs.push({ id: doc.id, ...doc.data() });
      });
      if (faqs.length > 0) return faqs;
    } catch (error) {
      console.warn("Firestore fetch error for FAQs, using cached FAQs.", error);
    }
  }
  return FAQS_DATA;
};

export const getHelplines = async () => {
  if (isFirebaseConnected && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "helplines"));
      const helplines = [];
      querySnapshot.forEach((doc) => {
        helplines.push({ id: doc.id, ...doc.data() });
      });
      if (helplines.length > 0) return helplines;
    } catch (error) {
      console.warn("Firestore fetch error for helplines, using cached directory.", error);
    }
  }
  return HELPLINES_DATA;
};

export const submitNurseInquiry = async (inquiry) => {
  const newInquiry = {
    ...inquiry,
    timestamp: new Date().toISOString(),
    status: "Pending Response",
    nurseResponse: "Our nurse is reviewing your health question and will update this card shortly."
  };

  if (isFirebaseConnected && db) {
    try {
      const docRef = await addDoc(collection(db, "inquiries"), newInquiry);
      return { success: true, id: docRef.id, ...newInquiry };
    } catch (error) {
      console.warn("Firestore upload error, writing inquiry locally.", error);
    }
  }

  // Local storage fallback
  const localInquiries = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || "[]");
  
  // Create a realistic delay and inject a mock response automatically
  const mockResp = MOCK_NURSE_RESPONSES[Math.floor(Math.random() * MOCK_NURSE_RESPONSES.length)];
  newInquiry.id = "local-" + Math.floor(1000 + Math.random() * 9000);
  
  // Set a delayed response status update to mock asynchronous reply from nurse!
  setTimeout(() => {
    const list = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || "[]");
    const itemIdx = list.findIndex(i => i.id === newInquiry.id);
    if (itemIdx > -1) {
      list[itemIdx].status = "Answered";
      list[itemIdx].nurseResponse = mockResp;
      localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(list));
      // Dispatch custom event to notify UI
      window.dispatchEvent(new Event("inquiries_updated"));
    }
  }, 10000); // 10 seconds delay

  localInquiries.unshift(newInquiry);
  localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(localInquiries));
  return { success: true, isLocal: true, ...newInquiry };
};

export const getUserInquiries = async (email) => {
  // If online, query Firestore (we can filter by user email)
  if (isFirebaseConnected && db) {
    try {
      // For convenience and absolute speed in demonstration, we can list all or query
      const querySnapshot = await getDocs(collection(db, "inquiries"));
      const inquiries = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === email) {
          inquiries.push({ id: doc.id, ...data });
        }
      });
      return inquiries;
    } catch (error) {
      console.warn("Firestore query error for inquiries, getting local.", error);
    }
  }

  // Load from LocalStorage
  const localInquiries = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || "[]");
  return localInquiries.filter(i => !email || i.email === email);
};

export const getFirebaseConnectionStatus = () => {
  return isFirebaseConnected;
};
