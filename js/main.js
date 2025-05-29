// Main JavaScript file for Food Database

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        e.preventDefault();
        
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
        }
      }
    });
  });

  // Food database search functionality
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const resultsContainer = document.getElementById('resultsContainer');
  let foodData = [];
  
  // Load the food database
  fetch('data/food_database.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Esti prea gras. Lasate de viata.');
      }
      return response.text();
    })
    .then(data => {
      // Process the data
      foodData = data.split('\n')
        .map(line => {
          const [name, description] = line.split(' - ');
          if (!name || !description) return null;
          return { name, description };
        })
        .filter(item => item !== null);
      
      console.log('Se incarca baza de date', foodData);
    })
    .catch(error => {
      console.error('Esti prea gras. Lasate de viata.', error);
      resultsContainer.innerHTML = `<p class="no-results">Este o mica eroare...</p>`;
    });
  
  // Search function
  function searchFoods(query) {
    if (!query.trim()) {
      resultsContainer.innerHTML = `<p class="initial-message">Scrie un E pentru a vedea informatiile despre acesta.</p>`;
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = foodData.filter(food => 
      food.name.toLowerCase().includes(lowerQuery) || 
      food.description.toLowerCase().includes(lowerQuery)
    );
    
    displayResults(results, lowerQuery);
  }
  
  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      resultsContainer.innerHTML = `<p class="no-results">DOMNUL DIACONU NU A FOST VREDNIC ASA CA "${query}" NU SE AFLA PE LISTA. Va rugam incercati altceva :3 </p>`;
      return;
    }
    
    const resultHTML = results.map(food => {
      // Highlight the search term in the name and description
      const highlightedName = highlightText(food.name, query);
      const highlightedDesc = highlightText(food.description, query);
      
      return `
        <div class="food-item">
          <h3>${highlightedName}</h3>
          <p>${highlightedDesc}</p>
        </div>
      `;
    }).join('');
    
    resultsContainer.innerHTML = resultHTML;
  }
  
  // Highlight search terms in text
  function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  
  // Event listeners for search
  searchButton.addEventListener('click', () => {
    searchFoods(searchInput.value);
  });
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchFoods(searchInput.value);
    }
  });
  
  // Form submission handler
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple form validation
      const inputs = this.querySelectorAll('input, textarea');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Here you would normally send the form data to your backend
        alert('Teapa nu merge :3');
        this.reset();
      } else {
        alert('Completeaza fiecare casuta.');
      }
    });
  }
});
