//array ids de recetas guardadas en favoritos

let stringToArray = [];
let recetario;

favoritesStorageArray()

//convierte el string guardado en un array de numeros y se lo asigna a recetario.

function favoritesStorageArray(){
    let getFavString  =  localStorage.getItem('favoritesStorage');
    if(getFavString){
        stringToArray = getFavString.split(',');
    
        for(let i =0;i<stringToArray.length;i++){
            stringToArray[i]= (parseInt(stringToArray[i]));
        }
        recetario = stringToArray;
    }else{
        recetario = [];
    }
}

//le pasa el valor actualizado de recetario transformado en string al Localstorage

function updateStorage(){
    localStorage.setItem('favoritesStorage', recetario.toString());
    favoritesStorageArray();
}

//Constructor de recetas
class Recipe {
    constructor (name, id, ingredientes, instrucciones, imagen, descripcion, preparacion, porciones, categoria) {
        this.name = name;
        this.id = id;
        this.ingredientes = ingredientes;
        this.instrucciones = instrucciones;
        this.imagen = imagen;
        this.missingIngredients = [];    
        this.descripcion = descripcion;
        this.preparacion = preparacion;
        this.porciones = porciones;
        this.categoria = categoria;
        this.favorited = false;
    }
    
    addFavorite(){
        recetario.push(this.id);

    }

}

//Array de recetas
const recipes = [];


const recipesList = document.getElementById('result');
        
 const getJSON = async () => {
        
        
     const response = await fetch ('./json/recipes.json')
     const data = await response.json()
     
     //agrega las recetas del json al array recipes[]
     data.forEach((recipe)=>{
         recipes.push(recipe);
        })
        
    //simulo una demora en la petición para poder ver el Loading.    
        setTimeout(()=>{
            $('#loading-cont').fadeOut();
            showRecipes(recipes);
        },1500)
        

    }
    getJSON()


//modal recetas

let currentId = 0;

function createModal(e){
    currentId = e.id;

    let modal = document.getElementById('modal');
    modal.classList.toggle('visible')
    modal.addEventListener('click', (e)=>{
        if(e.target == modal){
            closeModal(e);

        }
    })

    
    let instruccionesLista = [];
    let ingredientesLista = e.ingredientes.split(',');


    for(let i=0;i<ingredientesLista.length;i++){
        ingredientesLista[i] = `<li>${ingredientesLista[i]}</li>`;
    }

    

    for(let i=0;i<e.instrucciones.length;i++){
        instruccionesLista.push(`<li>${e.instrucciones[i]}</li>`)
    }

    let recipeModal = document.createElement('div');
    recipeModal.classList.add('modal-cont')
    recipeModal.innerHTML = `   <div class="descripcion">
                                    <img src="${e.imagen}" alt="">
                                    <div class="texto">
                                    <h2>${e.name}</h2>
                                    <p>
                                    <h5>Preparación: ${e.preparacion}</h5>
                                    <h5>Porciones: ${e.porciones}</h5>
                                    <h5 class="categoria ${e.categoria}">${e.categoria}</h5>
                                    </p>
                                    </div>
                                </div>
                                <div class="receta-cont">
                                    <ul class="ingredientes">${ingredientesLista.join('')}</ul>
                                    <ol class="receta">${instruccionesLista.join('')}</ol>

                                </div>`          

      //creo agregar al recetario                       
    let = favoriteheart = document.createElement('span');
    favoriteheart.addEventListener('click',(e)=>{
        favorite(e);
        generarRecetario();
    })
    favoriteheart.classList.add('favoriteheart', 'material-icons-outlined', 'noselect')
    favoriteheart.innerHTML = "favorite";

    //si el id de la receta está en el array recetario, pinta el corazon de rojo
    let found = recetario.find(element => element === currentId);
    if(found){
        favoriteheart.classList.add('favorite')
    }

    modal.appendChild(recipeModal);
    recipeModal.appendChild(favoriteheart);

}

//funcion de agregar id de la receta al array favoritos, si el id ya se encuentra en el array, lo saca
function favorite(e){
    let found = recetario.find(element => element === currentId);

    if(!found){
        e.target.classList.toggle('favorite')
        recetario.push(currentId);
        updateStorage();
    }else{
        e.target.classList.toggle('favorite')
        const recipeIndex = recetario.indexOf(found);
        recetario.splice(recipeIndex,1);
        updateStorage();
    }

}


function closeModal(e){
    document.getElementById('modal').innerHTML = ""
    modal.classList.remove('visible')
}


