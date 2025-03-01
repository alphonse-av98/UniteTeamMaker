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

// ポケモン選択のオプションの表示/非表示を切り替える
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

    // ユーザーが2人未満の場合はエラーを表示
    if (filteredUsers.length < 2) {
        alert('ユーザーが2人以上必要です');
        return;
    }

    // ユーザー名に重複がある場合はエラーを表示
    if (new Set(filteredUsers).size !== filteredUsers.length) {
        alert('ユーザー名が重複しています');
        return;
    }

    let shuffledUsers;
    let teamA, teamB;
    let pokemonTeamA, pokemonTeamB;

    do {
        const sliceIndex = document.getElementById('equalize').checked === true ? Math.floor(filteredUsers.length / 2 + filteredUsers.length % 2) : Math.floor(Math.random() * filteredUsers.length + 1);

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
            // 同両チームに同じポケモンを選ばない場合のロジック
            let pokemons = selectedCompositionTeamDraft(document.querySelector('input[name="composition"]:checked').value);
            pokemonTeamA = pokemons.slice(0, 5);
            pokemonTeamB = pokemons.slice(5, 10);
        } else {
            const selectedComposition = document.querySelector('input[name="composition"]:checked');
            pokemonTeamA = selectedCompositionTeam(selectedComposition.value);
            pokemonTeamB = selectedCompositionTeam(selectedComposition.value);
        }
    }

    // HTMLにチームを表示
    displayTeam('teamA', teamA, pokemonTeamA);
    displayTeam('teamB', teamB, pokemonTeamB);

    // RESULT部分を可視化
    const resultElement = document.getElementById('result');
    if (resultElement.style.display === "none" || resultElement.style.display === "") {
        resultElement.style.display = "block"; // 表示
    }

    // クリップボードにコピー
    if (document.getElementById('copy-to-clipbord').checked) {
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

function pokemonFilteringSelect(index, battleStyle) {
    let pokemons = [];
    do {
        let pokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        if (pokemons.includes(pokemon)) continue;
        if (!battleStyle.includes(pokemon.battleStyle)) continue;
        pokemons.push(pokemon);
    } while (pokemons.length < index);
    return pokemons;
}

function copyToClipbord() {
    const teamA = document.getElementById('teamA').innerText.replace(/\n/g, '\n\t');
    const teamB = document.getElementById('teamB').innerText.replace(/\n/g, '\n\t');
    const result = 'TeamA :\n\t' + teamA + '\nTeamB :\n\t' + teamB;
    navigator.clipboard.writeText(result);
}

function selectedCompositionTeam(composition) {
    let pokemonTeam = [];
    switch (composition) {
        case 'random':
            pokemonTeam = pokemonSelect(5);
            break;
        case 'support_or_tank':
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(2, ['サポート', 'ディフェンス']));
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(3, ['アタック', 'スピード', 'バランス']));
            pokemonTeam.sort(() => Math.random() - 0.5);
            break;
        case 'support_tank':
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(1, ['サポート']));
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(1, ['ディフェンス']));
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(3, ['アタック', 'スピード', 'バランス']));
            pokemonTeam.sort(() => Math.random() - 0.5);
            break;
        case 'tank2':
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(2, ['ディフェンス']));
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(3, ['アタック', 'スピード', 'バランス']));
            pokemonTeam.sort(() => Math.random() - 0.5);
            break;
        case 'support2':
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(2, ['サポート']));
            pokemonTeam = pokemonTeam.concat(pokemonFilteringSelect(3, ['アタック', 'スピード', 'バランス']));
            pokemonTeam.sort(() => Math.random() - 0.5);
            break;
        case 'all_support_tank':
            pokemonTeam = pokemonFilteringSelect(5, ['サポート', 'ディフェンス']).sort(() => Math.random() - 0.5);
            break;
        default:
            pokemonTeam = pokemonSelect(5);
            break;
    }
    return pokemonTeam;
}

function selectedCompositionTeamDraft(composition) {
    let pokemonTeam = [];
    switch (composition) {
        case 'random':
            pokemonTeam = pokemonSelect(10);
            break;
        case 'support_or_tank':
            {
                let support_tank = pokemonFilteringSelect(4, ['サポート', 'ディフェンス']);
                let others = pokemonFilteringSelect(6, ['アタック', 'スピード', 'バランス']);
                let teamA = [support_tank[0], support_tank[1], others[0], others[1], others[2]];
                teamA.sort(() => Math.random() - 0.5);
                let teamB = [support_tank[2], support_tank[3], others[3], others[4], others[5]];
                teamB.sort(() => Math.random() - 0.5);
                pokemonTeam = teamA.concat(teamB);
            }
            break;
        case 'support_tank':
            {
                let support = pokemonFilteringSelect(2, ['サポート'])
                let tank = pokemonFilteringSelect(2, ['ディフェンス']);
                let others = pokemonFilteringSelect(6, ['アタック', 'スピード', 'バランス']);
                let teamA = [support[0], tank[0], others[0], others[1], others[2]];
                teamA.sort(() => Math.random() - 0.5);
                let teamB = [support[1], tank[1], others[3], others[4], others[5]];
                teamB.sort(() => Math.random() - 0.5);
                pokemonTeam = teamA.concat(teamB);
            }
            break;
        case 'tank2':
            {
                let tank = pokemonFilteringSelect(4, ['ディフェンス']);
                let others = pokemonFilteringSelect(6, ['アタック', 'スピード', 'バランス']);
                let teamA = [tank[0], tank[1], others[0], others[1], others[2]];
                teamA.sort(() => Math.random() - 0.5);
                let teamB = [tank[2], tank[3], others[3], others[4], others[5]];
                teamB.sort(() => Math.random() - 0.5);
                pokemonTeam = teamA.concat(teamB);
            }
            break;
        case 'support2':
            {
                let support = pokemonFilteringSelect(4, ['サポート']);
                let others = pokemonFilteringSelect(6, ['アタック', 'スピード', 'バランス']);
                let teamA = [support[0], support[1], others[0], others[1], others[2]];
                teamA.sort(() => Math.random() - 0.5);
                let teamB = [support[2], support[3], others[3], others[4], others[5]];
                teamB.sort(() => Math.random() - 0.5);
                pokemonTeam = teamA.concat(teamB);
            }
            break;
        case 'all_support_tank':
            {
                pokemonTeam = pokemonFilteringSelect(10, ['サポート', 'ディフェンス']).sort(() => Math.random() - 0.5);
            }
            break;
        default:
            pokemonTeam = pokemonSelect(10);
            break;
    }
    return pokemonTeam;
}