/* import { layouts } from 'layouts.js';

console.log(layouts); */

const layouts = {
    bg : {
        full : [
            {
                vertical_image : 'url.svg',
                vertical_css : '    display: none;\n',
                horizontal_image : 'url.svg',
                horizontal_css : '  display: none;\n'
            },
            {
                vertical_image : 'url.svg',
                vertical_css : '    width: 30%;\n    height: 16%;\n    left: 10%;\n    bottom: 80%;\n    background-position: left top;\n',
                horizontal_image : 'url.svg',
                horizontal_css : '    width: 30%;\n    height: 16%;\n    left: 10%;\n    bottom: 80%;\n    background-position: left top;\n',
            },
            {
                vertical_image : 'url.svg',
                vertical_css : '    width: 30%;\n    height: 16%;\n    left: 10%;\n    bottom: 80%;\n    background-position: left top;\n',
                horizontal_image : 'url.svg',
                horizontal_css : '    width: 30%;\n    height: 16%;\n    left: 10%;\n    bottom: 80%;\n    background-position: left top;\n',
            },
            {
                vertical_image : 'url.svg',
                vertical_css : '    width: 30%;\n    height: 16%;\n    left: 10%;\n    bottom: 80%;\n    background-position: left top;\n',
                horizontal_image : 'url.svg',
                horizontal_css : '    width: 30%;\n    height: 16%;\n    left: 10%;\n    bottom: 80%;\n    background-position: left top;\n',
            }
        ],
        bar : [
            {
                desktop_image : 'url.svg',
                desktop_css : '  display: none; \n',
                mobile_image : 'url.svg',
                desktop_css : '  display: none; \n'
            },
            {
                desktop_image : 'url.svg',
                desktop_css : '  width: 20%;\n    height: 50%;\n    left: 2%;\n    bottom: 15%;\n',
                mobile_image : 'url.svg',
                desktop_css : '  width: 20%;\n    height: 50%;\n    left: 2%;\n    bottom: 15%;\n'
            },
            {
                desktop_image : 'url.svg',
                desktop_css : '  width: 20%;\n    height: 50%;\n    left: 2%;\n    bottom: 15%;\n',
                mobile_image : 'url.svg',
                desktop_css : '  width: 20%;\n    height: 50%;\n    left: 2%;\n    bottom: 15%;\n'
            }
        ]
    },
}

// VARIABLES: GENERAL
const appContainer = document.querySelector('.app-container');

const scenesPerFormat = {
    CED : ['bar-show'],
    CID : ['full', 'bar-show'],
    CEV : ['bar-video', 'bar-show'],
    CBV : ['full', 'bar-video', 'bar-show']
}

// VARIABLES: GENERATOR (LAYOUTS FORM)
const buttonClear = document.querySelector('.generator-clear');
const selectComponent = document.querySelector('.generator-config-component');
const selectFormat = document.querySelector('.generator-config-format');
const selectScene = document.querySelector('.generator-config-scene');

const generatorForm = document.getElementById('generator-element-container');
const buttonsDelete = document.querySelectorAll('.element-delete');

const selectAdd = document.querySelector('.generator-add');
const buttonGenerate = document.querySelector('.generator-generate');


// VARIABLES: RESULTS (CODES)
const textareaCss = document.getElementById('result-css');

let formResults = [];

const layoutsVariations = {
    block : 3,
    bg : 3,
    cta : 3,
    legal : 3,
    logo : 3
}

let currentAmount = {
    bg : 1,
    block : 1,
    cta : 1,
    legal : 0,
    logo : 1
}


// GENERATOR: CONFIG

// Clear all
buttonClear.addEventListener('click', () => {
    let resultsContainer = document.querySelector('.results-container');
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.lastChild);
    }
});

//  Select format: Hide layout collections + Update preview
const addViewClasses = ( visibleScenes ) => {
    appContainer.classList.remove('view-full');
    appContainer.classList.remove('view-bar-video');
    appContainer.classList.remove('view-bar-show');

    if (visibleScenes.constructor === Array) {
        for (let scene of visibleScenes) {
            appContainer.classList.add(`view-${scene}`);
        }
    } else {
        appContainer.classList.add(`view-${visibleScenes}`);
    }
}

selectFormat.addEventListener('change', () => {
    appContainer.classList.remove('building-CED');
    appContainer.classList.remove('building-CID');
    appContainer.classList.remove('building-CEV');
    appContainer.classList.remove('building-CBV');
    appContainer.classList.add(`building-${selectFormat.value}`);

    addViewClasses(scenesPerFormat[selectFormat.value]);
    selectScene.value = 'all';
});

