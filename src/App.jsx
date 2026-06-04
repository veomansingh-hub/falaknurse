import React, { useState, useEffect, useMemo } from "react";
import { 
  Home, 
  Pill, 
  BookOpen, 
  Calculator, 
  ShieldAlert, 
  PhoneCall, 
  Send, 
  Sun, 
  Moon, 
  Globe, 
  Activity, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  HeartPulse, 
  Baby, 
  ShieldCheck, 
  Share2, 
  Printer, 
  Trash2,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  BadgeInfo
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  getMedicines, 
  getArticles, 
  getFAQs, 
  getHelplines, 
  submitNurseInquiry, 
  getUserInquiries,
  getFirebaseConnectionStatus 
} from "./services/dataService";
import MedicineCard from "./components/MedicineCard";
import DetailModal from "./components/DetailModal";
import "./App.css";

// -------------------------------------------------------------
// TRANSLATION DICTIONARY (English & Hindi)
// -------------------------------------------------------------
const TRANSLATIONS = {
  en: {
    appTitle: "FalakNurse",
    tagline: "Indian Public Health & Medicine Guide",
    slogan: "Your health. Our guidance. Better everyday.",
    home: "Home",
    medicines: "Medicines",
    articles: "Articles",
    calculator: "Savings List",
    emergency: "Safety Help",
    searchPlaceholder: "Search generic medicines, health topics...",
    searchBtn: "Search",
    liveUsers: "Live Active Visitors",
    syncStatusLocal: "Local Database",
    syncStatusLive: "Google Server Sync",
    quickAccess: "Quick Access Dashboard",
    evidenceTitle: "Evidence-Based Guidance",
    evidenceDesc: "Reliable, peer-reviewed medical information from Indian pharmacy databases.",
    confTitle: "Safe & Private",
    confDesc: "Your searches, cost summaries, and inquiry submissions are saved client-side.",
    commTitle: "Affordable Health Care",
    commDesc: "Helping Indian families find low-cost generic replacements for daily treatments.",
    
    // Medicines page
    catAll: "All Categories",
    genericPrice: "Generic MRP",
    codeAbbr: "Code",
    pack: "Pack",
    addedTag: "Added",
    addBtn: "Add to List",
    searchMed: "Search 400+ Indian generic medicines...",
    filterPrice: "Max Price: ₹",
    noLimit: "No Limit",
    resultsCount: "Showing {count} of {total} medicines",
    noMedicines: "No medicines found.",
    refineSearch: "Try refining your search terms or adjusting the category filters.",
    medDetails: "Medicine Details",
    genericName: "Generic Formulation Name",
    saltCategory: "Therapeutic Category Group",
    packSize: "Packaging Unit Size",
    drugCode: "Jan Aushadhi Code",
    genericMrp: "Generic Price (PMBJP)",
    saveTitle: "Save Up To",
    saveDesc: "Branded market alternatives cost ₹{min} - ₹{max}. Generic medicines deliver identical therapeutic value for a fraction of the cost!",
    indicLbl: "Common Indications (Uses)",
    indicVal: "Used for general pain relief, anti-inflammatory control, chronic disease management, or as prescribed by your practitioner.",
    warningLbl: "Precautions & Warnings",
    warningVal: "Consult a registered doctor before usage. Do not exceed recommended dosages. Avoid alcohol. Common side effects include mild dizziness or stomach irritation in rare instances.",
    addToCalc: "Add to Calculator",
    addedToCalc: "Added to List ✓",

    // Articles page
    searchArticles: "Search health topics & articles...",
    readTime: "Read Time",
    author: "By",
    date: "Published",
    backToArticles: "← Back to Articles List",

    // Calculator page
    calculatorTitle: "Savings Estimator",
    monthlySavings: "Monthly Prescription Savings",
    annualSavings: "Annual Prescription Savings",
    estBrandedCost: "Est. Branded Price",
    genericCost: "Generic Alternative Price",
    genericCostTotal: "Generic PMBJP Total",
    emptyCalc: "Your Savings List is Empty",
    emptyCalcDesc: "Search generic medicines in the catalog and click 'Add to List' to calculate your prescription bill and generic discount savings.",
    clearList: "Clear List",
    printSummary: "Print Bill",
    costSavedTxt: "Prescription discount of 75% applied",

    // Emergency/Safety page
    emergencyBannerTitle: "Emergency Alert",
    emergencyBannerDesc: "For chest pain, severe breathing trouble, sudden paralysis, or heavy bleeding, visit the nearest emergency room or dial 108 immediately.",
    whatsappTitle: "Chat with Medical Assistant",
    whatsappDesc: "Get quick assistance regarding Indian generic schemes & dosage support.",
    whatsappBtn: "Open WhatsApp Support",
    safetyFormTitle: "Ask a Registered Nurse",
    safetyFormDesc: "Ask non-emergency medical questions. A qualified nurse will answer your query directly inside the Inbox below.",
    nameLbl: "Full Name",
    emailLbl: "Email Address (to fetch history)",
    queryLbl: "Your Question / Symptoms",
    submitBtn: "Submit Question",
    inboxTitle: "Your Health Inquiries & Responses",
    inboxDesc: "Submit questions using your email. We automatically simulate a nurse response after 10 seconds for offline review!",
    pendingStatus: "Reviewing...",
    answeredStatus: "Answered",
    nurseResponseLabel: "Professional Nurse Verdict",
    accDosageTitle: "Generic Dosage Safety Basics",
    accDosageDesc: "Always follow the '5 Rights' of drug administration: Right Patient, Right Drug, Right Dose, Right Route, and Right Time. Never self-medicate with high-dose antibiotics.",
    accStorageTitle: "Medicine Storage Rules",
    accStorageDesc: "Store medicines in dry, cool locations (under 30°C) away from direct sunlight. Keep child-safe caps closed and place them out of reach of children.",
    accRedFlagsTitle: "Red Flag Health Symptoms",
    accRedFlagsDesc: "Signs of severe conditions include: Sudden loss of speech/slurring, difficulty keeping balance, severe chest pressure radiating to the arm, or high fever with stiff neck."
  },
  hi: {
    appTitle: "फ़लकनर्स (FalakNurse)",
    tagline: "भारतीय जन स्वास्थ्य एवं औषधि मार्गदर्शिका",
    slogan: "आपका स्वास्थ्य। हमारा मार्गदर्शन। हर दिन बेहतर।",
    home: "मुख्य पृष्ठ",
    medicines: "दवाइयाँ",
    articles: "स्वास्थ्य लेख",
    calculator: "बचत सूची",
    emergency: "सुरक्षा सहायता",
    searchPlaceholder: "जेनेरिक दवाएं, स्वास्थ्य विषय खोजें...",
    searchBtn: "खोजें",
    liveUsers: "लाइव सक्रिय विज़िटर",
    syncStatusLocal: "स्थानीय डेटाबेस",
    syncStatusLive: "गूगल सर्वर सिंक सक्रिय",
    quickAccess: "त्वरित पहुँच डैशबोर्ड",
    evidenceTitle: "साक्ष्य-आधारित जानकारी",
    evidenceDesc: "विश्वसनीय और जांची गई स्वास्थ्य जानकारी सीधे जन औषधि डेटाबेस से ली गई है।",
    confTitle: "सुरक्षित और गोपनीय",
    confDesc: "आपकी खोज, बचत सूची और पूछे गए प्रश्न केवल आपके डिवाइस में सुरक्षित रहते हैं।",
    commTitle: "सस्ती स्वास्थ्य देखभाल",
    commDesc: "भारतीय परिवारों को दैनिक चिकित्सा खर्चों में महंगी ब्रांडेड दवाओं के सस्ते विकल्प ढूंढने में मदद करना।",
    
    // Medicines page
    catAll: "सभी श्रेणियां",
    genericPrice: "जेनेरिक मूल्य",
    codeAbbr: "कोड",
    pack: "पैकिंग",
    addedTag: "जोड़ा गया",
    addBtn: "सूची में जोड़ें",
    searchMed: "400+ भारतीय जेनेरिक दवाएं खोजें...",
    filterPrice: "अधिकतम मूल्य: ₹",
    noLimit: "कोई सीमा नहीं",
    resultsCount: "दिखाए जा रहे हैं {total} में से {count} दवाइयाँ",
    noMedicines: "कोई दवाई नहीं मिली।",
    refineSearch: "कृपया अपनी खोज बदलें या श्रेणी फ़िल्टर को बदल कर देखें।",
    medDetails: "दवाई का विवरण",
    genericName: "जेनेरिक सॉल्ट का नाम",
    saltCategory: "उपचार श्रेणी (ग्रुप)",
    packSize: "पैकेजिंग यूनिट साइज",
    drugCode: "जन औषधि कोड",
    genericMrp: "जेनेरिक मूल्य (PMBJP)",
    saveTitle: "मासिक बचत लगभग",
    saveDesc: "बाजार में ब्रांडेड दवा की कीमत ₹{min} - ₹{max} होती है। जेनेरिक दवा बिल्कुल समान प्रभाव बहुत कम दाम में प्रदान करती है!",
    indicLbl: "मुख्य उपयोग (लक्षण)",
    indicVal: "दर्द निवारण, सूजन नियंत्रण, पुरानी बीमारियों के प्रबंधन, या आपके डॉक्टर द्वारा सलाह दिए गए उपचार के लिए किया जाता है।",
    warningLbl: "सावधानी और चेतावनी",
    warningVal: "उपयोग करने से पहले डॉक्टर से सलाह लें। खुराक से अधिक न लें। शराब से बचें। दुर्लभ मामलों में हल्के चक्कर आना या पेट में जलन हो सकती है।",
    addToCalc: "बचत सूची में जोड़ें",
    addedToCalc: "सूची में मौजूद है ✓",

    // Articles page
    searchArticles: "स्वास्थ्य लेख खोजें...",
    readTime: "पढ़ने का समय",
    author: "लेखक",
    date: "प्रकाशित",
    backToArticles: "← लेख सूची पर वापस जाएँ",

    // Calculator page
    calculatorTitle: "बचत कैलकुलेटर",
    monthlySavings: "मासिक दवा खर्चों में बचत",
    annualSavings: "वार्षिक दवा खर्चों में बचत",
    estBrandedCost: "अनुमानित ब्रांडेड मूल्य",
    genericCost: "जेनेरिक दवा का मूल्य",
    genericCostTotal: "जेनेरिक कुल मूल्य",
    emptyCalc: "आपकी बचत सूची खाली है",
    emptyCalcDesc: "दवाइयों के कैटलॉग से दवाइयां खोजें और अपनी मासिक बचत का अनुमान लगाने के लिए 'सूची में जोड़ें' पर क्लिक करें।",
    clearList: "सूची साफ़ करें",
    printSummary: "बिल प्रिंट करें",
    costSavedTxt: "75% जेनेरिक डिस्काउंट लागू किया गया",

    // Emergency/Safety page
    emergencyBannerTitle: "आपातकालीन चेतावनी",
    emergencyBannerDesc: "अचानक छाती में दर्द, सांस लेने में गंभीर तकलीफ, शरीर के किसी अंग में कमजोरी या भारी रक्तस्राव होने पर तुरंत अस्पताल जाएं या 108 डायल करें।",
    whatsappTitle: "मेडिकल असिस्टेंट से चैट करें",
    whatsappDesc: "जेनेरिक योजनाओं और सही खुराक के बारे में व्हाट्सएप पर तुरंत सहायता प्राप्त करें।",
    whatsappBtn: "व्हाट्सएप चैट खोलें",
    safetyFormTitle: "रजिस्टर्ड नर्स से प्रश्न पूछें",
    safetyFormDesc: "गैर-आपातकालीन स्वास्थ्य संबंधी प्रश्न पूछें। हमारी नर्स नीचे दिए गए इनबॉक्स में आपकी क्वेरी का उत्तर देगी।",
    nameLbl: "आपका पूरा नाम",
    emailLbl: "ईमेल आईडी (इतिहास देखने के लिए)",
    queryLbl: "आपका प्रश्न / लक्षण",
    submitBtn: "प्रश्न सबमिट करें",
    inboxTitle: "आपके प्रश्न और नर्स के जवाब",
    inboxDesc: "अपनी ईमेल आईडी दर्ज करके प्रश्न इतिहास देखें। ऑफलाइन समीक्षा के लिए 10 सेकंड में उत्तर प्राप्त करें!",
    pendingStatus: "समीक्षा जारी...",
    answeredStatus: "उत्तर मिल गया",
    nurseResponseLabel: "नर्स की स्वास्थ्य सलाह",
    accDosageTitle: "जेनेरिक दवा सुरक्षा नियम",
    accDosageDesc: "दवा लेते समय हमेशा 5 नियमों का पालन करें: सही मरीज, सही दवा, सही खुराक, सही समय, और सही तरीका। बिना पर्चे के एंटीबायोटिक न लें।",
    accStorageTitle: "दवा भंडारण के नियम",
    accStorageDesc: "दवाओं को ठंडे और सूखे स्थान (30°C से कम) पर रखें। बच्चों की पहुंच से दूर रखें और कैप को कसकर बंद रखें।",
    accRedFlagsTitle: "खतरनाक स्वास्थ्य लक्षण",
    accRedFlagsDesc: "गंभीर लक्षणों में शामिल हैं: अचानक बोलने में असमर्थता, शरीर का संतुलन खोना, कंधे तक फैलता हुआ छाती का तेज दर्द, या गर्दन की अकड़न के साथ तेज बुखार।"
  }
};

