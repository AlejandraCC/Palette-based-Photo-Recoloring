# Palette-based Photo Recoloring
## Resumen
Se presenta una GUI que crea una paleta de colores a partir de una imagen, usa una clasificación de colores en base al algoritmo k-means y la transferencia de colores entre píxeles; se recolorea la imagen creando texturas según el nuevo color seleccionado por el usuario.
Basado en 

## Del Proyecto
![imagen de muestra](/Capturas/01.PNG)
### De la interfaz: 
La interfaz es simple e intuitiva ya que recibe un archivo de entrada y presenta en botones los colores en predominancia que han sido clasificados previamente.

### De la Clasificación:
Se muestra la implentacion del recoloreado de imagenes mediante el uso de kmeans. Y con la ayuda de webgl para la renderizaci´on de estas.

De la paleta de Colores
La paleta de colores muestra los colores en predominancia de la imagen de entrada, la cantidad de colores de esta paleta depende de el numero de k-means en los que se clasificar´a; el m´ınimo tama˜no de la paleta es 3 y el maximo es 7, adicionalmente el color negro se mantiene en un vector de correspondencia y no se modifica.

Iniciar centroides
Se usa un metodo deterministico para la creaci´on inicial de los k-means. Para lo cual empecemos a usar un contenedor representativo del espacio RGB y hallamos sus respectivos valores LAB. Se llena este contenedor aumentando en 1 por cada pıxel que corresponda al contenedor.

Del procesamiento de los Kmeans
Para la obtencion de los k-means se empieza con sus valores inicializados como se menciono en el punto anterior. Usando el contenedor de colores hallamos el promedio de todos los colores que est´en mas cerca a un determinado k-mean actualizamos este con el nuevo valor obtenido Y ası por cada Kmeans. Una vez que el valor obtenido es el mismo del que ya se tiene para cada kmeans se detiene la iteracion.

 Del proceso de la clasificacion
Una vez hallado los K-means. Se empieza un proceso de clasificacion de los pixeles de la imagen por su correspondiente. Para esto cada Pixel es transformado es su equivalente LAB. Se halla su k-mean mas cercano a este. y guardado en un vector de correspondencias.
Basado en el vector de correspondencias se llenan subimagenes. Estos posteriormente seran guardados como texturas tal que la suma de todas de a la imagen original.

De la transferencia de colores
Debido a que se trabaja en el espacio de colores CIELAB. Se tomaran en cuenta los valores ’a’ y ’b’ para lo cual se utiliza una funci´on de transferencia tomando en cuenta el desplazamiento relativo del centroide hacia el nuevo color escogido.

 De la Luminosidad
Se mantiene un orden de acuerdo a la luminosidad de los centroides y este cada vez que se actualiza tambien se actualizan la luminosidad de los otros centroides para que se mantenga el orden Mientras que en la funci´on de transferencia. El nuevo valor de la luminosidad del pıxel se mantiene.

De la Creacion de Texturas
Se crea ”nTexturas” seg´un el n´umero de k-means almacen´andolos en una array de texturas y envi´andolos despu´es de hallar los k-means correspondientes a un array de im´agenes que servir´an para nuestra salida. Luego se obtiene la referencia de los campos en los shaders para crear las coordenadas UV y dibujarlas en la imagen de salida.

## Video Demostrativo
https://youtu.be/ZP1ijC1EzJ8
## Video Explicativo
https://youtu.be/VmqzQ4pKqxA
## Presentación
[Presentación](/Palette-based%20Photo%20Recoloring.pdf)
## Reporte
[Reporte](/informe_CG_v1.pdf)
## Referencias
1. Chang, H., Fried, O., Liu, Y., DiVerdi, S., & Finkelstein, A. (2015). Palette-based photo recoloring. ACM Transactions on Graphics (TOG), 34(4), 139.
