FROM node:10

# Create app directory
WORKDIR /app
COPY . /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get -y install \
  apt-transport-https \
  curl \
  unzip \
  build-essential \
  python \
  libcairo2-dev \
  libgles2-mesa-dev \
  libgbm-dev \
  libllvm3.9 \
  libprotobuf-dev \
  libxxf86vm-dev \
  xvfb \
  x11-utils \
  && rm -rf /var/lib/apt/lists/* \
  && npm install --no-save

EXPOSE 8080

RUN pwd
RUN ls -al
COPY ./entrypoint.sh /root
RUN chmod +x /root/entrypoint.sh
ENTRYPOINT [ "/root/entrypoint.sh" ]
HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1
