FROM fnproject/node
RUN apk update
RUN apk add g++ make python
WORKDIR /function
ADD . /function/
RUN npm install
ENTRYPOINT ["node", "func.js"]
