import axios from 'axios';

// Instanca axios
const instance = axios.create({
    baseURL: 'https://kandi-app-d8b77dad00c8.herokuapp.com',
    timeout: 1000,
});

export default {
    data() {
        return {
            mesto: '',
            pridobljeniPodatki: {},
            zgodovina: [],
        };
    },
    methods: {
        pridobiWeather() {
            const mesto = this.mesto.trim()

            // Če vnos v input-u ni prazen potem nadaljuj
            if (mesto !== '') {

                // Pridobitev podatkov iz backend postavljen na heroku
                instance(`/mesto/${mesto}`)
                    .then(response => {

                        // Če je status respons pod 300 izvedi kodo, drugače mesto ne obstaja in se zgodi error
                        if (response.status < 300) {

                            // Pridobivanje podatkov
                            const data = response.data;
                            this.pridobljeniPodatki = data;

                            // Omejitev zgodovine na 5 vnosov, kar je več se zadnji prikazani izbriše
                            while (this.zgodovina.length >= 5) {
                                this.zgodovina.pop();
                            }

                            // Podatki se shranijo v zgodovino in izpišejo
                            return this.zgodovina.unshift(data);
                        } else {
                            // Če se zgornja kondicija ne zgodi mesto ne obstaja
                            alert('Mesto ne obstaja')
                        }

                    })
                    .catch((error) => {
                        if (!error.response) {
                            // Če ni nikakršnega odziva v error-ju potem:
                            alert('Server ne deluje!')
                        } else if (error.response.status < 500) {
                            // Če je status odziva error-ja manjši od 500 potem:
                            alert(`Mesto ne obstaja`)
                        } else {
                            // Karkoli drugega spada pod neznano napako:
                            alert('Neznana napaka')
                        }
                    })
            }

            // Reset inputa za vnos iskanega mesta
            this.mesto = '';
        },
        uporabiWeather(index) {

            // input se popularizira z imenom, ki je v izbranem indeksu zgodovine
            this.mesto = this.zgodovina[index].name;

            // pridobljeni podatki se popularizirajo s podatki izbranega indeksa
            this.pridobljeniPodatki = this.zgodovina[index];
        }
    },
};
