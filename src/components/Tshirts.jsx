// src/components/Tshirt.jsx
import React, { useEffect, useState } from 'react';
import { Link }                    from 'react-router-dom';
import { Swiper, SwiperSlide }     from 'swiper/react';
import SwiperCore, { Navigation }  from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Jacket.css';      // or rename to shared CSS
import { fetchProducts }           from '../api/products';
import { fetchCategories }         from '../api/categories';

SwiperCore.use([Navigation]);

export default function Tshirt() {
  const [tsCatId, setTsCatId] = useState('');
  const [subs, setSubs]       = useState([]);
  const [selSub, setSelSub]   = useState('');
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // 1) Load “T-Shirt” category + subcats
  useEffect(() => {
    (async () => {
      try {
        const { data: cats } = await fetchCategories();
        const tsh = cats.find(c => c.name.toLowerCase() === 't-shirt');
        if (!tsh) throw new Error('T-Shirt category not found');
        setTsCatId(tsh._id);
        setSubs(tsh.subcategories);
        await loadProducts(tsh._id, '');
      } catch (e) {
        console.error(e);
        setError(e.message);
        setLoading(false);
      }
    })();
  }, []);

  // 2) Fetch products by category & optional subcategory
  async function loadProducts(catId, subId) {
    setLoading(true);
    try {
      const { data } = await fetchProducts({ category: catId, subcategory: subId });
      setItems(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load T-shirts');
    } finally {
      setLoading(false);
    }
  }

  // 3) Filter handler
  const onFilterClick = subId => {
    setSelSub(subId);
    loadProducts(tsCatId, subId);
  };

  if (loading) return <p className="text-center">Loading T-shirts…</p>;
  if (error)   return <p className="text-center text-danger">{error}</p>;

  return (
    <section className="hd-section">
      <div className="hd-header">
        <div className="hd-title-wrap">
          <h2 className="hd-title">T-SHIRTS</h2>
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
        {items.map((prod, idx) => {
          const imgUrl = prod.images?.[0]
            ? `http://localhost:5000${prod.images[0]}`
            : require('../assets/images/product-1.png');
          const finalPrice =
            prod.discount > 0
              ? (prod.price * (1 - prod.discount / 100)).toFixed(2)
              : prod.price.toFixed(2);

          return (
            <SwiperSlide key={prod._id}>
              {/* Wrap your card in Link */}
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
                        <strong>₹{finalPrice}</strong>
                      </>
                    ) : (
                      <strong>₹{prod.price}</strong>
                    )}
                  </p>
                </div>
              </Link>
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
