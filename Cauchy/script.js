// =====================================================
// CALCULADORA DE INTEGRALES DE CAUCHY
// =====================================================


// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================

function calcularIntegral() {

    try {

        // =================================================
        // 1. OBTENER LOS DATOS
        // =================================================

        const funcionTexto =
            document.getElementById("funcion").value.trim();


        const z0Texto =
            document.getElementById("z0").value.trim();


        const n =
            Number(
                document.getElementById("orden").value
            );


        // =================================================
        // 2. VALIDACIONES
        // =================================================

        if (funcionTexto === "") {

            throw new Error(
                "Debes ingresar la función f(z)."
            );

        }


        if (z0Texto === "") {

            throw new Error(
                "Debes ingresar el punto z₀."
            );

        }


        if (
            !Number.isInteger(n) ||
            n < 0
        ) {

            throw new Error(
                "El orden n debe ser un entero mayor o igual a 0."
            );

        }


        // =================================================
        // 3. CONVERTIR LA FUNCIÓN
        // =================================================

        let funcion;

        try {

            funcion =
                math.parse(funcionTexto);

        } catch (error) {

            throw new Error(
                "La función ingresada no es válida. " +
                "Ejemplo: z^3 + 2*z + 1"
            );

        }


        // =================================================
        // 4. CONVERTIR z0
        // =================================================

        let z0;

        try {

            z0 =
                math.evaluate(z0Texto);

        } catch (error) {

            throw new Error(
                "El punto z₀ no es válido."
            );

        }


        // =================================================
        // 5. LIMPIAR TABLA
        // =================================================

        const tabla =
            document.getElementById("tablaPasos");


        tabla.innerHTML = "";


        // =================================================
        // 6. MOSTRAR FUNCIÓN ORIGINAL
        // =================================================

        agregarPaso(

            tabla,

            "1",

            "Función original",

            "f(z) = " +
            funcion.toString()

        );


        // =================================================
        // 7. MOSTRAR FÓRMULA DE CAUCHY
        // =================================================

        agregarPaso(

            tabla,

            "2",

            "Fórmula Integral de Cauchy",

            "∮ f(z)/(z-z₀)ⁿ⁺¹ dz = " +
            "(2πi/n!) · f⁽ⁿ⁾(z₀)"

        );


        // =================================================
        // 8. CALCULAR DERIVADAS
        // =================================================

        let derivada =
            funcion;


        if (n === 0) {

            agregarPaso(

                tabla,

                "3",

                "Como n = 0, no se deriva",

                "f(z) = " +
                derivada.toString()

            );

        } else {


            for (
                let k = 1;
                k <= n;
                k++
            ) {


                // -----------------------------------------
                // DERIVAR
                // -----------------------------------------

                derivada =
                    math.derivative(
                        derivada,
                        "z"
                    );


                // -----------------------------------------
                // SIMPLIFICAR
                // -----------------------------------------

                derivada =
                    math.simplify(
                        derivada
                    );


                // -----------------------------------------
                // AGREGAR A TABLA
                // -----------------------------------------

                agregarPaso(

                    tabla,

                    "3." + k,

                    "Derivada de orden " +
                    k,

                    "f⁽" +
                    k +
                    "⁾(z) = " +
                    derivada.toString()

                );

            }

        }


        // =================================================
        // 9. EVALUAR EN z0
        // =================================================

        let valor;


        try {

            valor =
                derivada.evaluate({
                    z: z0
                });

        } catch (error) {

            throw new Error(
                "No fue posible evaluar la derivada en z₀."
            );

        }


        agregarPaso(

            tabla,

            "4",

            "Evaluar la derivada en z₀ = " +
            z0Texto,

            "f⁽" +
            n +
            "⁾(z₀) = " +
            formatearNumero(valor)

        );


        // =================================================
        // 10. CALCULAR FACTOR
        // =================================================

        const factorialN =
            math.factorial(n);


        const factor =
            math.divide(

                math.multiply(

                    2,

                    Math.PI,

                    math.complex(0, 1)

                ),

                factorialN

            );


        agregarPaso(

            tabla,

            "5",

            "Calcular el factor 2πi/n!",

            "2πi/" +
            n +
            "! = " +
            formatearNumero(factor)

        );


        // =================================================
        // 11. CALCULAR RESULTADO
        // =================================================

        const resultado =
            math.multiply(

                factor,

                valor

            );


        // =================================================
        // 12. MOSTRAR MULTIPLICACIÓN
        // =================================================

        agregarPaso(

            tabla,

            "6",

            "Multiplicar el factor por " +
            "f⁽ⁿ⁾(z₀)",

            "(" +
            formatearNumero(factor) +
            ") × (" +
            formatearNumero(valor) +
            ")"

        );


        // =================================================
        // 13. MOSTRAR RESULTADO FINAL
        // =================================================

        document.getElementById(
            "resultado"
        ).innerHTML =

            "∮ = " +
            formatearResultado(resultado);


        // =================================================
        // 14. MOSTRAR INTEGRAL ORIGINAL
        // =================================================

        const denominador =
            "(z - (" +
            z0Texto +
            "))^" +
            (n + 1);


        document.getElementById(
            "integralOriginal"
        ).innerHTML =

            "<strong>Integral a resolver:</strong>" +
            "<br><br>" +

            "∮ " +

            funcionTexto +

            " / " +

            denominador +

            " dz";


        // =================================================
        // 15. RESULTADO FINAL EN TABLA
        // =================================================

        agregarPaso(

            tabla,

            "7",

            "Resultado final de la integral",

            "∮ = " +
            formatearResultado(resultado)

        );

    }


    // =====================================================
    // MANEJO DE ERRORES
    // =====================================================

    catch (error) {

        mostrarError(
            error.message
        );

    }

}



