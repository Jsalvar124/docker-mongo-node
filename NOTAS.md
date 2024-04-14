## Qué es un contenedor?

A container packages code and all its dependencies into a single unit, thus letting an application run quickly and reliably from one computing environment to another. This makes such applications easily portable between machines and solves the “it works on my machine” problem.

Es una forma de empaquetar aplicaciones incluyendo sus dependencias y archivos de configuración.

[[[[]]]] => html, node.js, .env.

- Portable: Fácil de compartir entre devs y operaciones.
- Facilita Despliegues.
-  Se almacena en un repositorio de contenedores.
- Repositorios privados y públicos (Dockerhub)

## Qué reemplaza docker?

Desarrolladores con distintos sistemas operativos, podían tener problemas por  estar usando distintas versiones de las dependencias.

1. Descargar una imagen Basada en linux.

## Despliegues SIN Contenedores.
Codigo, Actualizar dependencias, archivos de configuración. Operaciones y Desarrollo construyen una Imagen. La única dependencia que necesita es el Runtime de Docker, por eso, no hay problemas.

## Qué es una imagen?
Contiene
- Dependencias
- Código
- Lo que se comparte

## Qué es un contenedor?
Es un conjunto de capas, 

la base, es una distribución de linux, sobre esta, se van superponiendo imagenes, hasta llegar a la capa de la aplicación.

### Docker es una forma de virtualización

3 capas
- hardware
- kernel 
- apps

Lo que se encuentra virtualizado es el kernel, y las aplicaciones.
en una máquina virtual, se usa el hardware anfitrión, pero, se virtualiza el kernel, y las aplicaciones. 
esto hace que sea muy pesado (Del orden de gigas)
mientras que Docker, **SOLO** v
virtualiza las aplicaciones. (pesa del orden de 100 mb)

**Docker Usa directamente el kernel del sistema operativo Anfitrión. Tiene un mejor rendimiento y hace que sea mucho más rápido.**

## Docker Desktop
Es una máquina virtual, optimizada que corre linux y permite ejecutar contenedores, acceder a la red.

## Docker  Compose
## CLI

Corre en windows de manera nativa con WSL2 windows subsystem for linux.

# Comandos
 **Listar** todas las imagenes descargadas
```bash
$ docker images
 ```

**descargar** una imagen con una versión específica, por defecto, si no se pone la versión descarga latest.

```bash
$ docker pull node:18
 ```
Dos imagenes pueden tener etiquetas distintas pero un mismo ID, por lo que son exactamente la misma imagen.

Para **eliminar** 
```bash
$ docker image rm node
 ```
Para **Crear un Contenedor**, nombre de la imagen 

```bash
$ docker create mongo
 ```

una vez creado, **Correr el contenedor** con su ID
```bash
$ docker start containerID 
 ```
**detener contenedor**, con su ID
```bash
$ docker stop containerID 
 ```
**listar contenedores encendidos**
```bash
$ docker ps 
 ```
**listar TODOS los contenedores**
```bash
$ docker ps -a 
 ```

**crear un contenedor con un alias**
```bash
$ docker create --name ALIAS imageName 
 ```

## Port Mapping
cada contenedor tiene sus puertos, pero por defecto no se comunican con nuestra máquina. se puede tener 2 contenedores de node, corriendo en el puerto 3000. sin embargo hay que redireccionarlas en puertos distintos en nuestra máquina.

Puerto en Anfitrión : puerto en contenedor

```bash
$ docker create -p27017:27017 --name monguito mongo 
 ```
docker create -p (publish)puerto en nuestra máquina: puerto dentro del contenedor --name alias imagen

```bash
$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS         PORTS                      NAMES
a2085ae3c2e2   mongo     "docker-entrypoint.s…"   30 seconds ago   Up 2 seconds   0.0.0.0:27017->27017/tcp   monguito
```

## Como saber si se ejecutó correctamente?

```bash
$ docker logs monguito
```

Quedarse escuchando los logs
```bash
$ docker logs --follow monguito
```

## Docker run = pull + create + start
es la combinación de 3 comandos anteriores, si no encuentra la imagen la descarga, una vez descargada, crea un contenedor con ella y lo corre. podemos incluir las opciones de alias y mapeo de puertos directamente
```bash
$ docker run --name monguito -p27017:27017 -d mongo

$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                      NAMES
8c390d514a2d   mongo     "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:27017->27017/tcp   monguito
```

esto, hace que se ejecute, en modo --follow por defecto. para hacerlo detached, tenemos que añadir el flag. -d

```bash
$ docker run -d mongo
```

Crear un contenedor con variables de entorno para una base de datos de mongo.

```bash
$ docker create -p27017:27017 --name monguito -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=docker-password mongo
 ```
para constuir un contenedor, y empaquetar una aplicación de node, usamos un archivo Dockerfile, debe llamarse exactamente así.

## Dockerfile
incluye, imagen de donde se basa el contenedor
RUN es un comando que se ejecuta Dentro del contenedor, en linux. Creamos una carpeta para guardar el proyecto.
COPY es un comando que se ejecuta en el sistema Anfitrión, para copiar desde la ruta raiz ( . ) a la ruta dentro del contenedor ( /home/app ) 
EXPOSE le damos el puerto expuesto de la app de node.
CMD comando de ejecución de la aplicación. (Se debe especificar la ruta completa dentro de linux)
```Dockerfile
FROM  node:18
RUN  mkdir  -p  /home/app
COPY  .  /home/app
EXPOSE  3000
CMD  ["node",  "/home/app/index.js"]
```
### Redes en Docker
por defecto, los contenedores se crean de forma aislada, no pueden comunicarse entre sí. Docker permite crear redes entre los contenedores. 

