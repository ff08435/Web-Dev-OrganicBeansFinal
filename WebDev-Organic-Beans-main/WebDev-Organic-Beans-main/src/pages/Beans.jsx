import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import './Beans.css';

// Import images from the pages folder
import EthiopianBeansImage from './Ethiopian.jpeg';
import GuatemalanDarkRoastImage from './Ethiopian.jpeg';
import ColombianDecafImage from './Ethiopian.jpeg';
import SumatranBeansImage from './Ethiopian.jpeg';

const CoffeeSelection = () => {
  const scrollContainer = useRef(null); // Added scroll container reference
  const sectionRefs = {
    "Organic Ethiopian Beans": useRef(null),
    "Guatemalan Dark Roast": useRef(null),
    "Colombian Decaf": useRef(null),
    "Organic Sumatran Beans": useRef(null),
  };

  const location = useLocation();

  // Handle URL-based scrolling when search query changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
      const matchingSection = Object.keys(sectionRefs).find((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingSection && sectionRefs[matchingSection].current) {
        sectionRefs[matchingSection].current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.search]);

  // Handle adding items to cart
  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("Please log in first.", { autoClose: 3000 });
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product: item }),
      });

      if (response.ok) {
        toast.success(`${item.name} added to cart!`, { autoClose: 3000 });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to add item to cart.", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred. Please try again.", { autoClose: 3000 });
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!scrollContainer.current) return; // Ensure the container is defined

      const currentScrollPosition = scrollContainer.current.scrollLeft;
      const containerWidth = scrollContainer.current.offsetWidth;

      if (e.key === "ArrowRight") {
        // Scroll to the next section
        scrollContainer.current.scrollTo({
          left: currentScrollPosition + containerWidth,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowLeft") {
        // Scroll to the previous section
        scrollContainer.current.scrollTo({
          left: currentScrollPosition - containerWidth,
          behavior: "smooth",
        });
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={scrollContainer} className="scroll-container"> {/* Attach scrollContainer ref */}
      {/* Coffee Bean #1 */}
      <div ref={sectionRefs["Organic Ethiopian Beans"]} className="scroll-item section-1">
        <div className="coffee-image">
          <img src={EthiopianBeansImage} alt="Organic Ethiopian Beans" />
        </div>
        <div className="coffee-description">
          <h2>Organic Ethiopian Beans</h2>
          <p>Our Ethiopian beans offer a rich, complex flavor profile with fruity and floral notes.</p>
          <p>Origin: Ethiopia | Roast: Medium | Flavor: Fruity, Floral</p>
          <div className="buttons">
            <button
              className="btn"
              onClick={() =>
                handleAddToCart({
                  productId: "1",
                  name: "Organic Ethiopian Beans",
                  price: 15.99,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Coffee Bean #2 */}
      <div ref={sectionRefs["Guatemalan Dark Roast"]} className="scroll-item section-2">
        <div className="coffee-image">
          <img src={GuatemalanDarkRoastImage} alt="Guatemalan Dark Roast" />
        </div>
        <div className="coffee-description">
          <h2>Guatemalan Dark Roast</h2>
          <p>This dark roast Guatemalan coffee is bold and smoky with a hint of cocoa.</p>
          <p>Origin: Guatemala | Roast: Dark | Flavor: Cocoa, Smoky</p>
          <div className="buttons">
            <button
              className="btn"
              onClick={() =>
                handleAddToCart({
                  productId: "2",
                  name: "Guatemalan Dark Roast",
                  price: 12.99,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Coffee Bean #3 */}
      <div ref={sectionRefs["Colombian Decaf"]} className="scroll-item section-3">
        <div className="coffee-image">
          <img src={ColombianDecafImage} alt="Colombian Decaf" />
        </div>
        <div className="coffee-description">
          <h2>Colombian Decaf</h2>
          <p>Enjoy the full-bodied flavor of Colombian coffee without the caffeine.</p>
          <p>Origin: Colombia | Roast: Medium | Flavor: Rich, Smooth</p>
          <div className="buttons">
            <button
              className="btn"
              onClick={() =>
                handleAddToCart({
                  productId: "3",
                  name: "Colombian Decaf",
                  price: 14.99,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Coffee Bean #4 */}
      <div ref={sectionRefs["Organic Sumatran Beans"]} className="scroll-item section-4">
        <div className="coffee-image">
          <img src={SumatranBeansImage} alt="Organic Sumatran Beans" />
        </div>
        <div className="coffee-description">
          <h2>Organic Sumatran Beans</h2>
          <p>Known for their earthy, bold flavor, our Sumatran beans offer a full-bodied experience.</p>
          <p>Origin: Sumatra | Roast: Medium-Dark | Flavor: Earthy, Spicy</p>
          <div className="buttons">
            <button
              className="btn"
              onClick={() =>
                handleAddToCart({
                  productId: "4",
                  name: "Organic Sumatran Beans",
                  price: 13.99,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSelection;
