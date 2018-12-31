# Sirena

Requerimientos Tecnicos

$ node -v
v8.12.0

$ git --version
git version 2.19.1.windows.1

$ npm -v
6.4.1


Instalacion

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




Descripcion de Ejercicio

.env

Archivo de configuracion, para que no tarde en procesar el rastreo , se creo la variable NUMPAGES = 1 ,
si se deja vacia procesara completamente.

-- No logre trabajar con mogoose por las versiones de Koa, asi que decidi cambiar a koa-mongo

https://www.npmjs.com/package/koa-mongo


- Generar orden

POST

http://localhost:3000/api/product/search/

Body
{
  "searchQuery": "tornillos",
  "provider": "easy",
  "options": {
   "user": "sirena",
   "password": "sirena123"
  },
   "callbackUrl": "http://localhost:3000/"

 }

--Ver estado de la orden

 http://localhost:3000/api/product/search-order/:searchOrderId

 Ejemplo:


 http://localhost:3000/api/product/category/5c29a2faac9fb8f9bdf0c29b


--Ver todas las ordenes creadas

 http://localhost:3000/api/product/search-order2/list


--Consultar productos con # de Orden

No se estan guardando las categorias porque no las estoy rastreando asi que cambie la Endpoint para que muestre los productos
con el searchOrderId

GET
http://localhost:3000/api/product/category/:searchOrderId
http://localhost:3000/api/product/category/5c29a2faac9fb8f9bdf0c29b



Nota: Los productos que probe son tuerca, bisagra,tornillo