// No se encuentran recetas con esos valores de busqueda.

function showNoResults(){
    let listItem = document.createElement('li');
    listItem.innerHTML = `  <img src="./img/arrow_left_circle_icon_136939.png" alt="BACK">
    <div class="recipe-info">
    <h4>No se encontraron recetas</h4>
    <h5>Presione este cuadro o elimine los tags para resetear la búsqueda</h5>
    </div>`;
    recipesList.appendChild(listItem);
    listItem.addEventListener('click', ()=>{
        searchWords.innerHTML= ""
        showRecipes(recipes);
    })
}

// crea los tags de búsqueda, el parametro (e) es el array ingredientesDisponibles si buscas por ingredientes
// o el valor de userInput si buscas por nombre de receta.

function showTags(e){
    if(e.length>0){

        let searchWords = document.getElementById('searchWords');
        let deleteTags = document.createElement('b');
        deleteTags.addEventListener('click', ()=>{
            searchWords.innerHTML= ""
            ingredientesDisponibles = ""
            showRecipes(recipes);
        })
        deleteTags.innerHTML = 'X';
        deleteTags.classList.add('noselect')
        searchWords.appendChild(deleteTags);
        if(e==ingredientesDisponibles){

            e.forEach(e=>{
                let tagItem = document.createElement('li');
                tagItem.classList.add('noselect')
                tagItem.innerHTML = `${e}`;
                searchWords.appendChild(tagItem);
            })
        }else{
            let tagItem = document.createElement('li');
            tagItem.innerHTML = `${e}`;
            searchWords.appendChild(tagItem);
        }
    }
}

const searchIngredients = document.getElementById('searchIngredients');
const searchRecipes = document.getElementById('searchRecipes');
const recipeInput = document.getElementById('recipeInput');
const ingredientInput = document.getElementById('ingredientInput');

// interaccion con las solapas de busqueda
// se resetean todos los valores al cambiar de una solapa a la otra para que no continue el valor de un input en la siguiente busqueda

let solapaUno = true;

document.getElementById('searchIngredientsCont').classList.toggle('onTop');

searchIngredients.addEventListener('click', ()=>{
    if (solapaUno == false){
        recipeInput.value = ""
        ingredientInput.value = ""
        searchWords.innerHTML= ""
        showRecipes(recipes);
        document.getElementById('searchNameCont').classList.toggle('onTop');
        document.getElementById('searchIngredientsCont').classList.toggle('onTop');
        solapaUno = true;
    }
},{capture:true})

searchRecipes.addEventListener('click', ()=>{
    if (solapaUno == true){
        recipeInput.value = ""
        ingredientInput.value = ""
        searchWords.innerHTML= ""
        showRecipes(recipes);
        document.getElementById('searchNameCont').classList.toggle('onTop');
        document.getElementById('searchIngredientsCont').classList.toggle('onTop');
        solapaUno = false;
    }
},{capture:true})


//Botones de categorías

const botonesCategorias = document.querySelectorAll('.categoria_li')

botonesCategorias.forEach(categoria=>{

    categoria.addEventListener('click', (e)=>{

        filterCategories(e.target.innerText);

        // El resto del codigo de animacion de la solapa
        // de categorias está en el archivo visuals.js
        $('#categories').slideUp();
        categoriesVisible = false;
    })
})


//Filtro por categoria

function filterCategories(e){
    searchWords.innerHTML= "";
    recipesList.innerHTML = "";
    let categoriaElegida = e;
    let recetasPosibles = [];
    
    recipes.forEach(recipe=>{
        if(recipe.categoria.toUpperCase() === categoriaElegida.toUpperCase()){
            recetasPosibles.push(recipe);
        }
    })
    showRecipes(recetasPosibles);
}

const mostrarTodo = document.getElementById('categoriaTodas');
categoriaTodas.addEventListener('click', ()=>{
    searchWords.innerHTML= "";
    showRecipes(recipes);
    $('#categories').slideUp();
    categoriesVisible = false;
})

// Busqueda por ingredientes. Al ingresar separado por ',' se eliminan los espacios y 
//se agrega un nuevo elemento al array ingredientesDisponibles
let userInput;
let ingredientesDisponibles = [];

function enterSearchIng(){
    userInput = ingredientInput.value.toUpperCase();
    if(userInput){
        ingredientesDisponibles = userInput.split(',').filter(tag => tag.trim()
        !=='').map(tag=> tag.trim());
    }  
    ingredientInput.value = ""
    searchByIngredients(ingredientesDisponibles);
    searchWords.innerHTML= ""
    showTags(ingredientesDisponibles);
}

