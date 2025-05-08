// src/components/Jackets.jsx
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide }   from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Jacket.css';
import { fetchProducts }          from '../api/products';
import { fetchCategories }        from '../api/categories';

SwiperCore.use([Navigation]);

export default function Jackets() {
  const [jackCatId, setJackCatId] = useState('');
  const [subs, setSubs]           = useState([]);    // Jackets subcategories
  const [selSub, setSelSub]       = useState('');    // '' = All
  const [jackets, setJackets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // 1) Load categories, find “Jackets”, store its ID & subcats
  useEffect(() => {
    (async () => {
      try {
        const { data: cats } = await fetchCategories();
        const jack = cats.find(c => c.name.toLowerCase() === 'jackets');
        if (!jack) throw new Error('Jackets category not found');
        setJackCatId(jack._id);
        setSubs(jack.subcategories);
        // initial load: all jackets
        await loadProducts(jack._id, '');
      } catch (e) {
        console.error(e);
        setError(e.message);
        setLoading(false);
      }
    })();
  }, []);

  // 2) Fetch products filtered by category & optional subcategory
  async function loadProducts(catId, subId) {
    setLoading(true);
    try {
      const { data } = await fetchProducts({ category: catId, subcategory: subId });
      setJackets(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load jackets');
    } finally {
      setLoading(false);
    }
  }

  // 3) Handler for filter buttons
  const onFilterClick = subId => {
    setSelSub(subId);
    loadProducts(jackCatId, subId);
  };

  if (loading) return <p className="text-center">Loading jackets…</p>;
  if (error)   return <p className="text-center text-danger">{error}</p>;

  return (
    <section className="hd-section">
      <div className="hd-header">
        <div className="hd-title-wrap">
          <h2 className="hd-title">JACKETS</h2>
          <div className="hd-underline" />
        </div>
        <div className="hd-filters">
          <button
            className={`hd-filter ${selSub === '' ? 'hd-filter--active' : ''}`}
            onClick={() => onFilterClick('')}
          >
            All
          </button>
          {subs.map(sub => (
            <button
              key={sub._id}
              className={`hd-filter ${selSub === sub._id ? 'hd-filter--active' : ''}`}
              onClick={() => onFilterClick(sub._id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        navigation={{ prevEl: '.hd-prev', nextEl: '.hd-next' }}
        breakpoints={{
          320:  { slidesPerView: 1 },
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 }
        }}
      >
        {jackets.map((prod, idx) => {
          const imgUrl = prod.images?.[0]
            ? `http://localhost:5000${prod.images[0]}`
            : require('../assets/images/product-1.png');
          const finalPrice = prod.discount > 0
            ? (prod.price * (1 - prod.discount/100)).toFixed(2)
            : prod.price.toFixed(2);

          return (
            <SwiperSlide key={prod._id}>
              <div className="hd-card">
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
                        <strong>₹{finalPrice}</strong>
                      </>
                    ) : (
                      <strong>₹{prod.price}</strong>
                    )}
                  </p>
                  <button className="hd-btn">Quick View</button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="hd-nav">
        <button className="hd-prev">&#8592;</button>
        <button className="hd-next">&#8594;</button>
      </div>
    </section>
  );
}
