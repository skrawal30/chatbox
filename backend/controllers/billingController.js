"use strict";

const billing = require("../services/billingService");
const usage = require("../services/usageService");

function baseUrl(req) {
  const configured = String(process.env.WEBSITE_URL || "").trim().replace(/\/+$/, "");
  return configured || `${req.protocol}://${req.get("host")}`;
}

async function checkout(req, res) {
  try {
    const email = String((req.body && req.body.email) || "").trim().slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }
    const url = await billing.createCheckout(email, baseUrl(req));
    res.json({ success: true, url });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Unable to start checkout." });
  }
}

async function confirm(req, res) {
  try {
    const claims = await billing.confirmSession(String(req.query.session_id || ""));
    usage.issueProCookie(req, res, claims);
    res.json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Unable to confirm payment." });
  }
}

module.exports = { checkout, confirm };
