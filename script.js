// Функция задержки
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

// Функция запроса и вывода автодополнений
function fetchAutocomplete() {
    const input = document.querySelector(".search-input");
    const query = input.value;

    if (query === "") {
        return;
    }

    const url = `https://api.github.com/search/repositories?q=${query}&per_page=5`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const autocompleteList = document.querySelector(".autocomplete-list");
            autocompleteList.innerHTML = "";

            data.items.forEach((repo) => {
                const li = document.createElement("li");
                li.innerText = repo.full_name;
                li.addEventListener("click", () => {
                    addSelectedRepo(repo);
                    input.value = "";
                    autocompleteList.innerHTML = "";
                });

                autocompleteList.appendChild(li);
            });
        });
}

// Функция добавления выбранного репозитория
function addSelectedRepo(repo) {
    const selectedRepos = document.querySelector(".selected-repos");

    const li = document.createElement("li");

    const name = document.createElement("li");
    name.innerText = "Name: " + repo.name;
    li.appendChild(name);

    const owner = document.createElement("li");
    owner.innerText = "Owner: " + repo.owner.login;
    li.appendChild(owner);

    const stars = document.createElement("li");
    stars.innerText = "Stars: " + repo.stargazers_count;
    li.appendChild(stars);

    const deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", () => {
        selectedRepos.removeChild(li);
    });

    li.appendChild(deleteButton);

    selectedRepos.appendChild(li);
}

// Подписываемся на событие ввода с задержкой
const input = document.querySelector(".search-input");
input.addEventListener("input", debounce(fetchAutocomplete, 450));