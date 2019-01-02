# Sirena

### Requerimientos Tecnicos

$ node -v
v8.12.0

$ git --version
git version 2.19.1.windows.1

$ npm -v
6.4.1


### Instalacion

1- Clonar el respositorio

git clone https://github.com/jbuitrago/sirena.git

2- Pasar al branch develop

git checkout develop

3- Instalar las dependencias

cd sirena

npm install

4 -Instalar MongoDb

https://www.youtube.com/watch?v=c8n6JsQuX2A

5- Crear tablas

-Crear la base de datos sirena

use sirena

- Crear las siguientes tablas

db.createCollection("products");

db.createCollection("orders");

db.createCollection("categories");

-Verificar las tablas creadas

show collections;

6- Ejecutar el proyecto

npm start


### Proyecto Postman

Se creo el siguiente proyecto en Postman para validar los 4 Endpoint
https://documenter.getpostman.com/view/5855376/RznBP1bF


### Descripcion de Ejercicio

Se desarrollo de la siguiente manera:

- Se creo el archivo de configuracion .env

    - PORT_G      = 3000 //Puerto Ganimede
    - HOST_G      = http://localhost //Host Ganimede
    - PORT_T      = 3001 //Puerto Themisto
    - HOST_T      = http://localhost   //Host Themisto
    - MONGODB_DB  = sirena //Base de datos sirena en Mongodb
    - USER        = sirena //Usuario para acceder al POST /api/product/search
    - PASSWORD    = sirena123  //Password para acceder al POST /api/product/search
    - PROVIDER_ALIAS = easy //Proveedor
    - PROVIDER_PATH  = https://www.easy.com.ar/ //Proveedor Path
    - NUMPAGES =   //Numero de paginas que quiere rastrear, si se elimina esta variable se rastrearan todas

- Se crearon 2 Api con Koa
    - Api Ganymede http://localhost:3000
        - En esta Api se crearon los siguientes Endpoint
            - POST /api/product/search
                - Valida los parametros del Body
                - Crea una orden en la tabla orders
                - Llama al Api themisto la cual rastrea la palabra con el proveedor dado
                - Retorna el numero de orden generado
            - GET /api/product/search-order/{searchOrderId}
                - Muestra una Orden segun el searchOrderId
            - GET /api/product/search-order2/list
                - Tuve conflicto asi que lo llame search-order2 y muestra todas las ordenes creadas
            - GET /api/product/{searchOrderId}
                - Este Endpoint reemplaza a GET /api/product/category/{productCategoryId}  porque no se estan rastreando las categorias de los productos, se muestran los productos dada una orden searchOrderId



    - Api Themisto http://localhost:3001
        - En esta Api se creo un Endpoint que hace el rastreo con Google Puppeteer a www.easy.com.ar
        - Se mapea el buscador con la palabra dada , se da click al boton buscar y se comienza a buscsar todos los producto pagina por pagina
        - Guarda directamente en la tabla orders el estado y los productos en la tabla products.


Nota:
-   No se trabajo con mongoose porque tuve algunos problemas con la version de Koa 2 asi que cambie por koa-mongo https://www.npmjs.com/package/koa-mongo
-   Los productos que probe son tuercaS, bisagra,tornillo,tuercas amarillas












