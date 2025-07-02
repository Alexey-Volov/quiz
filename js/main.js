/* 
1. делаем перемещение по картчкам назад и вперёд
2. Делаем проверку на ввод данных
3. получение данных с карточек
4. записывать все введённые данные
5. работа прогресс бара
6. подсветка рамки для радио и чекбоксов
*/

// объект с данными
var answers = {
    2: null,
    3: null,
    4: null,
    5: null
}
// next
var btnNext = document.querySelectorAll('[data-nav="next"]');

btnNext.forEach(function(button) {
    button.addEventListener("click", function() {
    var thisCard = this.closest("[data-card]");
    var thisCardNumber = parseInt(thisCard.dataset.card);

    if(thisCard.dataset.validate == "novalidate") {

        navigate("next", thisCard);
        updateProgressBar("next", thisCardNumber);
    } else {

        saveAnswer(thisCardNumber, gatherCarData(thisCardNumber));

        // валидация на заполненность
        if(isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);
        } else {
            alert("Cделайте ответ!")
        }
    }
    });
});
// Prev
var btnPrev = document.querySelectorAll('[data-nav="prev"]');

btnPrev.forEach(function(button) {
        button.addEventListener("click", function() {
        var thisCard = this.closest("[data-card]");
        var thisCardNumber = parseInt(thisCard.dataset.card);
        navigate("prev", thisCard);
        updateProgressBar("prev", thisCardNumber);
    });
});

function navigate(direction, thisCard) {    
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;

    if (direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }
    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden"); // находим след card
}

// функция сбора данных с карточки
function gatherCarData(number) {
    
    var question;
    var result = [];

    // найдём текущую карточку по номеру и дата атр
    var currentCard = document.querySelector(`[data-card="${number}"]`);

    // найдём вопрос карточки
    question = currentCard.querySelector('[data-question]').innerText;

    // 1. находим все заполненные значения из радиокнопок
    var radioValues = currentCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(function(item) {

        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })
    // 2. находим все заполненные значения из чекбоксов
    var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');

    checkBoxValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    // 3. находим все заполненные значения из инпутов
    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');

    inputValues.forEach(function(item) {
        itemValue = item.value;
        if (item.value.trim() != "") {
                result.push({
                name: item.name,
                value: item.value
            });
        }

    })

    var data = {
        question: question,
        answer: result
    }

    return data;
}

// функция записи ответа в объект с ответами
function saveAnswer(number, data) {
    answers[number] = data
}

// проверяем на заполненность
function isFilled(number) {
    if(answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// проверяем на заполненность чекбоксов и инпутов с почттой
function checkOnRequired(number) {
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var requiredFields = currentCard.querySelectorAll("[required]");

    var isValidArray = [];
    
    requiredFields.forEach(function(item) {

        if(item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if(item.type == "email") {
            if  (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });


    if(isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    }
    


}

// добавляем рамки по клику

document.querySelectorAll(".radio-group").forEach(function (item) {
    item.addEventListener("click", function(e) {
        var label = e.target.closest("label");
        
        if(label) {
            label.closest(".radio-group").querySelectorAll("label").forEach(function(item) {
                item.classList.remove("radio-block--active");
            })
            label.classList.add("radio-block--active");
        }
    })
})

// подсвечивем чекбоксы
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener("change", function(e) {
        if (item.checked) {
            item.closest("label").classList.add("checkbox-block--active");
        } else {
            item.closest("label").classList.remove("checkbox-block--active");
        }
    });
})

// прогресс бар


function updateProgressBar(direction, cardNumber) {
    // найдём все карточки
    var cardsTotalNumber = document.querySelectorAll("[data-card]").length
    // проверяем перемещение
    if (direction == "next") {
        cardNumber = cardNumber + 1;
    } else if (direction == "prev") {
        cardNumber = cardNumber - 1;
    }

    // рассчёт %
    var progress = (cardNumber * 100) / cardsTotalNumber;
    progress = progress.toFixed();

    // обновляем прогресс бар
    var currentCard = document.querySelector(`[data-card="${cardNumber}"]`);
    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");

    if (progressBar) {
        progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;

        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    }
}