Para **listar Redes**

```bash
$ docker network ls
```
para **crear red**
```bash
$ docker network create networkName
```
para **eliminar red**
```bash
$ docker network rm networkName
```

El comando inspect, permite ver el interior de contenedores, y redes

```bash
$ docker network inspect mongo-node
 ```

### Docker Build
una vez completado el Dockerfile, se puede crear la imagen de la app. utilizando el comando docker build
con nombre y ubicación del archivo, el nombre de la imagen será nodeapp con tag de versión 1.

```bash
$ docker build -t nodeapp:1 .
 ```

creamos el contenedor, usando la nueva imagen creada (incluir el tag), y asignandole la red creada, así como el puerto expuesto.
```bash
$ docker create -p3000:3000 --name chanchito --network mongo-node nodeapp:1
 ```

incluimos el contenedor de mongo también en la red, con sus variables de entorno, alias, y mapeo de puertos.
```bash
$ docker create -p27017:27017 --name monguito --network mongo-node -e MONGO_INITDB_ROOT_USERNAME=jsalvar124 -e MONGO_INITDB_ROOT_PASSWORD=docker-password mongo
 ```

## Docker Compose
todo esto puede automatizarse a través de un archivo .yml es como un json de configuraciones con sintaxis sensible a identación.

```yml
version: '3.7'
services:
	chanchito:
		build: .
		ports:
		- '3000:3000'
		links:
		- monguito
	monguito:
		image: mongo:latest
		ports:
		- '27017:27017'
		environment:
		- MONGO_INITDB_ROOT_USERNAME=jsalvar124
		- MONGO_INITDB_ROOT_PASSWOR=docker-password
```
podemos hacer el docker compose en modo detached, para no mostrar los logs de los contenedores y podemos detener la ejecución del contenedor con Ctrl+c

Docker Compose, automáticamente crea una red para todos los contenedores que se generen dentro del archivo yml. por lo que por defecto, pueden comunicarse entre sí.

# Volumes
Cuando tenemos que eliminar un contenedor, los datos que se guardan en este, no persisten por defecto.
Con los volumes, se puede montar una carpeta en el sistema operativo Anfitrión, que no se eliminan y persisten en el tiempo. 

### Volumen Anónimo
Sólo se indica la ruta, Docker se encarga de guardar como el quiera

### Anfitrión o Host
Se escoge la carpeta

### Nombrado
Es como el anónimo pero se puede refernciar el volumen cuando se vaya a crear otro contenedor.

Añadiendo el volumes al archivo yml podemos hacer persistir nuestros datos, incluso después de hacer docker compose down.

```yml
version: '3.7'
services:
	chanchito:
		build: .
		ports:
		- '3000:3000'
		links:
		- monguito
	monguito:
		image: mongo:latest
		ports:
		- '27017:27017'
		environment:
		- MONGO_INITDB_ROOT_USERNAME=jsalvar124
		- MONGO_INITDB_ROOT_PASSWORD=docker-password
		volumes:
		- mongo-data:/data/db
		#mysql -> /var/lib/mysql
		#postgres -> /var/lib/postgresql/data
volumes:
	mongo-data:
 ```
 
 # Hot Reload- Nodemon
 Docker permite hacer distintos entornos, el entorno de  desarrollo suele utilizar nodemon para detectar los cambios de forma automática. para esto usamos un Dockerfile.dev y un archivo docker-compose-dev.yml

```yml
FROM  node:18
  
RUN  npm  install  -g  nodemon
RUN  mkdir  -p  /home/app
  
WORKDIR  /home/app
  
EXPOSE  3000
  
CMD  ["nodemon",  "index.js"]
 ```
 Cambiamos el comando de ejecución por nodemon index.js y definimos el directorio raiz como /home/app con WORKDIR.
### Archivo docker-compose-dev.yml

```yml
version: '3.7'
services:
	chanchito:
		build:
		context: .
		dockerfile: Dockerfile.dev
		ports:
		- '3000:3000'
		links:
		- monguito
		volumes:
		- .:/home/app
	monguito:
		image: mongo:latest
		ports:
		- '27017:27017'
		environment:
		- MONGO_INITDB_ROOT_USERNAME=jsalvar124
		- MONGO_INITDB_ROOT_PASSWORD=docker-password
		volumes:
		- mongo-data:/data/db
		# mysql -> /var/lib/mysql
		#postgres -> /var/lib/postgresql/data
volumes:
	mongo-data:
```

- Especificamos el archivo Dockerfile.dev, para el build, en lugar del archivo Dockerfile por defecto.
- Utilizamos un volumen anónimo, para guardar el código
[ruta local] : [ruta contenedor]

# Docker compose up -f
Para especificar que se creen los contenedores del ambiente de desarrollo, se debe especificar el archivo docker-compose-dev.yml usando la bandera -f 

```bash
docker compose -f docker-compose-dev.yml up

...

chanchito-1  | [nodemon] restarting due to changes...
chanchito-1  | [nodemon] starting `node index.js`
```
De este modo, se iniciará la aplicación usando nodemon
para habilitar el hotreload, añadir en el package.json el siguiente atributo.
```json
"nodemonConfig": {
	"legacyWatch": true
}
 ```
Y listo!

# Ingresar en un contenedor
para acceder a la terminal de un contenedor que esté corriendo podemos usar el siguiente comando. (añadiendo el prefijo antes de docker para git bash)

```bash
winpty docker exec -it nombre-contenedor bash

...

root@a4f7a3427524:/home/app# ls
Dockerfile      docker-compose-dev.yml  node_modules
Dockerfile.dev  docker-compose.yml      package-lock.json
NOTAS.md        index.js                package.json
root@a4f7a3427524:/home/app#
 ```