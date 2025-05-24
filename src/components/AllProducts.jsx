// src/pages/AllProductsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { fetchCategories } from '../api/categories';
import Loader from '../components/Loader';
import '../styles/AllProductsPage.css';

export default function AllProductsPage() {
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [state, setState] = useState({
    products: [],
    filtered: [],
    categories: [],
    isLoading: true,
    error: null
  });

  const [filters, setFilters] = useState({
    category: '',
    gender: [],
    size: []
  });

  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // 1) Load products & categories, initialize filters from URL
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);

        const params = new URLSearchParams(location.search);
        const catParam = params.get('category') || '';
        let genderParam = (params.get('gender') || '').trim().toLowerCase();
        genderParam = genderParam
          ? genderParam[0].toUpperCase() + genderParam.slice(1)
          : '';

        setState({
          products: prodRes.data,
          filtered: prodRes.data,
          categories: catRes.data,
          isLoading: false,
          error: null
        });

        setFilters({
          category: catParam,
          gender: genderParam ? [genderParam] : [],
          size: []
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || 'Failed to load products'
        }));
      }
    };

    loadData();
  }, [location.search]);

  // 2) Apply filters & sorting whenever products, filters, or sortOrder change
  useEffect(() => {
    let tmp = [...state.products];

    // 2a) Filter by category (use optional chaining)
    if (filters.category) {
      tmp = tmp.filter(p => p.category?._id === filters.category);
    }

    // 2b) Filter by gender (compare to subcategory.name)
    if (filters.gender.length) {
      const want = filters.gender[0].toLowerCase();
      tmp = tmp.filter(
        p => p.subcategory?.name?.toLowerCase() === want
      );
    }

    // 2c) Filter by sizes
    if (filters.size.length) {
      tmp = tmp.filter(p =>
        Array.isArray(p.sizes)
          ? p.sizes.some(sz => filters.size.includes(sz.toUpperCase()))
          : false
      );
    }

    // 2d) Apply sorting
    if (sortOrder === 'asc') {
      tmp.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      tmp.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      tmp.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    setState(prev => ({ ...prev, filtered: tmp }));
  }, [state.products, filters, sortOrder]);

  // 3) Reset to page 1 when filters or sortOrder change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOrder]);

  if (state.isLoading) return <Loader />;
  if (state.error) return <div className="error-message">{state.error}</div>;

  // 4) Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = state.filtered.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(state.filtered.length / productsPerPage);

  return (
    <div className="all-products-page">
      <header className="page-header">
        <h2>Raah Collection</h2>
        <p className="product-count">{state.filtered.length} Results</p>
      </header>

      {/* Filter/Sort Buttons (mobile) */}
      <div className="mobile-header">
        <button
          className="mobile-btn mobile-filter-btn"
          onClick={() => {
            setShowFilter(prev => !prev);
            setShowSort(false);
          }}
        >
          <span className="icon-filter">☰</span>
          <span className="btn-label">Filter</span>
        </button>

        <button
          className="mobile-btn mobile-sort-btn"
          onClick={() => {
            setShowSort(prev => !prev);
            setShowFilter(false);
          }}
        >
          <span className="icon-sort">⇅</span>
          <span className="btn-label">Sort</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilter && (
        <div className="filter-panel">
          <select
            className="dan"
            value={filters.category}
            onChange={e =>
              setFilters(f => ({ ...f, category: e.target.value }))
            }
          >
            <option value="">All Categories</option>
            {state.categories.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="dan"
            value={filters.gender[0] || ''}
            onChange={e => {
              const selected = e.target.value;
              setFilters(f => ({
                ...f,
                gender: selected ? [selected] : []
              }));
            }}
          >
            <option value="">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>

          <select
            className="dan"
            multiple
            size={5}
            value={filters.size}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(
                opt => opt.value
              );
              setFilters(f => ({ ...f, size: selected }));
            }}
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>
      )}

      {/* Sort Panel */}
      {showSort && (
        <div className="sort-panel">
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="dan"
          >
            <option value="">Sort by</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      )}

      {/* Product Grid */}
      <div className="products-grid">
        {currentProducts.length ? (
          currentProducts.map(prod => {
            const imgUrl = prod.images?.[0]
              ? `http://localhost:5000${prod.images[0]}`
              : require('../assets/images/product-1.png');

            const discountedPrice =
              prod.discount > 0
                ? (prod.price * (1 - prod.discount / 100)).toFixed(2)
                : null;

            return (
              <Link
                to={`/product/${prod._id}`}
                key={prod._id}
                className="hd-card"
              >
                <div className="hd-image-wrap">
                  <img
                    src={imgUrl}
                    alt={prod.title}
                    className="hd-image"
                  />
                </div>
                <div className="hd-info">
                  <h3 className="hd-name">{prod.title}</h3>
                  <p className="hd-price">
                    {discountedPrice ? (
                      <>
                        <del>₹{prod.price.toFixed(2)}</del>{' '}
                        <strong>₹{discountedPrice}</strong>
                      </>
                    ) : (
                      <strong>₹{prod.price.toFixed(2)}</strong>
                    )}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="no-results">
            <p>No products match your filters</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {state.filtered.length > productsPerPage && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage(prev =>
                prev < totalPages ? prev + 1 : prev
              )
            }
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
