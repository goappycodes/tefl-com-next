/**
 * Native templates: promos (sale and campaign landing pages). Entries are
 * added here, not in ../registry.tsx. See docs/NATIVE-TEMPLATES.md.
 */
import BlackFriday2023 from "@/components/promos/BlackFriday2023";
import BlackFridayLanding from "@/components/promos/BlackFridayLanding";
import BlackFridaySalePrz from "@/components/promos/BlackFridaySalePrz";
import CouponCodes from "@/components/promos/CouponCodes";
import EarlyAccess from "@/components/promos/EarlyAccess";
import InternshipSale from "@/components/promos/InternshipSale";
import JanuaryCoursesSale from "@/components/promos/JanuaryCoursesSale";
import SalePage2026 from "@/components/promos/SalePage2026";
import TeflJanuarySale from "@/components/promos/TeflJanuarySale";
import type {
  BlackFriday2023Data,
  BlackFridayLandingData,
  BlackFridaySalePrzData, CouponCodesData, EarlyAccessData, InternshipSaleData, JanuaryCoursesSaleData, SalePage2026Data, TeflJanuarySaleData } from "@/components/promos/types";

import { template, type NativeTemplate } from "../types";

export const TEMPLATES: NativeTemplate[] = [
  // TEFL coupon codes — discount-tefl-coupon-codes.php.
  template<CouponCodesData>({
    endpoint: "discount-tefl-coupon-codes",
    match: (c) => c.has("page-template-discount-tefl-coupon-codes"),
    render: (data) => <CouponCodes d={data} />,
  }),
  // VIP early-access sign-up — early-access-black-friday-sale-prz.php.
  template<EarlyAccessData>({
    endpoint: "early-access-black-friday-sale-prz",
    match: (c) => c.has("page-template-early-access-black-friday-sale-prz"),
    render: (data) => <EarlyAccess d={data} />,
  }),
  // Black Friday / January sale — black-friday-sale-prz.php.
  template<BlackFridaySalePrzData>({
    endpoint: "black-friday-sale-prz",
    match: (c) => c.has("page-template-black-friday-sale-prz"),
    render: (data) => <BlackFridaySalePrz d={data} />,
  }),
  // January sale (2025 design) — tefl-january-sale.php.
  template<TeflJanuarySaleData>({
    endpoint: "tefl-january-sale",
    match: (c) => c.has("page-template-tefl-january-sale"),
    render: (data) => <TeflJanuarySale d={data} />,
  }),
  // Sale page (2026 design) — page-sale-new.php.
  template<SalePage2026Data>({
    endpoint: "page-sale-new",
    match: (c) => c.has("page-template-page-sale-new"),
    render: (data) => <SalePage2026 d={data} />,
  }),
  // January courses sale landing page — january-courses-sale.php.
  template<JanuaryCoursesSaleData>({
    endpoint: "january-courses-sale",
    match: (c) => c.has("page-template-january-courses-sale"),
    render: (data) => <JanuaryCoursesSale d={data} />,
  }),
  // January internships sale — january-internships-sale.php.
  template<InternshipSaleData>({
    endpoint: "january-internships-sale",
    match: (c) => c.has("page-template-january-internships-sale"),
    render: (data) => <InternshipSale d={data} variant="internships" />,
  }),
  // Black Friday internship mega sale — internship-black-friday-landing-page.php.
  template<InternshipSaleData>({
    endpoint: "internship-black-friday-landing-page",
    match: (c) => c.has("page-template-internship-black-friday-landing-page"),
    render: (data) => <InternshipSale d={data} variant="internship-bf" />,
  }),
  // TEFL course sale landing page — black-friday-landing-page.php.
  template<BlackFridayLandingData>({
    endpoint: "black-friday-landing-page",
    match: (c) => c.has("page-template-black-friday-landing-page"),
    render: (data) => <BlackFridayLanding d={data} />,
  }),
  // Accredited TEFL course sale (2023 design) — black-friday-landing-page-2023.php.
  template<BlackFriday2023Data>({
    endpoint: "black-friday-landing-page-2023",
    match: (c) => c.has("page-template-black-friday-landing-page-2023"),
    render: (data) => <BlackFriday2023 d={data} />,
  }),
];
