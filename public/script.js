const updateUI = (animals) => {
  const container = document.getElementById('animal-list');
  container.textContent = ''; 

  animals.forEach(animal => {
    const card = document.createElement('div');
    card.className = 'animal-card';

    const nameHeader = document.createElement('h3');
    nameHeader.textContent = `${animal.name} (${animal.species})`;

    const statusPara = document.createElement('p');
    statusPara.textContent = `Health: ${animal.healthStatus}`;
    
    statusPara.style.color = animal.healthStatus === 'Critical' ? 'red' : 'green';

    card.appendChild(nameHeader);
    card.appendChild(statusPara);
    container.appendChild(card);
  });
};

//  Get CSRF Token then Fetch Data
async function initZoo() {
  try {
    // Get the CSRF Token
    const csrfResponse = await fetch('/api/csrf-token');
    const { csrfToken } = await csrfResponse.json();

    // Fetch Initial Health Report
    const dataResponse = await fetch('/api/zoo/health-report');
    const report = await dataResponse.json();

    console.log('Zoo Status:', report);

    const form = document.getElementById('add-animal-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {
        name: document.getElementById('name').value,
        species: document.getElementById('species').value,
        healthStatus: document.getElementById('status').value
      };

      const saveResponse = await fetch('/api/zoo/update-animal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken // Security requirement
        },
        body: JSON.stringify(payload)
      });

      if (saveResponse.ok) {
        const result = await saveResponse.json();
        updateUI(result.data);
        form.reset();
      } else {
        alert('Failed to update: Security or Validation Error');
      }
    });

  } catch (err) {
    console.error('Initialization failed:', err);
  }
}

initZoo();