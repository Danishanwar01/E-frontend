import React, { useState, useEffect } from 'react';
import { useLocation }                from 'react-router-dom';
import { fetchProducts }              from '../api/products';
import { fetchCategories }            from '../api/categories';
import ProductCard                    from '../components/ProductCard';
import FilterSection                  from '../components/FilterSection';
import Loader                         from '../components/Loader';
import '../styles/AllProductsPage.css';

export default function AllProductsPage() {
  const location = useLocation();
  const [state, setState]     = useState({
    products: [], filtered: [], categories: [], isLoading: true, error: null
  });
  const [filters, setFilters] = useState({
    category: '', gender: [], size: []
  });
  const [sortOrder, setSortOrder] = useState('');

  // 1) Load products & categories, then seed filters from URL
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);

        // read query params
        const params      = new URLSearchParams(location.search);
        const catParam    = params.get('category') || '';
        let   genderParam = (params.get('gender') || '').trim().toLowerCase();
        genderParam       = genderParam
          ? genderParam[0].toUpperCase() + genderParam.slice(1)
          : '';

        setState({
          products:   prodRes.data,
          filtered:   prodRes.data,
          categories: catRes.data,
          isLoading:  false,
          error:      null
        });

        setFilters({
          category: catParam,
          gender:   genderParam ? [genderParam] : [],
          size:     []
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error:     err.message || 'Failed to load products'
        }));
      }
    };

    loadData();
  }, [location.search]);

  // 2) Apply filters & sort whenever inputs change
  useEffect(() => {
    let tmp = [...state.products];

    // Category
    if (filters.category) {
      tmp = tmp.filter(p => p.category._id === filters.category);
    }

    // Gender
    if (filters.gender.length) {
      const want = filters.gender[0].toLowerCase();
      tmp = tmp.filter(p =>
        p.subcategory?.name?.toLowerCase() === want
      );
    }

    // Size
    if (filters.size.length) {
      tmp = tmp.filter(p =>
        p.sizes.some(sz => filters.size.includes(sz.toUpperCase()))
      );
    }

    // Sort
    if (sortOrder === 'asc')  tmp.sort((a,b) => a.price - b.price);
    if (sortOrder === 'desc') tmp.sort((a,b) => b.price - a.price);

    setState(prev => ({ ...prev, filtered: tmp }));
  }, [state.products, filters, sortOrder]);

  // 3) Toggle filters
  const handleFilterChange = (type, val) => {
    setFilters(f => ({
      ...f,
      [type]: Array.isArray(f[type])
        ? f[type].includes(val)
          ? f[type].filter(x => x !== val)
          : [...f[type], val]
        : val
    }));
  };

  if (state.isLoading) return <Loader />;
  if (state.error)     return <div className="error-message">{state.error}</div>;

  return (
    <div className="all-products-page">
      <header className="page-header">
        <h1>Discover Our Collection</h1>
        <p className="product-count">
          {state.filtered.length} products found
        </p>
      </header>

      <div className="layout-container">
        <aside className="filters-sidebar">
          <FilterSection title="Category">
            <select
              className="filter-select"
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {state.categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </FilterSection>

          <FilterSection title="Gender">
            {['Men','Women'].map(g => (
              <label key={g} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.gender.includes(g)}
                  onChange={() => handleFilterChange('gender', g)}
                />
                <span className="checkmark"></span>
                {g}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Size">
            {['XS','S','M','L','XL','XXL'].map(sz => (
              <label key={sz} className="filter-option size-option">
                <input
                  type="checkbox"
                  checked={filters.size.includes(sz)}
                  onChange={() => handleFilterChange('size', sz)}
                />
                <span className="size-label">{sz}</span>
              </label>
            ))}
          </FilterSection>
        </aside>

        <main className="products-main">
          <div className="sort-controls">
            <select
              className="sort-select"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          <div className="products-grid">
            {state.filtered.length > 0 ? (
              state.filtered.map(p => (
                <ProductCard key={p._id} product={p} />
              ))
            ) : (
              <div className="no-results">
                <p>No products match your filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
