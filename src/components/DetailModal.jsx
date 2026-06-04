import React from "react";
import { X, ShieldAlert, BadgeInfo, Scale, ShoppingCart } from "lucide-react";

const DetailModal = ({ medicine, onClose, onAddToCalc, isAddedToCalc, t, language }) => {
  if (!medicine) return null;

  // Approximate branded medicine price calculation (Generic is ~15%-25% of branded market alternatives)
  const genericPrice = medicine.mrp;
  const brandedMin = genericPrice * 2.5;
  const brandedMax = genericPrice * 8;
  const averageSavings = ((brandedMin + brandedMax) / 2) - genericPrice;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-row">
          <h2>{t("medDetails")}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-section">
          <div className="modal-field-block">
            <div className="modal-field-lbl">{t("genericName")}</div>
            <div className="modal-field-val" style={{ fontSize: "1.1rem", color: "var(--primary)" }}>
              {medicine.name}
            </div>
          </div>

          <div className="modal-field-block">
            <div className="modal-field-lbl">{t("saltCategory")}</div>
            <div className="modal-field-val">{medicine.group || "N/A"}</div>
          </div>

          <div className="modal-field-block" style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <div className="modal-field-lbl">{t("packSize")}</div>
              <div className="modal-field-val">{medicine.unit}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="modal-field-lbl">{t("drugCode")}</div>
              <div className="modal-field-val">#{medicine.code}</div>
            </div>
          </div>

          <div className="modal-field-block" style={{ borderBottom: "2px solid var(--primary)", paddingBottom: "16px" }}>
            <div className="modal-field-lbl" style={{ color: "var(--primary)", fontWeight: "bold" }}>
              {t("genericMrp")}
            </div>
            <div className="modal-field-val" style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--primary)", fontFamily: "var(--font-display)" }}>
              ₹{genericPrice.toFixed(2)}
            </div>
          </div>

          {/* Cost Savings Estimate Card */}
          <div className="modal-savings-card-alert">
            <div style={{ color: "var(--primary)", marginTop: "2px" }}>
              <Scale size={20} />
            </div>
            <div>
              <h4>{t("saveTitle")} ₹{averageSavings.toFixed(0)}*</h4>
              <p>{t("saveDesc").replace("{min}", Math.round(brandedMin)).replace("{max}", Math.round(brandedMax))}</p>
            </div>
          </div>

          {/* Usage, Warnings & Safety Information */}
          <div className="modal-field-block">
            <div className="modal-field-lbl" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <BadgeInfo size={14} /> {t("indicLbl")}
            </div>
            <p style={{ fontSize: "0.85rem", marginTop: "4px", marginBottom: 0, fontWeight: "600", color: "var(--text)" }}>
              {language === "hi" ? medicine.usecaseHindi : medicine.usecase}
            </p>
          </div>

          <div className="modal-field-block">
            <div className="modal-field-lbl" style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--warning)" }}>
              <ShieldAlert size={14} /> {t("warningLbl")}
            </div>
            <p style={{ fontSize: "0.85rem", marginTop: "4px", marginBottom: 0 }}>
              {t("warningVal")}
            </p>
          </div>
        </div>

        <button 
          className={`med-add-calc-btn ${isAddedToCalc ? "added" : ""}`}
          onClick={() => {
            onAddToCalc(medicine);
          }}
          style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "var(--radius-md)" }}
        >
          <ShoppingCart size={16} />
          {isAddedToCalc ? t("addedToCalc") : t("addToCalc")}
        </button>
      </div>
    </div>
  );
};

export default DetailModal;
