/**
 * TEFL shop — native port of the theme's page-tefl-shop.php (/tefl-shop/).
 *
 * Same markup as the PHP template, including its `calss="ast-container"`
 * typo. A product card's content is built as one HTML string because a
 * variable product's card ends with WooCommerce's variations form
 * (wc-add-to-cart-variation drives it), which has no wrapper of its own. Data: wordpress/headless/native/page-tefl-shop.php.
 */
import { esc, H, type OverviewsBase } from "./shared";

type Buttons =
  | { kind: "cart"; cart: string }
  | { kind: "voucher"; cart: string }
  | { kind: "extension"; link: string }
  | { kind: "form"; html: string }
  | null;

interface ShopCard {
  title: string;
  from: string | null;
  image: string;
  description: string;
  note: string;
  additional: string;
  bookmark: string;
  sample_pdf: string;
  buttons: Buttons;
}

export interface TeflShopData extends OverviewsBase {
  hero: { image: string; title: string; subtitle: string };
  symbol: string;
  callback: string;
  featured: ShopCard[];
  delivery: string[][];
  products: ShopCard[];
  resources: ShopCard[];
  article: { image: string; title: string; description: string; link: string };
}

const ANGLE = '<i class="fa fa-angle-right"></i>';

export default function TeflShop({ data }: { data: TeflShopData }) {
  const { hero, article } = data;
  // React prints the template's misspelt attribute as-is.
  const calss = { calss: "ast-container" } as Record<string, string>;

  return (
    <>
      <section className="banner-section" style={{ backgroundImage: `url('${hero.image}')` }}>
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col" />
          </div>
        </div>
      </section>

      <section className="header-section">
        <div {...calss}>
          <div className="ast-row">
            <div className="ast-col-lg-7">
              <H as="h1" html={hero.title} />
              <H as="p" html={hero.subtitle} />
            </div>
          </div>
        </div>
      </section>

      <section className="filter-section">
        <div {...calss}>
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <ul className="list">
                <li>Filter</li>
                <li>
                  <a href="#certificates">Certificates</a>
                </li>
                <li>
                  <a href="#extensions">Extensions</a>
                </li>
                <li>
                  <a href="#resume-service">Resume Service</a>
                </li>
                <li>
                  <a href="#reference-letter">Reference Letter</a>
                </li>
                <li>
                  <a href="#gift-card">Gift Card</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-section">
        <div {...calss}>
          <div className="ast-row grid-section-row">
            {data.featured.map((c, i) => (
              <div key={i} className="ast-col-lg-6">
                <H className="product-card" html={cardHtml(c, data, "featured")} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="delivery-section" style={{ display: "none" }}>
        <div {...calss}>
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <h2>Delivery information</h2>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Delivery</th>
                    <th scope="col">UK</th>
                    <th scope="col">Europe</th>
                    <th scope="col">USA</th>
                    <th scope="col">Rest of the World</th>
                    <th scope="col">Tracking Number?</th>
                  </tr>
                </thead>
                <tbody>
                  {data.delivery.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, k) => (
                        <H key={k} as="td" html={cell} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-section">
        <div {...calss}>
          <div className="ast-row grid-section-row">
            {data.products.map((c, i) => (
              <div key={i} className="ast-col-lg-6">
                <H className="product-card" id={c.bookmark} html={cardHtml(c, data, "products")} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="resources-section">
        <div {...calss}>
          <h3>Teaching Resources</h3>

          <div className="ast-row resources-section-row">
            {data.resources.map((c, i) => (
              <div key={i} className="ast-col-lg-6">
                <H className="product-card" id={c.bookmark} html={cardHtml(c, data, "resources")} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="article-container" style={{ backgroundImage: `url('${article.image}')` }}>
                <div className="article-container-content">
                  <H as="h3" html={article.title} />
                  <H as="p" html={article.description} />
                  <a className="blog-link" href={article.link}>
                    Read the Blog <i className="fa fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** The inside of one `.product-card`, as the template prints it for that list. */
function cardHtml(c: ShopCard, data: TeflShopData, list: "featured" | "products" | "resources"): string {
  const out: string[] = [`<h2>${c.title}</h2>`];
  if (c.from !== null) out.push(`<h3>From ${data.symbol}${c.from}</h3>`);
  const pdf = list === "resources" && c.sample_pdf ? `<a href="${esc(c.sample_pdf)}" data-lity></a>` : "";
  out.push(`<div class="image" style="background-image: url('${esc(c.image)}');">${pdf}</div>`);
  if (list === "featured") {
    out.push(
      `<div class="product-card-description">${c.description}\n<p class="small">${c.note}</p>` +
        (c.additional ? `\n<div class="additional_information">${c.additional}</div>` : "") +
        `</div>`,
    );
  } else {
    out.push(`<div class="product-card-description">${c.description}${c.note ? `<p class="small">${c.note}</p>` : ""}</div>`);
  }
  const b = c.buttons;
  const buttons = (inner: string, extra = "") =>
    `<div class="banner-buttons-container"><div class="banner-buttons${extra}">${inner}</div></div>`;
  if (b) {
    if (b.kind === "form") out.push(b.html);
    else if (b.kind === "extension")
      out.push(buttons(`<a href="${esc(b.link)}">purchase study extension ${ANGLE}</a>`, " course-extension-button"));
    else
      out.push(
        buttons(
          `<a href="${esc(data.callback)}">Ask us a question ${ANGLE}</a>\n` +
            `<a href="${esc(b.cart)}">${b.kind === "voucher" ? "Choose your Voucher" : "Add to Cart"} ${ANGLE}</a>`,
        ),
      );
  }
  return out.join("\n");
}
