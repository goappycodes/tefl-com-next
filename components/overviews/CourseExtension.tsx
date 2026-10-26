/**
 * Course extensions — native port of the theme's ti-course-extension.php
 * (/course-extensions/). Same markup as the PHP template.
 * Data: wordpress/headless/native/ti-course-extension.php.
 */
import { H, type OverviewsBase } from "./shared";

export interface CourseExtensionData extends OverviewsBase {
  products: { title: string; image: string; link: string; price: string }[];
}

export default function CourseExtension({ data }: { data: CourseExtensionData }) {
  return (
    <div id="primary" className="content-area primary">
      <section className="extension-products">
        <h1 className="section-heading">
          TEFL INSTITUTE <strong>COURSE EXTENSIONS</strong>
        </h1>
        <h4 className="section-subheadig">
          Sometimes things out of your control can delay studying.
          <br />
          We can extend your course – you choose how long for!
        </h4>
        <div className="ast-row">
          {data.products.map((p, i) => (
            <div key={i} className="ast-col-md-4 product-card__wrapper">
              <div className="product-card">
                <a href={p.link} className="clickbox" />
                <div className="product-card__image">
                  <img src={p.image} alt="" />
                </div>
                <div className="product-card__details">
                  <H as="h3" className="product-card__title" html={p.title} />
                  <H as="span" className="product-card__price" html={p.price} />
                </div>
              </div>
              <a href={p.link} className="btn btn-black">
                Add to cart
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
