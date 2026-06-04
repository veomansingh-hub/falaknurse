import React from "react";
import { Star, Plus, Check } from "lucide-react";

// Helper to highlight matching text query keywords safely
const HighlightText = ({ text, query }) => {
  if (!text) return "";
  if (!query) return <span>{text}</span>;
  
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return <span>{text}</span>;
  
  // Escape regex characters and create a capturing regex pattern
  const escapedKeywords = keywords.map(kw => kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
  
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="highlight-match-mark">{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const MedicineCard = ({ 
  medicine, 
  isBookmarked, 
  isAddedToCalc, 
  onBookmarkToggle, 
  onAddToCalc, 
  onClick, 
  searchQuery,
  t 
}) => {
  return (
    <div 
      className="medicine-card-item"
      onClick={onClick}
    >
      <div>
        <div className="med-card-header">
          <span className="med-drug-code">
            {t("codeAbbr")}: {medicine.code}
          </span>
          <button 
            className={`med-fav-btn ${isBookmarked ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle(medicine);
            }}
            aria-label="Toggle Favorite"
          >
            <Star size={18} fill={isBookmarked ? "#fbbf24" : "none"} />
          </button>
        </div>

        <h3 className="med-card-title">
          <HighlightText text={medicine.name} query={searchQuery} />
        </h3>

        <div className="med-meta-row">
          <span style={{ fontSize: "0.75rem" }}>
            {t("pack")}: {medicine.unit}
          </span>
          <span className="med-group-tag" title={medicine.group}>
            <HighlightText text={medicine.group} query={searchQuery} />
          </span>
        </div>
      </div>

      <div className="med-card-footer">
        <div className="med-price-box">
          <span className="med-price-lbl">{t("genericPrice")}</span>
          <span className="med-price-val">₹{medicine.mrp.toFixed(2)}</span>
        </div>

        <button 
          className={`med-add-calc-btn ${isAddedToCalc ? "added" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCalc(medicine);
          }}
          aria-label="Toggle Savings Calculator"
        >
          {isAddedToCalc ? (
            <span style={{ display: "flex", alignItems: "center", gap: "2px" }}><Check size={14} /> {t("addedTag")}</span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: "2px" }}><Plus size={14} /> {t("addBtn")}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
