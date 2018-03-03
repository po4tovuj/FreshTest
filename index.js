
/* render page, here could be entered data from json by using variables from:
fetch(url)
fetch(stepThreeUrl, add)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("error while fetching, " + response.statusText);
        })
        .then(data=>{
            data.Summ,
            data.Term 
            etc...
            and put it in templates
        })
        .catch(err => {
            console.error("Error: ", err);
        });
*/
function pageRender() {
    let mainRender = `<form action="#" method="post" class="form-fields" autocomplete="on">
            <label>Enter Summ
                <input type="number" id="summ" required>
            </label>
            <label>Enter Term
                <input type="number" id="term" required>
            </label>

            <label> Enter your INN
                <input type="number" class="step-2" id="inn" disabled required>
            </label>
            <label> Enter your Name
                <input type="text" class="step-2" id="name" disabled required>
            </label>
            <label> Enter your Surname
                <input type="text" class="step-2" id="surname" disabled required>
            </label>

            <label> Enter your City
                <input type="text" value="" class="get-city step-2" id="f_elem_city" disabled required>
            </label>

            <p class="errorMessage"></p>
            <input type="submit" id="next" value="Get List">
        </form>`;
    let container = select('.container');
    container.insertAdjacentHTML('beforeEnd',  mainRender);
}

window.onload = pageRender();

function select(name) {
    return document.querySelector(name);
}

let errorMessage = select('.errorMessage');
let clientInfo = {};
let url = "http://localhost:3000/";
let city = select('.get-city');
let currentId = '';
let currentStep = '';

(function() {
    let term = select('#term');
    let summ = select('#summ');
    let name = select('#name');
    let surname = select('#surname');
    let inn = select('#inn');

//check valid summ
function statusBar () {
    let status = select('.status');
    function textStatus (text) {
        return setTimeout(() => {
            status.innerHTML = `<span class="status status__text">${text}</span>`;
        }, 1500);
    }
    switch (Object.keys(clientInfo).length) {
        case 1:
            status.style.width = `100px`;
            textStatus('You fill 10%');
            break;
        case 2:
            status.style.width = `200px`;
            textStatus('You are finish stepOne');
            break;
        case 3:
            status.style.width = `300px`;
            textStatus('You are finished 50%');
            break;
        case 4:
            status.style.width = `400px`;
            textStatus('You are finished 50% of stepTwo');
            break;
        case 5: 
            status.style.width = `500px`;
            textStatus('You are  almost finish');
            break;
        case 6:
            status.style.width = `600px`;
            textStatus('Chek your information a confirm it');
            break;
        default:
            status.style.width = '';
            textStatus('');
            return;
    }
}

    function checkSumm() {
        if (summ.value === '' || summ.value > 10000 || summ.value <= 0) {
            if (clientInfo.hasOwnProperty('summ')) {
                delete clientInfo.summ;
            }
            summ.value = '';
            summ.focus();
            term.setAttribute('disabled', true);
            errorMessage.textContent = 'Введите сумму. Сумма должна быть больше 0 и меньше 10000';
        } else if (parseInt(summ.value) != summ.value) {
            if (clientInfo.hasOwnProperty('summ')) {
                delete clientInfo.summ;
            }
            summ.value = '';
            summ.focus();
            term.setAttribute('disabled', true);
            errorMessage.textContent = 'Вы не корректно заполнили поле Summ. Cумма должна быть целым числом';
        } else {
            term.removeAttribute('disabled');
            errorMessage.textContent = '';
            clientInfo.summ = summ.value;
            statusBar();
            console.log(clientInfo);
        }
        return checkStepOne(); /* here will be check firstStep if client try to comeback from next input  */
    }
// check valid term
    function checkTermValid() {
        let termPattern = /^[1-9]{1}$|^1{1}[0-2]{1}$/;
        let checkTerm = termPattern.test(term.value);
        if (!checkTerm) {
            if (clientInfo.hasOwnProperty('term')) {
                delete clientInfo.term;
            }
            term.value = '';
            errorMessage.textContent = 'Вы не корректно заполнили поле Term. Введите целое число от 1 до 12';
        } else {
            clientInfo.term = term.value;
            statusBar();
            errorMessage.textContent = '';
        }
        return checkStepOne();
    }
//check for correct fills of first two inputs, and write in json information from them into StepOne
    function checkStepOne() {
        let inputs = document.querySelectorAll('input.step-2');
        if (Object.keys(clientInfo).length >= 2) {
            delAttr(inputs);
            inn.focus();
            let add = {};
            let stepOneUrl = `${url}stepOne`;
            add.headers = {
                'Content-Type': 'application/json'
            };
            add.method = "POST";
            add.body = JSON.stringify({
                "Summ": summ.value,
                "Term": term.value
            });
            fetch(stepOneUrl, add)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("error while fetching, " + response.statusText);
                })
                .then(data => {
                    currentId = data.id;
                    currentStep = "stepOne";
                  
                })
                .catch(err => {
                    console.error("Error: ", err);
                });
        } else {
            setAttr(inputs);
        }
    }
