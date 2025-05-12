export default function FilterSection({ title, children }) {
    return (
      <div className="filter-section">
        {/* use h3 to match AllProductsPage.css */}
        <h3 className="filter-title">{title}</h3>
        <div className="filter-options">{children}</div>
      </div>
    );
  }
  