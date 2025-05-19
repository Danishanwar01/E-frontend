import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Jacket.css';

import { fetchProducts } from '../api/products';
import { fetchCategories } from '../api/categories';

SwiperCore.use([Navigation]);

export default function Shirt() {
  const [subs, setSubs] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [selectedSub, setSelectedSub] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const location = useLocation();

  // Reload items when navigating back
  useEffect(() => {
    if (categoryId) loadItems(selectedSub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Load shirt category ID and subcategories
  useEffect(() => {
    (async () => {
      try {
        const { data: cats } = await fetchCategories();
        const shirtCat = cats.find(c => c.name.toLowerCase() === 'shirt');
        if (!shirtCat) throw new Error('Shirt category not found');
        setCategoryId(shirtCat._id);
        setSubs(shirtCat.subcategories);
      } catch (e) {
        console.error(e);
        setError('Failed to load categories');
        setLoading(false);
      }
    })();
  }, []);

  // Fetch items based on subcategory
  const loadItems = async (subId) => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const params = { category: categoryId };
      if (subId && subId !== 'all') params.subcategory = subId;
      const { data } = await fetchProducts(params);
      setItems(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load shirts');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (categoryId) loadItems('all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleFilter = (subId) => {
    if (selectedSub === subId) return;
    setSelectedSub(subId);
    loadItems(subId);
  };

  if (loading) return <p className="text-center">Loading…</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <section className="hd-section">
      <div className="hd-header">
        <div className="hd-title-wrap">
          <h2 className="hd-title">SHIRTS</h2>
          <div className="hd-underline" />
        </div>
        <div className="hd-filters">
          <button
            className={`hd-filter ${selectedSub === 'all' ? 'hd-filter--active' : ''}`}
            onClick={() => handleFilter('all')}
          >
            All
          </button>
          {subs.map(sub => (
            <button
              key={sub._id}
              className={`hd-filter ${selectedSub === sub._id ? 'hd-filter--active' : ''}`}
              onClick={() => handleFilter(sub._id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      <div className="hd-swiper-wrapper">
        <button ref={prevRef} className="hd-prev">&#8592;</button>
        <button ref={nextRef} className="hd-next">&#8594;</button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={4}
          onSwiper={swiper => {
            swiperRef.current = swiper;
            setTimeout(() => {
              if (
                swiperRef.current &&
                prevRef.current &&
                nextRef.current &&
                swiperRef.current.navigation
              ) {
                swiperRef.current.params.navigation.prevEl = prevRef.current;
                swiperRef.current.params.navigation.nextEl = nextRef.current;
                swiperRef.current.navigation.destroy();
                swiperRef.current.navigation.init();
                swiperRef.current.navigation.update();
              }
            }, 0);
          }}
          breakpoints={{
            320:  { slidesPerView: 2 },
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {items.map((prod, idx) => {
            const imgUrl = prod.images?.[0]
              ? `http://localhost:5000${prod.images[0]}`
              : require('../assets/images/product-1.png');
            return (
              <SwiperSlide key={prod._id}>
                <Link to={`/product/${prod._id}`} className="hd-card">
                  <div className="hd-image-wrap">
                    <img src={imgUrl} alt={prod.title} className="hd-image" />
                    <span className="hd-index">0{idx + 1}</span>
                  </div>
                  <div className="hd-info">
                    <h3 className="hd-name">{prod.title}</h3>
                    <p className="hd-price">
                      {prod.discount > 0 ? (
                        <>
                          <del>₹{prod.price}</del>{' '}
                          <strong>
                            ₹
                            {(
                              prod.price *
                              (1 - prod.discount / 100)
                            ).toFixed(2)}
                          </strong>
                        </>
                      ) : (
                        <strong>₹{prod.price.toFixed(2)}</strong>
                      )}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
