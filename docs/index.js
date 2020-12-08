
if (navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1) {
    var divDanger = '<div class="alert alert-danger">' +
        '<strong> Esta aplicación no está soportada en Internet Explorer, favor intentar con Chrome, FireFox, o el nuevo Edge' +
        '</div >';
    $('body').html(divDanger);
} else {
    $(document).ready(function () {
        prepararControles();
    })
}

async function prepararControles() {
    console.time("obtenerArticulos");
    var response = await fetch('https://prod-07.brazilsouth.logic.azure.com:443/workflows/529fcc50b3c14d58a4a5e496061387cf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Zr4VIrqgxVw_V7zmZLHFurxMbpQlLdt_9sXDREOxlnU', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ withImages: true })
    });
    var result = await response.json();
    //para datos de pruebas 
    //var result = artpruebas;
    //$("#msg").html(JSON.stringify(result)); 

    console.timeEnd("obtenerArticulos");
    
    
    $("#msg").html("");
    for (const articulo of result) {
        $("#dvCards").append(
            `
            <div class="card col-sm-4 col-lg-3 col-xl-2 mb-3 mr-2">
                <div class="card-header">${articulo.nombre} | ${articulo.codigo}</div>
                <div class="card-body" id="cbody${articulo.codigo}"></div>
                <div class="card-footer row text-center">
                    <span class="col-sm-6">Gs. ${$.number(articulo.precio, 0, ",", ".")}</span>
                    <a class="btn btn-link btn-sm col-sm-6" target="_blank" href="https://api.whatsapp.com/send?phone=595984900558&text=Hola, me interesa el articulo cod: ${articulo.codigo}, ${articulo.nombre}" role="button">Me interesa <i class="fa fa-lg fa-whatsapp" aria-hidden="true"></i></a>
                </div>
            </div>
            `
        );
        for (const foto of articulo.fotos) {
            let imgarticulo = $(`<img style="cursor:pointer;" class="img-fluid rounded img-articulos" src="data:${foto["$content-type"]};base64,${foto["$content"]}"alt="foto de ${articulo.nombre}" title="clic para ver más grande">`);
            imgarticulo.click(() => {
                var newTab = window.open();
                newTab.document.body.innerHTML = `<img src="data:${foto["$content-type"]};base64,${foto["$content"]}">`;
            });
            $("#cbody" + articulo.codigo).html(imgarticulo);
            $(".img-articulos").css("width", $(window).width() * 0.15);
        }




    }

}

