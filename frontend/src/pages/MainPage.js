import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";

// Currency code → country code for flag images (using CDN)
const CURRENCY_COUNTRY = {
  USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", AUD: "au",
  CAD: "ca", CHF: "ch", CNY: "cn", INR: "in", LKR: "lk",
  SGD: "sg", MYR: "my", AED: "ae", SAR: "sa", PKR: "pk",
  BDT: "bd", THB: "th", IDR: "id", PHP: "ph", KRW: "kr",
  HKD: "hk", TWD: "tw", MXN: "mx", BRL: "br", ZAR: "za",
  NGN: "ng", EGP: "eg", KES: "ke", GHS: "gh", TZS: "tz",
  NOK: "no", SEK: "se", DKK: "dk", PLN: "pl", CZK: "cz",
  HUF: "hu", RON: "ro", TRY: "tr", RUB: "ru", UAH: "ua",
  NZD: "nz", ARS: "ar", CLP: "cl", COP: "co", PEN: "pe",
  VND: "vn", IQD: "iq", KWD: "kw", BHD: "bh", OMR: "om",
  QAR: "qa", JOD: "jo", ILS: "il", MAD: "ma", DZD: "dz",
  AFN: "af", ALL: "al", AMD: "am", ANG: "an", AOA: "ao",
  AWG: "aw", AZN: "az", BAM: "ba", BBD: "bb", BMD: "bm",
  BND: "bn", BOB: "bo", BSD: "bs", BTN: "bt", BWP: "bw",
  BYN: "by", BZD: "bz", CDF: "cd", CRC: "cr", CUP: "cu",
  CVE: "cv", DJF: "dj", DOP: "do", ERN: "er", ETB: "et",
  FJD: "fj", FKP: "fk", FOK: "fo", GEL: "ge", GGP: "gg",
  GIP: "gi", GMD: "gm", GNF: "gn", GTQ: "gt", GYD: "gy",
  HNL: "hn", HRK: "hr", HTG: "ht", IMP: "im", IRR: "ir",
  ISK: "is", JEP: "je", JMD: "jm", KGS: "kg", KHR: "kh",
  KID: "ki", KMF: "km", KPW: "kp", KYD: "ky", KZT: "kz",
  LAK: "la", LBP: "lb", LRD: "lr", LSL: "ls", LYD: "ly",
  MDL: "md", MGA: "mg", MKD: "mk", MMK: "mm", MNT: "mn",
  MOP: "mo", MRU: "mr", MUR: "mu", MVR: "mv", MWK: "mw",
  MZN: "mz", NAD: "na", NIO: "ni", NPR: "np", NTD: "tw",
  PAB: "pa", PGK: "pg", PYG: "py", RSD: "rs", RWF: "rw",
  SBD: "sb", SCR: "sc", SDG: "sd", SHP: "sh", SLE: "sl",
  SOS: "so", SRD: "sr", SSP: "ss", STN: "st", SYP: "sy",
  SZL: "sz", TJS: "tj", TMT: "tm", TND: "tn", TOP: "to",
  TTD: "tt", TUV: "tv", UGS: "ug", UYU: "uy", UZS: "uz",
  VUV: "vu", WST: "ws", XAF: "cm", XCD: "ag", XOF: "bj",
  XPF: "pf", YER: "ye", ZMW: "zm", ZWL: "zw",
};

const getFlagUrl = (code) => {
  const country = CURRENCY_COUNTRY[code];
  if (!country) return null;
  return `https://flagcdn.com/w40/${country}.png`;
};

