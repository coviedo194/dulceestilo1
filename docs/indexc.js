
if (navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1) {
    var divDanger = '<div class="alert alert-danger">' +
        '<strong> Esta aplicación no está soportada en Internet Explorer, favor intentar con Chrome, FireFox, o el nuevo Edge' +
        '</div >';
    $('body').html(divDanger);
} else {
    prepararControles();
}

async function prepararControles() {
    console.time("obtenerArticulos");
    console.log("consultando articulos...");
    var response = await fetch('https://prod-07.brazilsouth.logic.azure.com:443/workflows/529fcc50b3c14d58a4a5e496061387cf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Zr4VIrqgxVw_V7zmZLHFurxMbpQlLdt_9sXDREOxlnU', {

        //prueba
        //var response = await fetch('https://prod-15.westus.logic.azure.com:443/workflows/98502210a22647d1a005c61ebb0edcd4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=rw4FGE479XjUExe-4klmY5KR--6RdQAAynmmQzM_r9M', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ withImages: true })
    });
    var result = await response.json();
    console.log(result);

    console.log("articulos devueltos...");
    console.timeEnd("obtenerArticulos");

    $("#msg").html("listo!");
    for (const articulo of result) {
        $("#tbodyArticulos").append(
            `<tr>
                <td>${articulo.codigo}</td>
                <td>${articulo.nombre}</td>
                <td class="text-right">Gs. ${$.number(articulo.precio, 0, ",", ".")}</td>
                <td id="${articulo.codigo}">No hay foto</td>
                <td><a target="_blank" href="https://api.whatsapp.com/send?phone=595984900558&text=Hola, me interesa el articulo cod: ${articulo.codigo}, ${articulo.nombre}" class="btn btn-link" role="button">Me interesa <i class="fa fa-lg fa-whatsapp" aria-hidden="true"></i></a></td>
            </tr> `
        );
        for (const foto of articulo.fotos) {
            let imgarticulo = $(`<img style="cursor:pointer;" class="img-fluid rounded img-articulos" src="data:${foto["$content-type"]};base64,${foto["$content"]}"alt="foto de ${articulo.nombre}" title="clic para ver más grande">`);
            imgarticulo.click(() => {
                var newTab = window.open();
                newTab.document.body.innerHTML = `<img src="data:${foto["$content-type"]};base64,${foto["$content"]}">`;
            });
            $("#" + articulo.codigo).html(imgarticulo);
            $(".img-articulos").css("width", $(window).width() * 0.15);
        }




    }

}