//End checking

    let setAttr = (name) => {
        name.forEach(elem => {
            elem.setAttribute('disabled', true);
        });
    };

    let delAttr = (name) => {
        name.forEach(elem => {
            elem.removeAttribute('disabled');
        })
    };

//check correct INN and check age>=21 to continuation
    function checkInn() {
        let dateOfBirth = new Date(0, 0, parseFloat(inn.value.slice(0, 5)));
        let yearOfBirth = dateOfBirth.getFullYear();
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let age = currentYear - yearOfBirth;
        let stepTwoErr = document.querySelectorAll('input#name, input#surname, input.get-city');
        if (inn.value.length > 10 || inn.value.length < 10) {
            if (clientInfo.hasOwnProperty('inn')) {
                delete clientInfo.inn;
            }
            inn.value = '';
            inn.focus();
            errorMessage.textContent = "INN must contain of 10 numbers. Please enter your real INN.";
        } else if (age < 21) {
            if (clientInfo.hasOwnProperty('inn')) {
                delete clientInfo.inn;
            } /* if age less then 21 remove data from json */
            let removeUrl = `${url}${currentStep}/${currentId}`;
            let removed = {};
            removed.headers = {
                'Content-Type': 'application/json'
            };
            removed.method = "DELETE";
            removed.body = JSON.stringify({});
            fetch(removeUrl, removed)
                .then(response => {
                    if (response.ok) {
                        response.json();
                    } else {
                        throw new Error("Error fetching data. Response status: " + response.status + " : " + response.statusText);
                    }
                })
                .catch(err => {
                    console.error("Error: ", err);
                });

            errorMessage.textContent = 'Sorry, but your age is less then 21. You couldn\'t take a credit';
            setAttr(stepTwoErr);
        } else {
            clientInfo.inn = inn.value;
            statusBar();
            console.log(age);
            delAttr(stepTwoErr);
        }
    }
