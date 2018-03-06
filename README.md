# Palette-based Photo Recoloring
## Resumen
Se presenta una GUI que crea una paleta de colores a partir de una imagen, usa una clasificación de colores en base al algoritmo k-means y la transferencia de colores entre píxeles; se recolorea la imagen creando texturas según el nuevo color seleccionado por el usuario. 

## Del Proyecto

<img align="left" width="100" height="100" src="http://www.fillmurray.com/100/100">

De la interfaz: 
La interfaz es simple e intuitiva ya que recibe un archivo de entrada y presenta en botones los colores en predominancia que han sido clasificados previamente.

De la Clasificación:


 El numero de k- means varia entre 3 y 7 valores 
  ---------  Explotando la propiedad
que nuestros datos son colores restringidos a R, G, B ∈ [0, 1], asignamos
a los contenedores en un histograma b × b × b (usamos b = 16 en RGB).
Para cada contenedor, calculamos el color medio en el espacio Lab, y estos
segundo
3
colores ci (o menos porque algunos contenedores pueden estar vacíos) son los
datos que usamos para k-means - típicamente al menos un par de órdenes de
magnitud menor que la cantidad de píxeles en la imagen, y
ahora independiente del tamaño de la imagen. Porque cada punto de datos ci ahora ----



Se crea un k-means con valores aleatorios donde la primera fila son 0's esto representando el negro según el articulo. Se debería hacer esto como una búsqueda de los valores mas 
repetidos y usarlo como valores iniciales(función a mejorar).
Se empieza cargando la imagen según la escala RGB  y un contador según el numero ingresado de k-means.
Luego en un bucle se llena en un array las correspondencias con los means para cada píxel.
Se cuenta cuantos píxeles hay por cada grupo; hallando el promedio y creando los nuevos k-means.
Se pregunta si hay diferencia entre cada píxel y se guarda según el array de correspondencias y los valores de los k-means para llenar la paleta de colores con estos últimos.

De la creacion de texturas:
Se crea "nTexturas" según el número de k-means almacenándolos en una array de texturas y enviándolos después de hallar los k-means correspondientes a un array de imágenes que servirán para nuestra salida.
Luego se obtiene la referencia de los campos en los shaders para crear las coordenadas UV y dibujarlas en la imagen de salida.
### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/AlejandraCC/Palette-based-Photo-Recoloring/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
