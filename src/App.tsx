import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSearch, faCube } from '@fortawesome/free-solid-svg-icons';
import Card from './Components/Card';
import Fuse from 'fuse.js'; // Import fuse.js for fuzzy search

const App: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCount, setSearchCount] = useState<string>(`Latest 0 Packages`);
  const [loading,setLoading]=useState<Boolean>(true)

  useEffect(() => {
    // Fetch the last 10 packages from the API
    fetch('https://600eda693bb1d100179e04dc.mockapi.io/api/v1/packages')
      .then((response) => response.json())
      .then((data) => {
        setPackages(data);
        setSearchCount(`Latest ${data.length} Packages`);
        setLoading(false)
      });
  }, []);

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleSearch = () => {
    // Implement fuzzy search logic using fuse.js
    const fuse = new Fuse(packages, {
      keys: ['name'], // Specify the keys to search in
      includeScore: true,
      threshold: 0.4, // Adjust the threshold for fuzzy matching
    });

    const result = fuse.search(searchQuery);
    const filteredPackages = result.map((item:any) => item.item);

    setPackages(filteredPackages);
    setSearchCount(`${filteredPackages.length} Search Results: *${searchQuery}*`);
  };

  return (
    <div className="App">
      <div className='navbar'>
        <h1 className='logo-heading'>Help R-project</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by package name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className='searchButton'><FontAwesomeIcon icon={faSearch} className="fa-fw" /></button>
          <a href="#profile">
            <FontAwesomeIcon icon={faUser} className="fa-fw" />
          </a>
        </div>
      </div>
      <div className="container">
        <div className="sidebar">
          <a href="">
            <FontAwesomeIcon icon={faHome} className="fa-fw" />
          </a>
        </div>
        <div className="left-panel">
          <h2>{searchCount}</h2>
          <p>Find an R package by name, find package documentation, find R documentation, find R functions, search R source code.</p>
          {packages.length !== 0 ?
            <ul>
              {packages.map((pkg) => (
                <Card key={pkg.id} packagee={pkg} icon={faCube} onClick={() => handlePackageClick(pkg)} selected={selectedPackage?.id === pkg.id} />
              ))}
            </ul> :loading?<span className="loader"></span>:
            <img src="/assets/captainDeadpool.jpg" alt='Funny 😂... Not found😁' style={{ width: "400px" }} />
          }
        </div>
        <div className="right-panel">
          {selectedPackage && (
            <>
              <div className='search-text-color' style={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faCube} style={{ fontSize: '24px' }} />
                <h1 style={{ marginLeft: '10px', lineHeight: '24px', fontSize: '24px' }}>PACKAGE</h1>
              </div>

              <h2>{selectedPackage.name}</h2>
              <p>Version: {selectedPackage.version} </p>
              <p>License: {selectedPackage.license}</p>
              <p>Date: {selectedPackage.created_at}</p>
              <p>{selectedPackage.headline}</p>
              <p><b>Dependencies:</b> {selectedPackage.dependencies}</p>
              <p><b>Imports: </b> {selectedPackage.imports}</p>
              <p>
                <b>Authors:</b>
                {formatAuthors(selectedPackage.authors)}
              </p>
              <hr />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

interface Package {
  id: string;
  name: string;
  version: string;
  description: string;
  license: string;
  created_at: string;
  headline: string;
  dependencies: string;
  imports: string;
  authors: string;
}

function isEmailAddress(str: string) {
  return /\S+@\S+\.\S+/.test(str);
}

function formatAuthors(authors: any) {
  if (typeof authors !== 'string') {
    console.error('Authors is not a string:', authors);
    return authors; // Return the variable as is if it's not a string
  }

  const parts = authors.split(/[<>]/);
  return parts.map((part, index) => {
    if (index % 2 === 1 && isEmailAddress(part)) {
      console.log('Email address:', part);
      return <span key={index} style={{ color: 'green' }}>{`<${part}>`}</span>;
    }
    return part;
  });
}