// =====================================================
// AGREGAR PASO A LA TABLA
// =====================================================

function agregarPaso(

    tabla,

    numero,

    procedimiento,

    resultado

) {


    const fila =
        document.createElement("tr");


    const celdaPaso =
        document.createElement("td");


    const celdaProcedimiento =
        document.createElement("td");


    const celdaResultado =
        document.createElement("td");


    celdaPaso.textContent =
        numero;


    celdaProcedimiento.textContent =
        procedimiento;


    celdaResultado.textContent =
        resultado;


    fila.appendChild(
        celdaPaso
    );


    fila.appendChild(
        celdaProcedimiento
    );


    fila.appendChild(
        celdaResultado
    );


    tabla.appendChild(
        fila
    );

}



// =====================================================
// FORMATEAR NÚMEROS
// =====================================================

function formatearNumero(numero) {

    try {

        return math.format(

            numero,

            {
                precision: 10
            }

        );

    }

    catch {

        return String(numero);

    }

}



// =====================================================
// FORMATEAR RESULTADO
// =====================================================

function formatearResultado(resultado) {

    try {

        return math.format(

            resultado,

            {
                precision: 12
            }

        );

    }

    catch {

        return String(resultado);

    }

}



// =====================================================
// MOSTRAR ERROR
// =====================================================

function mostrarError(mensaje) {


    document.getElementById(
        "resultado"
    ).innerHTML =

        '<div class="error">' +

        mensaje +

        '</div>';


    document.getElementById(
        "integralOriginal"
    ).innerHTML = "";


    document.getElementById(
        "tablaPasos"
    ).innerHTML = "";

}



// =====================================================
// LIMPIAR
// =====================================================

function limpiar() {


    document.getElementById(
        "funcion"
    ).value = "";


    document.getElementById(
        "z0"
    ).value = "";


    document.getElementById(
        "orden"
    ).value = 0;


    document.getElementById(
        "resultado"
    ).innerHTML =

        'Ingresa los datos y presiona ' +
        '"Calcular integral".';


    document.getElementById(
        "integralOriginal"
    ).innerHTML = "";


    document.getElementById(
        "tablaPasos"
    ).innerHTML =

        '<tr>' +

        '<td colspan="3">' +

        'El procedimiento aparecerá aquí.' +

        '</td>' +

        '</tr>';

}