function App() {
  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("home");
  const [language, setLanguage] = useState(() => localStorage.getItem("falaknurse_lang") || "en");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("falaknurse_theme") === "dark");
  
  // Data lists loaded from service layer
  const [medicines, setMedicines] = useState([]);
  const [articles, setArticles] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [isLiveServer, setIsLiveServer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lists state
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem("falaknurse_bookmarks") || "[]"));
  const [calculator, setCalculator] = useState(() => JSON.parse(localStorage.getItem("falaknurse_calculator") || "[]"));
  
  // Search and view filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(Infinity);
  
  // Detailed medicine modal state
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  // Current health article reading state (null if listing)
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Ask a Nurse form state
  const [nurseForm, setNurseForm] = useState({ name: "", email: "", queryText: "" });
  const [nurseInquiries, setNurseInquiries] = useState([]);
  const [inboxFilterEmail, setInboxFilterEmail] = useState("");
  const [formFeedback, setFormFeedback] = useState("");

  // Live visitors counter state
  const [activeVisitors, setActiveVisitors] = useState(132);

  // Emergency safety Accordions toggle state
  const [openAccordion, setOpenAccordion] = useState(null);

  // -------------------------------------------------------------
  // INITIAL DATA LIFECYCLE
  // -------------------------------------------------------------
  useEffect(() => {
    // Load app theme
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const meds = await getMedicines();
      const arts = await getArticles();
      const fqs = await getFAQs();
      const hlines = await getHelplines();
      const status = getFirebaseConnectionStatus();

      setMedicines(meds);
      setArticles(arts);
      setFaqs(fqs);
      setHelplines(hlines);
      setIsLiveServer(status);
      setLoading(false);
    };

    loadData();
    
    // Check local inquiries
    const savedInquiries = localStorage.getItem("falaknurse_inquiries");
    if (!savedInquiries) {
      localStorage.setItem("falaknurse_inquiries", JSON.stringify([]));
    } else {
      setNurseInquiries(JSON.parse(savedInquiries));
    }
  }, []);

  // Sync state values on changes
  useEffect(() => {
    localStorage.setItem("falaknurse_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("falaknurse_calculator", JSON.stringify(calculator));
  }, [calculator]);

  // Handle local inquiry background updates
  useEffect(() => {
    const handleInquiryUpdate = () => {
      const list = JSON.parse(localStorage.getItem("falaknurse_inquiries") || "[]");
      setNurseInquiries(list);
      // If user provided an email filter, sync immediately
      if (inboxFilterEmail) {
        setNurseInquiries(list.filter(i => i.email.toLowerCase() === inboxFilterEmail.toLowerCase()));
      }
    };
    window.addEventListener("inquiries_updated", handleInquiryUpdate);
    return () => window.removeEventListener("inquiries_updated", handleInquiryUpdate);
  }, [inboxFilterEmail]);

  // Simulate active visitor fluctuations (Indian users check in real time)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVisitors(prev => {
        const delta = Math.floor(Math.random() * 9) - 4; // fluctuates -4 to +4
        const newVal = prev + delta;
        return newVal > 80 ? newVal : 120;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // TRANSLATION HELPER
  // -------------------------------------------------------------
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["en"]?.[key] || key;
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    localStorage.setItem("falaknurse_lang", newLang);
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("falaknurse_theme", newTheme ? "dark" : "light");
  };

  // -------------------------------------------------------------
  // LIST STATE MODIFIERS
  // -------------------------------------------------------------
  const handleBookmarkToggle = (med) => {
    setBookmarks(prev => {
      const idx = prev.findIndex(b => b.srNo === med.srNo);
      if (idx > -1) {
        return prev.filter(b => b.srNo !== med.srNo);
      } else {
        return [...prev, med];
      }
    });
  };

  const handleAddToCalculator = (med) => {
    setCalculator(prev => {
      const idx = prev.findIndex(c => c.srNo === med.srNo);
      if (idx > -1) {
        // Already added, remove it
        return prev.filter(c => c.srNo !== med.srNo);
      } else {
        // Add new item with qty 1
        return [...prev, { ...med, qty: 1 }];
      }
    });
  };

  const updateCalculatorQty = (srNo, delta) => {
    setCalculator(prev => {
      return prev.map(item => {
        if (item.srNo === srNo) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCalculator = () => {
    if (window.confirm("Are you sure you want to clear your Savings List?")) {
      setCalculator([]);
    }
  };

  const printCalculatorSummary = () => {
    window.print();
  };

  // Confetti triggering helper for massive savings!
  const checkSavingsAndConfetti = (savingsPercent) => {
    if (savingsPercent > 50) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  // -------------------------------------------------------------
  // COMPUTED COST METRICS
  // -------------------------------------------------------------
  const calcMetrics = useMemo(() => {
    let genericTotal = 0;
    calculator.forEach(item => {
      genericTotal += item.mrp * item.qty;
    });
    
    // Average Jan Aushadhi Generic delivers 75% savings
    // Branded Cost = Generic Cost / (1 - 0.75) = Generic * 4.0
    const estimatedBrandedTotal = genericTotal * 4.0;
    const monthlySavings = estimatedBrandedTotal - genericTotal;
    const annualSavings = monthlySavings * 12;
    const savingsPercent = estimatedBrandedTotal > 0 ? (monthlySavings / estimatedBrandedTotal) * 100 : 0;

    return {
      genericTotal,
      estimatedBrandedTotal,
      monthlySavings,
      annualSavings,
      savingsPercent
    };
  }, [calculator]);

  // Trigger confetti when savings lists populated with high-savings content
  useEffect(() => {
    if (calculator.length > 0 && calcMetrics.savingsPercent > 60) {
      checkSavingsAndConfetti(calcMetrics.savingsPercent);
    }
  }, [calculator.length]);

  // -------------------------------------------------------------
  // ASK A NURSE INQUIRIES SUBMIT
  // -------------------------------------------------------------
  const handleNurseFormChange = (e) => {
    const { name, value } = e.target;
    setNurseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNurseFormSubmit = async (e) => {
    e.preventDefault();
    if (!nurseForm.name || !nurseForm.email || !nurseForm.queryText) {
      setFormFeedback("Please fill out all fields.");
      return;
    }

    setFormFeedback("Submitting query...");
    const inquiry = {
      name: nurseForm.name,
      email: nurseForm.email,
      queryText: nurseForm.queryText
    };

    const res = await submitNurseInquiry(inquiry);
    
    if (res.success) {
      setFormFeedback("Submitted! Your response will appear in the history inbox below in 10 seconds.");
      setNurseForm({ name: "", email: nurseForm.email, queryText: "" }); // keep email for active inbox check
      setInboxFilterEmail(nurseForm.email);
      
      // Force immediate local reload
      const list = JSON.parse(localStorage.getItem("falaknurse_inquiries") || "[]");
      setNurseInquiries(list.filter(i => i.email.toLowerCase() === nurseForm.email.toLowerCase()));
      
      setTimeout(() => {
        setFormFeedback("");
      }, 5000);
    } else {
      setFormFeedback("Error submitting. Please try again.");
    }
  };

  const handleFetchHistory = (e) => {
    const email = e.target.value;
    setInboxFilterEmail(email);
    const list = JSON.parse(localStorage.getItem("falaknurse_inquiries") || "[]");
    if (email.trim() === "") {
      setNurseInquiries(list);
    } else {
      setNurseInquiries(list.filter(i => i.email.toLowerCase() === email.toLowerCase()));
    }
  };

  // -------------------------------------------------------------
  // MEDICINES FILTERING & SEARCH METRICS
  // -------------------------------------------------------------
  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    medicines.forEach(m => {
      if (m.group) cats.add(m.group);
    });
    return Array.from(cats).sort();
  }, [medicines]);

  const filteredMedicinesList = useMemo(() => {
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    
    return medicines.filter(med => {
      // 1. Text Search matching
      if (keywords.length > 0) {
        const nameMatch = med.name.toLowerCase();
        const codeMatch = String(med.code).toLowerCase();
        const groupMatch = med.group ? med.group.toLowerCase() : "";
        
        const matchesAll = keywords.every(kw => 
          nameMatch.includes(kw) || 
          codeMatch.includes(kw) || 
          groupMatch.includes(kw)
        );
        
        if (!matchesAll) return false;
      }
      
      // 2. Category matching
      if (selectedCategory !== "all" && med.group !== selectedCategory) {
        return false;
      }
      
      // 3. Price matching
      if (maxPrice !== Infinity && med.mrp > maxPrice) {
        return false;
      }

      return true;
    });
  }, [medicines, searchQuery, selectedCategory, maxPrice]);

  // Filtered articles list matching home global lookup or specific tab query
  const filteredArticlesList = useMemo(() => {
    if (!searchQuery) return articles;
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    
    return articles.filter(art => {
      const titleMatch = art.title.toLowerCase();
      const summaryMatch = art.summary.toLowerCase();
      const contentMatch = art.content.toLowerCase();
      
      return keywords.some(kw => 
        titleMatch.includes(kw) || 
        summaryMatch.includes(kw) || 
        contentMatch.includes(kw)
      );
    });
  }, [articles, searchQuery]);

  // Navigate directly to medicines tab with selected category
  const navigateToCategory = (cat) => {
    setSelectedCategory(cat);
    setActiveTab("medicines");
  };

  // -------------------------------------------------------------
  // RENDER INTERACTION
  // -------------------------------------------------------------
  return (
    <>
      {/* 1. Header Toolbar */}
      <header className="app-header">
        <div className="logo-container" onClick={() => setActiveTab("home")} style={{ cursor: "pointer" }}>
          <span className="logo-icon">
            <Activity size={24} strokeWidth={2.5} />
          </span>
          <span className="logo-text">{t("appTitle")}</span>
        </div>
        
        <div className="header-controls">
          <button 
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Globe size={14} />
            <span>{language === "en" ? "हिन्दी" : "EN"}</span>
          </button>
          
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* 2. Main Scrollable Dashboard Content */}
      <main className="main-content">
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", height: "300px", justifyContent: "center", alignItems: "center", gap: "12px", color: "var(--primary)" }}>
            <Activity size={32} style={{ animation: "pulse 1.2s infinite alternate" }} />
            <p style={{ fontWeight: 600 }}>Loading Indian Health Portal Catalog...</p>
          </div>
        ) : (
          <div className="tabs-view-scroller">
            
            {/* ==================== TAB 1: HOME ==================== */}
            {activeTab === "home" && (
              <div>
                <div className="home-banner">
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.45rem", lineHeight: 1.25, color: "var(--primary)" }}>
                    {t("slogan")}
                  </h2>
                  <p style={{ marginTop: "6px", fontSize: "0.85rem" }}>
                    {t("tagline")}
                  </p>
                  
                  {/* Home Global Search bar */}
                  <div className="home-search-wrapper">
                    <input 
                      type="text" 
                      className="search-input-field" 
                      placeholder={t("searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="search-icon-svg">
                      <Stethoscope size={18} />
                    </div>
                  </div>
                </div>

                {/* Portal Stats Bar */}
                <div className="live-badge-row">
                  <div className="live-counter-pill">
                    <span className="live-dot"></span>
                    <span>{activeVisitors} {t("liveUsers")}</span>
                  </div>

                  <div className="sync-status-pill">
                    <ShieldCheck size={14} />
                    <span>{isLiveServer ? t("syncStatusLive") : t("syncStatusLocal")}</span>
                  </div>
                </div>

                {/* Search Quick Match Results Banner */}
                {searchQuery.trim() !== "" && (
                  <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--primary)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "0.95rem", color: "var(--primary)", display: "flex", justifyBetween: "center", alignItems: "center", gap: "6px" }}>
                      <Activity size={14} /> Quick Matches for "{searchQuery}"
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                      <button 
                        className="calc-btn-action primary"
                        style={{ padding: "8px", fontSize: "0.8rem" }}
                        onClick={() => setActiveTab("medicines")}
                      >
                        Search Catalog ({filteredMedicinesList.length} Medicines)
                      </button>
                      <button 
                        className="calc-btn-action"
                        style={{ padding: "8px", fontSize: "0.8rem" }}
                        onClick={() => setActiveTab("articles")}
                      >
                        Read Articles ({filteredArticlesList.length} Matching Topics)
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Access Dashboard */}
                <h3 style={{ marginBottom: "14px", fontSize: "1.1rem" }}>{t("quickAccess")}</h3>
                <div className="quick-actions-grid">
                  <div className="action-card med" onClick={() => { setActiveTab("medicines"); setSelectedCategory("all"); }}>
                    <div className="action-icon-box">
                      <Pill size={20} />
                    </div>
                    <span className="action-title">{t("medicines")}</span>
                  </div>
                  
                  <div className="action-card calc" onClick={() => setActiveTab("calculator")}>
                    <div className="action-icon-box">
                      <Calculator size={20} />
                    </div>
                    <span className="action-title">{t("calculator")}</span>
                  </div>

                  <div className="action-card art" onClick={() => setActiveTab("articles")}>
                    <div className="action-icon-box">
                      <BookOpen size={20} />
                    </div>
                    <span className="action-title">{t("articles")}</span>
                  </div>

                  <div className="action-card help" onClick={() => setActiveTab("emergency")}>
                    <div className="action-icon-box">
                      <ShieldAlert size={20} />
                    </div>
                    <span className="action-title">{t("emergency")}</span>
                  </div>
                </div>

                {/* Portal Features / Value Proposition */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ color: "var(--primary)", marginTop: "4px" }}><ShieldCheck size={20} /></div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem" }}>{t("evidenceTitle")}</h4>
                      <p style={{ fontSize: "0.8rem", marginTop: "2px" }}>{t("evidenceDesc")}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ color: "var(--primary)", marginTop: "4px" }}><Activity size={20} /></div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem" }}>{t("confTitle")}</h4>
                      <p style={{ fontSize: "0.8rem", marginTop: "2px" }}>{t("confDesc")}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ color: "var(--primary)", marginTop: "4px" }}><PhoneCall size={20} /></div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem" }}>{t("commTitle")}</h4>
                      <p style={{ fontSize: "0.8rem", marginTop: "2px" }}>{t("commDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 2: MEDICINES ==================== */}
            {activeTab === "medicines" && (
              <div>
                {/* Search query input */}
                <div className="home-search-wrapper" style={{ marginBottom: "16px" }}>
                  <input 
                    type="text" 
                    className="search-input-field" 
                    placeholder={t("searchMed")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="search-icon-svg">
                    <Pill size={18} />
                  </div>
                </div>

                {/* Categories Pill Scroller */}
                <div className="category-scroller">
                  <button 
                    className={`category-pill-btn ${selectedCategory === "all" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    {t("catAll")}
                  </button>
                  {uniqueCategories.map(cat => (
                    <button 
                      key={cat}
                      className={`category-pill-btn ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                      title={cat}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Price Range Filter Slider */}
                <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px" }}>
                    <span>{t("filterPrice")} {maxPrice === Infinity ? t("noLimit") : maxPrice}</span>
                    {maxPrice !== Infinity && (
                      <button 
                        style={{ border: "none", background: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 700 }}
                        onClick={() => setMaxPrice(Infinity)}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="150" 
                    value={maxPrice === Infinity ? 150 : maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === "150" ? Infinity : Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>

                {/* Count display */}
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px", display: "flex", justifyBetween: "center" }}>
                  <span>
                    {t("resultsCount")
                      .replace("{count}", filteredMedicinesList.length)
                      .replace("{total}", medicines.length)}
                  </span>
                </div>

                {/* Medicine Items List */}
                <div className="med-list-container">
                  {filteredMedicinesList.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
                      <AlertTriangle size={32} style={{ color: "var(--warning)", marginBottom: "12px" }} />
                      <h4 style={{ marginBottom: "4px" }}>{t("noMedicines")}</h4>
                      <p style={{ fontSize: "0.8rem", marginBottom: 0 }}>{t("refineSearch")}</p>
                    </div>
                  ) : (
                    // Load top 100 on page for fluid mobile performance
                    filteredMedicinesList.slice(0, 100).map(med => (
                      <MedicineCard 
                        key={med.srNo}
                        medicine={med}
                        isBookmarked={bookmarks.some(b => b.srNo === med.srNo)}
                        isAddedToCalc={calculator.some(c => c.srNo === med.srNo)}
                        onBookmarkToggle={handleBookmarkToggle}
                        onAddToCalc={handleAddToCalculator}
                        onClick={() => setSelectedMedicine(med)}
                        searchQuery={searchQuery}
                        t={t}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB 3: HEALTH ARTICLES ==================== */}
            {activeTab === "articles" && (
              <div>
                {selectedArticle ? (
                  // Full Article View
                  <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "20px", boxShadow: "var(--card-shadow)" }}>
                    <button 
                      className="lang-toggle-btn"
                      style={{ marginBottom: "16px" }}
                      onClick={() => setSelectedArticle(null)}
                    >
                      {t("backToArticles")}
                    </button>
                    
                    <div className="article-cat-tag">{selectedArticle.category}</div>
                    <h2 style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: 800, marginBottom: "8px", color: "var(--primary)" }}>
                      {selectedArticle.title}
                    </h2>
                    
                    <div className="article-meta-lbl" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
                      <span>{t("author")}: <strong>{selectedArticle.author}</strong></span>
                      <span>•</span>
                      <span>{selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.readTime}</span>
                    </div>

                    {/* Rendering raw markdown content safely as simple blocks */}
                    <div style={{ fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "12px", whiteSpace: "pre-line" }}>
                      {selectedArticle.content}
                    </div>
                  </div>
                ) : (
                  // Articles list view
                  <div>
                    <div className="home-search-wrapper" style={{ marginBottom: "20px" }}>
                      <input 
                        type="text" 
                        className="search-input-field" 
                        placeholder={t("searchArticles")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="search-icon-svg">
                        <BookOpen size={18} />
                      </div>
                    </div>

                    <div className="article-scroller-vertical">
                      {filteredArticlesList.map(art => (
                        <div 
                          key={art.id} 
                          className="article-card-item"
                          onClick={() => setSelectedArticle(art)}
                        >
                          <div className="article-body-details">
                            <span className="article-cat-tag">{art.category}</span>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "4px 0" }}>{art.title}</h3>
                            <p style={{ fontSize: "0.8rem", margin: "6px 0", textOverflow: "ellipsis", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                              {art.summary}
                            </p>
                            <div className="article-meta-lbl">
                              <span>{art.readTime}</span>
                              <span>•</span>
                              <span>{art.author}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 4: CALCULATOR ==================== */}
            {activeTab === "calculator" && (
              <div>
                {calculator.length === 0 ? (
                  <div style={{ padding: "60px 20px", textAlign: "center", backgroundColor: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", color: "var(--text-muted)" }}>
                      <Calculator size={30} />
                    </div>
                    <h3 style={{ fontSize: "1.15rem", marginBottom: "6px" }}>{t("emptyCalc")}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "20px" }}>
                      {t("emptyCalcDesc")}
                    </p>
                    <button 
                      className="calc-btn-action primary" 
                      onClick={() => setActiveTab("medicines")}
                      style={{ maxWidth: "200px", margin: "0 auto" }}
                    >
                      {t("medicines")}
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Savings Summary Banner */}
                    <div className="calc-summary-panel">
                      <div className="calc-summary-row">
                        <div>
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700" }}>{t("monthlySavings")}</span>
                          <div className="calc-summary-stat-val">₹{calcMetrics.monthlySavings.toFixed(2)}</div>
                        </div>
                        <span className="calc-savings-badge">
                          {calcMetrics.savingsPercent.toFixed(0)}% Saved
                        </span>
                      </div>

                      <div className="calc-summary-row" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "12px" }}>
                        <div>
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700" }}>{t("annualSavings")}</span>
                          <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>₹{calcMetrics.annualSavings.toFixed(2)}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.9 }}>{t("genericCostTotal")}</span>
                          <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>₹{calcMetrics.genericTotal.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Visual Progress bar representing discount ratio */}
                      <div className="calc-savings-progress">
                        <div 
                          className="calc-savings-progress-bar" 
                          style={{ width: `${calcMetrics.savingsPercent}%` }}
                        ></div>
                      </div>
                      
                      <div style={{ fontSize: "0.65rem", textAlign: "center", opacity: 0.85 }}>
                        * {t("costSavedTxt")}
                      </div>
                    </div>

                    {/* Prescription List items */}
                    <div className="calc-list-items-box">
                      {calculator.map(item => (
                        <div key={item.srNo} className="calc-card-item">
                          <div className="calc-item-details">
                            <div className="calc-item-title">{item.name}</div>
                            <div className="calc-item-pricing-label">
                              ₹{item.mrp.toFixed(2)} x {item.qty} = <strong>₹{(item.mrp * item.qty).toFixed(2)}</strong>
                            </div>
                          </div>

                          <div className="calc-item-controls">
                            <button 
                              className="calc-item-qty-btn"
                              onClick={() => updateCalculatorQty(item.srNo, -1)}
                            >
                              -
                            </button>
                            <span className="calc-item-qty-val">{item.qty}</span>
                            <button 
                              className="calc-item-qty-btn"
                              onClick={() => updateCalculatorQty(item.srNo, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Calculator actions */}
                    <div className="calc-action-buttons-row">
                      <button 
                        className="calc-btn-action" 
                        onClick={clearCalculator}
                      >
                        <Trash2 size={16} />
                        <span>{t("clearList")}</span>
                      </button>

                      <button 
                        className="calc-btn-action primary" 
                        onClick={printCalculatorSummary}
                      >
                        <Printer size={16} />
                        <span>{t("printSummary")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 5: SAFETY EMERGENCY HELP ==================== */}
            {activeTab === "emergency" && (
              <div>
                {/* Emergency red alert flag warning banner */}
                <div className="emergency-red-alert-banner">
                  <h3>
                    <AlertTriangle size={18} />
                    <span>{t("emergencyBannerTitle")}</span>
                  </h3>
                  <p>{t("emergencyBannerDesc")}</p>
                </div>

                {/* Quick Call Emergency Helplines Directory */}
                <div className="helplines-directory">
                  {helplines.map((hl, i) => (
                    <a 
                      key={i}
                      href={`tel:${hl.number}`} 
                      className="helpline-card-item"
                    >
                      <div className="helpline-phone-icon-box">
                        <PhoneCall size={18} />
                      </div>
                      <div className="helpline-content-block">
                        <div className="helpline-card-name">{hl.name}</div>
                        <div className="helpline-card-desc">{hl.description}</div>
                      </div>
                      <div className="helpline-card-num">{hl.number}</div>
                    </a>
                  ))}
                </div>

                {/* WhatsApp Chat link */}
                <div className="whatsapp-chat-button-row">
                  <a 
                    href="https://wa.me/919999999999?text=Hello%20FalakNurse,%20I%20have%20a%20health%20query" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="whatsapp-chat-btn-link"
                  >
                    <span>💬 {t("whatsappBtn")}</span>
                  </a>
                  <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {t("whatsappDesc")}
                  </p>
                </div>

                {/* Dosage, Storage, Red Flags Accordion Drawer */}
                <div className="details-accordion-wrapper">
                  <div className="accordion-details-card">
                    <button 
                      className="accordion-header-btn"
                      onClick={() => setOpenAccordion(openAccordion === "dosage" ? null : "dosage")}
                    >
                      <span>💡 {t("accDosageTitle")}</span>
                      {openAccordion === "dosage" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordion === "dosage" && (
                      <div className="accordion-content-panel">
                        <p style={{ fontSize: "0.8rem", margin: 0 }}>{t("accDosageDesc")}</p>
                      </div>
                    )}
                  </div>

                  <div className="accordion-details-card">
                    <button 
                      className="accordion-header-btn"
                      onClick={() => setOpenAccordion(openAccordion === "storage" ? null : "storage")}
                    >
                      <span>📦 {t("accStorageTitle")}</span>
                      {openAccordion === "storage" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordion === "storage" && (
                      <div className="accordion-content-panel">
                        <p style={{ fontSize: "0.8rem", margin: 0 }}>{t("accStorageDesc")}</p>
                      </div>
                    )}
                  </div>

                  <div className="accordion-details-card">
                    <button 
                      className="accordion-header-btn"
                      onClick={() => setOpenAccordion(openAccordion === "redflags" ? null : "redflags")}
                    >
                      <span>🚨 {t("accRedFlagsTitle")}</span>
                      {openAccordion === "redflags" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordion === "redflags" && (
                      <div className="accordion-content-panel">
                        <p style={{ fontSize: "0.8rem", margin: 0 }}>{t("accRedFlagsDesc")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ask a Nurse Question Form Panel */}
                <div className="safety-form-panel">
                  <h3>{t("safetyFormTitle")}</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                    {t("safetyFormDesc")}
                  </p>

                  <form onSubmit={handleNurseFormSubmit}>
                    <div className="safety-form-group">
                      <label>{t("nameLbl")}</label>
                      <input 
                        type="text" 
                        name="name"
                        className="safety-form-field-input" 
                        value={nurseForm.name}
                        onChange={handleNurseFormChange}
                        required
                      />
                    </div>

                    <div className="safety-form-group">
                      <label>{t("emailLbl")}</label>
                      <input 
                        type="email" 
                        name="email"
                        className="safety-form-field-input" 
                        value={nurseForm.email}
                        onChange={handleNurseFormChange}
                        required
                      />
                    </div>

                    <div className="safety-form-group">
                      <label>{t("queryLbl")}</label>
                      <textarea 
                        name="queryText"
                        rows="3"
                        className="safety-form-field-textarea" 
                        value={nurseForm.queryText}
                        onChange={handleNurseFormChange}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="safety-form-submit-btn">
                      {t("submitBtn")}
                    </button>
                  </form>

                  {formFeedback && (
                    <div style={{ marginTop: "12px", fontSize: "0.8rem", fontWeight: "700", color: "var(--primary)", textAlign: "center" }}>
                      {formFeedback}
                    </div>
                  )}
                </div>

                {/* Submitted Nurse Inquiry Inbox History */}
                <div className="inquiry-inbox-section">
                  <h3 style={{ fontSize: "1rem", marginBottom: "8px" }}>{t("inboxTitle")}</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    {t("inboxDesc")}
                  </p>

                  {/* Mail history fetch field input */}
                  <div style={{ marginBottom: "16px" }}>
                    <input 
                      type="email" 
                      className="safety-form-field-input" 
                      placeholder="Enter email to view query inbox history..."
                      value={inboxFilterEmail}
                      onChange={handleFetchHistory}
                    />
                  </div>

                  {nurseInquiries.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      No queries found under this email. Submit a question above to see history!
                    </div>
                  ) : (
                    nurseInquiries.map(inq => (
                      <div key={inq.id} className="inquiry-card-item">
                        <div className="inquiry-header-row">
                          <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>
                            {new Date(inq.timestamp).toLocaleDateString()}
                          </span>
                          <span className={`inquiry-status-tag ${inq.status === "Answered" ? "answered" : "pending"}`}>
                            {inq.status === "Answered" ? t("answeredStatus") : t("pendingStatus")}
                          </span>
                        </div>
                        <div className="inquiry-question-text">
                          Q: {inq.queryText}
                        </div>
                        
                        <div className="inquiry-nurse-response-block">
                          <div className="inquiry-nurse-response-lbl">
                            👩‍⚕️ {t("nurseResponseLabel")}
                          </div>
                          <div>{inq.nurseResponse}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* 3. Bottom Mobile Tabs Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => { setActiveTab("home"); setSelectedArticle(null); }}
        >
          <Home size={20} />
          <span>{t("home")}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === "medicines" ? "active" : ""}`}
          onClick={() => { setActiveTab("medicines"); setSelectedArticle(null); }}
        >
          <Pill size={20} />
          <span>{t("medicines")}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === "articles" ? "active" : ""}`}
          onClick={() => { setActiveTab("articles"); setSelectedArticle(null); }}
        >
          <BookOpen size={20} />
          <span>{t("articles")}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === "calculator" ? "active" : ""}`}
          onClick={() => { setActiveTab("calculator"); setSelectedArticle(null); }}
        >
          <Calculator size={20} />
          {calculator.length > 0 && (
            <span className="nav-badge">{calculator.length}</span>
          )}
          <span>{t("calculator")}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === "emergency" ? "active" : ""}`}
          onClick={() => { setActiveTab("emergency"); setSelectedArticle(null); }}
        >
          <ShieldAlert size={20} />
          <span>{t("emergency")}</span>
        </button>
      </nav>

      {/* 4. Medicine Details Modal Portal */}
      {selectedMedicine && (
        <DetailModal 
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          onAddToCalc={handleAddToCalculator}
          isAddedToCalc={calculator.some(c => c.srNo === selectedMedicine.srNo)}
          t={t}
        />
      )}
    </>
  );
}

export default App;
