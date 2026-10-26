/** Inline <script> / <style> blocks of the theme's section-banner.php, verbatim, in template order. */
export const SCRIPTS: string[] = [

];

export const STYLES: string[] = [
  "\n    .ptb-20{\n        padding-top: 20px;\n        padding-bottom: 20px;\n    }\n    .banner-content{\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n    .banner-content p{\n        margin-bottom: 0px;\n    }\n    .cta-gif img{\n        width:  60px;\n        height:  auto;\n        object-fit: cover;\n    }\n    .teacher-choice img{\n        width: 180px;\n        height:auto;\n        object-fit: cover;\n    }\n    .cta-content{\n        text-align: center;\n    }\n    .cta-content .cta-title{\n        font-weight: 700;\n        color: #ffffff ;\n    }\n\n    .cta-content .cta-subtitle{\n        color: #ffffff;\n    }\n\n    .cta-btn{\n        background: #D4951A;\n        padding: 12px 24px;\n        font-size: 12px;\n        border-radius: 10px;\n    }\n    .cta-btn:hover{\n        color: #000000;\n    }\n    .banner-cta-btn{\n        display: flex;\n        justify-content: right;\n    }\n\n    @media(max-width: 545px){\n\n        .teacher-choice{\n            display: none;\n        }\n        .banner-cta-btn{\n            display:none;\n        }\n        .banner-content {\n            flex-direction: column;\n        }\n    }\n\n",
];
