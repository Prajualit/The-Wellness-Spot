import React, { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../footer';

const QueryPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:5000/api/submit-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, query }),
    });
    if (response.ok) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setQuery('');
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      alert("Failed to submit query. Please try again.");
    }
  } catch (err) {
    alert("An error occurred. Please try again.");
  }
};

  return (
    <div className='flex flex-col h-full'>
        <Navbar/>
        
        <div className="max-w-2xl mx-auto p-6  bg-white rounded-lg my-32 shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Have a Question for the Trainer?</h1>
      <p className="text-gray-600 text-center mb-6">Fill out the form below to get expert advice on your fitness journey.</p>
      
      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Thank you for your query! We'll get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block  text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700">
            Your Query
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Query
        </button>
      </form>
    </div>
    <Footer/>
    </div>
    
  );
};

export default QueryPage;
