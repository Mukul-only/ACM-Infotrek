FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Expose both app and debug ports
EXPOSE 3000 9229

CMD ["npm", "run", "dev"]