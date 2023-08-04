//Acá creo todas las contatntes que voy a usar
const pokemonContainer = document.querySelector(".pokemon-container");
const modal = document.getElementById("modal");
const modalContent = document.querySelector(".modal-content");
const closeModalButton = document.getElementById("close-modal");
const pokemonSearchInput = document.getElementById("pokemon-search");
const pokemonData = {};

//Esta es la funcion principal donde se trae la URL de la API
async function fetchPokemon(id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        const data = await res.json();
        pokemonData[id] = data;
        createPokemon(data);
    } catch (error) {
        console.error("Error al obtener el Pokémon:", error);
    }
}

//Este es el bucle para iterar en el número de pokemons que traemos
async function fetchPokemons(number) {
    for (let i = 1; i <= number; i++) {
        await fetchPokemon(i);
    }
}

//Esta es la funcion que va a crear los pokemons con sus respectiva info en la tarjeta
function createPokemon(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-block");

    const spriteContainer = document.createElement("div");
    spriteContainer.classList.add("img-container");

    const sprite = document.createElement("img");
    sprite.src = pokemon.sprites.other["official-artwork"].front_default;

    spriteContainer.appendChild(sprite);

    const number = document.createElement("p");
    number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

    const name = document.createElement("p");
    name.classList.add("name");
    name.textContent = pokemon.name;

    const type = document.createElement("p")
    type.classList.add("type")
    type.textContent = `Tipo: ${pokemon.types.map((type) => type.type.name).join(", ")}`;

    card.appendChild(spriteContainer);
    card.appendChild(number);
    card.appendChild(name);
    card.appendChild(type);

    pokemonContainer.appendChild(card);
}

//Acá llamo el número de pokemon que vamos a crear
fetchPokemons(151);

//Esta funcion crea el modal de cada pokemon, ya sea en el buscador o al darles click
function openModal(pokemon) {
    const modalTitle = document.createElement("h2");
    modalTitle.classList.add("name")
    modalTitle.textContent = pokemon.name;

    const spriteContainer = document.createElement("div");
    spriteContainer.classList.add("img-container");

    const imgModal = document.createElement("img")
    imgModal.src = pokemon.sprites.other["official-artwork"].front_default;

    const pokemonType = document.createElement("p");
    pokemonType.classList.add("type")
    pokemonType.textContent = `Tipo: ${pokemon.types.map((type) => type.type.name).join(", ")}`;

    const pokemonAbilities = document.createElement("p");
    pokemonAbilities.classList.add("type")
    pokemonAbilities.textContent = `Habilidades: ${pokemon.abilities.map((ability) => ability.ability.name).join(", ")}`;

    const pokemonHeight = document.createElement("p");
    let heightInMeters = pokemon.height * 10
    pokemonHeight.textContent = `ALTURA: ${heightInMeters}cm`;

    const pokemonWeight = document.createElement("p")
    let weightInKg = pokemon.weight * 0.1
    pokemonWeight.textContent = `PESO: ${weightInKg.toFixed(1)}kg`

    //Limpia el contenido anterior del modalContent antes de agregar los nuevos elementos
    modalContent.innerHTML = "";

    //Agrega los elementos al modalContent
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(spriteContainer)
    modalContent.appendChild(imgModal);
    modalContent.appendChild(pokemonType);
    modalContent.appendChild(pokemonAbilities);
    modalContent.appendChild(pokemonHeight);
    modalContent.appendChild(pokemonWeight)
    

    // Muestra el modal
    modal.style.display = "block";
}

function closeModal() {
    //Limpia el contenido del modal antes de cerrarlo
    modalContent.innerHTML = "";
    //Oculta el modal
    modal.style.display = "none";
}

//Este evento abre el modal al hacerle click a un pokemon
pokemonContainer.addEventListener("click", (event) => {
    const clickedPokemon = event.target.closest(".pokemon-block");
    if (clickedPokemon) {
        const pokemonId = parseInt(clickedPokemon.querySelector("p").textContent.slice(1));
        const selectedPokemonData = pokemonData[pokemonId];
        openModal(selectedPokemonData);
    }
});

//Este evento cierra el modal al hacer click fuera del area del modal
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

//Estas funciones son para buscar el pokemon por el nombre, la idea es que lo traiga de la funcion createPokemon
function searchPokemonByName(name) {
    const filteredPokemon = Object.values(pokemonData).filter((pokemon) =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
    return filteredPokemon;
}
  
function displaySearchedPokemon(pokemonList) {
    pokemonContainer.innerHTML = "";
    pokemonList.forEach((pokemon) => {
      createPokemon(pokemon);
    });
}
  
pokemonSearchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length >= 2) {
      const searchResults = searchPokemonByName(searchTerm);
      displaySearchedPokemon(searchResults);
    } else {
      displaySearchedPokemon(Object.values(pokemonData));
    }
});
