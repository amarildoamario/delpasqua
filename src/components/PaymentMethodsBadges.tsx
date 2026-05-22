"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function PaymentMethodsBadges({ 
  className = "",
  dark = false,
  collapsible = false
}: { 
  className?: string;
  dark?: boolean;
  collapsible?: boolean;
}) {
  const t = useTranslations("Common.footer.bottom");
  const [isExpanded, setIsExpanded] = useState(false);

  const cardBaseClass = `flex px-3.5 h-8 items-center justify-center rounded-md transition-all shadow-sm ${
    dark 
      ? "bg-[#0d0d0d] hover:bg-[#141414] border-0" 
      : "border border-neutral-200 bg-white hover:border-neutral-300"
  }`;

  const expandedCardClass = `${cardBaseClass} animate-in fade-in zoom-in-95 duration-200`;

  return (
    <div className={className}>
      <p className={`text-center text-[10px] uppercase tracking-widest mb-4.5 ${dark ? "text-stone-500 font-medium" : "text-neutral-400"}`}>
        {t("secure_payments")}
      </p>

      {/* Reduced spacing for collapsible/product view: gap-2 md:gap-2.5 (8px-10px) */}
      <div className={`flex flex-wrap items-center justify-center transition-all duration-300 ${collapsible ? "gap-2 md:gap-2.5" : "gap-6 md:gap-7"}`}>
        
        {/* ========================================================= */}
        {/* ALWAYS VISIBLE: Mastercard, Visa, Revolut, PayPal, Sepa   */}
        {/* ========================================================= */}

        {/* Visa */}
        <div className={cardBaseClass} title="Visa">
          <svg role="img" viewBox="0 0 24 24" height="13" fill={dark ? "white" : "#142663"} xmlns="http://www.w3.org/2000/svg">
            <title>Visa</title>
            <path d="M21.9 5.1H18c-.6 0-1.1.3-1.4.9l-5.6 12.9h3.7l.7-2.1h4.5l.4 2.1H24L21.9 5.1zM16.1 13.9l1.9-5.1 1.1 5.1h-3zm-9.3-8.8H3.1L0 18.9h3.6l4.3-10.2c.1-.3.2-.5.5-.6.3-.2.6-.2.8-.2l3.4.1L8.8 18.9h3.7L18.1 5.1H14.5L11.7 13.9 10 5.1H6.8z"/>
          </svg>
        </div>

        {/* Mastercard */}
        <div className={cardBaseClass} title="Mastercard">
          <svg role="img" viewBox="0 0 24 24" height="20" xmlns="http://www.w3.org/2000/svg">
            <title>MasterCard</title>
            <path
              d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.31 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416z"
              fill="#EB001B"
            />
            <path
              d="M12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z"
              fill="#FF5F00"
            />
          </svg>
        </div>

        {/* Revolut */}
        <div className={cardBaseClass} title="Revolut">
          <svg role="img" viewBox="0 0 24 24" height="18" fill={dark ? "white" : "black"} xmlns="http://www.w3.org/2000/svg">
            <title>Revolut</title>
            <path d="M20.9133 6.9566C20.9133 3.1208 17.7898 0 13.9503 0H2.424v3.8605h10.9782c1.7376 0 3.177 1.3651 3.2087 3.043.016.84-.2994 1.633-.8878 2.2324-.5886.5998-1.375.9303-2.2144.9303H9.2322a.2756.2756 0 0 0-.2755.2752v3.431c0 .0585.018.1142.052.1612L16.2646 24h5.3114l-7.2727-10.094c3.6625-.1838 6.61-3.2612 6.61-6.9494zM6.8943 5.9229H2.424V24h4.4704z" />
          </svg>
        </div>

        {/* PayPal */}
        <div className={cardBaseClass} title="PayPal">
          <svg role="img" viewBox="0 0 24 24" height="18" xmlns="http://www.w3.org/2000/svg">
            <title>PayPal</title>
            <path
              d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86"
              fill="#003087"
            />
            <path
              d="M13.604 17.052h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686 c0 3.41-3.01 6.853-6.958 6.853"
              fill="#009CDE"
            />
            <path d="M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" fill="#012169" />
          </svg>
        </div>

        {/* SEPA */}
        <div className={cardBaseClass} title="Bonifico SEPA">
          <span className={`font-extrabold text-[11px] tracking-tight italic ${dark ? "text-blue-400" : "text-[#0055A5]"}`}>SEPA</span>
          <span className={`ml-1 flex h-3 w-3 items-center justify-center rounded-full text-[7px] font-bold text-white ${dark ? "bg-blue-400" : "bg-[#0055A5]"}`}>€</span>
        </div>

        {/* ========================================================= */}
        {/* COLLAPSED OTHERS: shown only when expanded                */}
        {/* ========================================================= */}
        {(!collapsible || isExpanded) && (
          <>
            {/* Apple Pay */}
            <div className={expandedCardClass} title="Apple Pay">
              <svg role="img" viewBox="0 0 24 24" height="18" fill={dark ? "white" : "black"} xmlns="http://www.w3.org/2000/svg">
                <title>Apple Pay</title>
                <path d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z" />
              </svg>
            </div>

            {/* Google Pay */}
            <div className={expandedCardClass} title="Google Pay">
              <svg role="img" viewBox="0 0 24 24" height="14" fill={dark ? "white" : "black"} className="mr-1" xmlns="http://www.w3.org/2000/svg">
                <title>Google</title>
                <path d="M12.24 10.285V14.4h6.887C18.2 16.57 15.645 18 12.24 18c-4.32 0-7.854-3.535-7.854-7.857s3.534-7.857 7.854-7.857c2.345 0 4.137.95 5.378 2.14l3.228-3.228C18.845.895 15.825 0 12.24 0 5.48 0 0 5.48 0 12.24c0 6.758 5.48 12.24 12.24 12.24 7.07 0 11.758-4.975 11.758-11.96 0-.81-.08-1.585-.24-2.235H12.24z" />
              </svg>
              <span className={`text-[10px] font-bold ${dark ? "text-stone-300" : "text-neutral-700"}`}>Pay</span>
            </div>

            {/* American Express */}
            <div className={expandedCardClass} title="American Express">
              <svg role="img" viewBox="0 0 24 24" height="15" fill={dark ? "white" : "#006fcf"} xmlns="http://www.w3.org/2000/svg">
                <title>American Express</title>
                <path d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5.5 15.5H3.1l2.4-7h2.4l2.4 7H7.9l-.6-1.8H4.7l-.6 1.8zm8.5 0h-3.9V8.5h3.9V10h-2.4v1.2h2.1V13h-2.1v1.3h2.4v1.2zm7.6 0h-2.1l-1.4-2.5-1.4 2.5h-2.1l2.3-4.1-2.1-3.9h2.1l1.2 2.3 1.2-2.3h2.1l-2.1 3.9 2.3 4.1z" />
              </svg>
            </div>

            {/* Klarna */}
            <div className={expandedCardClass} title="Klarna">
              <span className="font-extrabold text-[#ffb3c6] text-[10px] tracking-wider italic">Klarna.</span>
            </div>

            {/* Shop Pay */}
            <div className={expandedCardClass} title="Shop Pay">
              <span className={`font-black text-[11px] tracking-tight ${dark ? "text-[#9672ff]" : "text-[#5a31f4]"}`}>shop</span>
              <span className={`ml-0.5 font-bold text-[11px] tracking-tight ${dark ? "text-stone-200" : "text-neutral-700"}`}>Pay</span>
            </div>

            {/* iDEAL */}
            <div className={expandedCardClass} title="iDEAL">
              <span className={`font-black text-[11px] tracking-tight ${dark ? "text-[#ff4da6]" : "text-[#cc0066]"}`}>iDEAL</span>
            </div>

            {/* Bancontact */}
            <div className={expandedCardClass} title="Bancontact">
              <span className="font-extrabold text-[10px] tracking-tight text-yellow-500">Ban</span>
              <span className="font-bold text-[10px] tracking-tight text-blue-500">contact</span>
            </div>

            {/* Sofort */}
            <div className={expandedCardClass} title="Sofort">
              <span className="font-extrabold text-[#ff5b00] text-[10px] tracking-tight uppercase">Sofort.</span>
            </div>

            {/* EPS */}
            <div className={expandedCardClass} title="EPS">
              <span className="font-black text-[11px] tracking-tighter text-[#0066b2]">eps</span>
            </div>

            {/* Giropay */}
            <div className={expandedCardClass} title="Giropay">
              <span className={`font-bold text-[10px] tracking-tight ${dark ? "text-stone-300" : "text-blue-900"}`}>giro</span>
              <span className="font-extrabold text-[10px] tracking-tight text-blue-500">pay</span>
            </div>

            {/* UnionPay */}
            <div className={expandedCardClass} title="UnionPay">
              <span className="font-extrabold text-[10px] tracking-tight text-[#00478b]">Union</span>
              <span className="font-extrabold text-[10px] tracking-tight text-[#ff3333]">Pay</span>
            </div>

            {/* Alipay */}
            <div className={expandedCardClass} title="Alipay">
              <span className="font-extrabold text-[11px] tracking-tight text-[#00a0e9]">Alipay</span>
            </div>

            {/* WeChat Pay */}
            <div className={expandedCardClass} title="WeChat Pay">
              <span className="font-extrabold text-[9.5px] tracking-tight text-[#09b83e]">WeChat Pay</span>
            </div>
          </>
        )}
      </div>

      {collapsible && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-50/50 px-3.5 py-1.5 text-[10px] font-medium tracking-wide text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900 transition-all select-none shadow-sm cursor-pointer"
          >
            {isExpanded ? "Vedi meno" : "Vedi altri metodi"}
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}