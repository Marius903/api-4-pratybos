const API = "TAVO_ACCESS_KEY";

const container = document.getElementById("container");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");

// Nuotrauku gavimo funkcija
async function getPhotos(word = "") {
  container.innerHTML = "";
  message.textContent = "Kraunamos nuotraukos...";
  searchButton.disabled = true;

  try {
    let url;

    if (word.trim() === "") {
      // Gauname 8 atsitiktines nuotraukas
      url =
        "https://api.unsplash.com/photos/random?count=8&content_filter=high";
    } else {
      // Ieskome nuotrauku pagal ivesta zodi
      url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(word)}&per_page=8&content_filter=high`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${API}`,
      },
    });

    const data = await response.json();

    // Tikriname API klaidas
    if (!response.ok) {
      console.error("API klaida:", response.status, data);

      if (response.status === 401) {
        throw new Error("Neteisingas API raktas! Patikrink savo Access Key.");
      }

      if (response.status === 403 || response.status === 429) {
        throw new Error("Pasiektas API uzklausu limitas arba truksta leidimu.");
      }

      throw new Error("Nepavyko gauti nuotrauku.");
    }

    // Atsitiktines arba paieskos nuotraukos
    const photos = word.trim() === "" ? data : data.results;

    // Jeigu nuotrauku nerasta
    if (!photos || photos.length === 0) {
      message.textContent = "Atsiprasome, tokiu nuotrauku nerasta!";
      return;
    }

    message.textContent = "";

    // Atvaizduojame nuotraukas
    photos.forEach((el) => {
      const card = document.createElement("div");
      card.className = "photo-card";

      const image = document.createElement("img");

      image.src = el.urls.small;
      image.alt = el.alt_description || "Nuotrauka";

      const credit = document.createElement("p");
      credit.className = "photo-credit";

      credit.append("Nuotrauka: ");

      const author = document.createElement("a");

      author.href =
        el.user.links.html + "?utm_source=api_4_pratybos&utm_medium=referral";

      author.textContent = el.user.name;
      author.target = "_blank";

      credit.appendChild(author);
      credit.append(" / ");

      const unsplash = document.createElement("a");

      unsplash.href =
        "https://unsplash.com/?utm_source=api_4_pratybos&utm_medium=referral";

      unsplash.textContent = "Unsplash";
      unsplash.target = "_blank";

      credit.appendChild(unsplash);

      card.appendChild(image);
      card.appendChild(credit);

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    message.textContent = error.message;
  } finally {
    searchButton.disabled = false;
  }
}

// Paieska paspaudus Search mygtuka
searchButton.addEventListener("click", () => {
  getPhotos(searchInput.value.trim());
});

// Paieska paspaudus Enter
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getPhotos(searchInput.value.trim());
  }
});

// Automatiškai parodomos 8 atsitiktines nuotraukos
getPhotos();
