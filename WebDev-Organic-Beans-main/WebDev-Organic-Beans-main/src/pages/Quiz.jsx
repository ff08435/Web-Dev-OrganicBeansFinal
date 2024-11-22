// src/pages/Quiz.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const [answers, setAnswers] = useState({
    flavor: '',
    roast: '',
    caffeine: '',
    body: ''
  });
  const [recommendation, setRecommendation] = useState(null);

  const coffeeBeans = [
    { name: "Ethiopian Beans", flavor: "Fruity", roast: "Medium", caffeine: "Caffeinated", body: "Light" },
    { name: "Guatemalan Dark Roast", flavor: "Cocoa", roast: "Dark", caffeine: "Caffeinated", body: "Bold" },
    { name: "Colombian Decaf", flavor: "Rich", roast: "Medium", caffeine: "Decaffeinated", body: "Smooth" },
    { name: "Organic Sumatran Beans", flavor: "Earthy", roast: "Medium-Dark", caffeine: "Caffeinated", body: "Bold" }
  ];

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    let bestMatch = null;
    let maxMatches = 0;
  
    coffeeBeans.forEach((bean) => {
      let matches = 0;
  
      if (bean.flavor === answers.flavor) matches++;
      if (bean.roast === answers.roast) matches++;
      if (bean.caffeine === answers.caffeine) matches++;
      if (bean.body === answers.body) matches++;
  
      // Update bestMatch only if this bean has more matches than the current best
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = bean;
      }
    });
  
    // If no matches found, show a "No matching coffee" message
    if (!bestMatch || maxMatches === 0) {
      setRecommendation("No matching coffee found. Try adjusting your preferences.");
    } else {
      setRecommendation(bestMatch);
    }
  };
  
    

  return (
    <div className="quiz-page">
      <h1>Find Your Perfect Coffee Bean</h1>
      <form className="quiz-form" onSubmit={handleSubmit}>
        <label>What type of flavor do you prefer?</label>
        <select name="flavor" onChange={handleAnswerChange} required>
          <option value="">Select...</option>
          <option value="Fruity">Fruity</option>
          <option value="Cocoa">Cocoa</option>
          <option value="Rich">Rich</option>
          <option value="Earthy">Earthy</option>
        </select>

        <label>What level of roast do you prefer?</label>
        <select name="roast" onChange={handleAnswerChange} required>
          <option value="">Select...</option>
          <option value="Medium">Medium</option>
          <option value="Dark">Dark</option>
          <option value="Medium-Dark">Medium-Dark</option>
        </select>

        <label>Do you prefer caffeinated or decaffeinated coffee?</label>
        <select name="caffeine" onChange={handleAnswerChange} required>
          <option value="">Select...</option>
          <option value="Caffeinated">Caffeinated</option>
          <option value="Decaffeinated">Decaffeinated</option>
        </select>

        <label>How do you like the body of your coffee?</label>
        <select name="body" onChange={handleAnswerChange} required>
          <option value="">Select...</option>
          <option value="Light">Light and smooth</option>
          <option value="Bold">Bold and full-bodied</option>
        </select>

        <button type="submit">Get Recommendation</button>
      </form>

      {recommendation && (
        <div className="recommendation">
          <h2>We recommend:</h2>
          {typeof recommendation === "string" ? (
            <p>{recommendation}</p>
          ) : (
            <div>
              <Link
                to={`/beans?name=${encodeURIComponent(recommendation.name)}`}
                className="recommendation-link"
              >
                <h3>{recommendation.name}</h3>
              </Link>
              <p>{recommendation.description || "Discover more about this coffee!"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;