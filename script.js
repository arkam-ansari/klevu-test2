// Selecting the HTML element 
const body = document.querySelector("body");
const loader = document.getElementById("loadingIndicator");
const selectPrice = document.getElementById("kuDropSortBy");
const totalResultsFound = document.getElementById("total-result");
const productContainer = document.querySelector(".kuvmResultsList");
const modalContent = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".modal-close");

// Payload of Product API
const payload = {
  context: { apiKeys: ["klevu-160320037354512854"] },
  recordQueries: [
    {
      id: "configLayoutProducts564",
      typeOfRequest: "SEARCH",
      settings: {
        query: { term: "bags" },
        typeOfRecords: ["KLEVU_PRODUCT"],
        limit: 12,
        typeOfSearch: "WILDCARD_AND",
      },
    },
  ],
};

// Fetch Data from Product API using Promise
function fetchData() {
  loader.style.display = "block"; // Show Loading
  fetch("https://eucs23v2.ksearchnet.com/cs/v2/search", {
    method: "POST",
    body: JSON.stringify(payload),
  })
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);
}

// Handle the Response and Convert in JSON Format
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Error - Status Code: ${response.status}`);
  }
  return response.json();
}

// Handle the Response Data and Manage Change 
function handleData(data) {
  const { queryResults } = data;
  // Display Total No of Resulf
  totalResultsFound.innerHTML =
    queryResults[0].meta && queryResults[0].meta.noOfResults;
  const records = queryResults[0].records;
  // Added Product Card as per Record Data
  updateProductContainer(records);
  // Handle Price Change of Product 
  selectPrice.addEventListener("change", (event) =>
    handlePricing(event, records)
  );
}

// Handle the Error of Response Data
function handleError(error) {
  console.error("Fetch error:", error);
}

// Update the Prodct Card as per Records Data
function updateProductContainer(records) {
  productContainer.innerHTML = "";
  records.forEach((record) => insertCard(record));
  loader.style.display = "none";  // Hide Loader
}

// Insert the Product Card in Prouct Container
function insertCard(item) {
  const encodedItem = encodeURIComponent(JSON.stringify(item));
  const dummyImgUrl = "https://cdn.shopify.com/s/files/1/0872/0452/products/mb01-blue-0_4aed1c08-aa06-48a5-84e5-630e28d9177a_600X400.jpg?v=1496239350";
  const content = `
    <li class="kuvmProduct" data-id=${item.id} data-isdeleted="" data-instock=${item.inStock} data-itemgroupid=${item.itemGroupId}}>
      <div class="kuvmProdWrap">
          <div class="kuvmProdTop">
              <div class="kuvmImgWrap">
                  <a href="javascript:void(0)" class="kuvmProductLink">
                      <span class="kuvmImgSpan">
                          <img src=${item.image || dummyImgUrl} alt=${item.name} class="kuProdImg" title=${item.name}>
                          <img src=${item.imageHover || dummyImgUrl} alt=${item.name} class="kuProdImg" title=${item.name}>
                      </span>
                  </a>
              </div>
          </div>
          <div class="kuvmProdBottom">
              <div class="kuvmNameDesc">
                  <div class="kuvmName" data-name=${item.name}><a href="javascript:void(0)" class="kuvmProductLink" title=${item.name}>${item.name}</a></div>
                  <div class="kuvmsku" data-sku=${item.sku}><small class="text-muted">${item.sku}</small></div>
              </div>
              <div class="kuColor"><span>${item.color}</span></div>
              <div class="kuPrice">
                  ${item.price} ${item.currency}
              </div>
              <div class="kuButton">
              <button class="kuvmButton quick-view-btn" title="Quick View" data-item="${encodedItem}">Quick View</button>
              </div>
          </div>
      </div>
    </li>
  `;
  productContainer.innerHTML += content;
}

// Display Product Card as per the Pricing
function handlePricing(event, records) {
  const selectValue = event.target.value;
  const sortedRecords =
    selectValue === "low"
      ? records.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      : records.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  updateProductContainer(sortedRecords);
}

// Open Modal and Display the Poduct Data 
function openProductModal(e) {
  const encodedString = e.target.getAttribute("data-item");
  const decodedString = decodeURIComponent(encodedString);
  const item = JSON.parse(decodedString);
  const dummyImgUrl = "https://cdn.shopify.com/s/files/1/0872/0452/products/mb01-blue-0_4aed1c08-aa06-48a5-84e5-630e28d9177a_600X400.jpg?v=1496239350";
  let modalHTML =`
  <div class="modal-container">
    <div class="modal-image kuvmImgWrap">
      <img src=${item.image || dummyImgUrl} alt=${item.name} class="kuProdImg" title=${item.name}>
      <img src=${item.imageHover || dummyImgUrl} alt=${item.name} class="kuProdImg" title=${item.name}>
    </div>
    <div class="modal-content">
      <h2>${item.name}</h2>
      <p class="kuDescription">${item.shortDesc}</p>
      <div class="kuBrand">Brand: <span>${item.brand}</span></div>
      <div class="kuProductType">Product Type: <span>${item.product_type}</span></div>
      <div class="kuColor">Color: <span>${item.color}</span></div>
      <div class="kuInstock">In Stock: <span>${item.inStock}</span></div>
      <div class="kuProductPrice">
      Price: <span class="kuPrice">${item.price} ${item.currency}</span>
      </div>
      <a href=${item.url} class="buy-btn" title="Buy Product">Buy Product</a>
    </div>
  </div>
  `;
  modalContent.style.display = "block";
  modalContent.innerHTML += modalHTML;
  overlay.classList.toggle("hidden");
  // Avoid Scroll while Modal Open
  body.style.overflow = "hidden";
  document.addEventListener("keydown", handleEscapeKey);
}

// Handle the Opening and Closing of Modal
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("quick-view-btn")) {
  openProductModal(event);
} else if (event.target.classList.contains("modal-close")) {
  closeProductModal();
}
});

// On Closing the Product Modal
function closeProductModal() {
  modalContent.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
  modalContent.innerHTML = `<span class="modal-close" title="Close">&times;</span>`;
  body.style.overflow = "unset";
}

// On Pressing Escape Key Modal will Close 
function handleEscapeKey(event) {
  const overlayHidden = overlay.classList.contains("hidden");
  if (event.key === "Escape" && !(overlayHidden)) {
      closeProductModal();
  }
}

// On Clicking Overlay Modal will CLose
overlay.addEventListener("click", closeProductModal);

// Fetch Data on Initial Load 
fetchData();