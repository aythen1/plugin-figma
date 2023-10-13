# Aythen Figma Plugin

<div align="center">
  <img src="public/logo.webp" alt="Aythen Logo" />
</div>

## Descripción

El Plugin para Figma de Aythen es una herramienta que simplifica y agiliza el proceso de trabajar con componentes en Figma y exportar los datos resultantes en formato JSON. Este plugin te permitirá generar fácilmente una representación JSON de tus componentes seleccionados en Figma.

## Tecnologías Utilizadas

- HTML
- CSS
- JavaScript
- React
- TypeScript
- Figma Plugin API

## Inicio Rápido

1. Clona este repositorio: `git clone <URL_DEL_REPOSITORIO>`
2. Instala las dependencias: `cd nombre-del-proyecto && npm install`
3. Inicia el proyecto en modo de desarrollo: `npm run dev`

## Uso del Plugin

Una vez que el proyecto esté en funcionamiento, sigue estos pasos para cargar y utilizar el plugin en Figma:

1. Descarga o abre Figma desktop.

2. Ve a la parte superior izquierda de la ventana y selecciona `Resources` y elige `Plugins`.

3. En el menú desplegable `Recents and saves`, elige `Development`.

4. Aparecerá una opción `Create a new plugin` o `+`. Haz clic en ella.

5. Luego selecciona `Import plugin from manifest...`

6. Selecciona el archivo `manifest.json` en la carpeta raíz del proyecto que clonaste previamente. Listo !! 🚀

## Interfaz Gráfica del Plugin

El plugin proporciona una interfaz intuitiva para su uso:

- Selecciona un componente en tu diseño de Figma.

- Abre el panel del plugin.

- Haz clic en el botón "Component" para generar el JSON del componente seleccionado.

- Si deseas cancelar el proceso, puedes hacerlo haciendo clic en el botón "Cancelar".

## Resultado JSON

El JSON generado tendrá la siguiente estructura:

```json
{
  "tag": "span",
  "componentName": "NombreDelComponente",
  "nativeAttributes": {
    "width": "1600",
    "height": "800"
    // ... otras propiedades nativas
  },
  "imageNodes": {
    "backgroundImage": "urlDeLaImagen"
    // ... otras propiedades de imagen
  },
  "hasChildren": true,
  "children": [
    // ... otros componentes anidados
  ]
}
```
