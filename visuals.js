//animacion del loading con JQuery

animate1();


function animate1(){
    $(`#loading-ball2`).animate({width: '30px', height:['30px','swing'], top:['50px','swing'], left: '20px'},"slow",  
    function(){        
        $('#loading-ball2').css(        
            'z-index', 100
        )
        animate2();
    });
}

function animate2(){
    $(`#loading-ball2`).animate({width:'20px', height:['20px','swing'], top:['120px','swing'], left: '150px'},"slow",  
    function(){        
        $('#loading-ball2').css(        
            'z-index', 50
        )
        animate1();
    });
}

$('#modal-kosher').click(()=>{
    $('#modal-kosher').removeClass('visible');
})
$('#logoKosher').click(()=>{
    $('#modal-kosher').addClass('visible')
})