// check valid name
    function nameCheck() {
        let namePattern = /^[A-Z a-z]{1}([^а-яёєіїґ’'`]i?)[a-z]+((\s[A-Z]{1}([^а-яёєіїґ’'`]i?)[a-z]+)+)?$|^[А-ЯЁ а-яё]{1}([^a-zєіїґ’'`]i?)[а-яё]+((\s[А-ЯЁ]{1}([^a-zєіїґ’'`]i?)[а-яё]+)+)?$|^[А-ЯЄІЇҐ а-яєіїґ]{1}([^a-zыэъ]i?)[а-яєіїґ’'`]+((\s[А-ЯЄІЇҐ’'`]{1}([^a-zыэъ]i?)[а-яєіїґ’'`]+)+)?$/;
        console.log(name.value);
        let checkName = namePattern.test(name.value);
        if (!checkName) {
            if (clientInfo.hasOwnProperty('name')) {
                delete clientInfo.name;
            }
            name.value = '';
            errorMessage.textContent = 'Enter your real Name';
        } else {
            name.value = name.value[0].toUpperCase() + name.value.substr(1);
            errorMessage.textContent = '';
            clientInfo.name = name.value;
            statusBar();
        }
    }
//check valid Surname
    function surnameCheck() {
        let surnamePattern = /^[A-Z a-z]{1}([^а-яёєіїґ’'`]i?)[a-z]+((-[A-Z]{1}([^а-яёєіїґ’'`]i?)[a-z]+)+)?$|^[А-ЯЁ а-яё]{1}([^a-zєіїґ’'`]i?)[а-яё]+((-[А-ЯЁ]{1}([^a-zєіїґ’'`]i?)[а-яё]+)+)?$|^[А-ЯЄІЇҐ’'` а-яєіїґ]{1}([^a-zыэъ]i?)[а-яєіїґ’'`]+((-[А-ЯЄІЇҐ’'`]{1}([^a-zыэъ]i?)[а-яєіїґ’'`]+)+)?$/;
        let checkSurname = surnamePattern.test(surname.value);
        if (!checkSurname) {
            if (clientInfo.hasOwnProperty('surname')) {
                delete clientInfo.surname;
            }
            surname.value = '';
            errorMessage.textContent = 'Enter your real Surname';
        } else {
            errorMessage.textContent = '';
            surname.value = surname.value[0].toUpperCase() + surname.value.substr(1);
            clientInfo.surname = surname.value;
            statusBar();
        }
    }
    //check city and write data in Json in StepTwo
    function checkCity () {
        if (city.value === ''){
            city.focus();
            errorMessage.textContent = 'Please enter your city';
        } else {
            clientInfo.city = city.value;
            statusBar();
            let add = {};
            let stepTwoUrl = `${url}stepTwo`;
            add.headers = {
                'Content-Type': 'application/json'
            };
            add.method = "POST";
            add.body = JSON.stringify({
                "INN": inn.value,
                "Name": name.value,
                "Surname": surname.value,
                "City": city.value,
            });
            fetch(stepTwoUrl, add)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("error while fetching, " + response.statusText);
                })
                .catch(err => {
                    console.error("Error: ", err);
                });
            errorMessage.textContent = '';
        }
    }
//start validate by loosing focus
    name.addEventListener('blur', nameCheck);
    inn.addEventListener('blur', checkInn);
    term.addEventListener('blur', checkTermValid);
    summ.addEventListener('blur', checkSumm);
    surname.addEventListener('blur', surnameCheck);
    city.addEventListener('blur', checkCity);
})();

//by clicking will be open list with entered data

let btnNext = select('#next');
let change = false;
btnNext.addEventListener('click', function () {
    if (Object.keys(clientInfo).length == 6 && !change) {
        event.preventDefault();
        change = true;
        btnNext.value = 'Confirm';
        console.log(change);
        let renderKey = '';
        let renderVal = '';
        for (let key in clientInfo) {
            renderKey += `<th>${key}</th>`
            renderVal += `<td>${clientInfo[key]}</td>`
            console.log(`${key}: ${clientInfo[key]}`);
        }

        let renderList = `<table class="list">
        <caption> Please confirm your infirmation</caption>
        <tr class="first-row"> ${renderKey}</tr>
           <tr> ${renderVal}</tr>
        </table>`;
        // btnConf.style.visibility = "visible";
        let container = select('.container');
        container.insertAdjacentHTML('beforeEnd', renderList);
    } else if (Object.keys(clientInfo).length == 6 && change){ 
        change = false; /* if client saw list and all inputs filled it write stepThree in Json*/
        btnNext.value = 'Get List';
        console.log(change);    
        writeStepThree();
        
    } else {
        return;
    }
});

// here will be chaged functional ArrowLeft and ArrowRight

window.addEventListener('keydown', function () {
    if (event.defaultPrevented) {
        return;
    }
    switch (this.event.key) {
        case 'ArrowLeft':
            document.activeElement.parentElement.previousElementSibling.focus();
            break;
        case 'ArrowRight':
            document.activeElement.parentElement.nextElementSibling.focus();
            break;
        default:
            return;
    }
    event.preventDefault();
}, true);

function writeStepThree() {
    let add = {};
    let stepThreeUrl = `${url}stepThree`;
    add.headers = {
        'Content-Type': 'application/json'
    };
    add.method = "POST";
    add.body = JSON.stringify({
        "Summ": summ.value,
        "Term": term.value,
        "INN": inn.value,
        "Name": name.value,
        "Surname": surname.value,
        "City": city.value,
    });
    fetch(stepThreeUrl, add)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("error while fetching, " + response.statusText);
        })
        .catch(err => {
            console.error("Error: ", err);
        });
}


// Get autocomplete city from open-base
jQuery(function () {
    jQuery("#f_elem_city").autocomplete({
        source: function (request, response) {
            jQuery.getJSON(
                "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
                function (data) {
                    response(data);
                }
            );
        },
        minLength: 3,
        select: function (event, ui) {
            var selectedObj = ui.item;
            jQuery("#f_elem_city").val(selectedObj.value);
            return false;
        },
        open: function () {
            jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
    jQuery("#f_elem_city").autocomplete("option", "delay", 100);
});