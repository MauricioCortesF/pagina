document.addEventListener("DOMContentLoaded", function () {
    const previewBtn = document.getElementById("previewBtn");
    const generateBtn = document.getElementById("generateBtn");
    const certificateContent = document.getElementById("certificateContent");
    const signatureName = document.getElementById("signatureName");
    const matriculaInput = document.getElementById("matricula");
    const nombreAlumnoInput = document.getElementById("nombreAlumno");

    // Logo en Base64 (Inserta aquí tu imagen en Base64)
    const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."; 

    // Pie de página en Base64 (Inserta aquí tu imagen en Base64 si la necesitas)
    const footerBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";

    function validarNombre(nombre) {
        return nombre.split(" ").length - 1 >= 2; // Debe tener al menos tres espacios
    }

    function validarCamposVacios(campos) {
        for (let campo of campos) {
            if (campo.value.trim() === "") {
                return false; // Si algún campo está vacío, devuelve falso
            }
        }
        return true; // Todos los campos tienen datos
    }

    function generarPDF() {
        if (!window.jspdf) {
            alert("⚠️ Error: jsPDF no se ha cargado correctamente.");
            return;
        }

        const nombreAlumno = nombreAlumnoInput.value.trim();
        const matricula = matriculaInput.value.trim();
        const nombreInstitucion = document.getElementById("nombreInstitucion").value.trim();
        const grado = document.getElementById("grado").value.trim();
        const cicloEscolar = document.getElementById("cicloEscolar").value.trim();
        const nombreDirector = document.getElementById("nombreDirector").value.trim();
        const carrera = document.getElementById("carrera").value.trim(); // Obtener la carrera seleccionada

        // Verificar si hay campos vacíos
        const camposRequeridos = [
            nombreAlumnoInput,
            matriculaInput,
            document.getElementById("nombreInstitucion"),
            document.getElementById("grado"),
            document.getElementById("cicloEscolar"),
            document.getElementById("nombreDirector"),
            document.getElementById("carrera") // Asegurarse que la carrera esté seleccionada
        ];

        if (!validarCamposVacios(camposRequeridos)) {
            alert("Todos los campos son obligatorios. Completa la información antes de continuar.");
            return;
        }

        // 🚨 Verificar si el nombre tiene al menos tres espacios
        if (!validarNombre(nombreAlumno)) {
            alert("El nombre del alumno debe estar completo");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Fecha
        const fechaTexto = `Ciudad de México, a ${new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}`;
        const constanciaTexto = `Se hace constar que el/la estudiante ${nombreAlumno}, con matrícula ${matricula}, perteneciente a la institución ${nombreInstitucion}, está cursando el ${grado} en el ciclo escolar ${cicloEscolar}. Actualmente, cursa la carrera de ${carrera}. Se expide la presente constancia para los fines que convengan al interesado. ${fechaTexto}.`;

        // Agregar logo en la parte superior
        doc.addImage(logoBase64, "PNG", 10, 10, 200, 40);

        // Título
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(nombreInstitucion, 190, 50, { align: "right" });

        // Fecha
        doc.setFont("helvetica", "normal");
        doc.text(fechaTexto, 190, 70, { align: "right" });

        // Cuerpo del documento
        doc.setFont("helvetica", "bold");
        doc.text("A QUIEN CORRESPONDA:", 10, 90);
        doc.setFont("helvetica", "normal");
        doc.text(constanciaTexto, 10, 110, { maxWidth: 180, align: "justify" });

        // Firma
        let y = 170;
        doc.setFont("helvetica", "bold");
        doc.text("A T E N T A M E N T E", 105, y, { align: "center" });
        y += 20;
        doc.setFont("helvetica", "normal");
        doc.text("________________________", 105, y, { align: "center" });
        y += 10;
        doc.text(nombreDirector, 105, y, { align: "center" });
        y += 10;
        doc.text("Director/a", 105, y, { align: "center" });

        // Pie de página (Texto)
        doc.setFontSize(10);
        doc.text("Dirección: Av. Insurgentes Sur 3000, Ciudad de México, CP 04510", 10, 280);
        doc.text("Teléfono: (55) 1234-5678 | Correo: contacto@universidad.edu.mx", 10, 285);

        // Pie de página (Imagen en Base64 si la necesitas)
        doc.addImage(footerBase64, "PNG", 10, 270, 200, 30);

        // Guardar PDF
        doc.save(`Constancia_${nombreAlumno.replace(/\s+/g, "_")}.pdf`);
    }

    const sedesCarreras = {
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS AZCAPOTZALCO": ["Ing. en Control y Automatización", "Lic. en Turismo", "Lic. en Psicología"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS COYOACÁN": ["Licenciatura en Relaciones Internacionales", "Licenciatura en Ciencias de Datos", "Licenciatura en Urbanismo y Desarrollo Metropolitano", "Licenciatura en Derecho y Seguridad Ciudadana", "Licenciatura en Humanidades y Narrativas Multimedia"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS GUSTAVO A. MADERO": ["Licenciatura en Relaciones Internacionales","Licenciatura en Contaduría y Finanzas","Licenciatura en Ciencias de la Comunicación", "Licenciatura en Ciencias de Datos","Licenciatura en Derecho y Criminología", "Licenciatura en Ciencias Ambientales","Licenciatura en Urbanismo y Desarrollo Metropolitano", "Licenciatura en Humanidades y Narrativas Multimedia"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS JUSTO SIERRA": ["Arquitectura", "Urbanismo", "Historia del Arte"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS LA MAGDALENA CONTRERAS": ["Pedagogía", "Ciencias de la Educación", "Trabajo Social"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS CASCO SANTO TOMÁS": ["Ingeniería Civil", "Biología", "Física"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS EUZKADI": ["Contaduría", "Mercadotecnia", "Relaciones Internacionales"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS MAZA DE JUÁREZ": ["Historia", "Antropología", "Ciencias Políticas"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS HERRERÍAS": ["Ingeniería Industrial", "Matemáticas", "Estadística"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS MILPA ALTA": ["Agronomía", "Medio Ambiente", "Ecología"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS CHIAPAS": ["Turismo", "Gastronomía", "Artes Culinarias"],
        "UNIVERSIDAD ROSARIO CASTELLANOS CAMPUS TIJUANA": ["Criminología", "Ciencias Forenses", "Seguridad Pública"],
        "UNIVERSIDAD ROSARIO CASTELLANOS MODALIDAD A DISTANCIA": ["Educación en Línea", "Negocios Digitales", "Ciencias de Datos"]
    };

    const sedeSelect = document.getElementById("nombreInstitucion");
    const carreraSelect = document.getElementById("carrera");

    sedeSelect.addEventListener("change", function () {
        const sedeSeleccionada = sedeSelect.value;
        const carreras = sedesCarreras[sedeSeleccionada] || [];

        // Limpiar opciones previas
        carreraSelect.innerHTML = '<option value="" disabled selected>Selecciona una carrera</option>';

        // Agregar nuevas opciones
        carreras.forEach(carrera => {
            const option = document.createElement("option");
            option.value = carrera;
            option.textContent = carrera;
            carreraSelect.appendChild(option);
        });
    });

    generateBtn.addEventListener("click", generarPDF);
});