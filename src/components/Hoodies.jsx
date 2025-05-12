import React, { useEffect, useState } from 'react';
import { Link }                    from 'react-router-dom';
import { Swiper, SwiperSlide }     from 'swiper/react';
import SwiperCore, { Navigation }  from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/Hoodies.css';
import { fetchProducts }           from '../api/products';
import { fetchCategories}         from '../api/categories';

SwiperCore.use([Navigation]);

export default function Hoodies() {
  const [hoodCatId, setHoodCatId] = useState('');
  const [subs, setSubs]           = useState([]);    
  const [selSub, setSelSub]       = useState('');    
  const [hoodies, setHoodies]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // 1) Load “Hoodies” category + subcategories
  useEffect(() => {
    (async () => {
      try {
        const { data: cats } = await fetchCategories();
        const hood = cats.find(c => c.name.toLowerCase() === 'hoodies');
        if (!hood) throw new Error('Hoodies category not found');
        setHoodCatId(hood._id);
        setSubs(hood.subcategories);
        await loadProducts(hood._id, '');
      } catch (e) {
        console.error(e);
        setError(e.message);
        setLoading(false);
      }
    })();
  }, []);

  // 2) Fetch hoodies (filtered by subcategory if provided)
  async function loadProducts(categoryId, subId) {
    setLoading(true);
    try {
      const { data } = await fetchProducts({ category: categoryId, subcategory: subId });
      setHoodies(data);
    } catch {
      setError('Failed to load hoodies');
    } finally {
      setLoading(false);
    }
  }

  // 3) Sub-filter handler
  const onFilterClick = subId => {
    setSelSub(subId);
    loadProducts(hoodCatId, subId);
  };

  if (loading) return <p className="text-center">Loading hoodies…</p>;
  if (error)   return <p className="text-center text-danger">{error}</p>;

  return (
    <section className="hoodies-section">
      <div className="section-header">
        <h1 className="section-title">HOODIES</h1>
        <div className="category-filters">
          <button
            className={`filter-btn ${selSub === '' ? 'active' : ''}`}
            onClick={() => onFilterClick('')}
          >
            All
          </button>
          {subs.map(sub => (
            <button
              key={sub._id}
              className={`filter-btn ${selSub === sub._id ? 'active' : ''}`}
              onClick={() => onFilterClick(sub._id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={4}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        breakpoints={{
          320:  { slidesPerView: 1 },
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 }
        }}
      >
        {hoodies.map((prod, idx) => {
          const imgUrl = prod.images?.[0]
            ? `http://localhost:5000${prod.images[0]}`
            : require('../assets/images/product-1.png');
          const finalPrice = prod.discount > 0
            ? (prod.price * (1 - prod.discount/100)).toFixed(2)
            : prod.price.toFixed(2);

          return (
            <SwiperSlide key={prod._id}>
              {/* 1) Wrap entire card in a Link to /product/:id */}
              <Link to={`/product/${prod._id}`} className="product-card">
                <div className="image-container">
                  <img src={imgUrl} alt={prod.title} className="product-image" />
                  <span className="product-number">0{idx + 1}</span>
                </div>
                <div className="product-details">
                  <h3 className="product-title">{prod.title}</h3>
                  <p className="product-price">
                    {prod.discount > 0
                      ? <>
                          <del>₹{prod.price}</del>{' '}
                          <strong>₹{finalPrice}</strong>
                        </>
                      : <strong>₹{prod.price}</strong>
                    }
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="custom-navigation">
        <button className="custom-prev">&larr;</button>
        <button className="custom-next">&rarr;</button>
      </div>
    </section>
  );
}
