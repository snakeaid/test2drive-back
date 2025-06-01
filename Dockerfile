FROM public.ecr.aws/docker/library/node:16.20-bullseye-slim

WORKDIR /usr/src/app
COPY . .
RUN npm i
RUN npm run build
EXPOSE 3003
CMD [ "node", "dist/main" ]