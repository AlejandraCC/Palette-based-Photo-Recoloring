# Palette-based Photo Recoloring
## Resumen
Se presenta una GUI que crea una paleta de colores a partir de una imagen, usa una clasificación de colores en base al algoritmo k-means y la transferencia de colores entre píxeles; se recolorea la imagen creando texturas según el nuevo color seleccionado por el usuario.
Basado en 

## Del Proyecto
![imagen de muestra](/Capturas/01.PNG)
### De la interfaz: 
La interfaz es simple e intuitiva ya que recibe un archivo de entrada y presenta en botones los colores en predominancia que han sido clasificados previamente.

### De la Clasificación:


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

## Video Demostrativo
https://youtu.be/ZP1ijC1EzJ8
## Video Explicativo
https://youtu.be/VmqzQ4pKqxA
## Presentacion
## Reporte
## Referencias
1. Chang, H., Fried, O., Liu, Y., DiVerdi, S., & Finkelstein, A. (2015). Palette-based photo recoloring. ACM Transactions on Graphics (TOG), 34(4), 139.
