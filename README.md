<html>
<body>
  <h1>CompanySearchField</h1>
  <p>The <code>CompanySearchField</code> class provides a search input field with a dropdown that populates with company suggestions based on the user's input. When a company is selected from the dropdown, the class allows you to register callback functions that will be executed with the selected company's information.</p>

  <h2>API key</h2>
  <p>To use the services provided by TheCompanyAPI, follow these steps to obtain your API key:</p>
  <ol>
    <li>Visit <a href="https://w3.thecompanyapi.io/">TheCompanyAPI</a> Website</li>
    <li>On the homepage, click the 'Get API Key' button.</li>
    <li>Select the plan that suits your needs. Note that some plans may require payment.</li>
    <li>Follow the prompts to enter your payment information and complete the purchase if your chosen plan requires it.</li>
    <li>Your API key will be emailed to you after selecting your plan and completing any necessary payments.</li>
</ol>
  <h2>Usage</h2>
  <ol>
    <li>Include the required JavaScript file in your HTML file:
        <pre><code>&lt;script src="https://app.thecompanyapi.io/js/companyapi.min.js" &gt;&lt;/script&gt;</code></pre>
    </li>
    <li>Create an HTML element for the search input field:
      <pre><code>&lt;input type="text" id="searchInput" placeholder="Search for a company"&gt;</code></pre>
    </li>
    <li>Create an instance of the <code>CompanySearchField</code> class, passing the API key and the ID of the search input field:
      <pre><code>let searchField = new CompanySearchField("YOUR_API_KEY", "searchInput");</code></pre>
      It will create a search input and a dropdown according to the user input<br>
      <img src="searchbar.png" alt="Search Bar Image" style="width: 50%; height: 50%;">
    </li>
    <li>Register a callback function to handle the selected company information:
      <pre><code>searchField.onCompanySelected(function(companyObject) {
  // Handle the selected company information
  console.log("Selected company:", companyObject);
});</code></pre>
    </li>
  </ol>

  <h2>Selected Company Object</h2>
  <p>When a company is selected from the dropdown, the registered callback function receives an object with the following properties:</p>
  <ul>
    <li><code>company_name</code>: The name of the selected company.</li>
    <li><code>description</code>: A brief description of the selected company.</li>
    <li><code>size</code>: The company's size, e.g., "mnc" (multinational corporation), "startup", etc.</li>
    <li><code>industries</code>: An array of industries the company operates in.</li>
    <li><code>linkedin_link</code>: The URL of the company's LinkedIn page.</li>
    <li><code>company_id</code>: A unique identifier for the company.</li>
    <li><code>company_keyword</code>: The search keyword used to find the company.</li>
    <li><code>image_id</code>: The ID of the company's logo image (may not be present).</li>
    <li><code>location</code>: The company's headquarters location (may not be present).</li>
  </ul>

  <p>Example:</p>
  <pre><code>{
  company_name: 'Accenture',
  description: 'Accenture is a professional services company, providing services and solutions in strategy, consulting, digital, technology and operations.',
  size: 'mnc',
  industries: ['Consulting', 'Information Technology'],
  linkedin_link: 'https://www.linkedin.com/company/accenture/',
  company_id: '578c9a1f-cfc0-41ea-87f0-c6167190a48c',
  company_keyword: 'accenture',
  image_id: 'bayumbfcn7b4h7xk08cc',
  location: 'Dublin'
}</code></pre>

  <p><strong>Note:</strong> The properties present in the object may vary depending on the data available for the selected company.</p>

  <h2>Constructor</h2>
  <pre><code>var CompanySearchField = function(apiKey, domId) {
  // ...
}</code></pre>
  <ul>
    <li><code>apiKey</code> (string): The API key required for making requests.</li>
    <li><code>domId</code> (string): The ID of the search input field element in the DOM.</li>
  </ul>

  <h2>Public Methods</h2>
  <h3><code>onCompanySelected(callback)</code></h3>
  <p>Register a callback function to be executed when a company is selected from the dropdown.</p>
  <pre><code>searchField.onCompanySelected(function(companyObject) {
  // Your callback function
  console.log("Selected company:", companyObject);
});</code></pre>
  <ul>
    <li><code>callback</code> (function): The function to be called when a company is selected. It receives the selected company's information as an object.</li>
  </ul>

  <!-- <h2>Internal Functions</h2>
  <p>The following functions are used internally by the <code>CompanySearchField</code> class:</p>
  <ul>
    <li><code>addPrefix(imageId)</code>: Returns the URL for the company logo image based on the provided image ID. If no image ID is provided, it returns a placeholder image URL.</li>
    <li><code>debounce(func, delay)</code>: A debounce function that limits the rate of function calls. It is used to debounce the search function to prevent excessive API calls when the user is typing.</li>
    <li><code>performSearch(apiKey)</code>: Performs the search based on the user input and populates the dropdown with results. It calls the AWS Lambda function to retrieve search results.</li>
    <li><code>populateDropdown(list, apiKey)</code>: Populates the dropdown with the list of companies returned from the Lambda function. It creates a clickable list item for each company, with the company logo, name, and an event listener to handle the selection.</li>
    <li><code>closeDropdownOutside(event)</code>: Closes the dropdown if the user clicks outside of the dropdown and the search input field.</li>
    <li><code>handle_click(companyName, apiKey)</code>: Handles the click event on a company in the dropdown by retrieving the company's information from the Lambda API.</li>
    <li><code>clearDropdown()</code>: Clears the dropdown and removes it from the DOM.</li>
    <li><code>handleCompanySelected(companyObject)</code>: Executes the registered callback functions with the selected company's information.</li>
  </ul> -->

  <h2>Dependencies</h2>
  <ul>
    <li>The <code>CompanySearchField</code> class uses the custom <code>ajax</code> function for making HTTP requests to our backend API.</li>
  </ul>

  <h2>Known Issues</h2>
  The CompanyAPI.io is still in development, there are a number of known issues and they are listed in the <a href="https://github.com/hackertrail/scoutapi/issues">GitHub issues tracker</a>
</body>
</html>
