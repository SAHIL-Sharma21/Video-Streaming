#dockerixzing our youtube backend

FROM node:18


#makiong working directory
WORKDIR /app

#copy package json file
COPY package.json .
COPY package-lock.json .

RUN npm install

#rebilding bycrpt to compatible.
# RUN npm rebuild bcrypt --build-from-source

COPY . .

CMD [ "node", "src/index.js" ]