// オプション設定の表示/非表示を切り替える
const toggleButton = document.getElementById("toggle-options");
const optionsDiv = document.getElementById("options");

toggleButton.addEventListener("click", () => {
    if (optionsDiv.style.display === "none" || optionsDiv.style.display === "") {
        optionsDiv.style.display = "block"; // 表示
        toggleButton.textContent = "オプション設定を隠す";
    } else {
        optionsDiv.style.display = "none"; // 非表示
        toggleButton.textContent = "オプション設定を表示";
    }
});

const toggleCheckbox = document.getElementById("assignpokemon");
const pokemonOption = document.getElementById("pokemon-options");
toggleCheckbox.addEventListener("change", () => {
    if (toggleCheckbox.checked) {
        pokemonOption.style.display = "block"; // 表示
    } else {
        pokemonOption.style.display = "none"; // 非表示
    }
});

function divideTeams() {
    const previousResult = JSON.parse(localStorage.getItem("previousResult"));
    const users = [document.getElementById('user1').value, document.getElementById('user2').value, document.getElementById('user3').value, document.getElementById('user4').value, document.getElementById('user5').value, document.getElementById('user6').value, document.getElementById('user7').value, document.getElementById('user8').value, document.getElementById('user9').value, document.getElementById('user10').value];

    // 空欄のユーザーを削除
    const filteredUsers = users.filter(user => user);

    if (filteredUsers.length < 2) {
        alert('ユーザーが2人以上必要です');
        return;
    }

    let shuffledUsers;
    let teamA, teamB;
    let pokemonTeamA, pokemonTeamB;

    do {
        const sliceIndex = document.getElementById('equalize').checked === true ? Math.floor(filteredUsers.length / 2 + filteredUsers.length % 2) : Math.floor(Math.random() * filteredUsers.length + 1);

        console.log(sliceIndex);

        // ランダムにユーザーをシャッフル
        shuffledUsers = filteredUsers.sort(() => Math.random() - 0.5);

        // 2つのチームに分ける
        teamA = shuffledUsers.slice(0, sliceIndex).sort();
        teamB = shuffledUsers.slice(sliceIndex).sort();

        // 前回のチーム分け結果と比較
    } while (isSameTeams(teamA, teamB, previousResult));

    // 結果をローカルストレージに保存
    localStorage.setItem("previousResult", JSON.stringify({ teamA, teamB }));

    if (document.getElementById('assignpokemon').checked) {
        pokemonTeamA = [];
        pokemonTeamB = [];

        if (document.getElementById('draft').checked) {
            const pokemons = pokemonSelect(filteredUsers.length);
            for (let i = 0; i < teamA.length; i++) {
                pokemonTeamA.push(pokemons[i]);
            }
            for (let i = 0; i < teamB.length; i++) {
                pokemonTeamB.push(pokemons[i + teamA.length]);
            }
        } else {
            pokemonTeamA = pokemonSelect(teamA.length);
            pokemonTeamB = pokemonSelect(teamB.length);
        }
    }

    // HTMLにチームを表示
    displayTeam('teamA', teamA, pokemonTeamA);
    displayTeam('teamB', teamB, pokemonTeamB);

    const resultElement = document.getElementById('result');
    if (resultElement.style.display === "none" || resultElement.style.display === "") {
        resultElement.style.display = "block"; // 表示
    }

    if(document.getElementById('copy-to-clipbord').checked){
        copyToClipbord();
    }
}

function isSameTeams(teamA, teamB, previous) {
    if (!previous) return false;
    if (document.getElementById('lastteam').checked === false) return false;
    if (JSON.stringify(teamA.concat(teamB)) !== JSON.stringify(previous.teamA.concat(previous.teamB))) return false;

    const teamAEqual = JSON.stringify(teamA) === JSON.stringify(previous.teamA);
    const teamBEqual = JSON.stringify(teamB) === JSON.stringify(previous.teamA);

    return teamAEqual || teamBEqual;
}

function displayTeam(teamId, team, pokemon) {
    const teamElement = document.getElementById(teamId);
    teamElement.innerHTML = '';

    for (let i = 0; i < team.length; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = pokemon ? team[i] + "[" + pokemon[i].name + "]" : team[i];
        teamElement.appendChild(listItem);
    }
}

function pokemonSelect(index) {
    let pokemons = [];
    do {
        let pokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        if (pokemons.includes(pokemon)) continue;
        pokemons.push(pokemon);
    } while (pokemons.length < index);
    return pokemons;
}

function copyToClipbord(){
    const teamA = document.getElementById('teamA').innerText.replace(/\n/g, ',');
    const teamB = document.getElementById('teamB').innerText.replace(/\n/g, ',');
    const result = 'TeamA : ' + teamA + '\nTeamB : ' + teamB;
    navigator.clipboard.writeText(result);
}