// Custom searchable dropdown component
function CurrencySelect({ value, onChange, currencies, placeholder, label }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = Object.keys(currencies).filter((c) =>
    `${c} ${currencies[c]}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectedName = value ? currencies[value] : null;
  const flagUrl = getFlagUrl(value);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>

      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer text-left flex items-center gap-3"
      >
        <div className="flex-shrink-0 w-7 h-5 flex items-center justify-center">
          {flagUrl
            ? <img src={flagUrl} alt={value} className="w-7 h-5 object-cover rounded-sm" />
            : <span className="text-slate-400 text-lg">🏳️</span>
          }
        </div>
        <span className={selectedName ? "text-white flex-1" : "text-slate-400 flex-1"}>
          {selectedName ? `${value} - ${selectedName}` : placeholder}
        </span>
        <span className="flex-shrink-0">
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No results found</p>
            ) : (
              filtered.map((c) => {
                const url = getFlagUrl(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition text-left ${value === c ? "bg-emerald-500/20 text-emerald-400" : "text-white"}`}
                  >
                    <div className="flex-shrink-0 w-7 h-5 flex items-center justify-center">
                      {url
                        ? <img src={url} alt={c} className="w-7 h-5 object-cover rounded-sm" />
                        : <span className="text-base">🏳️</span>
                      }
                    </div>
                    <span className="font-medium">{c}</span>
                    <span className="text-slate-400 truncate flex-1">{currencies[c]}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MainPage() {
  const [date, setDate] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [amountInSourceCurrency, setAmountInSourceCurrency] = useState("");
  const [amountInTargetCurrency, setAmountInTargetCurrency] = useState(null);
  const [currencyNames, setCurrencyNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAmountInTargetCurrency(null);
    try {
      const response = await axios.get("http://localhost:5000/convert", {
        params: { date, sourceCurrency, targetCurrency, amountInSourceCurrency },
      });
      setAmountInTargetCurrency(response.data);
    } catch (err) {
      console.error(err);
      setError("Conversion failed. Please check your inputs or server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // Reset all form fields and result
    setDate("");
    setSourceCurrency("");
    setTargetCurrency("");
    setAmountInSourceCurrency("");
    setAmountInTargetCurrency(null);
    setError("");
  };

  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
    setAmountInTargetCurrency(null);
  };

  useEffect(() => {
    const getCurrencyNames = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getAllCurrencies");
        const data = response.data;
        setCurrencyNames(data);
      } catch (err) {
        console.error(err);
      }
    };
    getCurrencyNames();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            CurVo-Currency Converter
          </span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-4 w-full">
          {/* Hero */}
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Convert Your Currency Today
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              Welcome to Convert Your Currency Today 🌍💱<br />
              Quickly and easily convert currencies with real-time exchange rates.
              Simple, fast, and reliable — start converting in seconds! ✨
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                {/* Row 1: Date + Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Exchange Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount to Convert</label>
                    <input
                      type="number"
                      value={amountInSourceCurrency}
                      onChange={(e) => setAmountInSourceCurrency(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: From + Swap + To */}
                <div className="flex items-end gap-3 mb-5">
                  <div className="flex-1">
                    <CurrencySelect
                      label="From"
                      value={sourceCurrency}
                      onChange={setSourceCurrency}
                      currencies={currencyNames}
                      placeholder="Select Currency"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-12 h-12 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-400 flex items-center justify-center transition-all hover:scale-105 mb-0.5 flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>

                  <div className="flex-1">
                    <CurrencySelect
                      label="To"
                      value={targetCurrency}
                      onChange={setTargetCurrency}
                      currencies={currencyNames}
                      placeholder="Select Currency"
                    />
                  </div>
                </div>

                {/* Submit Button - Only show when no result */}
                {amountInTargetCurrency === null && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Converting...
                      </span>
                    ) : (
                      "Get the Target Currency →"
                    )}
                  </button>
                )}

                {/* Refresh Button - Only show when result exists */}
                {amountInTargetCurrency !== null && (
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    New Conversion
                  </button>
                )}
              </form>

              {/* Error */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Result - without flags */}
              {amountInTargetCurrency !== null && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-slate-300 text-sm text-center mb-2">
                    {amountInSourceCurrency} {sourceCurrency} =
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-center text-emerald-400">
                    {Number(amountInTargetCurrency).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} <span className="text-white text-lg">{targetCurrency}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-t border-white/10">
            <p className="text-slate-400 text-sm">CurVo © 2026 CurVo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}