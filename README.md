🛰️ Sumarización de Redes (Supernetting)

Aplicación web sencilla en HTML, CSS y JavaScript para calcular la sumarización de redes IPv4 (supernetting).
Permite introducir varias redes en formato CIDR y obtener la superred correspondiente.
Los resultados se almacenan en LocalStorage y se muestran en una tabla de historial.

🚀 Características

Interfaz moderna en modo oscuro con tonos azules para cuidar la vista.

Ingreso de varias redes en formato x.x.x.x/xx.

Validación de formato y rango antes de calcular.

Cálculo automático de la red sumarizada.

Almacenamiento del historial en LocalStorage.

Tabla con las redes ingresadas, resultado y fecha/hora.

Botón para borrar campos y botón para limpiar el historial completo.

⚙️ Acciones disponibles

Actualmente, la aplicación permite realizar las siguientes acciones principales:

✅ Configuración básica: acceso a las opciones iniciales de la app.

🧩 Configuración DHCP: simulación y configuración de parámetros básicos de red.

🌐 Navegación entre funciones: desplazamiento fluido entre las secciones de configuración y sumarización.

Estas funciones ya están completamente operativas y listas para usarse en el entorno web.

📂 Tecnologías utilizadas

HTML5

CSS3 (modo oscuro con paleta azul)

JavaScript (puro, sin librerías externas)

📝 Uso

Clona o descarga este repositorio.

Abre index.html en tu navegador.

Introduce varias redes en formato CIDR (por ejemplo):

192.168.0.0/24
192.168.1.0/24


Haz clic en Calcular Sumarización.

Verás el resultado y se guardará automáticamente en el historial.

🧩 Validaciones

Solo permite redes IPv4 en formato x.x.x.x/xx.

Prefijo entre 0 y 32.

Octetos entre 0 y 255.

Si algún dato es incorrecto, muestra un mensaje de error y no calcula.

⚖️ Licencia

Este proyecto se distribuye bajo la licencia MIT.
Puedes usarlo, modificarlo y compartirlo libremente citando este repositorio.

✨ Créditos

Desarrollado por JORGE CASTRO AKA: GeForce1818 👨‍💻
Colaborador @AlexLC96 AKA : El enano
