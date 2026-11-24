
const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const status = document.getElementById("status");

let debounceTimer;
let controller;

// Debounce function
searchInput.addEventListener("input", function () {
  clearTimeout(debounceTimer);

  // Cancel previous API request
  if (controller) {
    controller.abort();
  }

  const query = searchInput.value.trim();
  results.innerHTML = "";

  if (query === "") {
    status.textContent = "";
    return;
  }

  status.textContent = "Waiting for typing...";

  debounceTimer = setTimeout(() => {
    searchUsers(query);
  }, 500);
});

// API search function
async function searchUsers(query) {
  controller = new AbortController();

  status.textContent = "Loading...";

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?name_like=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const users = await response.json();

    results.innerHTML = "";

    if (users.length === 0) {
      status.textContent = "No results found";
      return;
    }

    status.textContent = "Search results:";

    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user.name;
      results.appendChild(li);
    });

  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    status.textContent = "Something went wrong!";
  }
}