//activa con enter o apretando el boton

ingredientInput.addEventListener('keypress', (e)=>{
    if (e.key === 'Enter'){
        enterSearchIng();
        
    }
})

document.getElementById('searchIngBtn').addEventListener('click', ()=>{
    enterSearchIng();
})


//busqueda por nombre

function enterSearchName(){
    userInput = recipeInput.value.toUpperCase();
    if(userInput){
        recipeInput.value = ""
        searchWords.innerHTML= ""
        showTags(userInput);
        searchByName(userInput);
    }  
}

//activa con enter o apretando el boton

recipeInput.addEventListener('keypress', (e)=>{
    if (e.key === 'Enter'){
        
        enterSearchName();
    }
})

document.getElementById('searchNameBtn').addEventListener('click', ()=>{
    enterSearchName();
})


// codigo de comparacion de arrays en busqueda por ingredientes

function searchByIngredients(e){
    recipesList.innerHTML = "";
    
    let recipeFound;
    let recetasPosibles = [];
    
    for (let i = 0; i < recipes.length; i++){
        recipeFound = true;
        for (let j = 0; j< ingredientesDisponibles.length; j++) {
            if (recipes[i].ingredientes.toUpperCase().indexOf(ingredientesDisponibles[j]) === -1) {
                recipeFound = false;
                break;
            }
        }
        if (recipeFound){
            recetasPosibles.push(recipes[i]);
        }
    }
    if(recetasPosibles.length >= 1){
        showRecipes(recetasPosibles);
    }else{
        showNoResults();
    }
}

//codigo de comparacion en busqueda por nombre

function searchByName(e){
    recipesList.innerHTML = "";
    const inputName = e;
    
    let recipeFound;
    let recetasPosibles = [];
    
    for(let i=0; i <recipes.length; i++){
        recipeFound = recipes[i].name.toUpperCase().includes(inputName)
        if(recipeFound){
            recetasPosibles.push(recipes[i]);
        }
    }
    if(recetasPosibles.length>0){
        showRecipes(recetasPosibles);
    }else{
        showNoResults();
        
    }
    
}



//Muestra las recetas que le mando como parámetro, para mostrar todas le mando el array recipes[].

function showRecipes(e){
    recipesList.innerHTML="";
    e.forEach(e=>{
        
        let listItem = document.createElement('li');
        listItem.addEventListener('click', ()=>{
            hideRecetarioMenu();
            createModal(e)
        })
        listItem.innerHTML = `  <img src="${e.imagen}" alt="${e.name}">
        <div class="recipe-info">
        <h4>${e.name}</h4>
        <h5>${e.descripcion}</h5>
        <h3 class="categoria ${e.categoria}">${e.categoria}</h3>
        </div>`;
        recipesList.appendChild(listItem);
    })
}


//slideDown recetario

const recetarioMenu = document.getElementById('recetario');
const solapaRecetario = document.getElementById('solapaRecetario');

solapaRecetario.addEventListener('click',()=>{
    showRecetarioMenu();
})

function showRecetarioMenu(){
    generarRecetario();
    recetarioMenu.classList.toggle('active');
}

function hideRecetarioMenu(){
    recetarioMenu.classList.remove('active');
}

function generarRecetario(){
    const recetasGuardadas = document.getElementById('recetasGuardadas')
    recetasGuardadas.innerHTML = '';
    if (recetario.length==0){
        recetasGuardadas.innerHTML = '<p><br><b>No hay nada por aquí</b><br>En esta sección podrás ver las recetas que guardaste en favoritos.</p>'
    }else{
        const tituloRecetario = document.createElement('div');
        tituloRecetario.classList.add('tituloRecetario')
        tituloRecetario.innerHTML = '<h2>Recetario</h2>Recetas guardadas'
        recetasGuardadas.appendChild(tituloRecetario);
        recetario.forEach(e=>{
            const compararId = recipes.find(obj =>{
                return obj.id === e
            });
    
            let recetaGuardada = document.createElement('li');
    
            recetaGuardada.innerHTML = `<img class="recetarioImg" src="${compararId.imagen}" alt="${compararId.name}">
                                        <div class="recipe-info">
                                            <h4>${compararId.name}</h4>
                                        </div>`;
            recetaGuardada.addEventListener('click',()=>{
                createModal(compararId);
            })
            recetasGuardadas.appendChild(recetaGuardada);
        })

    }
    
}

