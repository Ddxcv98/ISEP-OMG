const { remote } = require('electron');

const fs = require('fs');

const classes = document.getElementById('classes');
const search = document.getElementById('search');
const table = document.getElementById('table');
let map;

classes.addEventListener('input', () => {
    search.disabled = true;
    search.value = '';
    table.innerHTML = '';

    const text = classes.value.toLowerCase();
    map = new Map();
    
    fs.readFile(`${remote.app.getAppPath()}/raw/perguntas_${text}.txt`, 'utf8', (err, dQuestions) => {
        if (err) throw err;

        fs.readFile(`${remote.app.getAppPath()}/raw/respostas_${text}.txt`, 'utf8', (err, dAnswers) => {
            if (err) throw err;
            const questions = dQuestions.split('\n');
            const answers = dAnswers.split('\n');
            
            let j = 0;
            
            for (const question of questions) {
                let answer = answers[j].trim();

                while (j < answers.length && answer.length === 0) {
                    answer = answers[++j].trim();
                }

                const trimmed = question.trim();

                if (map.get(trimmed)) {
                    console.warn(`Duplicate: ${trimmed}`);
                }

                map.set(trimmed, answer);

                do {
                    j++
                } while (j < answers.length && answers[j].trim().length !== 0);
            }

            search.disabled = false;
        });
    });
});

search.addEventListener('input', () => {
    const text = search.value;
    table.innerHTML = '';

    if (classes.value && text.length > 0) {
        map.forEach((value, key) => {
            if (key.toLowerCase().includes(text.toLowerCase())) {
                const tr = document.createElement('tr');
                const question = document.createElement('td');
                const answer = document.createElement('td');
                question.innerText = key;
                answer.innerText = value;
                tr.append(question, answer);
                table.append(tr);
            }
        });
    }
});
