# Build the first stage with alpine node image and name as build
FROM node:20.9.0-alpine3.18 as build

# update and install the latest dependencies on docker base image
# Add non root user to the docker image and set the user
RUN apk update && apk upgrade && adduser -D svelteuser
USER svelteuser

# set work dir as app
WORKDIR /app

# copy the sveltkit project content with proper permission for the user svelteuser
COPY --chown=svelteuser:svelteuser . /app

# install all the project npm dependencies and 
# build the svelte project to generate the artifacts in build directory
RUN npm install && npm run build

# we are using multi stage build process to keep the image size as small as possible
FROM node:18-alpine3.17
# update and install latest dependencies, add dumb-init package
# add and set non root user
RUN apk update && apk upgrade && apk add dumb-init && adduser -D svelteuser
USER svelteuser

# set work dir as app
WORKDIR /app

# copy the build directory to the /app directory of second stage 
COPY --chown=svelteuser:svelteuser --from=build /app/build /app/package.json ./

# expose 8080 on container
EXPOSE 8080

# set app host and port and env as production
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

# start the app with dumb init to spawn the Node.js runtime process
# with signal support
CMD ["dumb-init","node","index.js"]