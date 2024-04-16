window.ajax=function(e,c){var b={api_url:"/api",request_header:"application/json",json_return:!0,method:"POST"};if("object"==typeof c)for(var f in c)c.hasOwnProperty(f)&&(b[f]=c[f]);var k="application/json"===b.request_header?JSON.stringify(e):Object.keys(e).map(d=>`${encodeURIComponent(d)}=${encodeURIComponent(e[d])}`).join("&");return new Promise((d,g)=>{var a=new XMLHttpRequest;a.open(b.method,b.api_url);a.setRequestHeader("Content-Type",b.request_header);a.onload= function(){if(200===a.status){var h=b.json_return?JSON.parse(a.responseText):a.responseText;d(h)}else try{h=JSON.parse(a.responseText),g({status:a.status,statusText:a.statusText,error:h})}catch(l){g({status:a.status,statusText:a.statusText,error:a.responseText})}};a.onerror=function(){g({status:a.status,statusText:"Network Error",error:null})};a.send(k)})};
function findNearestPositionedAncestor(element) {
  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);
    if (style.position !== 'static') {
      return element;
    }
    element = element.parentElement;
  }
  return null; // Fallback to document.body if no positioned ancestor is found
}
 
var CompanySearchField = function(apiKey, domId) {
  function positionDropdown(domId) {
    const companyNameInput = document.getElementById(domId);
    const helperDropdown = document.getElementById('helperDropdown');
    if (companyNameInput && helperDropdown) {
      const inputRect = companyNameInput.getBoundingClientRect();
      const ancestor = findNearestPositionedAncestor(companyNameInput);
      const ancestorRect = ancestor ? ancestor.getBoundingClientRect() : { top: 0, left: 0 };
  
      // Calculate top and left positions relative to the nearest positioned ancestor
      const topPosition = inputRect.bottom - ancestorRect.top + (ancestor? ancestor.scrollTop:0);
      const leftPosition = inputRect.left - ancestorRect.left + (ancestor? ancestor.scrollLeft:0);
  
      // Apply calculated positions to helperDropdown
      helperDropdown.style.position = 'absolute';
      helperDropdown.style.top = `${topPosition}px`;
      helperDropdown.style.left = `${leftPosition}px`;
    }
  }
  
  // Initial positioning
  positionDropdown(domId);
  
  // Adapt to various changes
  
  // Consider MutationObserver to observe DOM changes affecting the companyName input or its ancestors
  this._fnhooks = [];
  this.apiKey = apiKey;
  let domElem = document.getElementById(domId);
  if (domElem == null) throw Exception("DOM element not found");

  // Create a new div for the spinner
  const spinnerContainer = document.createElement('div');
  spinnerContainer.id = 'spinnerContainer';
  spinnerContainer.style.display = 'none'; // Initially hidden
  spinnerContainer.style.position = 'absolute';
  spinnerContainer.style.top = `${topPosition}px`;
  spinnerContainer.style.right = '5px'; // Adjust as needed

  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.style.border = '4px solid #f3f3f3';
  spinner.style.borderTop = '4px solid #3498db';
  spinner.style.borderRadius = '50%';
  spinner.style.width = '20px';
  spinner.style.height = '20px';
  spinner.style.animation = 'spin 2s linear infinite';

  // Add the animation keyframes
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  spinnerContainer.appendChild(spinner);

  // Insert the spinner container as the last child of the search input's parent
  domElem.parentNode.appendChild(spinnerContainer);

  let searchOptions = document.createElement("DIV");
  this._dropdownContainer = searchOptions;
  searchOptions.id = "helperDropdown";
  if (domElem.nextSibling) {
    domElem.parentElement.insertBefore(searchOptions, domElem.nextSibling);
  } else {
    domElem.appendChild(searchOptions);
  }

  // Calculate the position for the dropdown container
  const inputRect = domElem.getBoundingClientRect();
  const x = inputRect.left
  const y = inputRect.bottom

  // Update the position and z-index of the dropdown container
  searchOptions.style.position = 'absolute';
  searchOptions.style.left = `${x}px`;
  searchOptions.style.top = `${y}px`;
  searchOptions.style.zIndex = '999999';
  searchOptions.style.background = "#FFF";
  searchOptions.style.padding = "10px";
  searchOptions.style["border-bottom-left-radius"] = "10px";
  searchOptions.style["border-bottom-right-radius"] = "10px";
  searchOptions.style.maxWidth = (inputRect.width - 20)+"px";

  positionDropdown(domId);
  window.addEventListener('resize', positionDropdown);
  document.addEventListener('scroll', positionDropdown, true); // Capture during the capture phase

  this._selected_company_info = null;

  const addPrefix = (imageId) => {
    if (imageId && imageId.trim() !== '') {
      return `https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/${imageId}`;
    }
    return 'https://webmeet.io/shared/companies/logo.png'; // Placeholder image URL
  };

  const debounce = (func, delay) => {
    let timerId;

    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const showSpinner = () => {
    const spinnerContainer = document.getElementById('spinnerContainer');
    if (spinnerContainer) {
      spinnerContainer.style.display = 'inline-block';
    }
  };
  
  const hideSpinner = () => {
    const spinnerContainer = document.getElementById('spinnerContainer');
    if (spinnerContainer) {
      spinnerContainer.style.display = 'none';
    }
  };

  const performSearch = (apiKey) => {
    const searchTerm = domElem.value.trim();
    console.log('Calling AWS Lambda function...');
    const lambdaUrl = 'https://4n2s3o0q84.execute-api.ap-southeast-1.amazonaws.com/';
  
    showSpinner(); // Show the spinner
  
    if (searchTerm !== '' && apiKey !== '') {
      ajax({search: searchTerm, api_key: apiKey}, {api_url: lambdaUrl, request_header: "application/json"})
        .then(response => {
          populateDropdown(response.data, apiKey);
          hideSpinner(); // Hide the spinner
        })
        .catch(error => {
          console.error('Error calling Lambda function:', error);
          hideSpinner(); // Hide the spinner
        });
    } else {
      clearDropdown();
      hideSpinner(); // Hide the spinner
    }
  };

  const populateDropdown = (list, apiKey) => {
    clearDropdown();

    list.forEach((item, idx, array) => {
      const listItem = document.createElement('div');
      listItem.classList.add('dropdown-item');
      listItem.dataset.imageId = item.image_id;
      listItem.style["padding-left"] = "55px";
      listItem.style["background"] = "url("+addPrefix(item.image_id)+") no-repeat";
      listItem.style["background-position"] = "left";
      listItem.style["background-size"] = "50px";
      listItem.style["font-size"] = "15px";
      listItem.style["overflow"] = "hidden";
      listItem.style["min-height"] = "50px";
      listItem.style["display"] = "flex";
      listItem.style["align-items"] = "center";
      
      if (idx !== 0) listItem.style["padding-top"] = "5px";

      if (idx !== array.length - 1){
        listItem.style["border-bottom"] = "1px solid lightgrey";
        listItem.style["padding-bottom"] = "5px";
      }

      const companyName = document.createTextNode(item.company_name);
      listItem.appendChild(companyName);
      searchOptions.appendChild(listItem);

      listItem.addEventListener('click', async () => {
        const companyObject = await handle_click(item.company_name, apiKey);
        handleCompanySelected(companyObject); // Call the custom function with the company object
        searchOptions.classList.remove('show');
        domElem.value = item.company_name;
        clearDropdown();
      });

      listItem.addEventListener('mouseover', () => {
        listItem.style.backgroundColor = '#e0e0e0';
        listItem.style.cursor = 'pointer';
      });

      listItem.addEventListener('mouseout', () => {
        listItem.style.backgroundColor = '';
        listItem.style.cursor = '';
      });
    });
    searchOptions.classList.add('show');
    positionDropdown(domId); // Call the positionDropdown function
    document.addEventListener('click', closeDropdownOutside);
  };

  const closeDropdownOutside = (event) => {
    if (!searchOptions.contains(event.target) && event.target !== domElem) {
      clearDropdown();
      document.removeEventListener('click', closeDropdownOutside);
    }
  };

  const handle_click = (companyName, apiKey) => {
    try {
      const lambdaUrl = 'https://4n2s3o0q84.execute-api.ap-southeast-1.amazonaws.com/';

      return response = ajax({company_name: companyName, api_key: apiKey}, {api_url: lambdaUrl, request_header: "application/json"})
      .then(response => response.data).catch(error => {
          console.error('Error calling Lambda function:', error);
          throw error;
        });
      // const response = await axios.post(lambdaUrl, requestData, { headers });
      // const responseData = response.data;

      // return responseData;
    } catch (error) {
      console.error('Error calling Lambda API:', error);
      throw error;
    }
  };

  const clearDropdown = () => {
    searchOptions.innerHTML = '';
    searchOptions.classList.remove('show');
    positionDropdown(domId); // Call the positionDropdown function
  };

  const debounceSearch = debounce(performSearch, 300);
  domElem.addEventListener('keyup', () => {
    debounceSearch(apiKey);
  });
  domElem.addEventListener('click', positionDropdown);

  const handleCompanySelected = (companyObject) => {
    // Create a new hidden input field
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'linkedin_link';
    hiddenField.value = companyObject.linkedin_link || '';
  
    // Get the reference to the search input field
    const searchInput = document.getElementById('searchInput');
  
    // Insert the hidden field as a sibling after the search input field
    searchInput.parentNode.insertBefore(hiddenField, searchInput.nextSibling);
  
    // Call the registered callback functions
    if (this._fnhooks.length > 0) {
      for (let i = 0; i < this._fnhooks.length; i++) {
        this._fnhooks[i](companyObject);
      }
    }
  };

  this.onCompanySelected = (fn) => {
    if (typeof fn === "function") {
      this._fnhooks.push(fn);
    } else {
      return false;
    }
  };
};