import inquirer from 'inquirer'
import fs from 'fs'
import express from 'express'


const api = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permette a tutte le origini
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

api.get('/list', (req, res) => {
    let prodotti = fs.readFileSync('data.json', 'utf8');
    res.send(prodotti);
});

api.listen(3000, () => {
    console.log('Server in ascolto sulla porta 3000');
});

const menù = [
    {
        type: 'list',
        name: 'opzione',
        message: 'Scegli un\'opzione:',
        choices: ['Visualizza prodotti', 'Inserisci prodotto', 'Modifica prodotto', 'Elimina prodotto', 'Esci']
    }
];



const inserisci = [
    {
        type: 'input',
        name: 'name',
        message: 'Nome del prodotto: ',
        validate: function (input) {
            let valid = input !== '';
            return valid || 'Non puoi lasciare vuoto questo campo!';
        }
    },
    {
        type: 'list',
        name: 'category',
        message: 'Categoria del prodotto: ',
        choices: ['Fruits', 'Vegetables']
    },
    {
        type: 'input',
        name: 'price',
        message: 'Prezzo del prodotto: ',
        validate: function (input) {
            let valid = input !== '';
            return valid || 'Non puoi lasciare vuoto questo campo!';
        }
    },
    {
        type: 'list',
        name: 'stocked',
        message: 'In stock?',
        choices: ['Sì', 'No'],
        filter: function (val) {
            return val === 'Sì';
        }
    }
];


function main() {
    let prodotti = [];
    inquirer.prompt(menù).then((risposte) => {
        switch(risposte.opzione) {
            case 'Visualizza prodotti':
                prodotti = fs.readFileSync('data.json', 'utf8');
                prodotti = JSON.parse(prodotti);
                prodotti.forEach((prodotto) => {
                    console.log(`Nome: ${prodotto.name}, Categoria: ${prodotto.category}, Prezzo: ${prodotto.price}€, In stock: ${prodotto.stocked ? 'Sì' : 'No'}`);
                });
                main();
                break;
            case 'Inserisci prodotto':
                prodotti = fs.readFileSync('data.json', 'utf8');
                prodotti = JSON.parse(prodotti);
                inquirer.prompt(inserisci).then((risposte) => {
                    if (prodotti.filter((prodotto) => prodotto.name === risposte.name).length === 0) {
                        prodotti.push(risposte);
                        fs.writeFileSync('data.json', JSON.stringify(prodotti), (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            console.log('Prodotto inserito correttamente!')
                        });
                    }else {
                        console.log('Prodotto già presente!')
                    }
                    main();
                });
                break;
            case 'Modifica prodotto':
                
                break;
            case 'Elimina prodotto':
                
                break;
            case 'Esci':
                
                return;
        }
    });
}


main();