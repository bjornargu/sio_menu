document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch data
    function fetchData() {
      const url = 'https://www.siost.hiof.no/spisesteder/ukens-meny';  // Replace with the actual URL
  
      fetch(url)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
  
          // Check if the element exists before trying to access its innerText
          const element = doc.querySelector('#xpm1577079665');
          if (element) {
            const data = element.innerText;
            document.getElementById('content').innerText = data;
          } else {
            document.getElementById('content').innerText = 'Element not found.';
            console.error('Error: Element with id="xpm1577079665" not found.');
          }
        })
        .catch(error => {
          console.error('Error fetching the page:', error);
          document.getElementById('content').innerText = 'Failed to fetch data.';
        });
    }
  
    // Automatically fetch data when the popup is opened
    fetchData();
  
    // Add event listener to the refresh button
    document.getElementById('refreshData').addEventListener('click', fetchData);
  });
  