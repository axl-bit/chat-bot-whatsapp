import fs from 'fs';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';
import ora from 'ora';


let client;
let sessionData

const SESSION_FILE_PATH = './session.json';

const onSession = () => {

    const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp... ')}`);
    sessionData = require(SESSION_FILE_PATH);
    spinner.start();

    client = new client({
        session:sessionData
    })

    client.on('ready',()=>{
        console.log('client is ready')
        spinner.stop();
    })

};

const offSession = () => {

    console.log("No tenemos session guardada");

    client = new Client();

    client.on('qr', qr =>{
        qrcode.generate(qr, {small:true})
    })

    client.on('authenticated', (session) => {

        sessionData = session;

        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err){
            if(err){
                console.log(err);
            }
        });

    });

    client.initialize();

}

(fs.existsSync(SESSION_FILE_PATH)) ? onSession() : offSession();