selectScene.addEventListener('change', () => {
    if (selectScene.value == 'all') {
        addViewClasses(scenesPerFormat[selectFormat.value]);
    } else {
        addViewClasses(selectScene.value);
    }
});


// GENERATOR: CREATE LAYOUT COLLECTIONS

const createNewInput = (elementType, container) => {
    for (let i = 0; i < layoutsVariations[elementType]; i++) {
        var newLabel = document.createElement('label');
        container.lastChild.appendChild(newLabel);

        var newImage = document.createElement('img');
        newImage.src = 'https://creatives.seedtag.com/63dbce2779d1cb002bb354e7/1675349585436.svg';
        newLabel.appendChild(newImage);

        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'radio');
        newInput.setAttribute('name', `layout-${elementType}-${currentAmount[elementType]}`);
        newInput.dataset.type = elementType;
        newInput.setAttribute('value', `${elementType}-${i}`);
        if (i == 0) { newInput.setAttribute('checked', '') };
        newLabel.appendChild(newInput);
    }
}

const createNewGeneratorElement = (elementType) => {
    currentAmount[elementType]++;
    var newGeneratorElement = document.createElement('div');
    newGeneratorElement.classList.add('generator-element');
    newGeneratorElement.dataset.type = elementType;
    newGeneratorElement.innerHTML = `<h3>${elementType} ${currentAmount[elementType]}</h3><button class="button button-delete">Delete</button><div class="layout-collection"></div>`;
    generatorForm.appendChild(newGeneratorElement);
    createNewInput(elementType, newGeneratorElement);
}

selectAdd.addEventListener('change', () => {
    createNewGeneratorElement(selectAdd.value);
    selectAdd.value = 'Add';
});

for (const button of buttonsDelete) {
    button.addEventListener('click', () => {
        let generatorElement = button.parentElement;
        generatorForm.removeChild(generatorElement);
        let elementType = generatorElement.dataset.type;
        currentAmount[elementType]--;
    });
}


// GENERATE CODE

const generateComponentCSS = (formData) => {
    let elementNumber = 1;

    for (const result of formResults) {
        if (result.type == 'bg') {
            let elementExtension = 'jpg';
            textareaCss.value += `.${result.type}-${elementNumber} {\n  background-image: url({{${result.type}-${elementNumber}.${elementExtension}}});\n}\n\n`;
            (elementNumber == currentAmount[result.type] ) ? 1 : elementNumber++;
        }
    }
    for (const result of formResults) {
        if (result.type == 'logo') {
            let elementExtension = 'svg';
            textareaCss.value += `.${result.type}-${elementNumber} {\n  background-image: url({{${result.type}-${elementNumber}.${elementExtension}}});\n}\n\n`;
            (elementNumber == currentAmount[result.type] ) ? 1 : elementNumber++;
        }
    }
    for (const result of formResults) {
        if (result.type == 'block') {
            let elementExtension = 'png';
            textareaCss.value += `.${result.type}-${elementNumber} {\n  background-image: url({{${result.type}-${elementNumber}.${elementExtension}}});\n}\n\n`;
            (elementNumber == currentAmount[result.type] ) ? 1 : elementNumber++;
        }
    }
    for (const result of formResults) {
        if (result.type == 'cta') {
            let elementExtension = 'svg';
            textareaCss.value += `.${result.type}-${elementNumber} {\n  background-image: url({{${result.type}-${elementNumber}.${elementExtension}}});\n}\n\n`;
            (elementNumber == currentAmount[result.type] ) ? 1 : elementNumber++;
        }
    }
}

const generateSceneFull = () => {
    console.log(layouts.bg.full[1].vertical_css)
}

buttonGenerate.addEventListener('click', () => {

    let checkedElements = document.querySelectorAll('.layout-collection input[type="radio"]');
    
    for ( let i = 0; i < checkedElements.length; i++ ) {
        if (checkedElements[i].checked) {
            let element = {};
            element.type = checkedElements[i].dataset.type;
            element.scene = checkedElements[i].dataset.scene;
            element.size = checkedElements[i].dataset.size;
            element.value = checkedElements[i].id;
            formResults.push(element);
        }
    }
    
    generateComponentCSS(formResults);
    generateSceneFull(formResults);
    console.log(formResults);
});