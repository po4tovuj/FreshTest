/*
 render page, here could be entered data from json by using variables from:
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
render page on window.onload
*/



// function for getting by querySellector
function select(b) {
    return document.querySelector(b);
}

let errorMessage = select(".errorMessage");
let clientInfo = {};
let url = "http://localhost:3000/";
let city = select(".get-city");
let currentId = "";
let currentStep = "";


(function () {
    let term = select("#term");
    let summ = select("#summ");
    let surname = select("#surname");
    let inn = select(".inn");
    let myName = select('#myName'); //start validate by loosing focus
    let stepTwo = select('#tab2');
    let stepThree = select('#tab3');
    let btnNext = select('.next');
    let errMessageStep2 = document.querySelector('#tab-content2 p');
    let inputs = document.querySelectorAll('.step-3 input'); /*get inputs from step3 */


    //Progress-bar
    function statusBar() {
        let status = select(".status");

        function textStatus(text) {
            return setTimeout(() => status.innerHTML = `<span class="status status__text">${text}</span>`, 1500);
        }
        switch (Object.keys(clientInfo).length) {
            case 1:
                status.style.width = `100px`;
                textStatus("You fill 10%");
                break;
            case 2:
                status.style.width = `200px`;
                textStatus("You are finish stepOne");
                break;
            case 3:
                status.style.width = `300px`;
                textStatus("You are finished 50%");
                break;
            case 4:
                status.style.width = `400px`;
                textStatus("You are finished 50% of stepTwo");
                break;
            case 5:
                status.style.width = `500px`;
                textStatus("You are  almost finish");
                break;
            case 6:
                status.style.width = `600px`;
                textStatus("Chek your information and confirm it");
                break;
            default:
                status.style.width = "";
                textStatus("");
                return;
        }
    }
    //end Progress-bar
    //check valid Summ
    function checkSumm() {
        if (summ.value === "" || summ.value > 10000 || summ.value <= 0) {
            if (clientInfo.hasOwnProperty("summ")) {
                delete clientInfo.summ;
            }
            summ.value = "";

            stepTwo.setAttribute("disabled", true);
            stepThree.setAttribute("disabled", true); /*close inputs for stepTwo*/
            errorMessage.textContent = "Введите сумму. Сумма должна быть больше 0 и меньше 10000";
        } else if (parseInt(summ.value) != summ.value) {
            if (clientInfo.hasOwnProperty("summ")) {
                delete clientInfo.summ;
            }
            summ.value = "";
            errorMessage.textContent = "Вы не корректно заполнили поле Summ. Cумма должна быть целым числом";
        } else {
            /*open inputs for stepTwo*/
            errorMessage.textContent = "";
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
            if (clientInfo.hasOwnProperty("term")) {
                delete clientInfo.term;
            }
            term.value = "";
            errorMessage.textContent = "Вы не корректно заполнили поле Term. Введите целое число от 1 до 12";
        } else {
            clientInfo.term = term.value;
            statusBar();
            errorMessage.textContent = "";
        }
        return checkStepOne();
    }
    //check for correct fills of first two inputs, and write in json information from them into StepOne
    function checkStepOne() {
        if (Object.keys(clientInfo).length >= 2) {
            stepTwo.removeAttribute('disabled');
            stepTwo.setAttribute('checked', true);
            stepTwo.focus();
            inn.focus();
        } else {
            stepTwo.setAttribute("disabled", true);
            stepThree.setAttribute("disabled", true);
        }
    }

    // btnNext.addEventListener('click', checkStepOne);
    //End checking stepOne

    //step 2 start
    //check correct INN and check age>=21 to continuation
    function checkInn() {
        let dateOfBirth = new Date(0, 0, parseFloat(inn.value.slice(0, 5))); /*get first 5 symbols from INN to check age */
        let yearOfBirth = dateOfBirth.getFullYear();
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let age = currentYear - yearOfBirth;
        let errMessageStep2 = document.querySelector('#tab-content2 p');
        let stepTwoErr = document.querySelectorAll("input#myName, input#surname, input.get-city");
        if (inn.value.length > 10 || inn.value.length < 10) {
            if (clientInfo.hasOwnProperty("inn")) {
                delete clientInfo.inn;
            }
            inn.value = "";
            // inn.focus();
            errMessageStep2.textContent = "INN must contain of 10 numbers. Please enter your real INN.";
        } else if (age < 21) { /*check age. if age > 21 then disable stepTwo*/
            if (clientInfo.hasOwnProperty("inn")) {
                delete clientInfo.inn;
            }


            errMessageStep2.textContent = "Sorry, but your age is less then 21. You couldn\"t take a credit";
            stepTwoErr.forEach(elem => {
                elem.setAttribute('disabled', true);
            })
        } else {
            stepTwoErr.forEach(elem => {
                elem.removeAttribute("disabled");
            });
            errMessageStep2.textContent = "";
            clientInfo.inn = inn.value;
            statusBar();
            console.log(age);
            // delAttr(stepTwoErr);
        }
    }
    // check valid name

    function nameCheck() {

        let namePattern = /^[A-Z a-z]{1}([^а-яёєіїґ’"`]i?)[a-z]+((\s[A-Z]{1}([^а-яёєіїґ’"`]i?)[a-z]+)+)?$|^[А-ЯЁ а-яё]{1}([^a-zєіїґ’"`]i?)[а-яё]+((\s[А-ЯЁ]{1}([^a-zєіїґ’"`]i?)[а-яё]+)+)?$|^[А-ЯЄІЇҐ а-яєіїґ]{1}([^a-zыэъ]i?)[а-яєіїґ’"`]+((\s[А-ЯЄІЇҐ’"`]{1}([^a-zыэъ]i?)[а-яєіїґ’"`]+)+)?$/;
        let checkName = namePattern.test(myName.value);
        if (!checkName) {
            if (clientInfo.hasOwnProperty("name")) {
                delete clientInfo.Name;
            }
            myName.value = "";
            errMessageStep2.textContent = "Enter your real Name";
        } else {
            /* if user write name whith small first letter
                       it will change it to UpperCase example write "petya", will change to "Petya"  */
            myName.value = myName.value[0].toUpperCase() + myName.value.substr(1);
            errMessageStep2.textContent = "";
            clientInfo.name = myName.value;
            statusBar();
        }
    }
    //check valid Surname
    function surnameCheck() {
        let surnamePattern;
        surnamePattern = /^[A-Z a-z]{1}([^а-яёєіїґ’"`]i?)[a-z]+((-[A-Z]{1}([^а-яёєіїґ’"`]i?)[a-z]+)+)?$|^[А-ЯЁ а-яё]{1}([^a-zєіїґ’"`]i?)[а-яё]+((-[А-ЯЁ]{1}([^a-zєіїґ’"`]i?)[а-яё]+)+)?$|^[А-ЯЄІЇҐ’"` а-яєіїґ]{1}([^a-zыэъ]i?)[а-яєіїґ’"`]+((-[А-ЯЄІЇҐ’"`]{1}([^a-zыэъ]i?)[а-яєіїґ’"`]+)+)?$/;
        let checkSurname = surnamePattern.test(surname.value);
        if (!checkSurname) {
            if (clientInfo.hasOwnProperty("surname")) {
                delete clientInfo.surname;
            }
            surname.value = "";
            errMessageStep2.textContent = "Enter your real Surname";
        } else {
            errMessageStep2.textContent = "";
            surname.value = surname.value[0].toUpperCase() + surname.value.substr(1);
            clientInfo.surname = surname.value;
            statusBar();
        }
    }
    //check city and write data in Json in StepTwo
    function checkCity() {
        if (city.value === "") {
            errMessageStep2.textContent = "Please enter your city";
        } else {
            clientInfo.city = city.value;
            statusBar();
            errMessageStep2.textContent = "";
        }
    }

    function checkStepTwo() {
        if (Object.keys(clientInfo).length === 6) {
            stepThree.removeAttribute('disabled');
            stepThree.setAttribute('checked', true);
            stepThree.focus();
        } else {
            stepThree.setAttribute("disabled", true);
        }
    }
    myName.addEventListener("blur", nameCheck);
    inn.addEventListener("blur", checkInn);
    term.addEventListener("blur", checkTermValid);
    summ.addEventListener("blur", checkSumm);
    surname.addEventListener("blur", surnameCheck);
    city.addEventListener("blur", checkCity);
    let btnList = document.querySelector('.get-list');

    btnList.addEventListener("click", function () {
        event.preventDefault();
        checkStepTwo();

        if (Object.keys(clientInfo).length === 6) {
            stepThree.removeAttribute('disabled');
            stepThree.setAttribute('checked', true);
            stepThree.focus();
            let renderKey = "";
            let renderVal = "";
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
            let container = select("#tab-content3 form");
            container.insertAdjacentHTML("afterBegin", renderList);
            
        } else {
            return;
        }
    });
    let btnConfirm = select('#confirm');
    btnConfirm.addEventListener('click', function(){
        event.preventDefault();
        addStepOne();
        addStepTwo();
        addStepThree();
    })
})();


function addStepOne() {
    let add = {};
    let stepOneUrl = `${url}stepOne`;
    add.headers = {
        "Content-Type": "application/json"
    };
    add.method = "POST";
    add.body = JSON.stringify({
        "Summ": clientInfo.summ,
        "Term": clientInfo.term
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
}

function addStepTwo() {
    let add = {};
    let stepTwoUrl = `${url}stepTwo`;
    add.headers = {
        "Content-Type": "application/json"
    };
    add.method = "POST";
    add.body = JSON.stringify({
        "INN": clientInfo.inn,
        "Name": clientInfo.name,
        "Surname": clientInfo.surname,
        "City": clientInfo.city
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
}

function addStepThree() {
    let add = {};
    let stepThreeUrl = `${url}stepThree`;
    add.headers = {
        "Content-Type": "application/json"
    };
    add.method = "POST";
    add.body = JSON.stringify({
        "Summ": clientInfo.summ,
        "Term": clientInfo.term,
        "INN": clientInfo.inn,
        "Name": clientInfo.name,
        "Surname": clientInfo.surname,
        "City": clientInfo.city
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

//by clicking will be open list with entered data
// below will be opened list of entered information and then confirm it
// let btnNext = select(".next");
// let change = false;


// here will be chaged functional ArrowLeft and ArrowRigh
window.addEventListener("keydown", function () {
    if (event.defaultPrevented) {
        return;
    }
    switch (this.event.key) {
        case "ArrowLeft":
            document.activeElement.parentElement.previousElementSibling.focus();
            break;
        case "ArrowRight":
            document.activeElement.parentElement.nextElementSibling.focus();
            break;
        default:
            return;
    }
    event.preventDefault();
}, true);

//get tabs

$(document).ready(function () {

    (function ($) {
        $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');

        $('.tab ul.tabs li a').click(function (g) {
            var tab = $(this).closest('.tab'),
                index = $(this).closest('li').index();

            tab.find('ul.tabs > li').removeClass('current');
            $(this).closest('li').addClass('current');

            tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
            tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();

            g.preventDefault();
        });
    })(jQuery);

});

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