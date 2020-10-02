FROM ubuntu:18.04

WORKDIR /usr/home/backend
COPY . .
RUN apt-get update
RUN snap install node --channel=14/stable --classic
RUN npm install
CMD ["npm", "run", "start"]